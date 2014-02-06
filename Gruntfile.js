module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        jshint: {
            files: [
                'Gruntfile.js',
                'client/src/*.js',
                'server/src/*.js'
            ],
            options: {
                globals: {
                    angular: false,
                    localStorage: false
                },
                multistr: true,
                node: true,
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true
            }
        },
        karma: {
            unit: {
                configFile: 'test/unit/karma.unit.conf.js'
            },
            e2e: {
                configFile: 'test/e2e/karma.e2e.conf.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['jshint', 'karma:unit']);
};