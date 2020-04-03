class RockPaperScissorsSM {
    step(userId, action, gameState, playerStates){
        const updatedGameState = {...gameState};
        const updatedPlayerStates = {};

        if (action.actionType == 'MAKE_SELECTION'){
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

            for (playerState in playerStates){
                if (playerState.selection == "rock") {
                    hasRock = true;
                } 
                if (playerState.selection == "paper") {
                    hasPaper = true;
                } 
                if (playerState.selection == "scissors") {
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

            Object.keys(playerStates).forEach(playerId => {
                if (playerStates[playerId].selection == winningSelection){
                    const player = updatedGameState.players.find(player => player.id == playerId);
                    if (player.selection == winningSelection){
                        player.gameData.score++;
                    }
                }
            })
            
            updatedGameState.currentRound++;
            updatedGameState.timerStart = action.timerStart;
        }


        return {updatedGameState, updatedPlayerStates}
    }
}

module.exports = RockPaperScissorsSM;