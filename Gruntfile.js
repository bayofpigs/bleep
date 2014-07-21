module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    wiredep: {
      defaultTheme: {
        src: ['app/assets/themes/default/layout.jade'],
        ignorePath: '../../../../assets/shared/'
      },
      config: {
        src: ['app/setupassets/views/layout.jade'],
        ignorePath: '../../../assets/shared/'
      }
    }
  })
}