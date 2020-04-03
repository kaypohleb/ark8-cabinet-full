const RockPaperScissorsSM = require('./RockPaperScissorsSM');

class RockPaperScissorsGame {
    constructor(players){
        this.id = 'ROCK_PAPER_SCISSORS';
        this.timer = null;
        this.gameState = {
            gameId: 'ROCK_PAPER_SCISSORS',
            players: players,
            currentRound: 0,
            totalRounds: 5,
            timerStart: null,
            timerLength: 5000,
            history: [],
            prevWinner: null
        };
        this.playerStates = {};
        this.history = [];
        this.gameStateUpdateCallback = null;
        this.gameStateMachine = new RockPaperScissorsSM();

        this.initializePlayerStates();
    }

    initializePlayerStates(){
        players.forEach( player => {
            this.playerStates[player.id] = {};
        })
    }

    printState(){
        return {
            game: {...this.gameState},
            players: {...this.playerStates}
        }
    }

    start(){
        const makeAction = this.makeAction.bind(this);
        const turn = (function(){
            const action = {
                actionType: 'NEXT_TURN',
                timerStart: new Date().getTime()
            }
            makeAction(null, action);
            if (this.gameState.currentRound <= this.gameState.totalRounds){
                this.timer = setTimeout(turn, this.timerLength);
            }

        }).bind(this);

        turn();
    }

    validateAction(userId, action){
        if (validActions[action.actionType]){
            return true;
        }
    }

    makeAction(userId, action){
        this.history.push({gameState: {...this.gameState}, playerStates: {...this.playerStates}});
        const {gameState, playerStates} = this.gameStateMachine.step(userId, action, this.gameState, this.playerStates);
        this.gameState = gameState;
        this.playerStates = playerStates;
    }


}

const validActions = {
    'MAKE_SELECTION' : {
        selection: "string"
    },
    "NEXT_TURN" : {
        timerStart: "number"
    }
}

module.exports = RockPaperScissorsGame;