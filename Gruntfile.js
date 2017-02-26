'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.initConfig({
    concat: {
      js: {
        src: [
          'bower_components/jquery/dist/jquery.js',
          'bower_components/tether/dist/js/tether.min.js',
          'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'bower_components/angular/angular.js',
          'bower_components/lodash/dist/lodash.js',
          'bower_components/moment/min/moment.min.js',
          'bower_components/angular-moment/angular-moment.min.js',
          'bower_components/angular-timer/dist/angular-timer.js',
          'bower_components/humanize-duration/humanize-duration.js'
        ],
        dest: 'dist/third-party.js'
      },
      css: {
        src: [
          'bower_components/bootstrap/dist/css/bootstrap.css'
        ],
        dest: 'dist/third-party.css'
      }
    },
    babel: {
      options: {
        sourceMap: true,
        presets: ['es2015']
      },
      dist: {
        files: {
          'dist/app.js': 'scripts/app.js'
        }
      }
    },
    watch: {
      scripts: {
        files: ['scripts/app.js'],
        tasks: ['babel'],
        options: {
          livereload: true
        }
      },
      html: {
        files: ['html/**/*.html', 'index.html'],
        options: {
          livereload: true
        }
      }
    }
  });

  grunt.registerTask('default', ['babel', 'concat:js', 'concat:css']);
  grunt.registerTask('serve', ['default', 'watch']);

};