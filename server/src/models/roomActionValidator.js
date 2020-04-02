const roomActionConstants = {
    ACTIONS : {
        'SET_READY' : {
            roomId: "string",
            gameId: "string"
        },

        'SET_UNREADY' : {
            roomId: "string",
            gameId: "string"
        },

        'ADD_GAME' : {
            roomId: "string",
            gameId: "string"
        },

        'START_GAME' : {
            roomId: "string",
            gameId: "string"
        }

    }
}

const roomActionValidator = (action) => {
    if (!roomActionConstants.ACTIONS[action.actionType]){
        throw new Error('Invalid room action')
    }

    for (const property in roomActionConstants.ACTIONS[action.actionType]){
        if (!action.actionType[property]){
            throw new Error('Invalid room action')
        }

        if (typeof action.actionType[property] != roomActionConstants.ACTIONS[action.actionType][property]){
            throw new Error('Invalid room action')
        }
    }

}

module.exports = roomActionValidator;