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

        if ( Object.keys(nsp.connected).length != 0 ){
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
    listen(nsp){
        const authMiddleware = this.socketAuth.authentication.bind(this.socketAuth);

        const disconnectHandler = this.disconnectHandler.bind(this);
        const authenticationHandler = this.authenticationHandler.bind(this);
        const roomActionHandler = this.roomActionHandler.bind(this);
        const gameActionHandler = this.gameActionHandler.bind(this);

        nsp.on('connection', (socket) => { 
            socket.use(authMiddleware);
            
            disconnectHandler(nsp, socket);
            authenticationHandler(nsp, socket);
            roomActionHandler(nsp, socket);
            gameActionHandler(nsp, socket);    
        })
    }

    /**
     * Attaches event listener for 'disconnect' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    disconnectHandler(nsp, socket){
        const getAuthenticatedUserId = this.socketAuth.getAuthenticatedUserId.bind(this.socketAuth);
        const removeAuthenticatedUser = this.socketAuth.removeAuthenticatedUser.bind(this.socketAuth);
        socket.on('disconnect', () => {
            const userId = getAuthenticatedUserId(socket.id);
            removeAuthenticatedUser(socket.id);
            this.room.removePlayer(userId);

            console.log('DISCONNECTED', socket.id, userId)

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
        const addAuthenticatedUser = this.socketAuth.addAuthenticatedUser.bind(this.socketAuth);

        socket.on('authentication', async (tokenId) => {
            const userId = await getUserId(tokenId);
            
            if (!userId){
                return socket.emit('authentication_error', { message: 'Invalid tokenId used for validation'});
            }

            const userData = await getUserData(userId);
            if (!userData){
                return socket.emit('authentication_error', { message: 'Unable to get user data'});
            }
            addAuthenticatedUser(socket.id, userId);
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
                this.room.validateRoomAction(socket.userId, data);
                this.room.makeRoomAction(socket.userId, data);
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
                this.room.validateGameAction(socket.userId, data);
                this.room.makeGameAction(socket.userId, data);
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