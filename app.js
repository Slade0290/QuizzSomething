const { Socket } = require('socket.io');

const express  = require('express');

const app = express();
const http = require('http').createServer(app);
const path = require('path');
const port = 8080;

const io = require('socket.io')(http);

app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquerry', express.static(path.join(__dirname, 'node_modules/jquerry/dist')));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

app.get('/games/WarQuizz', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/games/WarQuizz.html'));
});

http.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});