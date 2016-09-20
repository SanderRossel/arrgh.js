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
                    statements: 80,
                    branches: 80,
                    functions: 80,
                    lines: 80
                },
            }
        }
    });
};