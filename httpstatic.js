function httpstatic(func){
  var fs = require('fs'), 
    cache = {}, colors = require('colors'),
    nocache = process.env.nocache, 
    sep = require('path').sep,
    dir = __dirname + sep + 'static' + sep;

    if(!fs.existsSync(dir))
      fs.mkdirSync(dir);

  require('node-dir').files(dir, function(err, files) {
    if (err) throw err;
    files.map(function(fn) {
      cache[fn] = require('fs').readFileSync(fn).toString();
    });
  });

  return function(r, s){
      var body = '';
      r.on('data', function (data) {
        body += data;
        if (body.length > 1e6) r.connection.destroy();
      });
      r.on('end', function () {
        r.body = body;
        if(func){
          var ret = func(r, s);
          if(ret) s.end();
        }
        if(r.url === '/') r.url = sep + 'index.html';
        var path = dir + r.headers.host.match(/[^:]*/) + r.url.replace('/', sep);

        if(!fs.existsSync(path)){
          console.log(colors.red(path.replace(dir,'')));
          return s.end('')
        }

        console.log(colors.green(path.replace(dir,'')));
        if(!nocache && cache[path]) return s.end(cache[path]);
        s.end(fs.readFileSync(path).toString());
      });
  }
}

module.exports = start = function(f){
  var fu = httpstatic(f);
  port = process.env.port || 80;
  console.log('Starting server on ' + port);
  return require('http').createServer(fu).listen(port);
} 

var isScript = !module.parent;
if(isScript) start(require(process.cwd() + '/handler.js'));
