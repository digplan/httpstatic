function httpstatic(func){
  var fs = require('fs'), 
    cache = {}, colors = require('colors'),
    nocache = process.env.nocache, 
    dir = './static/';
    if(!fs.existsSync(dir))  fs.mkdirSync(dir);

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
        func && func(r, s);
        if(r.url === '/') r.url = '/index.html';
        var path = dir + r.headers.host.match(/[^:]*/) + r.url;
        
        if(!fs.exists(path)) {
          console.log(colors.red(path));
          return s.end('');
        }
        console.log(colors.green(path));
        if(!nocache && cache[path]) s.end(cache[path]);
        s.end(fs.readFileSync(path).toString());
      });
  }
}

module.exports = start = function(f, port){
  var fu = httpstatic(f);
  port = process.env.port || port || 80;
  console.log('Starting server on ' + port);
  return require('http').createServer(fu).listen(port);
} 

var isScript = !module.parent;
if(isScript) start();
