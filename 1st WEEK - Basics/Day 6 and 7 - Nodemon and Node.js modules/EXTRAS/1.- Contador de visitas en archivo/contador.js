const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    //leer contador
    fs.readFile('contador.txt', 'utf8', (err, data) => {
        let contador = 0;
        if(err || data.trim() === ''){
            contador = 1;
        } else {
            contador = parseInt(data) + 1;
        }

        //Escribir el nuevo valor
        fs.writeFile('contador.txt', contador.toString(), (err) => { //IMPORTANTE: toString, la función espera texto
            if (err) {  
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error al escribir el contador');
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end("<h1>Visitas: " + contador + "</h1>");
        })
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Página no encontrada');
  }
});

server.listen(3000, () => {
  console.log('Servidor en ejecución en el puerto 3000, http://localhost:3000/');
});
