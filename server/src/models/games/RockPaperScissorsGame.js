const RockPaperScissorsSM = require('./RockPaperScissorsSM');

class RockPaperScissorsGame {
    constructor(players,settings){
        console.log("adding settings in game");
        //TODO setup based on settings, default also taken from firestore
        this.id = 'ROCK_PAPER_SCISSORS';
        this.timer = null;
        this.gameState = {
            gameId: 'ROCK_PAPER_SCISSORS',
            players: players.map((player) => ({id: player.id, name: player.name, score: 0})),
            currentRound: 0,
            totalRounds: 5,
            timerStart: null,
            timerLength: 5000,
            history: [],
            prevWinner: null,
            gameEnded: false,
            labels: ["rock","paper","scissors"],
        };
        this.playerStates = players.reduce( (playerStates, player) => {
            playerStates[player.id] = {selection : null};
            return playerStates;
        }, {});
        this.history = [];
        this.gameStateUpdateCallback = null;
        this.publishScoreCallback = null;
        this.gameStateMachine = new RockPaperScissorsSM(settings);
        if(this.settings){
            this.gameState.totalRounds = settings.totalRounds.defaultValue;
            this.gameState.labels = settings.labels;
        }
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
            if (this.gameState.currentRound == this.gameState.totalRounds){
                this.end();
                return;
            }

            if (this.gameState.currentRound < this.gameState.totalRounds){
                this.timer = setTimeout(turn, this.gameState.timerLength);
            }

        }).bind(this);

        turn();
    }

    end(){
        const action = {
            actionType: 'END_GAME',
            timerStart: new Date().getTime()
        };
        this.makeAction(null,action);
        console.log('ending game...');
        const players = this.gameState.players;
        players.sort((a,b) => b.score - a.score); // sort by highest score first
        const winner = players[0];
        this.publishScoreCallback(winner, players);
    }

    validateAction(userId, action){
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