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
            console.log(`${socket.id} connected`) 
            socket.use( (packet, next) => {authMiddleware(packet, next, socket)});
            
            disconnectHandler(nsp, socket);
            authenticationHandler(nsp, socket);
            roomActionHandler(nsp, socket);
            gameActionHandler(nsp, socket);    
        });

        this.room.roomStateUpdateCallback = (state) => {nsp.emit('room_state_update', state)} ;
        this.room.gameStateUpdateCallback = (gameState, playerStates) => {
            console.log(nsp.connected);
            for (const socketId in nsp.connected){
                const socket = nsp.connected[socketId];
                socket.emit('game_state_update', {
                    game: gameState,
                    player: playerStates[socket.userId]
                })

            }
        };
    }

    /**
     * Attaches event listener for 'disconnect' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    disconnectHandler(nsp, socket){
        const removeAuthenticatedUser = this.socketAuth.removeAuthenticatedUser.bind(this.socketAuth);
        const removePlayer = this.room.removePlayer.bind(this.room);
        socket.on('disconnect', () => {
            const userId = socket.userId;
            removeAuthenticatedUser(userId);
            removePlayer(userId);

            console.log('DISCONNECTED', socket.id, userId)
        });
    }

    /**
     * Attaches event listener for 'authentication' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    authenticationHandler(nsp, socket){
        const addAuthenticatedUser = this.socketAuth.addAuthenticatedUser.bind(this.socketAuth);
        const addPlayer = this.room.addPlayer.bind(this.room);
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
            addPlayer(userId, userData.name);
            
            socket.userId = userId;

            socket.emit('authentication', { message: 'Authentication success'});
        })
    }

    /**
     * Attaches event listener for 'room_action' event
     * @param {namespace} nsp 
     * @param {socket} socket 
     */
    roomActionHandler(nsp, socket){
        socket.on('room_action', (data) => {
            const validateRoomAction = this.room.validateRoomAction.bind(this.room);
            const makeRoomAction = this.room.makeRoomAction.bind(this.room);
            console.log('received room_action: ',data);
            try {
                validateRoomAction(socket.userId, data);
                makeRoomAction(socket.userId, data);
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
        const validateGameAction = this.room.validateGameAction.bind(this.room);
        const makeGameAction = this.room.makeGameAction.bind(this.room);

        socket.on('game_action', (data) => {
            try {
                validateGameAction(socket.userId, data);
                makeGameAction(socket.userId, data);
            }
            catch (e) {
                console.log('game_action_error', e.message);
                return socket.emit('game_action_error', {message: e.message});
            }
        })
    }

}

module.exports = SocketRouter;