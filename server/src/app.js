const express = require('express');
const unless = require('express-unless');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Middleware
const authMiddleware = require('./middleware/auth');
authMiddleware.unless = unless;

app.use(express.json());
app.use(cors());
app.use(authMiddleware.unless({
    path: ['/login', '/logout']
}))

// Route handlers
app.use(require('./api/user'));

http.listen(port, () => {
    console.log(`Server started at port ${port}`)
});