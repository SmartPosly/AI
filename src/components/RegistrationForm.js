import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { trackRegistration, trackFormInteraction } from '../utils/analytics';
import { logger } from '../utils/logger';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: 'beginner',
    interests: [],
    hearAbout: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const experienceLevels = [
    { id: 'beginner', label: 'مبتدئ - لا خبرة سابقة في الذكاء الاصطناعي' },
    { id: 'intermediate', label: 'متوسط - استخدمت بعض أدوات الذكاء الاصطناعي' },
    { id: 'advanced', label: 'متقدم - خبرة جيدة في استخدام أدوات الذكاء الاصطناعي' }
  ];

  const interestOptions = [
    { id: 'prompting', label: 'كتابة الأوامر الفعالة للذكاء الاصطناعي' },
    { id: 'n8n', label: 'أتمتة المهام باستخدام n8n' },
    { id: 'coding', label: 'البرمجة باستخدام أدوات الذكاء الاصطناعي (Cursor, Windsurf, Kiro)' },
    { id: 'api', label: 'استخدام واجهات برمجة الذكاء الاصطناعي (OpenRouter)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Track form interactions
    trackFormInteraction(name, 'input');

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, value]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        interests: prev.interests.filter(interest => interest !== value)
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'الاسم مطلوب';

    if (!formData.email.trim()) {
      errors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'البريد الإلكتروني غير صالح';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'رقم الهاتف مطلوب';
    } else {
      // Remove any non-digit characters
      const cleanPhone = formData.phone.replace(/\D/g, '');
      // Check if it's exactly 10 digits and starts with 09X (Libyan mobile numbers)
      if (cleanPhone.length !== 10) {
        errors.phone = 'رقم الهاتف يجب أن يتكون من 10 أرقام';
      } else if (!/^09[1-9]/.test(cleanPhone)) {
        errors.phone = 'رقم الهاتف يجب أن يبدأ بـ 091 أو 092 أو 093 أو 094 أو 095 أو 096 أو 097 أو 098 أو 099';
      }
    }

    if (formData.interests.length === 0) {
      errors.interests = 'يرجى اختيار مجال اهتمام واحد على الأقل';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      logger.debug('Submitting registration data...');
      
      // Send data to API
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        logger.info('Registration successful:', result.user);
        
        // Track successful registration
        trackRegistration('success', formData.interests.join(','));
        
        // Also save to localStorage and sync with shared data API
        try {
          let existingData = [];
          const storedData = localStorage.getItem('registrations');
          if (storedData) {
            existingData = JSON.parse(storedData);
            if (!Array.isArray(existingData)) existingData = [];
          }
          
          existingData.push(result.user);
          localStorage.setItem('registrations', JSON.stringify(existingData));
          localStorage.removeItem('registrationsReset');
          sessionStorage.removeItem('registrationsReset');
          
          logger.debug('Data saved to localStorage');
          
          // Also try to sync with shared data API
          try {
            const sharedResponse = await fetch('/api/shared-data', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(result.user)
            });
            
            if (sharedResponse.ok) {
              logger.debug('Data also synced to shared data API');
            } else {
              logger.warn('Failed to sync to shared data API, but registration successful');
            }
          } catch (sharedError) {
            logger.warn('Error syncing to shared data API:', sharedError.message);
            // Don't fail the registration for this
          }
        } catch (localStorageError) {
          logger.warn('Failed to save to localStorage:', localStorageError);
        }

        // Show success
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: 'beginner',
          interests: [],
          hearAbout: '',
          notes: ''
        });
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      logger.error('Registration error:', error);
      
      // Track failed registration
      trackRegistration('failed', formData.interests.join(','));
      
      // Fallback to localStorage only
      try {
        logger.debug('Falling back to localStorage...');
        
        let existingData = [];
        const storedData = localStorage.getItem('registrations');
        if (storedData) {
          existingData = JSON.parse(storedData);
          if (!Array.isArray(existingData)) existingData = [];
        }
        
        const newId = existingData.length > 0 
          ? Math.max(...existingData.map(item => typeof item.id === 'number' ? item.id : 0)) + 1 
          : 1;
          
        const newRegistration = {
          id: newId,
          ...formData,
          registrationDate: new Date().toISOString()
        };

        existingData.push(newRegistration);
        localStorage.setItem('registrations', JSON.stringify(existingData));
        localStorage.removeItem('registrationsReset');
        sessionStorage.removeItem('registrationsReset');

        logger.info('Registration saved to localStorage as fallback');
        
        // Show success
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          experience: 'beginner',
          interests: [],
          hearAbout: '',
          notes: ''
        });
      } catch (fallbackError) {
        logger.error('Fallback also failed:', fallbackError);
        alert('حدث خطأ أثناء حفظ بياناتك. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="rounded-xl p-8 shadow-lg bg-white border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      {isSubmitted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-lg text-center bg-purple-50 text-purple-900 border border-purple-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-bold mb-2 text-purple-800">تم التسجيل بنجاح!</h3>
          <p className="text-gray-700">شكراً لتسجيلك في دورة أدوات الذكاء الاصطناعي. سنتواصل معك قريباً بخصوص تفاصيل الدورة وطرق الدفع.</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="mt-4 px-6 py-2 rounded-lg font-medium bg-purple-700 hover:bg-purple-600 text-white"
          >
            تسجيل آخر
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          >
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="name" className="block mb-2 font-medium">الاسم الكامل <span className="text-red-500">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.name ? 'border-red-500' : ''}`}
              />
              {formErrors.name && <p className="mt-1 text-red-500 text-sm">{formErrors.name}</p>}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <label htmlFor="email" className="block mb-2 font-medium">البريد الإلكتروني <span className="text-red-500">*</span></label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.email ? 'border-red-500' : ''}`}
              />
              {formErrors.email && <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>}
            </motion.div>
          </motion.div>

          {/* Phone */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <label htmlFor="phone" className="block mb-2 font-medium">رقم الهاتف <span className="text-red-500">*</span></label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="09X XXXXXXX"
              className={`w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 ${formErrors.phone ? 'border-red-500' : ''}`}
            />
            {formErrors.phone ? (
              <p className="mt-1 text-red-500 text-sm">{formErrors.phone}</p>
            ) : (
              <p className="mt-1 text-gray-500 text-sm">يجب أن يبدأ الرقم بـ 09X (رقم ليبي) ويتكون من 10 أرقام</p>
            )}
          </motion.div>

          {/* Experience Level */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <label htmlFor="experience" className="block mb-2 font-medium">مستوى الخبرة <span className="text-red-500">*</span></label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {experienceLevels.map(level => (
                <option key={level.id} value={level.id}>{level.label}</option>
              ))}
            </select>
          </motion.div>

          {/* Interests */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <label className="block mb-2 font-medium">مجالات الاهتمام <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              {interestOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  className="flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.5 + (index * 0.1) }}
                >
                  <input
                    type="checkbox"
                    id={`interest-${option.id}`}
                    name="interests"
                    value={option.id}
                    checked={formData.interests.includes(option.id)}
                    onChange={handleInterestChange}
                    className="ml-2 h-5 w-5 rounded bg-white border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500"
                  />
                  <label htmlFor={`interest-${option.id}`}>{option.label}</label>
                </motion.div>
              ))}
            </div>
            {formErrors.interests && <p className="mt-1 text-red-500 text-sm">{formErrors.interests}</p>}
          </motion.div>

          {/* How did you hear about us */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <label htmlFor="hearAbout" className="block mb-2 font-medium">كيف سمعت عنا؟</label>
            <input
              type="text"
              id="hearAbout"
              name="hearAbout"
              value={formData.hearAbout}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </motion.div>

          {/* Notes */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.0 }}
          >
            <label htmlFor="notes" className="block mb-2 font-medium">ملاحظات أو استفسارات</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border bg-white border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 1.1 }}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full px-8 py-3 rounded-lg font-bold bg-purple-700 hover:bg-purple-800 text-white transition-colors duration-300"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
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
                جاري التسجيل...
              </div>
            ) : (
              'تسجيل'
            )}
          </motion.button>
        </form>
      )}
    </motion.div>
  );
};

export default RegistrationForm;