
class DrawfulSM {
    constructor(props){
        this.selectedPrompt = null;
        this.selectedUserId = null;
        this.selectedDrawing = null;
    }
    step(userId, action, gameState, playerStates, hiddenState){
        let updatedGameState = {...gameState};
       
        let updatedPlayerStates = {...playerStates};
        let updatedHiddenState = {...hiddenState};
        if (gameState.currentPhase === 'INITIAL'){
            console.log(action);
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'DRAWING',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength,
                    history: [],
                    currentRound: 1,
                    waiting:false,
                }
                
                for (const userId in updatedPlayerStates){
                    let selectPrompt = updatedHiddenState.allDrawingPrompts.splice(Math.floor(Math.random()*updatedHiddenState.allDrawingPrompts.length), 1)[0]; 
                    updatedPlayerStates[userId].prompt = selectPrompt;
                    updatedHiddenState.drawingPrompts[userId] = selectPrompt;
                }
                
            }
        }
        else if (gameState.currentPhase === 'DRAWING'){
            if (action.actionType === 'SEND_DRAWING'){
                updatedHiddenState.submittedDrawings[action.userId] = action.drawing;
                updatedGameState.players.forEach((player,index) => {
                    if(player.id === action.userId){
                        updatedGameState.players[index].ready = true;
                    }else{
                        if(!player.ready){
                            updatedGameState.waiting = true;
                        }
                    }
                });
                
            }
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                const nextDrawingUserId = Object.keys(updatedHiddenState.submittedDrawings)[0];
                // TODO: figure out what to do when a player does not submit a drawing
                // waiting till all finished
                if (updatedHiddenState.submittedDrawings[nextDrawingUserId] == null){
                    //throw new Error('Player has not submitted drawing');
                }
                
                this.selectedDrawing = updatedHiddenState.submittedDrawings[nextDrawingUserId];
                this.selectedUserId = nextDrawingUserId;
                this.selectedPrompt = updatedHiddenState.drawingPrompts[this.selectedUserId];
                delete updatedHiddenState.submittedDrawings[nextDrawingUserId];
                updatedGameState.players.forEach((player,index) => {
                    updatedGameState.players[index].ready = false;
                    
                });
                updatedGameState.waiting = false;
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'FAKE_ANSWER',
                    currentDrawing: {
                        drawing: this.selectedDrawing,
                        userId: this.selectedUserId,
                        correctAnswer: null,
                        answers: null
                    },
                    timerStart: action.timerStart,
                    timerLength: action.timerLength
                }

                for (const userId in updatedPlayerStates){
                    updatedPlayerStates[userId] = {
                        ...updatedPlayerStates[userId],
                        prompt: null
                    }
                }
            }
        }
        else if (gameState.currentPhase === 'FAKE_ANSWER'){
            if (action.actionType === 'SEND_FAKE_ANSWER'){
                updatedHiddenState.fakeAnswers[action.userId] = action.fakeAnswer;
                updatedGameState.players.forEach((player,index) => {
                    if(player.id === updatedGameState.currentDrawing.userId){
                        updatedGameState.players[index].ready = true;
                    }
                    if(player.id === action.userId){
                        updatedGameState.players[index].ready = true;
                    }else if(!player.ready){
                            updatedGameState.waiting = true;
                        }    
                });
            }
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'PICK_ANSWER',
                    currentDrawing: {
                        drawing: this.selectedDrawing,
                        userId: this.selectedUserId,
                        correctAnswer: null,
                        answers: null
                    },
                    timerStart: action.timerStart,
                    timerLength: action.timerLength
                }
                updatedGameState.players.forEach((player,index) => {
                    updatedGameState.players[index].ready = false;
                    
                });
                // this means the correct answer is always the last item. solve this on front end?
                const answers = Object.keys(updatedHiddenState.fakeAnswers).map((userId) => updatedHiddenState.fakeAnswers[userId]).filter((answer) => !!answer);
                answers.push(hiddenState.drawingPrompts[updatedGameState.currentDrawing.userId]);
                updatedGameState.currentDrawing.answers = answers;
                
                for (const userId in updatedPlayerStates){
                    let shownAnswers = answers;
                    if (userId === updatedGameState.currentDrawing.userId){
                        shownAnswers = [];
                    }

                    updatedPlayerStates[userId] = {
                        ...updatedPlayerStates[userId],
                        shownAnswers: shownAnswers
                    }
                }
            }
        }
        else if (gameState.currentPhase === 'PICK_ANSWER'){
            
            if (action.actionType === 'PICK_ANSWER'){
                console.log(action);
                updatedPlayerStates[action.userId].pickedAnswer = action.pickedAnswer;
                updatedGameState.players.forEach((player,index) => {
                    if(player.id === updatedGameState.currentDrawing.userId){
                        updatedGameState.players[index].ready = true;
                    }
                    if(player.id === action.userId){
                        updatedGameState.players[index].ready = true;
                    }else if(!player.ready){
                            updatedGameState.waiting = true;
                        }    
                });
            }
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                const newAnswers = {};
                updatedGameState.currentDrawing.answers.forEach((answer)=>{
                    if(!(answer in newAnswers)){
                        let owner = this.selectedUserId;
                        for(const playerId in updatedHiddenState.fakeAnswers){
                            if(updatedHiddenState.fakeAnswers[playerId] == answer){
                                owner = playerId;
                            }
                        }
                        updatedGameState.players.forEach(player=>{
                            if(player.id == owner){
                                owner = player.name;
                            }
                        })
                        newAnswers[answer] = {
                            owner:owner,
                            selected:[],
                        }
                    }
                    for(const player in updatedPlayerStates){
                        if(updatedPlayerStates[player].pickedAnswer==answer){
                            let playername = null;
                            updatedGameState.players.forEach(StatePlayer=>{
                                if(StatePlayer.id == player){
                                    playername = StatePlayer.name;
                                }
                            });
                            newAnswers[answer].selected.push(playername);
                        }
                    }
                })
             
                updatedGameState.players.forEach((player,index) => {
                    updatedGameState.players[index].ready = false;
                    
                });
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'REVEAL',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength,
                    currentDrawing:{
                        ...updatedGameState.currentDrawing,
                        answers: newAnswers,
                        correctAnswer: this.selectedPrompt,
                    }

                }
                for (const userId in updatedPlayerStates){
                    let fooled = false;
                    if (updatedPlayerStates[userId].pickedAnswer !== this.selectedPrompt){
                        fooled = true;
                    }

                    updatedPlayerStates[userId] = {
                        ...updatedPlayerStates[userId],
                        fooled: fooled,
                    }
                }
            }

        }
        else if (gameState.currentPhase === 'REVEAL'){
            if (action.actionType === 'SEE_SCORE'){
                updatedGameState.players.forEach((player,index) => {
                    if(player.id == action.userId){
                        updatedGameState.players[index].ready = true;
                    }else if(!player.ready){
                            updatedGameState.waiting = true;
                        }    
                });
            }
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'DISPLAY_SCORE_RANKING',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength,
                    currentDrawing: {
                        ...updatedGameState.currentDrawing,
                    }
                }
                
                updatedGameState.players.forEach((player,index) => {
                    updatedGameState.players[index].ready = false;
                    
                });
                for (const userId in playerStates){
                    if (playerStates[userId].pickedAnswer === this.selectedPrompt){
                        updatedGameState.players.forEach(player => {
                            if(player.id == userId){
                                player.score+=1000;
                            }
                        });
                        
                    }
                }
                
                delete updatedHiddenState.submittedDrawings[updatedGameState.currentDrawing.userId];
            }
        }
        else if (gameState.currentPhase === 'DISPLAY_SCORE_RANKING'){
            if(action.actionType==="ACKNOWLEDGE"){
                updatedGameState.players.forEach((player,index) => {
                    if(player.id == action.userId){
                        updatedGameState.players[index].ready = true;
                    }else if(!player.ready){
                            updatedGameState.waiting = true;
                        }    
                });
            }
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                const noMoreDrawings = (Object.keys(updatedHiddenState.submittedDrawings).length == 0);
                updatedGameState.players.forEach((player,index) => {
                    updatedGameState.players[index].ready = false;
                    
                });
                if (noMoreDrawings){
                    console.log("end of drawings");
                    //end game
                    // updatedGameState = {
                    //     ...updatedGameState,
                    //     currentPhase: 'DRAWING',
                    //     timerStart: action.timerStart,
                    //     timerLength: action.timerLength,
                    //     history: [],
                    //     currentRound: updatedGameState.currentRound ++
                    // }
                    
                    // for (const userId in updatedPlayerStates){
                    //     randomItem = 
                    //     // TODO: figure out how to put prompts in. maybe have array of prompts in hiddenState?
                    //     updatedPlayerStates[userId].prompt = 'PROMPT HERE';
                    //     updatedHiddenState.drawingPrompts[playerId] = 'PROMPT HERE';
                    // }
                }
                else {
                    const nextDrawingUserId = Object.keys(updatedHiddenState.submittedDrawings)[0];
                    // TODO: figure out what to do when a player does not submit a drawing
                    // waiting till all finished
                    if (updatedHiddenState.submittedDrawings[nextDrawingUserId] == null){
                        //throw new Error('Player has not submitted drawing');
                    }
                    
                    this.selectedDrawing = updatedHiddenState.submittedDrawings[nextDrawingUserId];
                    this.selectedUserId = nextDrawingUserId;
                    this.selectedPrompt = updatedHiddenState.drawingPrompts[this.selectedUserId];
                    delete updatedHiddenState.submittedDrawings[nextDrawingUserId];
                    updatedGameState.players.forEach((player,index) => {
                        updatedGameState.players[index].ready = false;
                        
                    });
                    updatedGameState.waiting = false;
                    updatedGameState = {
                        ...updatedGameState,
                        currentPhase: 'FAKE_ANSWER',
                        currentDrawing: {
                            drawing: this.selectedDrawing,
                            userId: this.selectedUserId,
                            correctAnswer: null,
                            answers: null
                        },
                        timerStart: action.timerStart,
                        timerLength: action.timerLength
                    }
                    for(const player in updatedHiddenState.fakeAnswers){
                        updatedHiddenState.fakeAnswers[player] = null;
                    }
                    for (const userId in updatedPlayerStates){
                        updatedPlayerStates[userId] = {
                            ...updatedPlayerStates[userId],
                            pickedAnswer:null,
                            prompt: null,
                            fooled: null,
                        }
                    }
                }
            }
            
        }

        return {game: updatedGameState, players: updatedPlayerStates, hidden: updatedHiddenState}
    }
}


module.exports = DrawfulSM;