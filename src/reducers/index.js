import { combineReducers } from 'redux';

const messageReducer = (messages = null, action) => {
    if (action.type === 'UPDATE_MESSAGES') {
        return action.payload;
    }
    return messages;
}

export default combineReducers({
    messages: messageReducer,
});
