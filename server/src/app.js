const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const http = require('http').createServer(app);
const io = require('./socketio/socketio');

io.attach(http);

app.use(cors({
    origin:['http://localhost:3000','http://ark8-client.herokuapp.com', 'https://ark8-client.herokuapp.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(require('./firebase/auth').checkAuth);
app.use(express.json());

// API route handlers
app.use(require('./api/user'));
app.use(require('./api/room'));
app.use(require('./api/game'));

http.listen(port, () => {
    console.log(`Server started at port ${port}`)
});

module.exports = http;