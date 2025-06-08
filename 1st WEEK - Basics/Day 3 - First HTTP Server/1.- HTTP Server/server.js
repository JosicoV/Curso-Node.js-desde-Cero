const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Node.js Server running');
});

server.listen(3000, () => {
    console.log('Server is running on port 3000, http://localhost:3000');
})
