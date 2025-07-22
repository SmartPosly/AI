import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as XLSX from 'xlsx';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'registrationDate', direction: 'desc' });
  const [isResetting, setIsResetting] = useState(false);

  // Get user data from localStorage - only real registrations, no mock data
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading registration data...');
        
        // Always check for reset flag first
        const wasReset = localStorage.getItem('registrationsReset') === 'true';
        console.log('Reset flag status:', wasReset);
        
        if (wasReset) {
          console.log('Data was reset, keeping list empty');
          setUsers([]);
          setIsLoading(false);
          return;
        }
        
        // If not reset, try to get data from localStorage
        try {
          const storedData = localStorage.getItem('registrations');
          console.log('Raw stored data:', storedData ? `${storedData.substring(0, 50)}...` : 'null');
          
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            
            if (Array.isArray(parsedData)) {
              console.log('Found existing data in localStorage:', parsedData.length, 'registrations');
              setUsers(parsedData);
              setIsLoading(false);
              return;
            } else {
              console.warn('Stored data is not an array:', typeof parsedData);
            }
          } else {
            console.log('No stored data found in localStorage');
          }
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
        }
        
        // No mock data generation - just show empty list if no real registrations
        console.log('No valid registrations found, showing empty list');
        setUsers([]);
        setIsLoading(false);
      } catch (err) {
        console.error('Error setting up users data:', err);
        // Even if there's an error, we'll show empty data rather than an error message
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
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

  // Format date in Gregorian (AD) format with time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
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
      'كيف سمع عنا': user.hearAbout || '',
      'ملاحظات': user.notes || '',
      'تاريخ التسجيل': formatDate(user.registrationDate)
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    
    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المسجلين');
    
    // Generate Excel file
    XLSX.writeFile(workbook, 'ai_tools_course_registrations.xlsx');
  };

  // Refresh data without page reload
  const refreshData = () => {
    setIsLoading(true);
    
    try {
      // Clear any reset flag that might exist
      localStorage.removeItem('registrationsReset');
      sessionStorage.removeItem('registrationsReset');
      
      // Get fresh data from localStorage
      const storedData = localStorage.getItem('registrations');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData)) {
          console.log('Refreshed data from localStorage:', parsedData.length, 'registrations');
          setUsers(parsedData);
        } else {
          console.warn('Refreshed data is not an array');
          setUsers([]);
        }
      } else {
        console.log('No data found during refresh');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      setUsers([]);
    }
    
    setIsLoading(false);
  };

  // Reset the list
  const resetList = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة تعيين قائمة المسجلين؟ سيتم حذف جميع البيانات.')) {
      setIsResetting(true);
      
      try {
        // First set the reset flag, then clear the data
        localStorage.setItem('registrationsReset', 'true');
        localStorage.removeItem('registrations');
        
        // Double-check that the flag was set
        const flagSet = localStorage.getItem('registrationsReset') === 'true';
        console.log('Reset flag set:', flagSet);
        
        if (!flagSet) {
          // If flag wasn't set, try again with a different approach
          window.sessionStorage.setItem('registrationsReset', 'true');
          console.log('Using session storage as fallback');
        }
        
        console.log('Registrations data cleared successfully');
        
        // Show loading state briefly
        setTimeout(() => {
          setUsers([]);
          setIsResetting(false);
        }, 1000);
      } catch (error) {
        console.error('Error clearing registrations:', error);
        alert('حدث خطأ أثناء إعادة تعيين القائمة. يرجى المحاولة مرة أخرى.');
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-purple-800">
          لوحة الإدارة - المسجلين في الدورة
        </h2>
        
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshData}
            className="px-4 py-2 rounded-lg font-medium bg-blue-500 hover:bg-blue-600 text-white"
          >
            تحديث البيانات
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportToExcel}
            disabled={users.length === 0 || isResetting}
            className={`px-4 py-2 rounded-lg font-medium ${
              users.length === 0 || isResetting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-purple-700 hover:bg-purple-800'
            } text-white`}
          >
            تصدير إلى Excel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.95 }}
            onClick={resetList}
            disabled={users.length === 0 || isResetting}
            className={`px-4 py-2 rounded-lg font-medium ${
              users.length === 0 || isResetting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600'
            } text-white shadow-sm`}
          >
            {isResetting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                جاري إعادة التعيين...
              </div>
            ) : (
              'إعادة تعيين القائمة'
            )}
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 p-4 rounded-lg shadow-md bg-white border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <input
              type="text"
              placeholder="بحث بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isResetting}
            />
          </div>
          <div className="flex items-center">
            <span className="ml-2 text-gray-700">عدد المسجلين: <span className="font-bold text-purple-800">{sortedUsers.length}</span></span>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {isLoading || isResetting ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-700"></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg text-center bg-red-50 text-red-700 border border-red-200">
          <p>{error}</p>
        </div>
      ) : sortedUsers.length === 0 ? (
        <div className="p-8 rounded-lg text-center bg-gray-50 border border-gray-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-xl font-bold mb-2 text-gray-700">لا توجد بيانات للعرض</h3>
          <p className="text-gray-500">لم يتم تسجيل أي مستخدمين بعد.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('id')}
                >
                  الرقم {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('name')}
                >
                  الاسم {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('email')}
                >
                  البريد الإلكتروني {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('phone')}
                >
                  رقم الهاتف {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('experience')}
                >
                  مستوى الخبرة {sortConfig.key === 'experience' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-700"
                >
                  مجالات الاهتمام
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('notes')}
                >
                  ملاحظات أو استفسارات {sortConfig.key === 'notes' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer text-gray-700"
                  onClick={() => requestSort('registrationDate')}
                >
                  تاريخ التسجيل {sortConfig.key === 'registrationDate' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {experienceLabels[user.experience] || user.experience}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.interests && user.interests.map(interest => (
                        <span 
                          key={interest} 
                          className="inline-block px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
                        >
                          {interestLabels[interest] || interest}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {user.notes ? (
                      <div className="max-w-xs overflow-hidden">
                        <p className={user.notes.length > 50 ? "line-clamp-2 hover:line-clamp-none cursor-pointer" : ""}>
                          {user.notes}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {formatDate(user.registrationDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reset Button at Bottom */}
      {users.length > 0 && !isResetting && (
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.95 }}
            onClick={resetList}
            className="px-8 py-4 rounded-lg font-bold bg-red-500 hover:bg-red-600 text-white shadow-md"
          >
            إعادة تعيين القائمة بعد التصدير
          </motion.button>
        </div>
      )}
    </div>
  );
};

// Function to completely reset the system (for development purposes)
// Can be called from browser console: window.resetRegistrationSystem()
window.resetRegistrationSystem = () => {
  try {
    // Clear all related storage
    localStorage.removeItem('registrations');
    localStorage.removeItem('registrationsReset');
    sessionStorage.removeItem('registrationsReset');
    
    console.log('Registration system completely reset. All registrations have been cleared.');
    console.log('To verify reset status:');
    console.log('- localStorage.registrationsReset =', localStorage.getItem('registrationsReset'));
    console.log('- localStorage.registrations =', localStorage.getItem('registrations'));
    
    return {
      success: true,
      message: 'System reset complete. All registrations have been cleared.'
    };
  } catch (error) {
    console.error('Error during system reset:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default AdminPanel;