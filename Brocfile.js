module.exports = function (broccoli) {
  var env = require('broccoli-env').getEnv();

  var pickFiles = require('broccoli-static-compiler');
  var mergeTrees = require('broccoli-merge-trees');
  var filterES6Modules = require('broccoli-es6-module-filter');
  var makeDistModules = require('broccoli-dist-es6-module');
  var concatFiles = require('broccoli-concat');

  // Build dist

  var transpiledLib = makeDistModules('lib', {
    packageName: 'simple-html-tokenizer',
    main: 'simple-html-tokenizer',
    global: 'HTML5Tokenizer'
  });

  var dist = mergeTrees(transpiledLib);

  // Build testing assets

  if (env === 'development') {

    var transpiledTests = filterES6Modules('test/tests', {
      packageName: 'simple-html-tokenizer/tests',
      moduleType: 'amd',
      anonymous: false,
      main: 'tests'
    });

    var tests = concatFiles(transpiledTests, {
      inputFiles: ['**/*.js'],
      outputFile: '/tests.js'
    });

    var bower = 'bower_components';

    var loader = pickFiles(bower, {
      srcDir: 'loader.js',
      files: ['loader.js'],
      destDir: '/vendor'
    });

    var qunit = pickFiles(bower, {
      srcDir: 'qunit/qunit',
      files: ['qunit.js', 'qunit.css'],
      destDir: '/vendor'
    });

    var qunitIndex = pickFiles('test', {
      srcDir: '/',
      files: ['index.html'],
      destDir: '/'
    });

    var testingAssets = mergeTrees([loader, qunit, qunitIndex]);
  }

  switch (env) {
    case 'development': return mergeTrees([dist, tests, testingAssets]);
    case 'production': return dist;
  }
};
