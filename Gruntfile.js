module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [{
                    src: 'assets/js/angular/**/*.js',
                    dest: 'build/<%= pkg.name %>.min.js'
                }]
            }
        },
        less: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                cleancss: true
            },

            all: {
                files: [{
                    src: 'assets/styles/init.less',
                    dest: 'build/default.css'
                }]
            },
        },
        clean: {
            img: ['build/*']
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Default task(s).
    grunt.registerTask('default', [
        'clean', // Clean previous build files
        'uglify', // Minify and uglify css and put it in build folder
        'less', // Compile CSS files and put them in build folder
    ]);

};