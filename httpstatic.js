function httpstatic(func){
  var fs = require('fs'), 
    cache = {}, 
    nocache = process.env.nocache, 
    dir = './static/';

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    fs.mkdirSync(dir + 'localhost');  
    fs.writeFileSync(dir + 'localhost/index.html', 'hi there');
  }

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
        if(func && func(r, s)) return; // do not continue
        if(r.url === '/') r.url = '/index.html';
        var path = dir + r.headers.host + r.url;
        if(!nocache && cache[path]) s.end(cache[path]);
        s.end(fs.readFileSync(path).toString());
      });
  }
}

module.exports = function(func, port){
  require('http').createServer(httpstatic(func)).listen(port || 80);
}
