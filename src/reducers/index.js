import { combineReducers } from 'redux';
import { roomReducer } from './roomReducer';
import { userReducer } from './userReducer';

export default combineReducers({
    roomState: roomReducer,
    userState: userReducer,
});
