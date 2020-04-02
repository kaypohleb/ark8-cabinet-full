/** Wrapper class for auth middleware functions */
class SocketAuth {
    constructor(){
        this.authenticatedUsers = [];
    }
    
    getAuthenticatedUser(socketId){
        return this.authenticatedUsers.find(user => user.socketId == socketId);
    }

    getAuthenticatedUserId(socketId){
        const user = this.getAuthenticatedUser(socketId);
        if (!user) {
            return null;
        }
        return user.id;
    }

    /**
     * Add a user to the array of authenticated users
     * @param {String} socketId 
     * @param {String} userId 
     */
    addAuthenticatedUser(socketId, userId){
        this.authenticatedUsers.push({socketId, userId});
    }

    /**
     * Remove a user from the array of authenticated users
     * @param {String} socketId 
     * @param {String} userId 
     */
    removeAuthenticatedUser(socketId){
        this.authenticatedUsers = this.authenticatedUsers.filter(user => user.socketId != socketId);
    }

    /** Authentication middleware function. 
     *  Emits an 'authentication_error' event if the user's socket id is not in the array of authenticated users
     *  Does nothing if incoming event is 'authentication'*/
    authentication(socket, next){
        if (socket[0] == 'authentication'){
            return next()
        }

        const authenticatedUser = this.getAuthenticatedUser(socket.id);

        if (authenticatedUser){
            socket.userId = authenticatedUser.userId;
            return next();
        }

        return socket.emit('authentication_error', { message: 'Unauthenticated user'});
    }

}

module.exports = SocketAuth;