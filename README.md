HTTP Static
===========

Simple HTTP static server with caching and *multi-domain* applications from a single server.  Minimal resource usage.  
Static folder files are cached and served directly, for multiple domains.

Examples
````
// serve static memory cached pages from a.com and b.com
//  ./static/a.com/index.html
//  ./static/b.com/index.html

$ port=81 nocache=1 node httpstatic.js  # Optional port, nocache

// use alternate request handling
````
require('./httpstatic.js')(function(r, s){
  s.write('processing..');
  s.end(); // dont serve the page
});
````
