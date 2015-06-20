HTTP Static
===========

Simple HTTP static server with caching.  Minimal resource usage.  
    
Static folder files are cached and served directly.  From ./static folder, which is created if not exists.    
Takes request body and GET query string, and parses to JSON. (r.body)    

Example
````
function handler(r, s){
	// r.body is JS object if sent from client
}
require('httpstatic')(handler, port);  // port optional, defaults to 80
````

Don't cache files
````
nocache=1 node -e "require('httpstatic')()"
````
