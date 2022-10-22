const fs = require("fs");
const gulp = require("gulp");
const clean = require("gulp-clean");
const mjml = require("gulp-mjml");
const mjmlEngine = require("mjml");
const replace = require("gulp-replace");

const directoryNames = {
    build: "build",
    source: "emails",
    components: "components"
}

/*
 * compile time constants that can be used across email templates with {{}} syntax
 * at compile time, these constants will be replaced with values 
 */
const constants = {
    WEBSITE_URL: "http://example.com",
    EMAIL: "help@example.com",
}

/**
 * Replace template variables e.g. {{CONSTANT}}
 * with the value from the constants object. If no 
 * value is returned, just returns the template variable
 */
function replaceConstantPlaceHolders () {
  return replace(/\{\{(.*?)\}\}/g, (_, p1) => {
    const value = constants[p1];
    return value ? value : p1;
  });
};


function directories(done) {
    [directoryNames.build].forEach((path) => {
        if(!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }
    });
    done();
}

function clear() {
    return gulp
        .src([directoryNames.build], {read: false, allowEmpty: true})
        .pipe(clean({force: true}));
}

function html() {
    return gulp
        .src(["./emails/*"])
        .pipe(mjml(mjmlEngine, {validationLevel: "strict"}))
        // .pipe(replaceConstantPlaceHolders())
        .pipe(gulp.dest("./build"))
}

exports.default = gulp.series(html);
exports.clean = clear;
