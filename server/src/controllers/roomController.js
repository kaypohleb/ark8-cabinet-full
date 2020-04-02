const io = require('../socketio/socketio');
const SocketRouter = require('../socketio/SocketRouter');
const Room = require('../models/Room');
const generate = require('nanoid/generate');

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class RoomController {
    constructor(){
        this.rooms = [];
    }

    async createRoom(userId){
        const socketRouter = new SocketRouter();
        let nsp;
        let roomId;

        
        while (!nsp){
            try {
                roomId = generate(alphabet, 6);
                nsp = socketRouter.createNamespace(io, roomId);
            }
            catch (e){
                console.log(e.message);
                console.log('trying another roomId...')
            }
        }

        const room = new Room(roomId, userId);
        room.roomStateUpdateCallback = (() => {nsp.emit('room_state_update', room.printRoomState() )});
        room.gameStateUpdateCallback = (() => {nsp.emit('game_state_update', room.printGameState() )});

        socketRouter.room = room;
        socketRouter.listen(nsp);

        this.rooms.push({room, socketRouter});

        return room.printRoomState();
    }

    removeRoom(roomId){
        const nsp = io.of(`/${roomId}`);
        for (socketId in nsp.connected){
            nsp.connected[socketId].disconnect();
        }
        nsp.removeAllListeners();
        
        delete io.nsps[`/${roomId}`];

        this.rooms = this.rooms.filter(({room}) => room.id != roomId);
    }
}


module.exports = new RoomController();