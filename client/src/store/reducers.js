import { combineReducers } from 'redux';
import { USER_STATE_CHANGED } from './actions';
import { ID_TOKEN_CHANGED } from './actions';

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

export const rootReducer = combineReducers({
    userReducer,
    idtokenReducer,
});