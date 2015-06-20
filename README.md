HTTP Static
===========

Simple HTTP static server with caching.  Minimal resource usage.  
    
Static folder files are cached and served directly.  From ./static folder, which is created if not exists.    
Takes request body and parses to JSON. (r.body)    

Example
````
function handler(r, s){
	// r.body is JS object if sent from client
}
require('httpstatic')(handler);
````

Don't cache files
````
nocache=1 node -e "require('httpstatic')()"
````
