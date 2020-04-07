
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

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
                updatedHiddenState.submittedDrawings[action.data.userId] = action.data.drawing;
                updatedGameState.players.forEach((player,index) => {
                    if(player.id === action.data.userId){
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
                console.log(action);
                updatedHiddenState.fakeAnswers[action.data.userId] = action.data.fakeAnswer;
                updatedGameState.players.forEach((player,index) => {
                    if(player.id === updatedGameState.currentDrawing.userId){
                        updatedGameState.players[index].ready = true;
                    }
                    if(player.id === action.data.userId){
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
                updatedPlayerStates[action.data.userId].pickedAnswer = action.data.pickedAnswer;
                updatedGameState.players.forEach((player,index) => {
                    if(player.id === updatedGameState.currentDrawing.userId){
                        updatedGameState.players[index].ready = true;
                    }
                    if(player.id === action.data.userId){
                        updatedGameState.players[index].ready = true;
                    }else if(!player.ready){
                            updatedGameState.waiting = true;
                        }    
                });
            }
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                const newAnswers = {};
                console.log(updatedGameState.currentDrawing)
                updatedGameState.currentDrawing.answers.forEach((answer)=>{
                    if(!(answer in newAnswers)){
                        newAnswers[answer] = [];
                    }
                    for(const player in updatedPlayerStates){
                        if(updatedPlayerStates[player].pickedAnswer===answer){
                            newAnswers[answer].push(player);
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
                    }

                }
            }

        }
        else if (gameState.currentPhase === 'REVEAL'){
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'DISPLAY_SCORE_RANKING',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength,
                    currentDrawing: {
                        ...updatedGameState.currentDrawing,
                        correctAnswer: updatedHiddenState.drawingPrompts[currentDrawing.userId]
                    }
                }

                for (const userId in playerStates){
                    if (playerStates[userId].pickedAnswer === updatedGameState.currentDrawing.correctAnswer){
                        const player = players.find((player) => player.id = userId);
                        player.score++;
                    }
                }
                
                delete updatedHiddenState.submittedDrawings[updatedGameState.currentDrawing.userId];
            }
        }
        else if (gameState.currentPhase === 'DISPLAY_SCORE_RANKING'){
            if (userId === 'GAME' && action.actionType === 'NEXT_PHASE'){
                const noMoreDrawings = (Object.keys(updatedHiddenState.submittedDrawings).length == 0);
                if (noMoreDrawings){
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

                for (const userId in updatedPlayerStates){
                    updatedPlayerStates[userId] = {
                        ...updatedPlayerStates[userId],
                        prompt: null
                    }
                }
                }
            }
            
        }

        return {game: updatedGameState, players: updatedPlayerStates, hidden: updatedHiddenState}
    }
}


module.exports = DrawfulSM;