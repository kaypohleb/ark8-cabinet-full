class DrawfulSM {
    constructor(props){
        this.selectedPrompt = null;
        this.selectedUserId = null;
        this.selectedDrawing = null;
    }
    step(userId, action, gameState, playerStates, hiddenState){
        let updatedGameState = {
            ...gameState,
            gameEnded:false,
        }
        let updatedPlayerStates = {...playerStates};
        let updatedHiddenState = {...hiddenState};
        
        if (gameState.currentPhase === 'INITIAL'){
            if (action.actionType === 'NEXT_PHASE'){ 
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'DRAWING',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength,
                    history: [],
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
            }
            if (action.actionType === 'NEXT_PHASE'){
                const nextDrawingUserId = Object.keys(updatedHiddenState.submittedDrawings)[0];
                this.selectedDrawing = updatedHiddenState.submittedDrawings[nextDrawingUserId];
                this.selectedUserId = nextDrawingUserId;
                this.selectedPrompt = updatedHiddenState.drawingPrompts[this.selectedUserId];
                delete updatedHiddenState.submittedDrawings[nextDrawingUserId];
                
                if (this.selectedDrawing === []){
                    updatedGameState.players[this.selectedUserId].score -= 1000;
                    updatedGameState = {
                        ...updatedGameState,
                        currentPhase: 'NO_DRAWING',
                        currentDrawing: {
                            drawing: this.selectedDrawing,
                            userId: this.selectedUserId,
                            correctAnswer: null,
                            answers: null
                        },
                        timerStart: action.timerStart,
                        timerLength: action.timerLength
                    }
                }
                else{
                
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
        }
        else if (gameState.currentPhase === 'FAKE_ANSWER'){
            if (action.actionType === 'SEND_FAKE_ANSWER'){
                updatedHiddenState.fakeAnswers[action.userId] = action.fakeAnswer;
            }
            if (action.actionType === 'NEXT_PHASE'){
            
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
                
                updatedPlayerStates[action.userId].pickedAnswer = action.pickedAnswer;
            }
            if (action.actionType === 'NEXT_PHASE'){
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
            if (action.actionType === 'NEXT_PHASE'){
                const noMoreDrawings = (Object.keys(updatedHiddenState.submittedDrawings).length == 0);
                if (noMoreDrawings){
                    console.log("end of drawings");
                    updatedGameState = {
                        ...updatedGameState,
                        gameEnded:true,
                    }
                }
                else {
                    for (const userId in playerStates){
                        if (playerStates[userId].pickedAnswer === this.selectedPrompt){
                            updatedGameState.players.forEach(player => {
                                if(player.id == userId){
                                    player.score+=1000;
                                }
                            });
                            
                        }
                    }
                    const nextDrawingUserId = Object.keys(updatedHiddenState.submittedDrawings)[0];
                    this.selectedDrawing = updatedHiddenState.submittedDrawings[nextDrawingUserId];
                    this.selectedUserId = nextDrawingUserId;
                    this.selectedPrompt = updatedHiddenState.drawingPrompts[this.selectedUserId];
                    delete updatedHiddenState.submittedDrawings[nextDrawingUserId];
                    if (this.selectedDrawing === []){
                        updatedGameState.players[this.selectedUserId].score -= 1000;
                        updatedGameState = {
                            ...updatedGameState,
                            currentPhase: 'NO_DRAWING',
                            currentDrawing: {
                                drawing: this.selectedDrawing,
                                userId: this.selectedUserId,
                                correctAnswer: null,
                                answers: null
                            },
                            timerStart: action.timerStart,
                            timerLength: action.timerLength
                        }
                    }
                    else{
                    
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

        }
        

        return {game: updatedGameState, players: updatedPlayerStates, hidden: updatedHiddenState}
    }
}


module.exports = DrawfulSM;