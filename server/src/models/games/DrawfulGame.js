const DrawfulSM = require('./DrawfulSM');
const firebase = require('../../firebase/firebase');

const db = firebase.firestore();
let allPrompts = null;
const getPrompts = async () =>{
    await db.collection('prompts').doc('drawful').get().then(result=>{allPrompts =  result.data().drawingprompts});
}
module.exports 
class DrawfulGame{
    constructor(players,settings){
        //TODO setup based on settings, default also taken from firestore
        getPrompts();
        this.settings = settings;
        this.id = 'DRAWFUL';
        this.history = [];
        this.gameStateUpdateCallback = null;
        this.publishScoreCallback = null;
        this.gameStateMachine = new DrawfulSM(this.settings);
        this.useState = true;
        this.gameState = {
            gameId: 'DRAWFUL',
            players: players.map((player) => ({id: player.id, name: player.name, score: 0, ready: false})),
            currentPhase: 'INITIAL',
            currentDrawing: {
                drawing: null,
                userId: null,
                correctAnswer: null,
                answers: null
            },
            timerStart: null,
            timerLength: 5000,
            currentRound: 0,
            totalRounds: 1,
            history: null,
            gameEnded: false,
        };

        this.playerStates = players.reduce( (playerStates, player) => {
            playerStates[player.id] = {};
            return playerStates;
        }, {});

        this.hiddenState = {
            submittedDrawings: players.reduce( (submittedDrawings, player) => {
                submittedDrawings[player.id] = [];
                return submittedDrawings;
            }, {}),
            drawingPrompts: players.reduce( (drawingPrompts, player) => {
                drawingPrompts[player.id] = null;
                return drawingPrompts;
            }, {}),
            fakeAnswers: players.reduce( (fakeAnswers, player) => {
                fakeAnswers[player.id] = "";
                return fakeAnswers;
            }, {}),
            allDrawingPrompts: null,
        };
        if(settings){
            this.gameState.totalRounds = this.settings.totalRounds.defaultValue;
        }
    }

    printState(){
        return {
            game: {...this.gameState},
            players: {...this.playerStates}
        }
    }
    end(){
        console.log('ending game...')
        const players = this.gameState.players;
        players.sort((a,b) => b.score - a.score); // sort by highest score first
        const winner = players[0];
        this.publishScoreCallback(winner, players);
    }

    start(){
        const nextPhase = ((timerStart, timerLength) => {this.makeAction(null, {actionType: 'NEXT_PHASE', timerStart: timerStart, timerLength: timerLength})}).bind(this)
        const turn = (function(){
            const phase = this.gameState.currentPhase;
            let updatedPrompts = allPrompts;
            if(this.settings){
                updatedPrompts = updatedPrompts.concat(this.settings.customPrompts);
            }
            if (phase == 'INITIAL'){
                this.hiddenState = {
                    ...this.hiddenState,
                    allDrawingPrompts: updatedPrompts,
                }
                nextPhase(Date.now(), 10000);
                turn();
            }
            else if (phase == 'DRAWING'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                }, 10000)
            }
            else if (phase == 'FAKE_ANSWER'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                }, 10000)
            }
            else if (phase == 'PICK_ANSWER'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                },10000)
            }
            else if (phase == 'ANSWER'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                },10000)
            }
            else if (phase == 'REVEAL'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                }, 10000)
            
            }else if(phase == 'NO_DRAWING'){
                setTimeout(() => {
                    nextPhase(Date.now(), 10000)
                    turn();
                }, 10000)
            }else if(phase == 'END_GAME'){
                    this.end();
            }
           
        
        }).bind(this);

        turn();
    }
    
    validateAction(userId, action){
        return true;
    }

    makeAction(userId, action){
        //this.history.push({gameState: {...this.gameState}, playerStates: {...this.playerStates}});
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