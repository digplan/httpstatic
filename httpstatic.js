function httpstatic(func){
  var fs = require('fs'), 
    cache = {}, 
    nocache = process.env.nocache, 
    dir = './static/';

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
        var path = dir + r.headers.host + r.url;
        if(!nocache && cache[path]) s.end(cache[path]);
        s.end(fs.readFileSync(path).toString());
      });
  }
}

module.exports = function(f, port){
  // start server
  if(!fs.existsSync('certificate.crt'))
    return http.createServer(f).listen(port||80);

  return https.createServer({
    ca: fs.readFileSync("./ca_bundle.crt"),
    key: fs.readFileSync("./private.key"),
    cert: fs.readFileSync("./certificate.crt")
  }, f||df).listen(port||443);
  
  require('http').createServer(httpstatic(f)).listen(port || 80);
}
