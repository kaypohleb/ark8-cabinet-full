class RockPaperScissorsSM {
    step(userId, action, gameState, playerStates){
        let updatedGameState = {
            ...gameState,
            gameEnded:false,
        }
        
        let updatedPlayerStates = {...playerStates};
        if(action.actionType == 'END_GAME'){
            //console.log(action);
            //console.log(updatedGameState);
            updatedGameState = {
                ...updatedGameState,
                gameEnded: true,
            }
        }
        else if (action.actionType == 'MAKE_SELECTION'){
            updatedPlayerStates[userId] = { selection: action.selection };
        }
        else if (action.actionType = 'NEXT_TURN'){
            if (gameState.currentRound > gameState.totalRounds){
                return {updatedGameState, updatedPlayerStates}
            }

            let hasRock = false;
            let hasScissors = false;
            let hasPaper = false;
            let winningSelection = null;

            for (const playerId in playerStates){
                if (playerStates[playerId].selection == "rock") {
                    hasRock = true;
                } 
                if (playerStates[playerId].selection == "paper") {
                    hasPaper = true;
                } 
                if (playerStates[playerId].selection == "scissors") {
                    hasScissors = true;
                } 
            }

            if (hasRock && hasPaper && !hasScissors){
                winningSelection = "paper";
            }
            else if (hasRock && !hasPaper && hasScissors){
                winningSelection = "rock";
            }
            else if (!hasRock && hasPaper && hasScissors){
                winningSelection = "scissors";
            }

            const prevTurn = Object.keys(playerStates).map( playerId => ({playerId, selection: playerStates[playerId].selection}) )
            updatedGameState.history.push(prevTurn);

            for (const playerId in playerStates){
                if (winningSelection && playerStates[playerId].selection == winningSelection){
                    let player = updatedGameState.players.find(player => player.id == playerId);
                    player.score++;
                }
            }

            
            if (updatedGameState.currentRound < updatedGameState.totalRounds){
                updatedGameState.currentRound++;
            }

            updatedGameState.timerStart = action.timerStart;

            for (const playerId in updatedPlayerStates){
                updatedPlayerStates[playerId] = { selection: null};
            }
        }

        return {game: updatedGameState, players: updatedPlayerStates}
    }
}

module.exports = RockPaperScissorsSM;