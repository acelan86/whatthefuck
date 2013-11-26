'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    logo:         ' * \n' + 
                    ' *                          $$!   ;$;\n' +                      
                    ' *                    !$  $$$$  !$$$   ;;\n' +                   
                    ' *                 $ *$$;$$$$$$$$$$;*$$$\n' +                   
                    ' *                $$$$$$$$$$$$$$$$$$$$$\n' +                    
                    ' *               $$$$$$;         o$$$$$o\n' +                   
                    ' *              *$$$   *#####;     $$$$$\n' +                   
                    ' *              $$$   &#$*!###     $$$$!\n' +                   
                    ' *              $$$;  $#!!###$   ;$$$$\n' +                    
                    ' *                $$$o  ;**   !$$$$!\n' +                      
                    ' *          !$&&&&$!  o$$$$$$o;   ;$&###&!     ;o$&&##&$;\n' + 
                    ' *       ###########$ o####*  #############!  o############\n' + 
                    ' *     ;#####;        #####  $####    *####;          ####*\n' + 
                    ' *      ###########  o####   ####;    ####$  $######;o####\n' + 
                    ' *          ;*#####o ####$  ####&    !#### o####     ####\n' +  
                    ' *    ####$**&####$ ;####  o####     ####o &####$o$#####\n' +  
                    ' *   ;o########$    *###   ####!    &####   ;######&!\n' +     
                    ' *                 ###;\n' +                                 
                    ' *                  ##o\n' +                                   
                    ' *                 ;#!\n' +                                     
                    ' *                 ;\n',
    footer: '/* publish <%= pubtime %> */',
    pubtime : '<%= grunt.template.today("yyyy-mm-dd H:MM:ss") %>',
    // Task configuration.
    // copy: {
    //   cssimg : {
    //     files:[
    //       {expand: true, cwd: 'src/core/esui/css/img/', dest: 'release/img/', src: ['**']},
    //       {expand: true, cwd: 'src/css/img/', dest: 'release/img/', src: ['**']}
    //     ]
    //   }
    // },
    // 
    concat : {
      sinaads : {
        files : [
          { dest : 'release/sinaads.full.js', src : ['src/sinaadToolkit.js', 'src/sinaads.js'] }
        ]
      }
    },
    jshint : {
      options : {
        "bitwise": false,
        "curly": true,
        "eqeqeq": true,
        "forin": false,
        "immed": true,
        "latedef": true,
        "newcap": true,
        "noarg": true,
        "noempty": true,
        //"nonew": true,
        "plusplus": false,
        "regexp": true,
        "undef": true,
        "unused": true,
        "strict": true,
        "trailing": true,
        // "camelcase": true,
        // "quotmark": true,
        "asi": false,
        "boss": false,
        "debug": false,
        "eqnull": false,
        "esnext": true,
        "evil": true,
        "es3":true,
        "expr": true,
        "funcscope": false,
        "globalstrict": false,
        "iterator": false,
        "lastsemic": false,
        "laxbreak": false,
        "laxcomma": false,
        "loopfunc": false,
        "multistr": false,
        "onecase": false,
        "proto": false,
        "regexdash": false,
        "scripturl": true,
        "smarttabs": false,
        "shadow": false,
        "sub": false,
        "supernew": false,
        "validthis": false,
        "browser": true,
        "couch": false,
        "devel": false,
        "node": true,
        "nonstandard": false,
        "rhino": false,
        "wsh": false,
        "worker": true,
        "nomen": false,
        "onevar": false,
        "passfail": false,
        //"white": true,
        "maxerr": 100,
        //"maxlen": 100,
        "maxparams": 10,
        "maxdepth": 10,
        //"indent": 4
      },
      files: ['src/**/*.js'],
    },
    uglify: {
      options : {
        report : 'gzip',
        beautify : {
          ascii_only : true
        },
        sourceMapRoot : '<%= pkg.sourceRoot %>'
      },
      sinaadToolkit: {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * sinaadToolkit\n' +
                    ' * @author acelan <xiaobin8[at]staff.sina.com.cn> zhouyi<zhouyi3[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'sinaadToolkit.js.map'
        },
        files : [
          { dest : 'release/sinaadToolkit.js', src : 'src/sinaadToolkit.js' }
        ]
      },
      sinaads : {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * sinaads\n' +
                    ' * @author acelan<xiaobin8[at]staff.sina.com.cn> zhouyi<zhouyi3[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'sinaads.js.map'
        },
        files : [
          { dest : 'release/sinaads.js', src : ['src/sinaadToolkit.js', 'src/sinaads.js'] }
        ]
      },
      media : {
        options : {
          banner : '/*!\n' + 
                    ' * sinaadToolkit.Media\n' +
                    ' * @author acelan<xiaobin8[at]staff.sina.com.cn> zhouyi<zhouyi3[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' +
                    ' */\n',
          sourceMap: 'Media.js.map'
        },
        files : [
          { dest : 'release/plus/Media.js',  src : 'src/plus/*.js' }
        ]
      }
    },
    copy: {
      sourcemap : {
        files:[
          {dest: 'release/plus/', src: 'Media.js.map'},
          {dest: 'release/', src: 'sinaads.js.map'},
          {dest: 'release/', src: 'sinaadToolkit.js.map'}
        ]
      }
    },
    watch: {
      script : {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'uglify']
      }
    },
    connect: {
      server: {
        options: {
          port: 1234
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'copy', 'connect', 'watch']);
  grunt.registerTask('nouglify', ['jshint', 'concat', 'connect']);
  grunt.registerTask('nowatch', ['jshint', 'concat', 'uglify', 'connect']);

};
