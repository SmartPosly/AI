import React, { useState, useEffect } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";
import RegistrationForm from "./components/RegistrationForm";
import AdminPanel from "./components/AdminPanel";
import { motion } from "framer-motion";
import { trackPageView, trackAdminLogin, trackCourseInterest } from "./utils/analytics";

function MainApp() {
  // We're using ThemeContext but don't need to toggle since we're always in dark mode
  // eslint-disable-next-line no-unused-vars
  const { isDarkMode } = useTheme();
  const [showAdmin, setShowAdmin] = useState(() => {
    // Check if admin was logged in before refresh
    return sessionStorage.getItem('adminLoggedIn') === 'true';
  });
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Track page view on component mount
  useEffect(() => {
    trackPageView('دورات أدوات الذكاء الاصطناعي', window.location.href);
  }, []);

  // Course data
  const courses = [
    {
      title: "التعامل مع نماذج الذكاء الاصطناعي",
      desc: "تعلم كيفية التعامل مع نماذج الذكاء الاصطناعي وكتابة الأوامر الفعالة للحصول على أفضل النتائج.",
      icon: "🤖",
      tools: ["ChatGPT", "Claude", "Gemini"]
    },
    {
      title: "أتمتة المهام باستخدام n8n",
      desc: "تعلم كيفية أتمتة سير العمل وربط الخدمات المختلفة باستخدام منصة n8n سهلة الاستخدام.",
      icon: "⚙️",
      tools: ["n8n", "Zapier", "Make"]
    },
    {
      title: "البرمجة باستخدام أدوات الذكاء الاصطناعي",
      desc: "تعلم كيفية استخدام أدوات البرمجة المدعومة بالذكاء الاصطناعي لتسريع عملية التطوير.",
      icon: "💻",
      tools: ["Cursor", "Windsurf", "Kiro"]
    },
    {
      title: "إنشاء تطبيقات الذكاء الاصطناعي",
      desc: "تعلم كيفية إنشاء تطبيقات ذكية باستخدام واجهات برمجة الذكاء الاصطناعي.",
      icon: "🔌",
      tools: ["OpenRouter", "OpenAI API", "Anthropic API"]
    }
  ];

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "admin3506403") {
      // Track successful admin login
      trackAdminLogin(true);
      
      // Check for reset flag in both localStorage and sessionStorage
      const wasReset = localStorage.getItem('registrationsReset') === 'true' ||
        sessionStorage.getItem('registrationsReset') === 'true';

      // If the flag exists, ensure it's properly set in localStorage
      if (wasReset) {
        localStorage.setItem('registrationsReset', 'true');
        console.log('Reset flag detected and preserved during login');
      }

      // Save admin login state to persist through refresh
      sessionStorage.setItem('adminLoggedIn', 'true');
      
      setShowAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setLoginError("");
    } else {
      // Track failed admin login
      trackAdminLogin(false);
      setLoginError("كلمة المرور غير صحيحة");
    }
  };

  const handleBackToHome = () => {
    // Clear admin login state
    sessionStorage.removeItem('adminLoggedIn');
    setShowAdmin(false);
  };

  return (
    <div className="font-cairo min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-md shadow-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-800">
            دورات أدوات الذكاء الاصطناعي
          </h1>
          <div className="flex items-center gap-4">
            {!showAdmin && !showAdminLogin && (
              <>
                <a
                  href="#register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-700 hover:bg-purple-800 text-white"
                >
                  سجل الآن
                </a>
                <button
                  onClick={handleAdminClick}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
                >
                  تسجيل الدخول
                </button>
              </>
            )}
            {showAdmin && (
              <button
                onClick={handleBackToHome}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"
              >
                العودة للرئيسية
              </button>
            )}
          </div>
        </div>
      </header>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-purple-800 text-center">تسجيل الدخول للوحة الإدارة</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-gray-50 border-gray-300 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="أدخل كلمة المرور"
                />
                {loginError && <p className="mt-1 text-red-500 text-sm">{loginError}</p>}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-purple-700 hover:bg-purple-800 text-white"
                >
                  دخول
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showAdmin ? (
        <AdminPanel />
      ) : (
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Hero Section */}
          <section className="text-center mb-16">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-6 text-purple-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            >
              تعلم أدوات الذكاء الاصطناعي في 10 أيام
            </motion.h2>
            <motion.p
              className="text-xl max-w-3xl mx-auto mb-8 text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              دورة مكثفة لمدة 10 أيام لتعلم كيفية استخدام أحدث أدوات الذكاء الاصطناعي لزيادة إنتاجيتك وتطوير مهاراتك
            </motion.p>
            <motion.div
              className="p-4 rounded-lg inline-block bg-purple-100 border border-purple-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                backgroundColor: "#ede9fe"
              }}
            >
              <p className="font-bold text-lg text-purple-800">تبدأ الدورة القادمة: قريباً</p>
            </motion.div>
          </section>

          {/* Courses Section */}
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3
              className="text-2xl font-bold mb-8 text-center text-purple-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              محتوى الدورة
            </motion.h3>
            <div className="grid md:grid-cols-2 gap-8">
              {courses.map((course, idx) => (
                <motion.div
                  key={idx}
                  className="p-6 rounded-xl shadow-lg bg-white hover:bg-gray-50 transition-colors duration-300 border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    scale: 1.02
                  }}
                >
                  <motion.div
                    className="text-4xl mb-4"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + idx * 0.1 }}
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                  >
                    {course.icon}
                  </motion.div>
                  <h4 className="text-xl font-bold mb-2 text-purple-800">{course.title}</h4>
                  <p className="mb-4 text-gray-700">{course.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.tools.map((tool, i) => (
                      <motion.span
                        key={i}
                        className="text-sm px-3 py-1 rounded-full bg-purple-100 text-purple-800"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 + idx * 0.1 + i * 0.05 }}
                        whileHover={{ scale: 1.1, backgroundColor: "#e9d5ff" }}
                      >
                        {tool}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits Section */}
          <motion.section
            className="mb-16 p-8 rounded-xl bg-purple-50 border border-purple-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <motion.h3
              className="text-2xl font-bold mb-8 text-center text-purple-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              مميزات الدورة
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: "🎓",
                  title: "تدريب عملي",
                  desc: "تطبيق مباشر على مشاريع واقعية باستخدام أدوات الذكاء الاصطناعي"
                },
                {
                  icon: "👨‍👩‍👧‍👦",
                  title: "مجموعات صغيرة",
                  desc: "تدريب في مجموعات صغيرة لضمان الاهتمام الفردي والتفاعل المباشر"
                },
                {
                  icon: "🔄",
                  title: "دعم مستمر",
                  desc: "دعم فني ومتابعة لمدة شهر بعد انتهاء الدورة"
                }
              ].map((benefit, idx) => (
                <motion.div
                  key={idx}
                  className="flex flex-col items-center text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + idx * 0.2 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div
                    className="w-16 h-16 flex items-center justify-center rounded-full text-2xl mb-4 bg-white shadow-md border border-purple-100"
                    whileHover={{
                      scale: 1.2,
                      boxShadow: "0 0 0 8px rgba(168, 85, 247, 0.2)",
                      transition: { duration: 0.3, type: "spring", stiffness: 300 }
                    }}
                  >
                    {benefit.icon}
                  </motion.div>
                  <motion.h4
                    className="text-lg font-bold mb-2 text-purple-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 + idx * 0.2 }}
                  >
                    {benefit.title}
                  </motion.h4>
                  <motion.p
                    className="text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + idx * 0.2 }}
                  >
                    {benefit.desc}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Registration Form */}
          <motion.section
            className="mb-16"
            id="register"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h3
              className="text-2xl font-bold mb-8 text-center text-purple-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              سجل الآن
            </motion.h3>
            <RegistrationForm />
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            className="mb-16 p-8 rounded-xl bg-white border border-gray-200 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
          >
            <motion.h3
              className="text-2xl font-bold mb-8 text-center text-purple-800"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              الأسئلة الشائعة
            </motion.h3>
            <div className="space-y-4">
              {[
                {
                  question: "هل أحتاج إلى خبرة برمجية مسبقة؟",
                  answer: "لا، الدورة مصممة لتناسب جميع المستويات. سنبدأ من الأساسيات ونتدرج في المستوى."
                },
                {
                  question: "كم عدد ساعات الدورة يومياً؟",
                  answer: "ساعتان يومياً، مع تمارين وتطبيقات عملية إضافية."
                },
                {
                  question: "هل سأحصل على شهادة؟",
                  answer: "نعم، ستحصل على شهادة إتمام الدورة بعد إكمال جميع المتطلبات."
                },
                {
                  question: "ما هي طرق الدفع المتاحة؟",
                  answer: "يمكنك الدفع عبر البطاقة الائتمانية والتطبيقات المصرفية (ادفع لي , سداد, تداول)"
                },
                {
                  question: "كيف يمكنني التواصل للاستفسار؟",
                  answer: <>يمكنك التواصل معنا عبر الهاتف: <a href="tel:+218913555150" className="text-purple-700 hover:underline">0913555150</a> أو البريد الإلكتروني: <a href="mailto:albkshi@smartpos.ly" className="text-purple-700 hover:underline">albkshi@smartpos.ly</a></>
                }
              ].map((faq, idx) => (
                <motion.div
                  key={idx}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-100"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * idx }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#f5f3ff",
                    borderColor: "#ddd6fe",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <motion.h4
                    className="font-bold mb-2 text-purple-800"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 + 0.1 * idx }}
                  >
                    {faq.question}
                  </motion.h4>
                  <motion.p
                    className="text-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + 0.1 * idx }}
                  >
                    {faq.answer}
                  </motion.p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </main>
      )}

      {/* Footer */}
      <footer className="py-6 bg-purple-900 text-white border-t border-purple-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
            <a href="tel:+218913555150" className="flex items-center hover:text-purple-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>0913555150</span>
            </a>
            <a href="mailto:albkshi@smartpos.ly" className="flex items-center hover:text-purple-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>albkshi@smartpos.ly</span>
            </a>
          </div>
          <p>جميع الحقوق محفوظة © {new Date().getFullYear()} - دورات أدوات الذكاء الاصطناعي</p>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

export default App;