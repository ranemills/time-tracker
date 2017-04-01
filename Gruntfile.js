'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

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
          'bower_components/humanize-duration/humanize-duration.js',
          'bower_components/chart.js/dist/Chart.js',
          'bower_components/angular-chart.js/dist/angular-chart.min.js'
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
          'dist/app.js': 'src/scripts/app.js'
        }
      }
    },
    copy: {
      html: {
        expand: true,
        cwd: 'src/html',
        src: '**',
        dest: 'dist/'
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

  grunt.registerTask('default', ['babel', 'concat:js', 'concat:css', 'copy:html']);
  grunt.registerTask('serve', ['default', 'watch']);

};