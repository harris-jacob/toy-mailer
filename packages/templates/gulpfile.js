const fs = require("fs");
const gulp = require("gulp");
const clean = require("gulp-clean");
const mjml = require("gulp-mjml");
const mjmlEngine = require("mjml");
const replace = require("gulp-replace");
const server = require("live-server");


const directoryNames = {
    build: "build",
    source: "emails/*",
    components: "components/*"
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
 * Replace template variables e.g. {{VALUE}}
 * with the corresponding value from the constants object or 
 * if, no matching costant key is found, returns the value in 
 * the eta template format
 */
function templateVariables() {
  return replace(/\{\{(.*?)\}\}/g, (_, p1) => {
    const value = constants[p1];
    return value ? value : `<%= it.${p1} %>`;
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
        .src([directoryNames.source])
        .pipe(mjml(mjmlEngine, {validationLevel: "strict"}))
        .pipe(templateVariables())
        .pipe(gulp.dest(directoryNames.build))
}

function watchFiles() {
    return gulp
         .watch([directoryNames.source, directoryNames.components],
            html)
}

async function serve() {
    return server.start({
        root: directoryNames.build,
        port: 3000
    })
}



exports.default = gulp.series(clear, directories, html);
exports.watch = gulp.series(clear, directories, html, gulp.parallel([serve, watchFiles]))

exports.clean = clear;
