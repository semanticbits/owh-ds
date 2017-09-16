module.exports = function(config){
  config.set({

    basePath : './',

    files : [
      'vendor/uswds-0.9.1/js/uswds.min.js',
      'bower_components/spin.js/spin.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/clusterize/clusterize.js',
      'bower_components/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-loader/angular-loader.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'bower_components/leaflet/dist/leaflet-src.js',
      'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
      'bower_components/ui-leaflet/dist/ui-leaflet.js',
      'bower_components/angular-dateParser/dist/angular-dateparser.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/checklist-model/checklist-model.js',
      'bower_components/jstree/dist/jstree.js',
      'bower_components/ng-js-tree/dist/ngJsTree.js',
      'bower_components/angular-awesome-slider/dist/angular-awesome-slider.js',
      'bower_components/angular-modal-service/dst/angular-modal-service.js',
      'bower_components/d3/d3.js',
      'bower_components/nvd3/build/nv.d3.js',
      'bower_components/angular-nvd3/dist/angular-nvd3.js',
      'bower_components/js-xlsx/dist/xlsx.full.min.js',
      'bower_components/file-saver/FileSaver.min.js',
      'vendor/leaflet-image/leaflet-image.js',
      'bower_components/angular-filter/dist/angular-filter.min.js',
      'bower_components/pdfmake/build/pdfmake.js',
      'bower_components/pdfmake/build/vfs_fonts.js',
      'bower_components/ngSticky/dist/sticky.min.js',
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
