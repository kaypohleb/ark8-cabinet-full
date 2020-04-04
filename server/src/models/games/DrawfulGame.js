const DrawfulSM = require('./DrawfulSM');

class DrawfulGame{
    constructor(players){
        this.id = 'DRAWFUL';
        this.history = [];
        this.gameStateUpdateCallback = null;
        this.gameStateMachine = new DrawfulSM();

        this.gameState = {
            gameId: 'DRAWFUL',
            players: players.map((player) => ({id: player.id, name: player.name, score: 0})),
            currentPhase: 'INITIAL',
            currentDrawing: {
                drawing: null,
                userId: null,
                correctAnswer: null,
                answers: null
            },
            timerStart: null,
            timerLength: null,
            history: null,
            currentRound: 0,
            totalRounds: 3
        };

        this.playerStates = players.reduce( (playerStates, player) => {
            playerStates[player.id] = {};
            return playerStates;
        }, {});

        this.hiddenState = {
            submittedDrawings: players.reduce( (submittedDrawings, player) => {
                submittedDrawings[player.id] = null;
                return submittedDrawings;
            }, {}),
            drawingPrompts: players.reduce( (drawingPrompts, player) => {
                drawingPrompts[player.id] = null;
                return drawingPrompts;
            }, {}),
            fakeAnswers: players.reduce( (fakeAnswers, player) => {
                fakeAnswers[player.id] = null;
                return fakeAnswers;
            }, {})
        };
    }


    printState(){
        return {
            game: {...this.gameState},
            players: {...this.playerStates}
        }
    }

    start(){
        const makeAction = this.makeAction.bind(this);
        this.game.timerLength = 1000;
        const turn = (function(){
            const action = {
                actionType: 'NEXTPHASE',
                timerStart: new Date().getTime()
            }
            makeAction(null, action);
            console.log("what is this", this);
            if (this.gameState.currentRound <= this.gameState.totalRounds){
                console.log(`setting timer for next turn to ${this.gameState.timerLength}`);
                this.timer = setTimeout(turn, this.gameState.timerLength);
            }

        }).bind(this);

        turn();
    }

    
    validateAction(userId, action){
        return true;
    }

    makeAction(userId, action){
        this.history.push({gameState: {...this.gameState}, playerStates: {...this.playerStates}});
        const {game, players, hidden} = this.gameStateMachine.step(userId, action, {...this.gameState}, {...this.playerStates}, {...this.hiddenState});
        this.gameState = game;
        this.playerStates = players;
        this.hiddenState = hidden;

        this.gameStateUpdateCallback(game, players);
    }

}


// NEXT PHASE ACTION
// userId = 'GAME'
// action = {
//     actionType: 'NEXT_PHASE',
//     timerStart,
//     timerLength
// }

module.exports = DrawfulGame;