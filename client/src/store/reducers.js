import { combineReducers } from 'redux';
import { 
    USER_STATE_CHANGED,
    ID_TOKEN_CHANGED,
    UPDATE_ROOM_STATE_SUCCESS,
    FETCH_USER_DATA_SUCCESS,
    FETCH_USER_ERROR,
    } from './types';


function userReducer(state = {}, action) {
    if(action.type===USER_STATE_CHANGED){
        return {
            user: action.user,
        };
    }
    return state;
}

function idtokenReducer(state = '', action) {
    if(action.type===ID_TOKEN_CHANGED){
        return {
            idToken: action.idtoken,
        };
    }
    return state;
}
const initUserDataState = {
    name: '',
    id: '',
}
function getUserDataReducer(state=initUserDataState,action){
    switch(action.type){
        case(FETCH_USER_DATA_SUCCESS):
            return ({
                ...action.payload
            })

        case(FETCH_USER_ERROR):
            return({
                ...action.payload
            })
        default: 
            return state;
    }
}

const initLobbyState = {
    join: false,
    userID:'',
    checkCreated: false,
    players:[],
}

function getLobbyDataReducer(state=initLobbyState,action){
    switch(action.type){
        case(UPDATE_ROOM_STATE_SUCCESS):
            return ({
                ...action.payload
            })
        default: 
            return state;
    }
}
export const rootReducer = combineReducers({
    userReducer,
    idtokenReducer,
    getUserDataReducer,
    getLobbyDataReducer,
});