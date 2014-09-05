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
    smash: {
      bundle: {
        src: 'src/sinaads/main.js',
        dest: 'src/sinaads.js'
      }
    },
    concat : {
      media : {
        files : [
          { dest : 'release/plus/Media.full.js',  src : 'src/plus/*.js' }
        ]
      },
      sinaads : {
        files : [
          { dest : 'release/sinaads.full.js', src : ['src/sinaadToolkit.js', 'src/sinaadToolkit.Box.js', 'src/sinaadToolkit.ext.js', 'src/sinaads.js'] }
        ]
      }
      // ,
      // sinaadsDev : {
      //   files : [
      //     { dest : 'release/sinaads.dev.full.js', src : ['src/sinaadToolkit.dev.js', 'src/sinaadToolkit.ext.js', 'src/sinaads.dev.js'] }
      //   ]
      // }
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
      files: ['src/*.js', 'src/plus/*.js', 'src/spec/*.js'],
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
          { dest : 'release/sinaadToolkit.js', src : ['src/sinaadToolkit.js', 'src/sinaadToolkit.Box.js']}
        ]
      },
      // sinaadToolkitDev: {
      //   options : {
      //     //preserveComments:'some',
      //     banner : '/*!\n' + 
      //               ' * sinaadToolkit-dev version\n' +
      //               ' * @author acelan <xiaobin8[at]staff.sina.com.cn> zhouyi<zhouyi3[at]staff.sina.com.cn>\n' +
      //               ' * @version 1.0.0\n' +
      //               '<%= logo %>' + 
      //               ' */\n',
      //     sourceMap: 'sinaadToolkit.dev.js.map'
      //   },
      //   files : [
      //     { dest : 'release/sinaadToolkit.dev.js', src : 'src/sinaadToolkit.dev.js' }
      //   ]
      // },
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
          { dest : 'release/sinaads.js', src : ['src/sinaadToolkit.js', 'src/sinaadToolkit.Box.js', 'src/sinaadToolkit.ext.js', 'src/sinaads.js'] }
        ]
      },
      sinaadsMoHelper : {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * sinaads monitor helper\n' +
                    ' * @author fedeoo<zhangfei1[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'sinaadsMoHelper.js.map'
        },
        files : [
          { dest : 'release/sinaadsMoHelper.js', src : ['src/sinaadsMoHelper.js'] }
        ]
      },
      //压缩服务端预览全局变量附加脚本
      sinaadsServerPreviewSlots : {
        options : {
          //preserveComments:'some',
          banner : '/*!\n' + 
                    ' * sinaads monitor helper\n' +
                    ' * @author acelan<xiaobin8[at]staff.sina.com.cn>\n' +
                    ' * @version 1.0.0\n' +
                    '<%= logo %>' + 
                    ' */\n',
          sourceMap: 'sinaadsServerPreviewSlots.js.map'
        },
        files : [
          { dest : 'release/sinaadsServerPreviewSlots.js', src : ['src/sinaadsServerPreviewSlots.js'] }
        ]
      },
      // sinaadsDev : {
      //   options : {
      //     //preserveComments:'some',
      //     banner : '/*!\n' + 
      //               ' * sinaads-dev version\n' +
      //               ' * @author acelan<xiaobin8[at]staff.sina.com.cn> zhouyi<zhouyi3[at]staff.sina.com.cn>\n' +
      //               ' * @version 1.0.0\n' +
      //               '<%= logo %>' + 
      //               ' */\n',
      //     sourceMap: 'sinaads.dev.js.map'
      //   },
      //   files : [
      //     { dest : 'release/sinaads.dev.js', src : ['src/sinaadToolkit.dev.js', 'src/sinaadToolkit.ext.js', 'src/sinaads.dev.js'] }
      //   ]
      // },
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
          { dest : 'release/plus/Media.js',  src : 'release/plus/Media.full.js' }
        ]
      },
      // specmedia : {
      //   files : [
      //     { dest : 'release/spec/QrcodeMedia.js',  src : 'src/spec/QrcodeMedia.js' }
      //   ]
      // },
      // specad : {
      //   files : [
      //     { dest : 'release/spec/spec1.js',  src : 'src/spec/spec1.js' }
      //   ]
      // },
      // taobaofloat : {
      //   files : [
      //     { dest : 'release/spec/tanx.float.js',  src : 'src/spec/tanx.float.js' }
      //   ]
      // },
      //获取博客id及博文id
      exParamsForBlog : {
        files : [
          { dest : 'release/spec/getSinaadsExParamsForBlog.js',  src : 'src/spec/getSinaadsExParamsForBlog.js' }
        ]
      }
    },
    copy: {
      sourcemap : {
        files:[
          {dest: 'release/plus/', src: 'Media.js.map'},
          {dest: 'release/', src: 'sinaads.js.map'},
          {dest: 'release/', src: 'sinaadToolkit.js.map'},
          {dest: 'release/', src: 'sinaadsServerPreviewSlots.js.map'},
          {dest: 'release/', src: 'sinaadsMoHelper.js.map'},
          {dest: 'release/', src: 'src/pbv5.html'},
          {dest: 'release/', src: 'src/picshow_new.swf'}
        ]
      }
    },
    watch: {
      // 在mac node version v0.10.21 下有下面的设置时，会报错，信息：Waiting...[3]    1252 segmentation fault (core dumped)  grunt
      // 导致watch 终止，connect任务结束 所以调试时注释掉。added by fedeoo 
      script : {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify', 'copy']
      }
    },
    connect: {
      server: {
        options: {
          hostname: '*',//设置所有的host都能访问
          port: 1234
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-smash');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');

  // Default task.
  grunt.registerTask('default', ['smash', 'jshint', 'concat', 'uglify', 'copy', 'watch']);
  grunt.registerTask('nouglify', ['jshint', 'concat']);
  grunt.registerTask('nowatch', ['jshint', 'concat', 'uglify']);

};
