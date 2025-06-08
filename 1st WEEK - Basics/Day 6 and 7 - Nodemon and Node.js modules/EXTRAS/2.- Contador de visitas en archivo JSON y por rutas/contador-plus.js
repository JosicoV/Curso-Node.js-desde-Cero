const fs = require('fs');
const http = require('http');

const archivoJSON = 'contador.json';
const archivoCSV = 'contador.csv';



const server = http.createServer((req, res) => {
    const ruta = req.url;
    const ip = req.socket.remoteAddress;


    //Leer el archivo JSON
    fs.readFile(archivoJSON, 'utf8', (err, data) => {
        let contador = {};
        if (!err && data.trim() !== '') {
            try {
                contador = JSON.parse(data);
            } catch(e) {
                console.error("Error al parsear el archivo JSON", e);
                contador = {};
            }
        }

        //Inicializar ruta si no existe
        if (!contador[ruta]) {
            contador[ruta] = {
                visitas: 1,
                ultimaVisita: new Date().toISOString(),
                ips: [ip]
            }
        } else {
            contador[ruta].visitas++;
            contador[ruta].ultimaVisita = new Date().toISOString();
            if (!contador[ruta].ips.includes(ip)) {
                contador[ruta].ips.push(ip);
            }
        }


        //Guardar el nuevo valor en el archivo JSON
        fs.writeFile(archivo, JSON.stringify(contador, null, 2), (err) => {
            if (err) {
                console.error("Error al guardar el archivo JSON", err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                return res.end('Error al guardar el archivo JSON');
            }
            
            if(ruta === '/stats'){ //Todas las estadísticas de acceso
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write('<h1>Estadísticas</h1>');
                res.write('<ul>');
                for (const [ruta, info] of Object.entries(contador)) {
                    res.write(`<li><h2>${ruta}:</h2> ${info.visitas} visitas, última visita: ${info.ultimaVisita}, IPs: ${info.ips.join(', ')}</li><hr>`);
                }
                res.write('</ul>');
                return res.end();
            }
            
            //Respuesta normal para cualquier ruta que no sea /stats
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(`<h1>Ruta: ${ruta}</h1><p>Contador: ${contador[ruta].visitas}</p>`);
        });

    });
});

server.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000, http://localhost:3000");
});