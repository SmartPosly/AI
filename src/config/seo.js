// SEO Configuration
export const seoConfig = {
  title: 'دورات أدوات الذكاء الاصطناعي - تعلم في 10 أيام',
  description: 'دورات مكثفة لتعلم أدوات الذكاء الاصطناعي مثل ChatGPT وClaude وn8n وCursor وWindsurf وKiro وOpenRouter. تعلم كيفية استخدام أحدث أدوات الذكاء الاصطناعي لزيادة إنتاجيتك وتطوير مهاراتك في 10 أيام فقط.',
  keywords: [
    'دورات',
    'ذكاء اصطناعي',
    'تعلم الآلة',
    'ChatGPT',
    'Claude',
    'n8n',
    'Cursor',
    'Windsurf',
    'Kiro',
    'OpenRouter',
    'أتمتة',
    'برمجة',
    'كورسات',
    'شهادات',
    'تعلم عن بعد',
    'AI',
    'Machine Learning',
    'AI tools',
    'ليبيا',
    'Libya',
    'طرابلس',
    'Tripoli'
  ],
  author: 'دورات أدوات الذكاء الاصطناعي',
  siteUrl: 'https://ai.smartpos.ly',
  image: '/ai-courses-og.jpg',
  twitterHandle: '@smartposly',
  language: 'ar',
  locale: 'ar_AR',
  type: 'website',
  
  // Structured data
  organization: {
    name: 'دورات أدوات الذكاء الاصطناعي',
    url: 'https://ai.smartpos.ly',
    logo: 'https://ai.smartpos.ly/logo192.png',
    contactPoint: {
      telephone: '+218913555150',
      email: 'albkshi@smartpos.ly',
      contactType: 'customer service',
      areaServed: 'LY',
      availableLanguage: 'Arabic'
    },
    address: {
      addressCountry: 'LY',
      addressLocality: 'Tripoli'
    }
  },
  
  // Course information
  course: {
    name: 'دورات أدوات الذكاء الاصطناعي',
    description: 'دورات مكثفة لتعلم أدوات الذكاء الاصطناعي',
    duration: 'P10D', // 10 days
    courseMode: 'online',
    inLanguage: 'ar',
    teaches: [
      'التعامل مع نماذج الذكاء الاصطناعي',
      'أتمتة المهام باستخدام n8n',
      'البرمجة باستخدام أدوات الذكاء الاصطناعي',
      'إنشاء تطبيقات الذكاء الاصطناعي'
    ],
    audience: 'المهتمين بالذكاء الاصطناعي'
  }
};

// Generate structured data JSON-LD
export const generateStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${seoConfig.siteUrl}/#organization`,
        name: seoConfig.organization.name,
        url: seoConfig.siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: seoConfig.organization.logo
        },
        contactPoint: {
          '@type': 'ContactPoint',
          ...seoConfig.organization.contactPoint
        },
        address: {
          '@type': 'PostalAddress',
          ...seoConfig.organization.address
        }
      },
      {
        '@type': 'WebSite',
        '@id': `${seoConfig.siteUrl}/#website`,
        url: seoConfig.siteUrl,
        name: seoConfig.title,
        description: seoConfig.description,
        publisher: {
          '@id': `${seoConfig.siteUrl}/#organization`
        },
        inLanguage: seoConfig.language
      },
      {
        '@type': 'Course',
        '@id': `${seoConfig.siteUrl}/#course`,
        name: seoConfig.course.name,
        description: seoConfig.course.description,
        provider: {
          '@id': `${seoConfig.siteUrl}/#organization`
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: seoConfig.course.courseMode,
          duration: seoConfig.course.duration,
          inLanguage: seoConfig.course.inLanguage
        },
        teaches: seoConfig.course.teaches,
        audience: {
          '@type': 'Audience',
          audienceType: seoConfig.course.audience
        }
      }
    ]
  };
};