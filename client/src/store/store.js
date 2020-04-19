import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';
import { composeWithDevTools } from 'redux-devtools-extension';
import {loadState, saveState} from './sessionStorage';

const persistedState = loadState();

const mainstore = createStore(
    rootReducer,
    persistedState,  
    composeWithDevTools(applyMiddleware(thunk))
);
export default mainstore;

mainstore.subscribe(() => {
  saveState( mainstore.getState() );
});