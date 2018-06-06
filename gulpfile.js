/**
 * Slot Game Demo in HTML5 and JavaScript using PureMVC and Pixi.js
 * by Murali Saripalli.
 * File: gulpfile.js
 */
var gulp = require('gulp'),
//     gutil = require('gulp-util'),
//     jshint = require('gulp-jshint');
// sourcemaps = require('gulp-sourcemaps');
// concat = require('gulp-concat');
// uglify = require('gulp-uglify');
// order = require('gulp-order');
// streamqueue = require('streamqueue');
// header = require('gulp-header');
// connect = require('gulp-connect');
ts = require('gulp-typescript');
tsProject = ts.createProject("tsconfig.json");
// runSequence = require('run-sequence');
// open = require('gulp-open');
// inject = require('gulp-inject');
// jsonfile = require('jsonfile');
// var gnf = require('gulp-npm-files');
// var exec = require('child_process').exec;
// var clean = require('gulp-clean');
// var mkdirp = require('mkdirp');
// var pathParse = require('path-parse');

var packageJSON = require('./package');





// var typedoc = require("gulp-typedoc");

// gulp.task("doc", function () {
//     return gulp
//         .src([
//             "node_modules/jdbpuremvc/puremvc.d.ts",
//             "node_modules/pixi-spine/bin/pixi-spine.d.ts",
//             "node_modules/jdbsmartfox/smart-fox-server.d.ts",
//             "node_modules/pixi-projection/dist/pixi-projection.d.ts",
//             "src/**/*.ts"])
//         .pipe(typedoc({
//             // TypeScript options (see typescript docs)
//             module: "commonjs",
//             target: "es6",
//             includeDeclarations: false,


//             // Output options (see typedoc docs)
//             out: "./out",
//             // json: "doc.json",

//             // TypeDoc options (see typedoc docs)
//             name: "SuperLuckyDragon",
//             // theme: "/path/to/my/theme",
//             // plugins: ["my", "plugins"],
//             ignoreCompilerErrors: false,
//             version: true,
//         }))
//         ;
// });

gulp.task('webserver', function () {
    connect.server({
        root: ["./public"],
        host: "0.0.0.0",
        livereload: true,
        port: "5566"
    });
});

gulp.task('ts', function () {
    var moveTS =
        gulp.src([
            
            "./src/**/*.ts"
        ])

            // .pipe(sourcemaps.init())
            .pipe(ts({
                outFile: 'main.js',
                allowJs: true
            }))
            .js
            // .pipe(sourcemaps.write())
            .pipe(gulp.dest("./public/js"))
            // .pipe(connect.reload());

    return moveTS;
})

gulp.task('copyLibs', function () {
    gulp.src(gnf(), { base: './' }).pipe(gulp.dest('./public/libs'));


    // return gulp.src('./libs/**/*.js').pipe(gulp.dest("./public/libs"));
})

gulp.task('copyRes', function () {
    return gulp.src('./resource/**/*').pipe(gulp.dest("./public"));
})

var sources = gulp.src([
    './public/libs/node_modules/pixi.js/dist/pixi.min.js',
    './public/libs/**/*.min.js',
    './public/libs/node_modules/three/examples/js/controls/OrbitControls.js',
    './public/libs/node_modules/three/examples/js/loaders/ColladaLoader.js',
    './public/libs/node_modules/pixi-projection/dist/pixi-projection.js',
    './public/js/**/*.js'
]
    , { read: false }, { relative: true });

gulp.task('injectJS', function () {
    return gulp.src('./index.html').pipe(inject(sources, { ignorePath: 'public' }))
        .pipe(gulp.dest('./public'));
});

gulp.task('injectJS2', function () {
    // var sources = gulp.src(libSrc
    //     , { read: false });

    return gulp.src('./index.html').pipe(inject(sources))
        .pipe(gulp.dest('./public'));
});

gulp.task('open', function () {
    gulp.src('./public')
        .pipe(open({ uri: 'http://127.0.0.1:5566' }));
});

// // watch for changes and run jshint
gulp.task('watch', function () {
    gulp.watch('src/**/*.ts', ['ts']);
});

gulp.task('only_build', function () {
    return runSequence(['ts', 'copyLibs', 'copyRes'], 'injectJS2', 'compile_res');
})

gulp.task('default', function () {
    return runSequence(['ts', 'copyLibs', 'copyRes'], 'injectJS', ['watch', 'webserver', 'open']);
})

gulp.task('clean', function () {
    gulp.src('./public', { read: false }).pipe(clean());
})

gulp.task('compile_res', function () {

    var through2 = require('through2')

    // 產生語系的regex
    var supportLangs = tsProject.rawConfig.supportLangs;
    let langRegx = "(";
    for (index in supportLangs) {
        langRegx += "_"+supportLangs[index] + "|";
    }
    langRegx = langRegx.substring(0, langRegx.length - 1) + ")|(@\\d+[\\.\\d+]*x)";
    // console.log(langRegx);


    // 檢查路徑存在
    var configPath = "./public/assets/res.conf.json";
    let dir = pathParse(configPath).dir;
    mkdirp(dir, function (err) {
        if (err) {
            console.log(err);
        }
    });

    var conf = {};

    return gulp.src(['resource/assets/**/*'], { base: "resource/assets" })
        .pipe(through2.obj(function (file, enc, cb) {
            var parsed = pathParse(file.relative);

            var groupName = parsed.dir;
            var path = "assets/";
            var fileName = file.relative;

            if (!file.isDirectory()) {

                let name = parsed.base;
                let matchResult = name.match(langRegx);
                // console.log(matchResult);
                let key = parsed.name;
                if (matchResult) {
                    if (matchResult[1]){
                        // 加上語系
                        groupName += matchResult[1];
                    }
                    
                    key = name.substring(0, matchResult.index);
                    
                }
                // console.log(groupName,key);

                // 存到同一組group下
                var groupObj = conf[groupName];
                if (!groupObj) {
                    groupObj = {}
                }

                // 如果已有json檔，則不覆蓋(為了sheetscript)
                let savedObj = groupObj[key];
                if(!(savedObj && savedObj.endsWith(".json"))){
                    groupObj[key] = path + parsed.dir + "/" + parsed.base;
                    conf[groupName] = groupObj;    
                }

            }

            jsonfile.writeFileSync(configPath, conf, { spaces: 2 });
            cb()
        }))
})


gulp.task('run_test', function (cb) {
    exec('karma start', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
})