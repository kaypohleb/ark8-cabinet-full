class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.ready = false;
        this.gameData = {};
    }

    ready(){
        this.ready = true;
    }

    unready(){
        this.ready = false;
    }

    printGameData(){
        return {...this.gameData};
    }
}

module.exports = Player;