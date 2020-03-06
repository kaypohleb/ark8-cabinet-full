const io = require('socket.io')();
const { createRoom, joinRoom, leaveRoom } = require('../games/roomManager');

io.on('connection', (socket) => {
    console.log(`socket ${socket.id} connected`);

    let socketUserId, socketRoomId;

    socket.on('join', async ({userId, roomId}) => {
        socketUserId = userId;
        socketRoomId = roomId;
        socket.join(roomId);

        console.log(userId, roomId);
        const room = await joinRoom({userId, roomId});
        
        io.to(roomId).emit('roomStateUpdate', room);
    })




    socket.on('disconnect',async () =>{
        console.log("temps",socketUserId, socketRoomId);
        const room = await leaveRoom({userId: socketUserId, roomId: socketRoomId});
        console.log("temps leftroom", room);
        io.to(socketRoomId).emit('roomStateUpdate', room);
    })
});


module.exports = io;