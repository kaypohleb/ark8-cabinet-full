const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Middleware
const authMiddleware = require('./middleware/auth');
app.use(authMiddleware);
app.use(express.json());
app.use(cors());

// Route handlers
app.use(require('./api/user'));
app.use(require('./api/room'));

http.listen(port, () => {
    console.log(`Server started at port ${port}`)
});