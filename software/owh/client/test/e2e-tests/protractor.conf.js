//jshint strict: false
exports.config = {

  //Sets the amount of time to wait for an asynchronous script to finish execution before throwing an error.
  allScriptsTimeout: 600000,
  //When navigating to a new page using browser.get, Protractor waits for the page to be loaded and the new URL to appear before continuing.
  getPageTimeout: 600000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  specs: [
    'features/*.feature'
  ],
  cucumberOpts: {
    // require step definitions
    require: [
      'features/step_definitions/homeSteps.js',
      'features/step_definitions/mortalitySteps.js',
      'features/step_definitions/yrbsSteps.js',
      'features/step_definitions/commonSteps.js',
      'features/step_definitions/bridgeRaceSteps.js',
      'features/step_definitions/natalitySteps.js',
      'features/step_definitions/pramsSteps.js',
      'features/step_definitions/infant_mortality_steps.js',
      'features/step_definitions/stdSteps.js',
      'features/support/hook.js'
    ],
      format: 'pretty'
  },

  capabilities: {
    'browserName': 'firefox'
  },
  onPrepare: function() {
    browser.driver.manage().window().maximize();
  },
  baseUrl: 'http://localhost:9900/'
};
