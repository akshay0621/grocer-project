module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module:react-native-dotenv', // Use 'module:react-native-dotenv'
      {
        moduleName: '@env',
        envName: '.env',
        path: '.env', // This is crucial for finding the .env file
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
  ],
};
