const createGame = () => ({
    players: [],
    currentTurn: [],
    history: []
});

const addPlayer = (game, {id, name}) => {
    if (!id && !name) {
        return game;
    }

    return {
        ...game,
        players : [...game.players, {id, name, score: 0}]
    };

}

const removePlayer = (game, id) => {
    return {
        ...game,
        players : game.players.filter((player) => player.id == id)
    }
}

const addPlay = (game, {playerId, selection}) => {
    console.log("made play!")
    if (!playerId && !selection){
        return game;
    }

    const currentTurn = game.currentTurn.filter((play) => play.playerId != playerId);
    currentTurn.push({playerId, selection});

    return {
        ...game,
        currentTurn
    }

}

const turn = ({players, currentTurn, history}) => {
    const selections = new Set();
    currentTurn.forEach(({selection}) => { selections.add(selection)} );

    if ( currentTurn.length < 2){
        return {
            result: "Insufficient players this turn",
            game : {
                players,
                currentTurn : [],
                history : (currentTurn.length) ? [...history, currentTurn] : [...history]
            }
        }
    }

    // get winning selection and result text
    let winningSelection = null;
    let result = "";
    if (selections.has("rock") && selections.has("paper") && selections.has("scissors")){
        winningSelection = null;
        result = "Tie!";
    }
    else if (selections.has("rock") && selections.has("paper")){
        winningSelection = "paper";
        result = "Paper wins!";
    }
    else if (selections.has("paper") && selections.has("scissors")){
        winningSelection = "scissors";
        result = "Scissors wins!";
    }
    else if (selections.has("rock") && selections.has("scissors")){
        winningSelection = "rock";
        result = "Rock wins!";
    }
    else {
        winningSelection = null;
        result = `Tie! All players selected ${Array.from(selections)[0]}` 
    }

    // update scores
    const winningPlayerIds = [];
    currentTurn.forEach(({playerId, selection}) => {
        if (selection === winningSelection){
            winningPlayerIds.push(playerId);
        }
    })

    const updatedPlayers = players.map((player) => {
        if (winningPlayerIds.includes(player.id)){
            return {
                ...player,
                score: player.score + 1
            }
        }
        
        return {...player}
    })

    return {
        result,
        game : {
            players : updatedPlayers,
            currentTurn : [],
            history : [...history, currentTurn]
        }
    }
}

module.exports = {
    createGame,
    addPlayer,
    removePlayer,
    addPlay,
    turn
}