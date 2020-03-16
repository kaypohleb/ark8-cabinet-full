const io = require('socket.io')();
const firebase = require('../db/firebase');
const roomController = require('../controllers/room');

let signedInUsers = [{id : 'testuser', idToken: '21'}];
const auth = firebase.auth();

const checkAuth = async (idToken) => {
    let user = signedInUsers.find(user => user.idToken == idToken);
    
    if (user){
        return user;
    }

    auth.verifyIdToken(idToken)
    .then((decodedToken) => {
        user = {id: decodedToken.uid, idToken};
        signedInUsers.push(user);
        
        return user;
    })
    .catch(() => {
        return null;
    })
}


io.of(/^\/[A-Za-z0-9]{6}/).on('connect', async (socket) => {
    const roomId = socket.nsp.name.substring(1);
    console.log(`socket ${socket.id} connected to namespace ${roomId}`);

    const idToken = socket.handshake.query.idToken;
    if (!idToken){
        socket.emit('test', {message: 'id not valid'});
        return socket.disconnect(true);
    }

    const user = await checkAuth(idToken);
    if (!user){
        socket.emit('test', {message: 'user not valid'});
        return socket.disconnect(true);
    }

    const room = roomController.getRoom(roomId)
    if (!room) {
        socket.emit('test', {message: 'room not valid'});
        return socket.disconnect(true);
    }

    await roomController.joinRoom(user.id, roomId);

    socket.emit('roomStateChange',room);
    
    socket.on('disconnect', () => {
        console.log(`socket ${socket.id} disconnected from namespace ${roomId}`)
        signedInUsers = signedInUsers.filter(user => user.idToken != idToken);
    })
})


module.exports = io;