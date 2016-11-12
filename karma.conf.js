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
        reporters: ['progress', 'junit', 'coverage'],
        port: 9876,
        autoWatch: true,
        browsers: ['Chrome', 'IE', 'Firefox'],
        singleRun: true,
        coverageReporter: {
            reporters: [
                { type : 'html', subdir: 'html' },
                { type : 'cobertura', subdir: 'cobertura' }
            ],
            dir : 'test/coverage/',
            check: {
                global: {
                    statements: 95,
                    branches: 95,
                    functions: 95,
                    lines: 95
                },
            }
        },
        junitReporter: {
            outputDir: 'test/junit',
            suite: 'arrgh.js',
            useBrowserName: true
        }
    });
};