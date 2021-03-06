const roomActionConstants = {
    ACTIONS : {
        'SET_READY' : {
            roomId: "string",
            // gameId: "string"
        },

        'SET_UNREADY' : {
            roomId: "string",
            // gameId: "string"
        },

        'ADD_GAME' : {
            roomId: "string",
            gameId: "string"
        },

        'START_GAME' : {
            roomId: "string",
            gameId: "string"
        },

        'CHANGE_SETTINGS':{
            roomId: "string",
            gameId: "string",
            settings: "object",
        }

    }
}

const roomActionValidator = (action) => {
    if (!roomActionConstants.ACTIONS[action.actionType]){
        throw new Error('Invalid room action')
    }

    for (const property in roomActionConstants.ACTIONS[action.actionType]){
        if (!action[property]){
            throw new Error(`Invalid room action: missing field ${property}`)
        }

        if ((typeof action[property]) != roomActionConstants.ACTIONS[action.actionType][property]){
            throw new Error(`Invalid room action: typeof of ${action[property]} should be 
            ${roomActionConstants.ACTIONS[action.actionType][property]}`)
        }
    }

}

module.exports = roomActionValidator;