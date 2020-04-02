const roomActionValidator = require('./roomActionValidator');
const games = require('./games');

class Room {
    constructor(id, createdBy){
        this.id = id;
        this.createdBy = createdBy;
        this.admin = createdBy;
        this.game = null;
        this.gameStarted = false;
        this.players = [];

        this.roomStateUpdateCallback = null;
        this.gameStateUpdateCallback = null;
    }

    addPlayer(userId, name){
        const player = new Player(userId, name);
        this.players.push(player);
    }

    removePlayer(userId){
        this.players = this.players.filter( player => player.id != userId);
    }

    readyPlayer(userId){
        const player = this.players.find( player => player.id == userId);
        if (!player){
            throw new Error("User not found in room");
        }

        player.ready();
    }

    unreadyPlayer(userId){
        const player = this.players.find( player => player.id == userId);
        if (!player){
            throw new Error("User not found in room");
        }

        player.unready();
    }

    validateRoomAction(userId, action){
        roomActionValidator(action);
        if (action.actionType == 'START_GAME' && !this.game){
            throw new Error("Game cannot be started as game has not been set");
        }

        if (action.actionType == 'START_GAME' && this.admin != userId){
            throw new Error("Only admin can start game before all players are ready");
        }

        if (action.actionType == 'ADD_GAME' && this.admin != userId){
            throw new Error("Only admin can add game");
        }
    }

    makeRoomAction(userId, action){
        const actionType = action.actionType;
        if ( actionType == 'SET_READY'){
            const player = this.players.find( player => player.id == userId);
            if (!player){
                throw new Error("User not found in room");
            }

            player.ready();
            const allPlayersReady = this.players.reduce((prev, player) => (prev && player.ready), true);

            if (allPlayersReady){
                this.gameStarted = true;
                this.startGame();
            }
        }
        else if ( actionType == 'SET_UNREADY'){
            const player = this.players.find( player => player.id == userId);
            if (!player){
                throw new Error("User not found in room");
            }

            if (this.gameStarted){
                throw new Error("Cannot unready when game has already started");
            }

            player.unready();
        }   
        else if ( actionType == 'ADD_GAME'){
            if (!games[action.gameId]) {
                throw new Error("Game does not exist");
            }
            this.game = new games[action.gameId];
        }
        else if ( actionType == 'START_GAME'){
            this.startGame();
        }
    }

    startGame(){
        if (!this.game){
            throw new Error("Game cannot be started as game has not been set");
        }

        this.game.start();
    }
    
    validateGameAction(userId, action){
        if (!this.game){
            throw new Error("Game cannot be started as game has not been set");
        }

        this.game.validateAction(userId, action);
    }

    makeGameAction(userId, action){
        if (!this.game){
            throw new Error("Game cannot be started as game has not been set");
        }

        this.game.makeAction(userId, action);
    }

}

module.exports = Room;