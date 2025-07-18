import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Add preconnect for Google Fonts
const linkEl = document.createElement('link');
linkEl.rel = 'preconnect';
linkEl.href = 'https://fonts.googleapis.com';
document.head.appendChild(linkEl);

const linkEl2 = document.createElement('link');
linkEl2.rel = 'preconnect';
linkEl2.href = 'https://fonts.gstatic.com';
linkEl2.crossOrigin = 'anonymous';
document.head.appendChild(linkEl2);

// Add Cairo font
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&display=swap';
document.head.appendChild(fontLink);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker for offline capabilities
serviceWorkerRegistration.register();
