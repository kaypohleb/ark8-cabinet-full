class RockPaperScissors{
    constructor(fn){
        this.id = 'ROCK_PAPER_SCISSORS';
        this.rounds = 5; 
        this.timeout = 10000;
        this.updateCallback = fn;
        this.state = {
            turnStart: null,
            remainingRounds: 5,
            players : [],
            history : [],
            scores: {},
            prevWinner : null,
            currentTurn: [] 
        };
    }

    addPlayer(player){
        this.state.players.push(player);
    }

    setRounds(rounds){
        this.rounds = rounds;
        this.state.remainingRounds = rounds;
    }

    setTimeoutLength(timeout){
        this.timeout = timeout;
    }

    getState(){
        return this.state;
    }

    makeAction(player, data){
        const selection = data.selection;
        const madeAction = this.state.currentTurn.some((turn) => turn.playerId == player.id);
        if (madeAction){
            this.state.currentTurn = this.state.currentTurn.map((turn) => {
                if (turn.playerId == player.id){
                    return {playedId: player.id, selection};
                }
            })
        }
        else {
            this.state.currentTurn.push({playedId: player.id, selection});
        }
    }

    calculateTurn(){
        const currentTurn = this.state.currentTurn;
        this.state.history.push([...currentTurn]);

        const hasRock = currentTurn.some((turn) => turn.selection == "rock");
        const hasPaper = currentTurn.some((turn) => turn.selection == "paper");
        const hasScissors = currentTurn.some((turn) => turn.selection == "scissors");

        let winningSelection = null;
        if (hasRock && hasPaper && !hasScissors){
            winningSelection = "paper";
        }
        else if (hasRock && !hasPaper && hasScissors){
            winningSelection = "rock";
        }
        else if (!hasRock && hasPaper && hasScissors){
            winningSelection = "scissors";
        }

        this.prevWinner = winningSelection;
        currentTurn.forEach((turn) => {
            if (turn.selection == winningSelection){
                this.state.scores[turn.playedId] ++;
            }
        })
        this.state.currentTurn = [];
        this.state.remainingRounds--;
        
        console.log(this);

        this.updateCallback();

        if (this.state.remainingRounds > 0){
            this.state.turnStart = new Date().getTime();
            setTimeout(this.calculateTurn.bind(this), this.timeout);
        }
    }

    start(){
        this.state.players.forEach((player) => { this.state.scores[player.id] = 0});
        this.state.turnStart = new Date().getTime();
        setTimeout(this.calculateTurn.bind(this), this.timeout);
    }
}

module.exports = RockPaperScissors;