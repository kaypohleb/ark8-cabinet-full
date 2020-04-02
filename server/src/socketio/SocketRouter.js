const SocketAuth = require('./SocketAuth');
const {getUserId} = require('../firebase/auth');
const {getUserData} = require('../firebase/utils');


/** Wrapper class for routing functions */
class SocketRouter {
    constructor(){
        this.room = null;
        this.socketAuth = new SocketAuth();
    }

    /**
     * Creates a namespace if the namespace is not in use, throws error otherwise.
     * @param {server} server - a socket.io server
     * @param {String} roomId - a valid roomId String
     * @returns {namespace} a socket.io namespace
     */
    createNamespace(server, roomId){
        const nsp = server.of(`/${roomId}`);

        if (nsp.connected){
            throw new Error(`namespace ${roomId} is not empty`)
        }

        nsp.removeAllListeners();
        
        return nsp;
    }
  
    /**
     * listen for events on the namespace and attaches the handlers
     * @param {namespace} nsp 
     * @param  {...function} handlers 
     */
    listen(nsp, ...handlers){
        nsp.on('connection', (socket) => {
            handlers.forEach(handler => { handler(nsp, socket)});
        })
    }

    /**
     * Attaches event listener for 'disconnect' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    disconnectHandler(nsp, socket){
        socket.on('disconnect', () => {
            const userId = this.socketAuth.getAuthenticatedUserId(socket.id);
            this.socketAuth.removeAuthenticatedUser(socket.id);
            this.room.removePlayer(userId);

            nsp.emit('room_state_update', this.room.printRoomState());
            nsp.emit('game_state_update', this.room.printGameState());
        });
    }

    /**
     * Attaches event listener for 'authentication' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    authenticationHandler(nsp, socket){
        socket.on('authentication', async (tokenId) => {
            const userId = await getUserId(tokenId);
            
            if (!userId){
                return socket.emit('authentication_error', { message: 'Invalid tokenId used for validation'});
            }

            const userData = await getUserData(userId);
            if (!userData){
                return socket.emit('authentication_error', { message: 'Unable to get user data'});
            }

            this.socketAuth.addAuthenticatedUser(socket.id, userId);
            this.room.addPlayer(userId, userData.name);

            socket.emit('authentication', { message: 'Authentication success'});

            nsp.emit('room_state_update', this.room.printRoomState());
            nsp.emit('game_state_update', this.room.printGameState());
        })
    }

    /**
     * Attaches event listener for 'room_action' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    roomActionHandler(nsp, socket){
        socket.on('room_action', (data) => {
            try {
                this.room.validateRoomAction(data);
                this.room.makeRoomAction(data);
                nsp.emit('room_state_update', this.room.printRoomState());
                nsp.emit('game_state_update', this.room.printGameState());
            }
            catch (e) {
                return socket.emit('room_action_error', { message: e.message});
            }
        })
    }

    /**
     * Attaches event listener for 'game_action' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    gameActionHandler(nsp, socket){
        socket.on('game_action', (data) => {
            try {
                this.room.validateGameAction(data);
                this.room.makeGameAction(data);
                nsp.emit('room_state_update', this.room.printRoomState());
                nsp.emit('game_state_update', this.room.printGameState());
            }
            catch (e) {
                return socket.emit('game_action_error', {message: e.message});
            }
        })
    }

}

module.exports = SocketRouter;