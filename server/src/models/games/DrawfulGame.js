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
        this.timers={
            drawing:30,
            fakeAnswer:30,
            pickAnswer:10,
            update:10,
        }
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
            timerLength: 10000,
            currentRound: 0,
            totalRounds: 1,
            history: null,
            gameEnded: false,
        };

        this.playerStates = players.reduce( (playerStates, player) => {
            playerStates[player.id] = {
                submittedPick:false,
                submittedFake:false,
                submittedDraw:false,
            };
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
            this.timers.drawing = this.settings.drawingTimer.defaultValue;
            this.timers.fakeAnswer = this.settings.fakeAnswerTimer.defaultValue;
            this.timers.pickAnswer = this.settings.pickAnswerTimer.defaultValue;
            this.timers.update = this.settings.updateTimer.defaultValue;
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
                
                nextPhase(Date.now(), this.timers.drawing * 1000);
                setTimeout(turn, this.timers.drawing * 1000);
            }
            else if (phase == 'DRAWING'){
                nextPhase(Date.now(), this.timers.fakeAnswer * 1000);
                setTimeout(turn, this.timers.fakeAnswer * 1000);
            }
            else if (phase == 'FAKE_ANSWER'){
                nextPhase(Date.now(), this.timers.pickAnswer * 1000);
                setTimeout(turn, this.timers.pickAnswer * 1000);
            }
            else if (phase == 'PICK_ANSWER'){
                nextPhase(Date.now(), this.timers.update * 1000);
                setTimeout(turn, this.timers.update * 1000);
            }
            else if (phase == 'ANSWER'){
                nextPhase(Date.now(), this.timers.update * 1000);
                setTimeout(turn, this.timers.update * 1000);
            }
            else if (phase == 'REVEAL'){
                nextPhase(Date.now(), this.timers.update * 1000);
                setTimeout(turn, this.timers.update * 1000);
            
            }else if(phase == 'NO_DRAWING'){
                nextPhase(Date.now(), this.timers.update * 1000);
                setTimeout(turn, this.timers.fakeAnswer * 1000);
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