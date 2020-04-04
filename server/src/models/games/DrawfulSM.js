class DrawfulSM {
    step(userId, action, gameState, playerStates, hiddenState){
        let updatedGameState = {...gameState};
        let updatedPlayerStates = {...playerStates};
        let updatedHiddenState = {...hiddenState};

        if (gameState.currentPhase == 'INITIAL'){
            if (userId == 'GAME' && action.actionType == 'NEXT_PHASE'){
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'DRAWING',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength,
                    history: [],
                    currentRound: 1
                }
                
                for (const userId in updatedPlayerStates){
                    // TODO: figure out how to put prompts in. maybe have array of prompts in hiddenState?
                    updatedPlayerStates[userId].prompt = 'PROMPT HERE';
                    updatedHiddenState.drawingPrompts[playerId] = 'PROMPT HERE';
                }

            }
        }
        else if (gameState.currentPhase == 'DRAWING'){
            if (action.actionType == 'SEND_DRAWING'){
                updatedHiddenState.submittedDrawings[userId] = action.drawing;
            }
            if (userId == 'GAME' && action.actionType == 'NEXT_PHASE'){
                const nextDrawingUserId = Object.keys(hiddenState.submittedDrawings)[0];

                // TODO: figure out what to do when a player does not submit a drawing
                if (hiddenState.submittedDrawings[nextDrawingUserId] == null){
                    throw new Error('Player has not submitted drawing');
                }
                const nextDrawing = hiddenState.submittedDrawings[nextDrawingUserId];
                delete updatedHiddenState.submittedDrawings[nextDrawingUserId];

                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'FAKE_ANSWER',
                    currentDrawing: {
                        drawing: nextDrawing,
                        userId: userId,
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
        else if (gameState.currentPhase == 'FAKE_ANSWER'){
            if (action.actionType == 'SEND_FAKE_ANSWER'){
                updatedHiddenState.fakeAnswers[userId] = action.fakeAnswer;
            }
            if (userId == 'GAME' && action.actionType == 'NEXT_PHASE'){
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'PICK_ANSWER',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength
                }

                // this means the correct answer is always the last item. solve this on front end?
                const answers = Object.keys(updatedHiddenState.fakeAnswers).map((userId) => updatedHiddenState.fakeAnswers[userId]).filter((answer) => !!answer);
                answer.push(hiddenState.drawingPrompts[updatedGameState.currentDrawing.userId]);
                updatedGameState.currentDrawing.answers = answers;

                for (const userId in updatedPlayerStates){
                    let shownAnswers = answers;
                    if (userId == updatedGameState.currentDrawing.userId){
                        shownAnswers = [];
                    }

                    updatedPlayerStates[userId] = {
                        ...updatedPlayerStates[userId],
                        shownAnswers: shownAnswers
                    }
                }
            }
        }
        else if (gameState.currentPhase == 'PICK_ANSWER'){
            if (action.actionType == 'PICK_ANSWER'){
                updatedPlayerStates[userId].pickedAnswer == action.pickedAnswer;
            }
            if (userId == 'GAME' && action.actionType == 'NEXT_PHASE'){
                updatedGameState = {
                    ...updatedGameState,
                    currentPhase: 'REVEAL',
                    timerStart: action.timerStart,
                    timerLength: action.timerLength
                }
            }

        }
        else if (gameState.currentPhase == 'REVEAL'){
            if (userId == 'GAME' && action.actionType == 'NEXT_PHASE'){
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
                    if (playerStates[userId].pickedAnswer == updatedGameState.currentDrawing.correctAnswer){
                        const player = players.find((player) => player.id = userId);
                        player.score++;
                    }
                }
                
                delete updatedHiddenState.submittedDrawings[updatedGameState.currentDrawing.userId];
            }
        }
        else if (gameState.currentPhase == 'DISPLAY_SCORE_RANKING'){
            if (userId == 'GAME' && action.actionType == 'NEXT_PHASE'){
                const noMoreDrawings = (Object.keys(updatedHiddenState.submittedDrawings).length == 0);
                if (noMoreDrawings){
                    updatedGameState = {
                        ...updatedGameState,
                        currentPhase: 'DRAWING',
                        timerStart: action.timerStart,
                        timerLength: action.timerLength,
                        history: [],
                        currentRound: updatedGameState.currentRound ++
                    }
                    
                    for (const userId in updatedPlayerStates){
                        // TODO: figure out how to put prompts in. maybe have array of prompts in hiddenState?
                        updatedPlayerStates[userId].prompt = 'PROMPT HERE';
                        updatedHiddenState.drawingPrompts[playerId] = 'PROMPT HERE';
                    }
                }
                else {
                    const nextDrawingUserId = Object.keys(hiddenState.submittedDrawings)[0];

                    // TODO: figure out what to do when a player does not submit a drawing
                    if (hiddenState.submittedDrawings[nextDrawingUserId] == null){
                        throw new Error('Player has not submitted drawing');
                    }
                    const nextDrawing = hiddenState.submittedDrawings[nextDrawingUserId];
                    delete updatedHiddenState.submittedDrawings[nextDrawingUserId];

                    updatedGameState = {
                        ...updatedGameState,
                        currentPhase: 'FAKE_ANSWER',
                        currentDrawing: {
                            drawing: nextDrawing,
                            userId: userId,
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