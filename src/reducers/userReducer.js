const initialState = {
    users: [],
    error: null,
};

export const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_USERS_SUCCESS':
            return { ...state, users: action.payload };
        case 'GET_USERS_FAILURE':
            return { ...state, error: action.payload };
        case 'USER_LOGOUT':
            return initialState;
        default:
            return state;
    }
};
