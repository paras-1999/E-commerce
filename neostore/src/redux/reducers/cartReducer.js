let initialState = 0;

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INC': return state + 1;

        case 'DEC': return state - 1;

        case 'SET': return action.payload;
        default: return state;
    }
}
export default cartReducer;