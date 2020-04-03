class Player {
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.ready = false;
        this.gameData = {};
    }

    printGameData(){
        return {...this.gameData};
    }


}

module.exports = Player;