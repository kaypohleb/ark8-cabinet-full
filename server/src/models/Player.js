class Player {
    /**
     * Player constructor
     * @param {string} id 
     * @param {string} name 
     */
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.ready = false;
    }
}

module.exports = Player;