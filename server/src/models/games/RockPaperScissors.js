class RockPaperScissors{
    constructor(){
        this.timeout = 100000;
        this.updateCallback;
        this.state = {
            players : [],
            history : [],
            currentTurn 
        };
    }

    addPlayer(player){
        this.state.players.push(player);
    }

    makeAction(player, data){

    }

    setTimeoutLength(timeout){
        this.timeout = timeout;
    }

    setCallback(fn){
        this.updateCallback = fn;
    }

    start(){

    }
}

module.exports = RockPaperScissors;