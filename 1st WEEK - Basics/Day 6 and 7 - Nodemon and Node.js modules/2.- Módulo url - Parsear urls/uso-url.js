const url = require('url');

const miURL = new URL('https://josicovila.es:8000/node?nivel=avanzado&gratis=true#contacto');

console.log("Host:", miURL.host);
console.log("Pathname:", miURL.pathname);
console.log("Parametros:", miURL.searchParams);
console.log("Hash:", miURL.hash);
console.log("Protocol:", miURL.protocol);
console.log("Port:", miURL.port);
console.log("¿Es gratis?", miURL.searchParams.get("gratis"));