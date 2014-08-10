module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.initConfig({
    wiredep: {
      defaultTheme: {
        src: ['app/assets/themes/default/layout.jade'],
        ignorePath: '../../shared',
        exclude: ['medium-editor', 'medium-editor-insert-plugin']
      },
      setup: {
        src: ['app/setupassets/views/layout.jade'],
        ignorePath: '../../assets/shared',
        exclude: ['medium-editor', 'medium-editor-insert-plugin']
      },
      editor: {
        src: ['app/assets/themes/default/editor.jade'],
        ignorePath: '../../shared',
        exclude: ['angular', 'bootstrap', 'jquery']
      }
    }
  })
}
