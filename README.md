HTTP Static
===========

Simple HTTP static server with multi-domain hosting capabilities.  Multiple domain SPAs (single page applications).    
Caching by default.  Minimal resource usage.  Live reload feature for development optional.    
    
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

livereload feature    
````
livereload=1 node -e "require('httpstatic')()"
````
