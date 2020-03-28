import { combineReducers } from 'redux';
import * as type from './types';

function userReducer(state = {}, action) {
    if(action.type===type.USER_STATE_CHANGED){
        return {
            user: action.user,
        };
    }
    return state;
}

function idtokenReducer(state = '', action) {
    if(action.type===type.ID_TOKEN_CHANGED){
        return {
            idToken: action.idtoken,
        };
    }
    return state;
}
const initUserDataState = {
    name: '',
    id: '',
    isSignIn:false
}
function fetchUserDataReducer(state=initUserDataState,action){
    switch(action.type){
        case(type.FETCH_USER_DATA_SUCCESS):
            let isSignIn=true;
            if(action.payload.error){
                isSignIn=false;
            }
            return ({
                ...action.payload,
                isSignedIn:isSignIn
            })
        case(type.FETCH_USER_ERROR):
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
    isSignedIn:false,
}

function fetchLobbyDataReducer(state=initLobbyState,action){
    switch(action.type){
        case(type.UPDATE_ROOM_STATE_SUCCESS):
            let isSignIn=true;
            if(action.payload.error){
                isSignIn=false;
            }
            return ({
                ...action.payload,
                isSignedIn:isSignIn,
            })
        default: 
            return state;
    }
}

function fetchGameDataReducer(state={},action){
    switch(action.type){
        case(type.UPDATE_GAME_STATE_SUCCESS):
            return ({
                ...action.payload
            })
        default: 
            return state;
    }
}

function fetchDrawingStateReducer(state={},action){
    switch(action.type){
        case(type.UPDATE_DRAWING_STATE_SUCCESS):
        return ({
            ...action.drawing
        })
        default:
            return state;
        
    }
}
export const rootReducer = combineReducers({
    userReducer,
    idtokenReducer,
    fetchUserDataReducer,
    fetchLobbyDataReducer,
    fetchGameDataReducer,
    fetchDrawingStateReducer,
});