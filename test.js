function handler(r, s){
   s.end('');
}

require('./server.js')(handler);