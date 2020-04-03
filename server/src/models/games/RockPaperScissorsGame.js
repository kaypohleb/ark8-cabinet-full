const RockPaperScissorsSM = require('./RockPaperScissorsSM');

class RockPaperScissorsGame {
    constructor(players){
        console.log('rps game constructor', players);
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
        this.gameState.players.forEach( player => {
            this.playerStates[player.id] = {};
            player.gameData.score = 0;
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
            if (this.gameState.currentRound < this.gameState.totalRounds){
                console.log(`setting timer for next turn to ${this.gameState.timerLength}`);
                this.timer = setTimeout(turn, this.gameState.timerLength);
            }

        }).bind(this);

        turn();
    }

    validateAction(userId, action){
        console.log(action);
        console.log(validActions);
        console.log(validActions[action.actionType]);
        if (validActions[action.actionType]){
            return;
        }
        throw new Error('Not a valid action type for this game');
    }

    makeAction(userId, action){
        this.history.push({gameState: {...this.gameState}, playerStates: {...this.playerStates}});
        const {game, players} = this.gameStateMachine.step(userId, action, {...this.gameState}, {...this.playerStates});
        this.gameState = game;
        this.playerStates = players;

        this.gameStateUpdateCallback(game, players);
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