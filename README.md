HTTP Static
===========

Simple HTTP static server with multi-domain hosting capabilities.  Primarily for SPA (single page applications).  Caching by default.  Minimal resource usage.
    
Static folder files are cached and served directly.    
Files named after the domain are served as single page applications.    
Takes request body and parses to JSON. (r.body)    

Example
````
function handler(r, s){
	// r.body is JS object if sent from client
}
require('httpstatic')(handler);
````