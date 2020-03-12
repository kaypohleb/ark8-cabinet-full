import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { rootReducer } from './reducers';

const mainstore = createStore(
    rootReducer,
    applyMiddleware(thunk),
);
// mainstore.subscribe(() => console.log(mainstore.getState().idtokenReducer.idToken))
export default mainstore;