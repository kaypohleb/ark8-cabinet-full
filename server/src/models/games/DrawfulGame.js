const DrawfulSM = require('./DrawfulSM');
const firebase = require('../../firebase/firebase');

const db = firebase.firestore();
let allPrompts = null;
const getPrompts = async () =>{
    await db.collection('prompts').doc('drawful').get().then(result=>{allPrompts =  result.data().drawingprompts});
    
}
module.exports 
class DrawfulGame{
    constructor(players){
        getPrompts();
        this.id = 'DRAWFUL';
        this.history = [];
        this.gameStateUpdateCallback = null;
        this.gameStateMachine = new DrawfulSM();
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
            history: null,
            currentRound: 0,
            totalRounds: 3,
            waiting: false,
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
            }, {}),
            allDrawingPrompts: null,
        };
    }


    printState(){
        return {
            game: {...this.gameState},
            players: {...this.playerStates}
        }
    }

    start(){
        console.log(allPrompts);
        this.hiddenState = {
            ...this.hiddenState,
            allDrawingPrompts: allPrompts,
        }
        console.log(this.hiddenState);
        const makeAction = this.makeAction.bind(this);
        const turn = (function(userID,timerLen=3000){
            const action = {
                actionType: 'NEXT_PHASE',
                timerStart: new Date().getTime(),
                timerLength: timerLen,
            }
            
            
            console.log(userID);  
            makeAction(userID, action);
            //console.log("what is this", this);
            switch(this.gameState.currentPhase){
                case "DRAWING": 
                    console.log("DRAWING");         
                    let ready = Object.values(this.hiddenState.submittedDrawings).every(function(i){return i!==null;})
                    this.timer = setTimeout(()=>{
                            if(ready){
                                console.log("HIT");
                                if(this.useState){
                                    turn("GAME",3000);
                                    this.useState = false;
                                }
                            }
                            else{
                                turn("random",3000);
                            }
                        }, timerLen);
                    break;
                case "FAKE_ANSWER":
                    console.log("FAKEANSWER");
                    let numOfnull = 0;
                    this.useState = true;
                    console.log(this.hiddenState.fakeAnswers);
                    for(const player in this.hiddenState.fakeAnswers){
                        if(this.hiddenState.fakeAnswers[player] === null){
                            numOfnull +=1;
                        }
                    }
                   
                    this.timer = setTimeout(()=>{  
                        if((numOfnull===1)){
                            console.log("HIT");
                            if(this.useState){
                                turn("GAME",3000);
                                this.useState = false;
                            }
                            
                        }
                        else{
                            console.log("MIS");
                            turn("random",3000);
                        }
                    }, timerLen);
                    break;
                case "PICK_ANSWER": 
                    //console.log(`setting timer for next phase to ${this.gameState.timerLength}`);
                    let pickednumOfnull = 0;
                    this.useState = true;
                    console.log(this.playerStates);
                    for(const player in this.playerStates){
                        console.log(player);
                        if(this.playerStates[player].pickedAnswer == null){
                            pickednumOfnull +=1;
                        }
                    }
                    this.timer = setTimeout(()=>{  
                        if((pickednumOfnull==1)){
                            console.log("HIT");
                            if(this.useState){
                                turn("GAME",3000);
                                this.useState = false;
                            }
                            
                        }
                        else{
                            turn("random",3000);
                        }
                    }, timerLen);
                    break;
                case "REVEAL":
                    console.log("REVEAL")
                    console.log("Final phase no updates after this");
                    break;
                case "INITIAL":
                    console.log("INITIAL");
                    this.timer = setTimeout(()=>{makeAction(userID, action); turn("GAME",3000);}, timerLen);
                    break;
                }
            }).bind(this);
        turn(null);

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