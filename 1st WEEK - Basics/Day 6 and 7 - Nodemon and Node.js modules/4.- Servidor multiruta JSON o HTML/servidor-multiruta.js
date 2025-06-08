const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if(req.url === '/'){
        fs.readFile('index.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } else if (req.url === '/api'){
        const datos = {
            nombre: "José",
            mensaje: "Bienvenido a la API"
        };
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(datos));
    } else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end('<h1>Página no encontrada</h1>');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}, http://localhost:${port}`);
});