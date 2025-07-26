# Google Analytics Setup Guide

## 🚀 Quick Setup Steps

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create an account name: "AI Courses Libya"
4. Create a property name: "دورات أدوات الذكاء الاصطناعي"
5. Select your country: Libya
6. Choose "Web" as platform
7. Enter your website URL: `https://your-domain.vercel.app`

### 2. Get Your Measurement ID
1. After creating the property, you'll get a **Measurement ID** like: `G-XXXXXXXXXX`
2. Copy this ID

### 3. Update Your Website
Replace `GA_MEASUREMENT_ID` in `public/index.html` with your actual Measurement ID:

```html
<!-- Replace this line -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- With your actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
```

And also replace in the gtag config:
```javascript
gtag('config', 'GA_MEASUREMENT_ID', {
// Change to:
gtag('config', 'G-XXXXXXXXXX', {
```

### 4. Optional: Google Tag Manager Setup
1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Create a new account and container
3. Get your GTM ID like: `GTM-XXXXXXX`
4. Replace `GTM-XXXXXXX` in the HTML with your actual GTM ID

## 📊 What Will Be Tracked

### Automatic Tracking:
- ✅ Page views
- ✅ User sessions
- ✅ Geographic data (Libya focus)
- ✅ Device information
- ✅ Traffic sources

### Custom Events:
- ✅ Registration attempts (success/failed)
- ✅ Form interactions
- ✅ Admin login attempts
- ✅ Course interest clicks
- ✅ Scroll depth
- ✅ Time on page

## 🎯 Key Metrics to Monitor

### Registration Funnel:
1. **Page Views** → How many people visit
2. **Form Interactions** → How many start filling the form
3. **Registration Attempts** → How many submit
4. **Success Rate** → Conversion percentage

### User Behavior:
- **Bounce Rate** → How many leave immediately
- **Time on Page** → How engaged users are
- **Scroll Depth** → How much content they read
- **Device Types** → Mobile vs Desktop usage

### Geographic Data:
- **Libya Traffic** → Primary target audience
- **City Distribution** → Tripoli, Benghazi, etc.
- **Language Preferences** → Arabic vs English

## 🔧 Advanced Setup (Optional)

### Custom Dimensions:
1. In GA4, go to Configure → Custom Definitions
2. Add custom dimensions:
   - `course_interest` → Track which courses users are interested in
   - `user_experience` → Track user experience level
   - `registration_source` → Track how users heard about the course

### Goals & Conversions:
1. Set up conversion events:
   - `sign_up` → Registration completion
   - `form_start` → Form interaction start
   - `admin_access` → Admin panel usage

### Audience Segments:
1. Create audiences for:
   - **Registered Users** → People who completed registration
   - **Interested Users** → People who interacted with forms
   - **Libya Users** → Geographic targeting
   - **Mobile Users** → Device-based targeting

## 📱 Testing Your Setup

### 1. Real-time Reports:
1. Go to GA4 → Reports → Realtime
2. Visit your website
3. Check if your visit appears in real-time

### 2. Debug Mode:
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable it and visit your site
3. Check browser console for GA events

### 3. Test Events:
1. Fill out the registration form
2. Check GA4 → Reports → Realtime → Events
3. Look for custom events like `sign_up`, `form_interaction`

## 🚨 Important Notes

### Privacy Compliance:
- ✅ Added proper privacy-friendly tracking
- ✅ No personal data collection without consent
- ✅ GDPR-friendly setup for international users

### Performance:
- ✅ Async loading to not slow down your site
- ✅ Minimal impact on page speed
- ✅ Optimized for mobile users

### Libya-Specific:
- ✅ Arabic language support
- ✅ RTL (right-to-left) compatibility
- ✅ Local timezone tracking
- ✅ Libya geographic focus

## 📈 Expected Results

After 1 week, you should see:
- Daily visitor counts
- Registration conversion rates
- Popular course interests
- User engagement metrics
- Geographic distribution within Libya

This data will help you optimize your course offerings and marketing strategy! 🎯