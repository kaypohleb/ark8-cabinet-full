const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const http = require('http').createServer(app);
const io = require('./socketio/socketio');

io.attach(http);

app.use(cors({
    origin:['http://localhost:3000',],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Middleware
const authMiddleware = require('./middleware/auth');
app.use(authMiddleware);
app.use(express.json());


// Route handlers
app.use(require('./api/user'));
app.use(require('./api/room'));

http.listen(port, () => {
    console.log(`Server started at port ${port}`)
});