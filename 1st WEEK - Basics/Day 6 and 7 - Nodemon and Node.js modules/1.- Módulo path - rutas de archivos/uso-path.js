const path = require('path');

//Ruta absoluta del archivo actual
console.log("Ruta absoluta: ", __filename);

//Nombre del archivo
console.log("Nombre del archivo: ", path.basename(__filename));

//Nombre del directorio
console.log("Nombre del directorio: ", path.dirname(__filename));

//Extension del archivo
console.log("Extension del archivo: ", path.extname(__filename));

//Parsear ruta
console.log("Parsear ruta: ", path.parse(__filename));