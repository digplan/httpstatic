module.exports = function(use) {

  var fs = require('fs');

  var cache = {};
  fs.readdirSync('./static')
    .filter(function(f){ return !f.match(/^\.$/) })
    .forEach(function(f){
      cache[f] = fs.readFileSync('./static/' + f).toString();
    });

  require('http').createServer(function(r, s) {

    var d = '';
    r.on('data', function(chunk) {
      d += chunk.toString();
    });

    r.on('end', function() {

      if(cache[r.headers.host])
      	return s.end(cache[r.headers.host]);

      var url = (r.url === '/') ? 'index.html' : r.url.slice(1);
      if(cache[url])
        return s.end(cache[url]);

      try{
      	r.body = JSON.parse(d);
      } catch(e){
      	r.body = d;
      }

      if(!use){
      	s.writeHeader(404); 
        return s.end();
      }

      use(r, s);
    });

  })

  .listen(80);
}
