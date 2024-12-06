const initialState = {
    rooms: [],
    countries: [],
    error: null,
};

export const roomReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_ROOMS_SUCCESS':
            return { ...state, rooms: action.payload };
        case 'GET_COUNTRIES_SUCCESS':
            return { ...state, countries: action.payload };
        case 'GET_ROOMS_FAILURE':
        case 'GET_COUNTRIES_FAILURE':
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
