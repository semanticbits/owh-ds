//jshint strict: false
exports.config = {

  //Sets the amount of time to wait for an asynchronous script to finish execution before throwing an error.
  allScriptsTimeout: 600000,
  //When navigating to a new page using browser.get, Protractor waits for the page to be loaded and the new URL to appear before continuing.
  getPageTimeout: 800000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  specs: [
      'features/*.feature'
      //'features/factsheets.feature'

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
      'features/step_definitions/tbSteps.js',
      'features/step_definitions/aidsSteps.js',
      'features/step_definitions/cancerIncidenceSteps.js',
      'features/step_definitions/cancerMortalitySteps.js',
      'features/step_definitions/dataDocumentationSteps.js',
      'features/step_definitions/factsheetsSteps.js',
      'features/support/hook.js'
    ],
      format: 'pretty'
  },

  capabilities: {
    'browserName': 'chrome',
      chromeOptions: {
          args: [ "--disable-gpu", "--window-size=1920,1080" ]
      }
  },

 //baseUrl: process.env.E2E_BASE_URL || 'http://localhost:9900/'

    baseUrl:'http://owhqa.semanticbits.com/'



};
