// Google Analytics utility functions

// Track page views
export const trackPageView = (page_title, page_location) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_title,
      page_location,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track registration attempts
export const trackRegistration = (status, course_interest) => {
  trackEvent('registration', 'form', status, 1);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: 'form',
      course_interest: course_interest,
      success: status === 'success'
    });
  }
};

// Track admin login
export const trackAdminLogin = (success) => {
  trackEvent('admin_login', 'authentication', success ? 'success' : 'failed', 1);
};

// Track course interest
export const trackCourseInterest = (course_name) => {
  trackEvent('course_interest', 'engagement', course_name, 1);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'select_content', {
      content_type: 'course',
      content_id: course_name
    });
  }
};

// Track form interactions
export const trackFormInteraction = (field_name, action) => {
  trackEvent('form_interaction', 'form', `${field_name}_${action}`, 1);
};

// Track scroll depth
export const trackScrollDepth = (percentage) => {
  trackEvent('scroll', 'engagement', `${percentage}%`, percentage);
};

// Track time on page
export const trackTimeOnPage = (seconds) => {
  trackEvent('time_on_page', 'engagement', 'seconds', seconds);
};