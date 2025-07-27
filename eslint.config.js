// Minimal ESLint config for production
export default [
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      // Disable all rules that cause false positives in React
    }
  }
];