const io = require('../socketio/socketio');
const Player = require('./Player');
const constants = require('./constants');
const {getUserId} = require('../firebase/auth');
const {getUserData} = require('../firebase/utils');

class Room {
    /**
     * Room constructor
     * @param {string} roomId 
     * @param {Player} createdBy 
     * @param {Game} game 
     */

    constructor(roomId, createdBy, game){
        this.id = roomId;
        this.createdBy = createdBy;
        this.game = game;
        this.gameStarted = false;
        this.players = [];
        this.authenticatedUsers = [];

        const nsp = io.of(`/${roomId}`);

        nsp.on('connection', (socket) => {
            let player;

            socket.on('authentication', async (token) => {
                const userId = await getUserId(token);
                if (userId == null){
                    return socket.emit('authentication_error', {
                        message: `Authentication token is not valid`
                    })
                }

                if (!this.authenticatedUsers.some(user => user.socketId == socket.id)){
                    this.authenticatedUsers.push({uid: userId, socketId: socket.id});
                    const userData = await getUserData(userId);
                    player = new Player(userId, userData.name);
                    this.addPlayer(player);
                }

                socket.emit('authentication', {message: 'Authentication success'});
                return nsp.emit('room_state_update', this.getRoomState())
            });

            socket.on('room_action', async (data) => {
                console.log("room action", data);
                const validUser = this.authenticatedUsers.some(o => o.socketId == socket.id);
                if (!validUser){
                    return socket.emit('room_action_error', {
                        message: `Socket is not authenticated for this room`
                    })
                }
                
                const validAction = constants.ROOM_ACTION_TYPES.some((type) => type == data.actionType);
                if (!validAction){
                    return socket.emit('room_action_error', {
                        message: "Invalid room action"
                    })
                }

                if (data.actionType == constants.SET_READY_ACTION_TYPE){
                    player.ready = true;
                    const allPlayersReady = this.players.reduce((accumulator, currentVal) => accumulator && currentVal.ready ,true)
                    if (allPlayersReady && this.game){
                        this.players.forEach(player => {this.game.addPlayer(player)});
                        this.gameStarted = true;
                        this.game.start();
                    }

                    return nsp.emit('room_state_update', this.getRoomState());
                }

                if (data.actionType == constants.SET_UNREADY_ACTION_TYPE && !this.gameStarted){
                    player.ready = false;
                    return nsp.emit('room_state_update', this.getRoomState());
                }

                if (data.actionType == constants.ADD_GAME_ACTION_TYPE){
                    const validGame = constants.GAME_IDS.some((gameId) => gameId == data.gameId);
                    if (!validGame){
                        return socket.emit('room_action_error', {
                            message: "Invalid game selected"
                        })
                    }
                    
                    const updateCallback = function(){
                        nsp.emit('game_state_update', this.game.getState());
                    };
                    this.game = new constants.GAMES[data.gameId](updateCallback.bind(this)); 

                    const allPlayersReady = this.players.reduce((accumulator, currentVal) => accumulator && currentVal.ready ,true)
                    if (allPlayersReady && this.game){
                        this.players.forEach(player => {this.game.addPlayer(player)});
                        this.gameStarted = true;
                        this.game.start();
                    }

                    return nsp.emit('room_state_update', this.getRoomState());
                }

                if (data.actionType == constants.START_GAME_ACTION_TYPE){
                    if (!game){
                        return socket.emit('room_action_error', {
                            message: "Cannot start game without adding a game first"
                        })
                    }
                    
                    if (player.id != this.createdBy){
                        return socket.emit('room_action_error', {
                            message: "Game can only be started by room creator"
                        })
                    }

                    this.players.forEach(player => {this.game.addPlayer(player)});
                    this.gameStarted = true;
                    this.game.start();
                    
                    return nsp.emit('room_state_update', this.getRoomState());
                }


            });

            socket.on('game_action',  async (data) => {
                const validUser = this.authenticatedUsers.some(o => o.socketId == socket.id);
                if (!validUser){
                    return socket.emit('room_action_error', {
                        message: `Socket is not authenticated for this room ${this.id}`
                    })
                }

                if (!this.game) {
                    return socket.emit('game_error', {
                        message: `No game currently in room ${this.id}`
                    })
                }

                if (!this.gameStarted){
                    return socket.emit('game_error', {
                        message: `Game has not started in room ${this.id}`
                    })
                }

                try {
                    this.game.makeAction(player, data);
                }
                catch (e) {
                    return socket.emit('game_error', {
                        message: e.message
                    })
                }

                nsp.emit('game_state_update', this.game.getState());
            })

            socket.on('disconnect', () => {
                this.removePlayer(player);
                this.authenticatedUsers = [this.authenticatedUsers.filter(user => user.socketId != socket.id)];
                nsp.emit('room_state_update', this.getRoomState());
            })
        });

    }

    /**
     * @param {Player} player 
     */

    addPlayer(player){
        this.players.push(player);
        return this;
    }

    removePlayer(player){
        this.players = this.players.filter((existingPlayer) => existingPlayer.id != player.id);

        return this;
    }

    getRoomState(){
        return {
            id : this.id,
            createdBy: this.createdBy,
            game : !!this.game ? this.game: null,
            gameStarted: this.gameStarted,
            players: this.players
        }
    }

}

module.exports = Room;