module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    wiredep: {
      target: {
        src: ['app/assets/themes/default/*'],
        ignorePath: '../../shared/bower_components'
      }
    }
  })
}