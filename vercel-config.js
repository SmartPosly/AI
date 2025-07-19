// Vercel API configuration
module.exports = {
  projectId: 'prj_OJVI61GSy4hydkxe7FGUIHI6Xvkk',
  config: {
    framework: 'create-react-app',
    buildCommand: 'npm run build',
    outputDirectory: 'build',
    installCommand: 'npm install',
    devCommand: 'npm run dev',
    rootDirectory: '.',
    regions: ['cdg1'], // Paris region
    publicSource: true,
    nodeVersion: '18.x'
  },
  environmentVariables: [
    {
      key: 'NODE_ENV',
      value: 'production',
      target: ['production', 'preview']
    }
  ]
};