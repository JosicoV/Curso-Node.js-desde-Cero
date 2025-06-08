const http = require('http');

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        res.end('Inicio');
    } else if (req.url === '/about'){ //Comprobado, no funciona con /about/
        res.end('Acerca de...');
    } else {
        res.end('Ruta no encontrada');
    }
});

const port = 3000;

server.listen(port);