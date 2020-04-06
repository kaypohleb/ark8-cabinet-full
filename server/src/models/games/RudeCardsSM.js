class RudeCardsSM{
    step(userId, action, gameState, playerStates, hiddenState){
        const player = gameState.players.find( p => p.id == userId);

        if (gameState.currentPhase == 'INITIAL'){
            if (action.actionType == 'NEXT_PHASE'){
                // Start the game, all players draw 5 cards
                // Cards won't be drawn if there are no more available response cards (for now)
                // change currentPrompt.prompt
                
                for (const userId in playerStates){
                    for (let i = 0; i < 5; i++){
                        let card = hiddenState.availableResponses.pop();
                        if (!card) { card = 'EMPTY_CARD'};
                        playerStates[userId].availableResponses.push(card);
                    }
                }

                let prompt = hiddenState.availablePrompts.pop();
                if (!prompt) { prompt = 'EMPTY_PROMPT'};
                gameState.currentPrompt.prompt = prompt;

                gameState.currentRound = 1;

                gameState.currentPhase = 'REVEAL_PROMPT';
            }
        }
        else if (gameState.currentPhase == 'DRAW_CARDS'){
            for (const userId in playerStates){
                let card = hiddenState.availableResponses.pop();
                if (!card) { card = 'EMPTY_CARD'};
                playerStates[userId].availableResponses.push(card);
            }

            let prompt = hiddenState.availablePrompts.pop();
            if (!prompt) { prompt = 'EMPTY_PROMPT'};
            gameState.currentPrompt.prompt = prompt;

            gameState.currentRound++;

            gameState.currentPhase = 'REVEAL_PROMPT';
            
        }
        else if (gameState.currentPhase == 'REVEAL_PROMPT'){
            // this phase is just to pause the ui at the prompt for a bit
            if (action.actionType == 'NEXT_PHASE'){
                gameState.currentPhase = 'PLACE_CARDS';
            }   
            
        }
        else if (gameState.currentPhase == 'PLACE_CARDS'){
            if (action.actionType == 'SEND_CARD'){
                const response = action.response;
                if (playerStates[userId].availableResponses.includes(response)){
                    playerStates[userId].currentResponse = response;
                    
                    hiddenState.currentResponses.push({ userId, response, playerName: player.name, votes: 0 })
                }

            }
            
            if (action.actionType == 'NEXT_PHASE'){
                for (const userId in playerStates){
                    playerStates[userId].availableResponses = playerStates[userId].availableResponses.filter(r => r != playerStates[userId].currentResponse);
                    playerStates[userId].votableResponses = gameState.currentPrompt.responses.filter(r => r != playerStates[userId].currentResponse);
                }


                gameState.currentPrompt.responses = hiddenState.currentResponses.map(r => r.response);
                gameState.currentPhase = 'REVEAL_RESPONSES';
            }
        }
        else if (gameState.currentPhase == 'REVEAL_RESPONSES'){
            // this phase is also to prause the ui for a bit
            if (action.actionType == 'NEXT_PHASE'){
                gameState.currentPhase = 'VOTING';
            }
            
        }
        else if (gameState.currentPhase == 'VOTING'){
            if (action.actionType == 'SEND_VOTE'){
                const response = action.response;
                if (playerStates[userId].votableResponses.includes(response)){
                    playerStates[userId].votableResponses = [];
                    playerStates[userId].votedResponse = response;

                    const r = hiddenState.currentResponses.find(r => r.response = response);
                    r.votes++ ;
                }
            }
            
            if (action.actionType == 'NEXT_PHASE'){
                hiddenState.currentResponses.forEach(r => {
                    const p = gameState.players.find(p => p.id == r.userId);
                    p.score++;
                })

                gameState.currentPhase = 'UPDATE_SCORES';
            }
            
        }
        else if (gameState.currentPhase == 'UPDATE_SCORES'){
            // this phase is also to prause the ui for a bit
            if (action.actionType == 'NEXT_PHASE'){
                // check if its the final round, if so, go to GAME_END
                gameState.currentPrompt = {
                    prompt: null,
                    responses: []
                };

                for (const userId in playerStates){
                    playerStates[userId].currentResponse = null;
                    playerStates[userId].votableResponses = [];
                    playerStates[userId].votedRespnse = null;

                    hiddenState.currentResponses = [];
                }

                if (gameState.currentRound == gameState.totalRounds){
                    gameState.currentPhase = 'GAME_END';
                }
                else {
                    gameState.currentPhase = 'DRAW_CARDS';
                }
            }
            
        }
        else if (gameState.currentPhase == 'GAME_END'){
            // this phase does nothing

        }
    
        return {game: gameState, players: playerStates, hidden: hiddenState};
    }
}

module.exports = RudeCardsSM;