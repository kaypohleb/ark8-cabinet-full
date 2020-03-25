const generate = require('nanoid/generate');
const {getUserData} = require('../firebase/utils');

const Room = require('./Room');
const Player = require('./Player');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class RoomController {
    constructor(){
        this.rooms = [];
    }

    getRoom(roomId){
        return this.rooms.find( room => room.id == roomId );
    }

    async createRoom(userId){
        const user = await getUserData(userId);

        if (!user){
            return null;
        }

        const roomId = generate(alphabet, 6);
        const player = new Player(user.id, user.name);

        const room = new Room(roomId, player, null);
        this.rooms.push(room);

        return room;
    }
}


module.exports = new RoomController();