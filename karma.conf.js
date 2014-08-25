// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
	config.set({

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],
		// test results reporters to use

		// list of files / patterns to load in the browser
		files: [
			'o.deepObserve.js',
			'test/**/*.js'
		],

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,
//	  http://localhost:9001/

		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: [
			//setting Chrome as default because of better error messages (phantomjs do not report linenumbers on errors)
			//'PhantomJS'
        	'Chrome'
		],


		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
