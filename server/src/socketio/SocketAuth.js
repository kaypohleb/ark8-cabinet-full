/** Wrapper class for auth middleware functions */
class SocketAuth {
    constructor(){
        this.authenticatedUsers = [];
    }
    
    getAuthenticatedUser(userId){
        return this.authenticatedUsers.find(user => user.userId == userId);
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
    removeAuthenticatedUser(userId){
        this.authenticatedUsers = this.authenticatedUsers.filter(user => user.userId != userId);
    }

    /** Authentication middleware function. 
     *  Emits an 'authentication_error' event if the user's socket id is not in the array of authenticated users
     *  Does nothing if incoming event is 'authentication'*/
    authentication(packet, next, socket){
        if (packet[0] == 'authentication'){
            return next()
        }
        const authenticatedUser = this.getAuthenticatedUser(socket.id);

        if (authenticatedUser){
            console.log("adding userId");
            socket.userId = authenticatedUser.userId;
            console.log(socket);
            return next();
        }

        return socket.emit('authentication_error', { message: 'Unauthenticated user'});
    }

}

module.exports = SocketAuth;