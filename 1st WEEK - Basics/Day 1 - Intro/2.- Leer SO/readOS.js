const os = require('os'); //Librería necesaria para acceder a la información del SO.

console.log("Sistema Operativo: " + os.platform());
console.log("Memoria Libre: " + os.freemem());
console.log("Memoria Total: " + os.totalmem());