module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        files: [
            'src/*.js',
            'test/spec/*.js'
        ],
        preprocessors: {
            'src/*.js': ['coverage']
        },
        reporters: ['progress', 'coverage'],
        port: 9876,
        autoWatch: true,
        browsers: ['Chrome', 'IE'],
        singleRun: false,
        coverageReporter: {
            type : 'html',
            dir : 'test/coverage/',
            check: {
                global: {
                    statements: 90,
                    branches: 90,
                    functions: 90,
                    lines: 90
                },
            }
        }
    });
};