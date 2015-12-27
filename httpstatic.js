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

function db(r, s){
  switch(r.method){
      case 'GET':
        if(!db[table]) return s.end('table does not exist');
        res = db[table]; break;
      case 'POST':
        if(!db[table]) return s.end('table does not exist');
        var id = makeid();
        var t = db[table];
        if(Array.isArray(t)){
          db[table].push(r.body);
          res = db[table];
        } else if(typeof t === 'string') {
          res = db[table] = r.body;
        } else if(typeof t === 'object') {
          res = db[table][t] = r.body;
        }
        break;
      case 'PATCH':
        var id = r.body.id;
        if(!db[table][id]) return s.end('no id provided');
        delete r.body.id;
        db[table][id] = r.body;
        res = id; break;
      case 'DELETE':
        if(!db[table][r.body.id]) return s.end('no id provided');
        delete db[table][r.body.id];
        res = r.body.id; break;
      case 'PUT':
        if(db[table]) return s.end('table exists');
        db[table] = r.body;
        res = table;
  }
}

module.exports = function(f, port){
  var fu = httpstatic(f);
  // start server
  if(!fs.existsSync('certificate.crt'))
    return http.createServer(fu).listen(port||80);

  return https.createServer({
    ca: fs.readFileSync("./ca_bundle.crt"),
    key: fs.readFileSync("./private.key"),
    cert: fs.readFileSync("./certificate.crt")
  }, fu).listen(port||443);
}
