// Action Creator
export const updateMessages = (messagePayload) => {
    // Return an action
    return {
        type: 'UPDATE_MESSAGES',
        payload: messagePayload
    };
}
