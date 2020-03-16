class Game {
    constructor(state, players){
        this.state = state;
        this.players = players;
        this.history = [];
        this.currentTurn = [];
    }

    makeAction(action){
        if (!(action instanceof Action)){
            throw new Error("makeAction expects an Action");
        }

        this.currentTurn = this.currentTurn.map((currentAction) => {
            if (currentAction.player == action.player){
                return action;
            }
            
            return action;
        })
        
    }

    calculateTurn(){
        
    }
    
}

class Action {
    constructor(player){
        this.player = player;
    }
}

module.exports = {Game, Action}