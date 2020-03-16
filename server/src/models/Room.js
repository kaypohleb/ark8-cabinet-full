class Room {
    /**
     * Room constructor
     * @param {string} roomId 
     * @param {Player} createdBy 
     * @param {Game} game 
     */

    constructor(roomId, createdBy, game){
        this.id = roomId;
        this.createdBy = createdBy;
        this.game = game;
        this.players = [createdBy];
    }

    /**
     * @param {Player} player 
     */
    addPlayer(player){
        if (!(player instanceof Player)){
            throw new Error("addPlayer expected a Player object")
        }

        this.players.push(player);
        return this;
    }

    removePlayer(player){
        if (!(player instanceof Player)){
            throw new Error("removePlayer expected a Player object")
        }

        const foundPlayer = this.players.find( existingPlayer => existingPlayer.id == player.id);

        if (!foundPlayer){
            throw new Error(`player with id ${player.id} not found in room with id ${this.id}`)
        }
        
        this.players = this.players.filter((existingPlayer) => existingPlayer.id != player.id);

        return this;
    }

}

module.exports = Room;