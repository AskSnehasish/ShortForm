var fs = require('fs');
var csso = require('csso');

var src = 'assets/css/style.css';
var dst = 'assets/css/style.min.css';
var css = fs.readFileSync(src, 'utf8');
var result = csso.minify(css);
fs.writeFileSync(dst, result.css);
console.log('Minified %s (%dkB) -> %s (%dkB)', src, (Buffer.byteLength(css) / 1024).toFixed(1), dst, (Buffer.byteLength(result.css) / 1024).toFixed(1));
