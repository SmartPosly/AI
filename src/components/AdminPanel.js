import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'registrationDate', direction: 'desc' });

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // For demo purposes, let's create some mock data
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const mockUsers = Array.from({ length: 50 }, (_, i) => {
        // Generate random interests
        const allInterests = ['prompting', 'n8n', 'coding', 'api'];
        const interestCount = Math.floor(Math.random() * 4) + 1;
        const shuffledInterests = [...allInterests].sort(() => 0.5 - Math.random());
        const interests = shuffledInterests.slice(0, interestCount);
        
        // Generate random registration date within the last 30 days
        const registrationDate = new Date();
        registrationDate.setDate(registrationDate.getDate() - Math.floor(Math.random() * 30));
        
        return {
          id: i + 1,
          name: `مستخدم ${i + 1}`,
          email: `user${i + 1}@example.com`,
          phone: `+966 5${Math.floor(10000000 + Math.random() * 90000000)}`,
          experience: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)],
          interests,
          hearAbout: ['جوجل', 'تويتر', 'فيسبوك', 'صديق', 'إنستغرام'][Math.floor(Math.random() * 5)],
          notes: Math.random() > 0.7 ? 'أريد معرفة المزيد عن الدورة وطرق الدفع المتاحة.' : '',
          registrationDate: registrationDate.toISOString()
        };
      });
      setUsers(mockUsers);
      setIsLoading(false);
    }
  }, []);

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Apply sorting and filtering
  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...users];
    
    // Filter by search term
    if (searchTerm) {
      sortableUsers = sortableUsers.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm)
      );
    }
    
    // Sort
    if (sortConfig.key) {
      sortableUsers.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [users, searchTerm, sortConfig]);

  // Map experience levels to Arabic
  const experienceLabels = {
    'beginner': 'مبتدئ',
    'intermediate': 'متوسط',
    'advanced': 'متقدم'
  };

  // Map interest IDs to Arabic labels
  const interestLabels = {
    'prompting': 'كتابة الأوامر الفعالة',
    'n8n': 'أتمتة المهام باستخدام n8n',
    'coding': 'البرمجة باستخدام أدوات الذكاء الاصطناعي',
    'api': 'استخدام واجهات برمجة الذكاء الاصطناعي'
  };

  // Export to Excel
  const exportToExcel = () => {
    // Format data for Excel
    const excelData = sortedUsers.map(user => ({
      'الرقم': user.id,
      'الاسم': user.name,
      'البريد الإلكتروني': user.email,
      'رقم الهاتف': user.phone,
      'مستوى الخبرة': experienceLabels[user.experience] || user.experience,
      'مجالات الاهتمام': user.interests.map(int => interestLabels[int] || int).join(', '),
      'كيف سمع عنا': user.hearAbout,
      'ملاحظات': user.notes,
      'تاريخ التسجيل': new Date(user.registrationDate).toLocaleDateString('ar-SA')
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المسجلين');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'ai_tools_course_registrations.xlsx');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-400">
          لوحة الإدارة - المسجلين في الدورة
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportToExcel}
          className="px-4 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
        >
          تصدير إلى Excel
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 p-4 rounded-lg shadow-md bg-gray-900 border border-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg border bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center">
            <span className="ml-2">عدد المسجلين: {sortedUsers.length}</span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg text-center bg-red-900 text-red-100">
          <p>{error}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('id')}
                >
                  الرقم {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  الاسم {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('email')}
                >
                  البريد الإلكتروني {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('phone')}
                >
                  رقم الهاتف {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('experience')}
                >
                  مستوى الخبرة {sortConfig.key === 'experience' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                >
                  مجالات الاهتمام
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('registrationDate')}
                >
                  تاريخ التسجيل {sortConfig.key === 'registrationDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="bg-gray-900 hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {experienceLabels[user.experience] || user.experience}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.interests.map(interest => (
                        <span 
                          key={interest} 
                          className="inline-block px-2 py-1 text-xs rounded-full bg-gray-800 text-blue-300"
                        >
                          {interestLabels[interest] || interest}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {new Date(user.registrationDate).toLocaleDateString('ar-SA')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;