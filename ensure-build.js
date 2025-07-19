const fs = require('fs');
const path = require('path');

// Create build directory if it doesn't exist
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
  console.log('Creating build directory...');
  fs.mkdirSync(buildDir, { recursive: true });
  
  // Create a simple index.html file
  const indexHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="/ai.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <title>دورات أدوات الذكاء الاصطناعي</title>
    <style>
      body {
        font-family: 'Cairo', Arial, sans-serif;
        background: #000000;
        color: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        text-align: center;
      }
      h1 {
        color: #3b82f6;
      }
    </style>
  </head>
  <body>
    <div>
      <h1>دورات أدوات الذكاء الاصطناعي</h1>
      <p>جاري تحميل الموقع...</p>
    </div>
    <script>
      // Redirect to the main app if this placeholder is shown
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    </script>
  </body>
</html>
  `;
  
  fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
  console.log('Created placeholder index.html');
}

console.log('Build directory check completed successfully!');