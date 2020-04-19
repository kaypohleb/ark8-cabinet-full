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

function fetchUserHistoryDataReducer(state={},action){
    switch(action.type){
        case(type.FETCH_USER_HISTORY_DATA_SUCCESS):
            return ({
                ...action.payload,
            })
        case(type.FETCH_USER_HISTORY_ERROR):
            return({
                ...action.payload
            })
        default: 
            return state;
    }
}

function fetchUserProfileDataReducer(state={}, action){
    switch(action.type){
        case(type.FETCH_USER_PROFILE_SUCCESS):
            return ({
                ...action.payload,
            })
        case(type.FETCH_USER_PROFILE_ERROR):{
            return({
                ...action.payload
            })
        }
        default: 
            return state;
    }
}

const initLobbyState = {
    admin:'',
    game:null,
    id:"",
    createdBy: "",
    players:[],
    isSignedIn:undefined,
}

function fetchLobbyDataReducer(state=initLobbyState,action){
    switch(action.type){
        case(type.UPDATE_ROOM_STATE_SUCCESS):
            return ({
                ...action.payload,
                isSignedIn:true,
            })
        case(type.UPDATE_ROOM_STATE_ERROR):
            return ({
                ...state,
                isSignedIn:false,
            })

        default:
            return state;
    }
}

function fetchGameDataReducer(state = {},action){
    switch(action.type){
        case(type.UPDATE_GAME_STATE_SUCCESS):
            return ({
                ...action.payload
            })
        default: 
            return state;
    }
}

function fetchSettingsListReducer(state = {},action){
    switch(action.type){
        case(type.FETCH_SETTINGS_LIST_SUCCESS):
            return ({
                ...action.payload
            })
        case(type.FETCH_SETTINGS_LIST_ERROR):
            return ({
                ...action.payload
            })
        default: 
            return state;
    }
}

function fetchDefaultSettingsReducer(state = {},action){
    switch(action.type){
        case(type.FETCH_DEFAULT_SETTINGS_SUCCESS):
            return ({
                ...action.payload
            })
        default: 
            return state;
    }
}

function fetchSpecSettingsReducer(state={},action){
    switch(action.type){
        case(type.FETCH_SPEC_SETTINGS_SUCCESS):
            return({
                ...action.payload
            })
        default:
            return state;
    }
}






export const rootReducer = combineReducers({
    userReducer,
    idtokenReducer,
    fetchUserDataReducer,
    fetchUserHistoryDataReducer,
    fetchUserProfileDataReducer,
    fetchLobbyDataReducer,
    fetchGameDataReducer,
    fetchSettingsListReducer,
    fetchDefaultSettingsReducer,
    fetchSpecSettingsReducer,
});