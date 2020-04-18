
const {addGameResults,addGameResIDtoUserHistory} = require('../firebase/utils')
const roomActionValidator = require('./roomActionValidator');
const games = require('./games');
const Player = require('./Player');
class Room {
    //TOOD maybe fix        the constracutor problems here?
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

    printRoomState(){
        return {
            id: this.id,
            createdBy: this.createdBy,
            admin: this.admin,
            game: this.game ? this.game.id : null,
            gameStarted: this.gameStarted,
            players: this.players
        }
    }

    addPlayer(userId, name){
        const playerPresent = this.players.find(player => player.id == userId);
        if (!playerPresent){
            const player = new Player(userId, name);
            this.players.push(player);
        }
        

        this.roomStateUpdateCallback( this.printRoomState() );
        if (this.game){
            const {game, players} = this.game.printState();
            this.gameStateUpdateCallback(game, players);
        }

    }

    removePlayer(userId){
        this.players = this.players.filter( player => player.id != userId);

        this.roomStateUpdateCallback( this.printRoomState() );
        if (this.game){
            const {game, players} = this.game.printState();
            this.gameStateUpdateCallback(game, players);
        }
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

        if (action.actionType == 'CHANGE_SETTINGS' && this.admin != userId){
            throw new Error("Only admin can change settings");
        }
    }

    makeRoomAction(userId, action){
        const actionType = action.actionType;
        if ( actionType == 'SET_READY'){
            const player = this.players.find( player => player.id == userId);
            if (!player){
                throw new Error("User not found in room");
            }

            player.ready = true;

            // const allPlayersReady = this.players.reduce((prev, player) => (prev && player.ready), true);

            // if (allPlayersReady){
            //     this.gameStarted = true;
            //     this.startGame();
            // }
        }
        else if ( actionType == 'SET_UNREADY'){
            const player = this.players.find( player => player.id == userId);
            if (!player){
                throw new Error("User not found in room");
            }

            if (this.gameStarted){
                throw new Error("Cannot unready when game has already started");
            }

            player.ready = false;
        }   
        else if ( actionType == 'ADD_GAME'){
            if (!games[action.gameId]) {
                throw new Error("Game does not exist");
            }
            this.game = new games[action.gameId](this.players);//add settings params here
            this.game.gameStateUpdateCallback = this.gameStateUpdateCallback;
            
        }

        else if(actionType == "CHANGE_SETTINGS"){
            this.game = new games[action.gameId](this.players,action.settings);
        }
        else if ( actionType == 'START_GAME'){
            
            this.startGame();
        }
        console.log("sent room_state_update")
        this.roomStateUpdateCallback( this.printRoomState() );
        if (this.game){
            const {game, players} = this.game.printState();
            this.gameStateUpdateCallback(game, players);
        }
    }

    startGame(){
        if (!this.game){
            throw new Error("Game cannot be started as game has not been set");
        }
        
        this.game.publishScoreCallback = async (winner, players) => {
            console.log('publishScoreCallback called!')
            const refId = await addGameResults({
            gameId: this.game.id,
            roomId: this.id,
            players,
            winner
            });
            addGameResIDtoUserHistory(players,refId);
        }
        
        this.gameStarted = true;
        this.game.start();
        
        this.roomStateUpdateCallback( this.printRoomState() );
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
        this.roomStateUpdateCallback( this.printRoomState() );
    }

}

module.exports = Room;