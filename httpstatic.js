var fs = require('fs');
var cache = {}, client;
var livereload = process.env.livereload;
var flag;

if(livereload){
 fs.watch('./static', function(){
  cache = buildCache();
  if(client)
    setTimeout(function(){client.write('data:ok\n\n');}, 100);
 });
}

function cli_reload(){
  console.log('registering for reload');
  var ev = new EventSource('/reload');
  ev.onmessage = function(){
    setTimeout(function(){history.go()}, 100); 
    console.log('reloading');
  };
}
var clijs = '\n\n<script>\n('+cli_reload.toString()+')()\n</script>';

function buildCache(){
  if(!fs.existsSync('./static')) return;
  var cache = {};
  fs.readdirSync('./static')
    .filter(function(f){ return !f.match(/^\.$/) })
    .forEach(function(f){
      if(!f.match(/^\./) && !f.match(/\.TMP$/)) 
        cache[f] = fs.readFileSync('./static/' + f).toString();
      if(livereload) cache[f] += clijs;
    });
  return cache;
}

module.exports = function(use) {
  cache = buildCache();

  require('http').createServer(function(r, s) {

    if(livereload && r.url == '/reload'){
      s.setHeader('Content-Type', 'text/event-stream');
      s.setHeader('Access-Control-Allow-Origin', '*');
      return client = s;
    }

    var d = '';
    r.on('data', function(chunk) {
      d += chunk.toString();
    });

    r.on('end', function() {

      s.setHeader('Content-Type', 'text/html');
      if(cache && cache[r.headers.host])
      	return s.end(cache[r.headers.host]);

      var url = (r.url === '/') ? 'index.html' : r.url.slice(1);
      if(cache && cache[url])
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
