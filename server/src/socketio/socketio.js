const io = require('socket.io')();
const { leaveRoom } = require('../games/roomManager');

io.on('connection', (socket) => {
    console.log(`socket ${socket.id} connected`);

    let socketUserId, socketRoomId;

    socket.on('join', ({userId, roomId}) => {
        socketUserId = userId;
        socketRoomId = roomId;
        socket.join(roomId);
    })

    socket.on('disconnect', () =>{
        leaveRoom({socketUserId, socketRoomId});
    })
});

module.exports = io;