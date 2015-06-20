module.exports = function(use, port) {

  var fs = require('fs');
  var nocache = process.env.nocache;
  
  var cache = {};
  try {
    fs.readdirSync('./static')
      .filter(function(f){ return !f.match(/^\.$/) })
      .forEach(function(f){
        cache[f] = fs.readFileSync('./static/' + f).toString();
      });
  } catch(e){
      fs.mkdir('./static');
      fs.writeFileSync('./static/index.html', 'hi there');
      nocache = true;  
  }

  require('http').createServer(function(r, s) {

    s.exit = function(c, r){
      s.writeHeader(c);
      s.end(r||'');
    }

    var d = '';
    r.on('data', function(chunk) {
      d += chunk.toString();
    });

    r.on('end', function() {

      if(cache[r.headers.host] && !nocache)
      	return s.end(cache[r.headers.host]);

      var url = (r.url === '/') ? 'index.html' : r.url.slice(1);
      if(cache[url])
        return s.end(cache[url]);

      try{
      	r.body = JSON.parse(d);
      } catch(e){
      	r.body = d;
      }

      !use &&	s.exit(404);

      var parts = require('url').parse(r.url);

      if(parts.search){
        r.body = {};
        r.url = r.url.replace(parts.search, '');
        var qs = require('querystring').parse(parts.query);
        for(i in qs) r.body[i] = qs[i];
      }

      use(r, s);
    });

  })

  .listen(port||80);
}
