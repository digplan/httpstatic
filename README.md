HTTP Static
===========

Simple HTTP static server with caching.  Minimal resource usage.  
    
Static folder files are cached and served directly, for multiple domains.  
From ./static folder, which is created if not exists.    
Request body (r.body)    

Example
````
function handler(r, s){
	// r.body
}
require('httpstatic')(handler, port);  // handler and port optional, defaults to static server and 80
````

Don't cache files
````
nocache=1 node -e "require('httpstatic')()"
````
