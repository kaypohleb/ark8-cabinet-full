const generate = require('nanoid/generate');
const firebase = require('../db/firebase');
const db = firebase.firestore();
const io = require('../socketio/socketio');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const rooms = [];

const createRoom = async ({userId, gameId}) => {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists){
        return null;
    }

    const roomId = generate(alphabet, 6);
    const user = userDoc.data();

    const room = {
        roomId,
        createdBy: user,
        gameId,
        players : [user]
    }

    rooms.push(room);
    console.log("rooms:", room);

    io.to(roomId).emit('roomStateUpdate',room);

    return room;
};

const joinRoom = async ({userId, roomId}) => {
    const roomIndex = rooms.findIndex(r => r.roomId == roomId);
    if (roomIndex == -1) {
        return null;
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists){
        return null;
    }

    const user = userDoc.data();

    let room = rooms[roomIndex];
    
    rooms[roomIndex] = {
        ...room,
        players : [...room.players.filter(player => player.id != userId), user]
    };

    room = rooms[roomIndex];
    console.log("rooms:", rooms);

    io.to(roomId).emit('roomStateUpdate',room);

    return room
}

const leaveRoom = async ({userId, roomId}) => {
    const roomIndex = rooms.findIndex(r => r.roomId == roomId);

    if (roomIndex == -1) {
        return null;
    }

    let room = rooms[roomIndex];
    
    rooms[roomIndex] = {
        ...room,
        players : room.players.filter(player => player.id != userId)
    };

    room = rooms[roomIndex];
    console.log("rooms:", rooms);

    io.to(roomId).emit('roomStateUpdate',room);

    return room
}


module.exports = {
    createRoom,
    joinRoom,
    leaveRoom
};