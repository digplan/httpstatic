HTTP Static
===========

Simple HTTP static server with caching and *multi-domain* applications from a single server.  Minimal resource usage.  
Static folder files are cached and served directly, for multiple domains.

Examples
````
// serve static memory cached pages from a.com and b.com
//  ./static/a.com/index.html
//  ./static/b.com/index.html

$ port=81 nocache=1 node httpstatic  # Optional port, nocache

// use alternate request handling
function handler(r, s){
  if(r.url.match(/php$/)) // do something
  s.write("im intercepting the static request handling");
  s.end("i used end, i wont continue serving the static page");
}
require('./httpstatic.js')(handler, 82);
````
