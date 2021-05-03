module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'vendor/uswds-0.9.1/js/uswds.min.js',
      'node_modules/spin.js/spin.js',
      'node_modules/jquery/dist/jquery.js',
      'node_modules/clusterize/clusterize.js',
      'node_modules/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.js',
      'node_modules/angular-aria/angular-aria.js',
      'node_modules/angular-loader/angular-loader.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-translate/angular-translate.js',
      'node_modules/angular-resource/angular-resource.js',
      'node_modules/angular-sanitize/angular-sanitize.js',
      'node_modules/angular-ui-router/release/angular-ui-router.js',
      'node_modules/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'node_modules/angular-animate/angular-animate.min.js',
      'node_modules/leaflet/dist/leaflet-src.js',
      'node_modules/angular-simple-logger/dist/angular-simple-logger.js',
      'node_modules/ui-leaflet/dist/ui-leaflet.js',
      'node_modules/angular-dateParser/dist/angular-dateparser.js',
      'node_modules/angular-ui-select/dist/select.js',
      'node_modules/checklist-model/checklist-model.js',
      'node_modules/jstree/dist/jstree.js',
      'node_modules/ng-js-tree/dist/ngJsTree.js',
      'node_modules/angular-awesome-slider/dist/angular-awesome-slider.js',
      'node_modules/angular-modal-service/dst/angular-modal-service.js',
      'node_modules/d3/d3.js',
      'node_modules/nvd3/build/nv.d3.js',
      'node_modules/angular-nvd3/dist/angular-nvd3.js',
      'node_modules/js-xlsx/dist/xlsx.full.min.js',
      'node_modules/file-saver/FileSaver.min.js',
      'vendor/leaflet-image/leaflet-image.js',
      'node_modules/angular-filter/dist/angular-filter.min.js',
      'node_modules/pdfmake/build/pdfmake.js',
      'node_modules/pdfmake/build/vfs_fonts.js',
      'node_modules/ngSticky/dist/sticky.min.js',
      'app/**/*.module.js',
      'app/**/*.js',
      'app/**/*.html',
      'app/**/*.spec.js',
      'app/**/fixtures/**/*.json'
    ],

    preprocessors: {
      'app/**/!(*.spec).js': ['coverage'],
      'app/**/*.html': ['ng-html2js'],
      'app/**/fixtures/**/*.json'   : ['json_fixtures']
    },

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    reporters : ['dots', 'junit','coverage'],

    plugins : [
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-junit-reporter',
      'karma-coverage',
      'karma-ng-html2js-preprocessor',
      'karma-fixture',
      'karma-json-fixtures-preprocessor'
    ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    },
    check: {
      global: {
        statements: 90,
        branches: 90,
        functions: 100,
        lines: 90
      },
      each: {
        statements: 90,
        branches: 90,
        functions: 100,
        lines: 90
      }
    },

    coverageReporter:{
      type : 'lcov',
      dir : 'coverage/',
      file : 'index.html'
    },

    // add the plugin settings
    ngHtml2JsPreprocessor: {
      stripPrefix: ''
    },
    browserNoActivityTimeout: 1000000
  });
};
