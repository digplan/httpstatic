HTTP Static
===========

Simple HTTP static server with caching and multi-domain applications from a single server.  Minimal resource usage.  
Static folder files are cached and served directly, for multiple domains.

Examples
````
// serve static memory cached pages from a.com and b.com
//  ./static/a.com/index.html
//  ./static/b.com/index.html
node -e "require('httpstatic')()"

// use alternate request handling
function handler(r, s){
  s.write("im intercepting the static request handling");
  s.end("i used end, i wont continue serving the static page");
}
node -e "require('httpstatic')(handler)()"

// use alternate port
require('httpstatic')(func, 81);

// development, no caching
nocache=1 node -e "require('httpstatic')(func, 81)"
````
