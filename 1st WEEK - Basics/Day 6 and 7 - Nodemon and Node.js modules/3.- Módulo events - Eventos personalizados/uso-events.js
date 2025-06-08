const eventEmitter = require('events');

const myEmitter = new eventEmitter();

myEmitter.on('saludo', (nombre) => {
    console.log(`Hola, ${nombre}`);
});

myEmitter.emit('saludo', 'Juan');
myEmitter.emit('saludo', 'Maria');