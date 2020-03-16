const generate = require('nanoid/generate');
const firebase = require('../db/firebase');

const Room = require('../models/Room');
const Player = require('../models/Player');

const db = firebase.firestore();

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

class RoomController {
    constructor(){
        this.rooms = [];
    }

    getRoom(roomId){
        return this.rooms.find( room => room.id == roomId );
    }

    async createRoom(userId){
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists){
            return null;
        }

        const roomId = generate(alphabet, 6);
        const user = userDoc.data();
        const player = new Player(user.id, user.name);

        const room = new Room(roomId, player, null);
        this.rooms.push(room);

        return room;
    }

    async joinRoom(userId, roomId){
        const foundRoom = this.rooms.find( room => room.id == roomId );

        if (!foundRoom){
            return null;
        }

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists){
            return null;
        }

        const user = userDoc.data();

        const player = new Player(user.id, user.name);
        foundRoom.players.push(player);

        return foundRoom;
    }

    async leaveRoom(userId, roomId){
        const foundRoom = this.rooms.find( room => room.id == roomId );

        if (!foundRoom){
            return null;
        }

        const foundPlayer = foundRoom.players.find( player => player.id = userId);

        if (!foundPlayer){
            return null;
        }

        foundRoom.players = foundRoom.players.filter( player => player.id != userId );

        return foundRoom;
    }
}


module.exports = new RoomController();