const generate = require('nanoid/generate');
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const rooms = [];

const createRoom = ({userId, gameId}) => {
    const roomId = generate(alphabet, 6);

    const room = {
        roomId,
        createdBy: userId,
        gameId,
        players : [userId]
    }

    rooms.push(room);

    console.log("rooms:", rooms);
    return room;
};

const joinRoom = ({userId, roomId}) => {
    const roomIndex = rooms.findIndex(r => r.roomId == roomId);

    if (roomIndex == -1) {
        return null;
    }

    let room = rooms[roomIndex];
    
    rooms[roomIndex] = {
        ...room,
        players : [...room.players.filter(player => player != userId), userId]
    };

    room = rooms[roomIndex];
    
    console.log("rooms:", rooms);
    return room
}

const leaveRoom = ({userId, roomId}) => {
    const roomIndex = rooms.findIndex(r => r.roomId == roomId);

    if (roomIndex == -1) {
        return null;
    }

    let room = rooms[roomIndex];
    
    rooms[roomIndex] = {
        ...room,
        players : room.players.filter((id) => id != userId)
    };

    room = rooms[roomIndex];

    console.log("rooms:", rooms);
    return room
}


module.exports = {
    createRoom,
    joinRoom,
    leaveRoom
};