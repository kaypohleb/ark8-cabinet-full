import { createStore } from 'redux';
import {rootReducer} from './reducers';

const mainstore = createStore(rootReducer);
mainstore.subscribe(() => console.log(mainstore.getState()))
export default mainstore;