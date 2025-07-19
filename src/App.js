import React, { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { useTheme } from "./hooks/useTheme";
import RegistrationForm from "./components/RegistrationForm";
import AdminPanel from "./components/AdminPanel";
import { motion } from "framer-motion";

function MainApp() {
  // We're using ThemeContext but don't need to toggle since we're always in dark mode
  // eslint-disable-next-line no-unused-vars
  const { isDarkMode } = useTheme();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [loginError, setLoginError] = useState("");

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
      setShowAdmin(true);
      setShowAdminLogin(false);
      setAdminPassword("");
      setLoginError("");
    } else {
      setLoginError("كلمة المرور غير صحيحة");
    }
  };

  const handleBackToHome = () => {
    setShowAdmin(false);
  };

  return (
    <div className="font-cairo min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md shadow-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400">
            دورات أدوات الذكاء الاصطناعي
          </h1>
          <div className="flex items-center gap-4">
            {!showAdmin && !showAdminLogin && (
              <>
                <a
                  href="#register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-700 text-white"
                >
                  سجل الآن
                </a>
                <button
                  onClick={handleAdminClick}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 hover:bg-gray-800"
                >
                  تسجيل الدخول
                </button>
              </>
            )}
            {showAdmin && (
              <button
                onClick={handleBackToHome}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-900 hover:bg-gray-800"
              >
                العودة للرئيسية
              </button>
            )}
          </div>
        </div>
      </header>

      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-blue-400 text-center">تسجيل الدخول للوحة الإدارة</h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-2 font-medium">كلمة المرور</label>
                <input
                  type="password"
                  id="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full p-3 rounded-lg border bg-gray-800 border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="أدخل كلمة المرور"
                />
                {loginError && <p className="mt-1 text-red-500 text-sm">{loginError}</p>}
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAdminLogin(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-800 hover:bg-gray-700"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 hover:bg-blue-700"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-blue-400">
              تعلم أدوات الذكاء الاصطناعي في 10 أيام
            </h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              دورة مكثفة لمدة 10 أيام لتعلم كيفية استخدام أحدث أدوات الذكاء الاصطناعي لزيادة إنتاجيتك وتطوير مهاراتك
            </p>
            <div className="p-4 rounded-lg inline-block bg-blue-900/30">
              <p className="font-bold text-lg">تبدأ الدورة القادمة: قريباً</p>
            </div>
          </section>

          {/* Courses Section */}
          <section className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-400">
              محتوى الدورة
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              {courses.map((course, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-xl shadow-lg bg-gray-900 hover:bg-gray-800 transition-colors duration-300 border border-gray-800"
                >
                  <div className="text-4xl mb-4">{course.icon}</div>
                  <h4 className="text-xl font-bold mb-2 text-blue-400">{course.title}</h4>
                  <p className="mb-4">{course.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.tools.map((tool, i) => (
                      <span
                        key={i}
                        className="text-sm px-3 py-1 rounded-full bg-gray-800 text-blue-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-16 p-8 rounded-xl bg-gray-900 border border-gray-800">
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-400">
              مميزات الدورة
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full text-2xl mb-4 bg-gray-800">
                  🎓
                </div>
                <h4 className="text-lg font-bold mb-2">تدريب عملي</h4>
                <p>تطبيق مباشر على مشاريع واقعية باستخدام أدوات الذكاء الاصطناعي</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full text-2xl mb-4 bg-gray-800">
                  👨‍👩‍👧‍👦
                </div>
                <h4 className="text-lg font-bold mb-2">مجموعات صغيرة</h4>
                <p>تدريب في مجموعات صغيرة لضمان الاهتمام الفردي والتفاعل المباشر</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 flex items-center justify-center rounded-full text-2xl mb-4 bg-gray-800">
                  🔄
                </div>
                <h4 className="text-lg font-bold mb-2">دعم مستمر</h4>
                <p>دعم فني ومتابعة لمدة شهر بعد انتهاء الدورة</p>
              </div>
            </div>
          </section>

          {/* Registration Form */}
          <section className="mb-16" id="register">
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-400">
              سجل الآن
            </h3>
            <RegistrationForm />
          </section>

          {/* FAQ Section */}
          <section className="mb-16 p-8 rounded-xl bg-gray-900 border border-gray-800">
            <h3 className="text-2xl font-bold mb-8 text-center text-blue-400">
              الأسئلة الشائعة
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-800">
                <h4 className="font-bold mb-2">هل أحتاج إلى خبرة برمجية مسبقة؟</h4>
                <p>لا، الدورة مصممة لتناسب جميع المستويات. سنبدأ من الأساسيات ونتدرج في المستوى.</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <h4 className="font-bold mb-2">كم عدد ساعات الدورة يومياً؟</h4>
                <p>ساعتان يومياً، مع تمارين وتطبيقات عملية إضافية.</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <h4 className="font-bold mb-2">هل سأحصل على شهادة؟</h4>
                <p>نعم، ستحصل على شهادة إتمام الدورة بعد إكمال جميع المتطلبات.</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <h4 className="font-bold mb-2">ما هي طرق الدفع المتاحة؟</h4>
                <p>يمكنك الدفع عبر البطاقة الائتمانية والتطبيقات المصرفية (ادفع لي , سداد, تداول)</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800">
                <h4 className="font-bold mb-2">كيف يمكنني التواصل للاستفسار؟</h4>
                <p>يمكنك التواصل معنا عبر الهاتف: <a href="tel:+218913555150" className="text-blue-400 hover:underline">0913555150</a> أو البريد الإلكتروني: <a href="mailto:albkshi@smartpos.ly" className="text-blue-400 hover:underline">albkshi@smartpos.ly</a></p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-gray-400 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-4">
            <a href="tel:+218913555150" className="flex items-center hover:text-blue-400 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>0913555150</span>
            </a>
            <a href="mailto:albkshi@smartpos.ly" className="flex items-center hover:text-blue-400 transition-colors">
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