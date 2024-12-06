import axios from 'axios';

// جلب قائمة الغرف
export const getAllRooms = () => async (dispatch) => {
    try {
        const response = await axios.get('/api/rooms');
        dispatch({ type: 'GET_ROOMS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_ROOMS_FAILURE', payload: error.message });
    }
};

// جلب قائمة الدول
export const getCountries = () => async (dispatch) => {
    try {
        const response = await axios.get('/api/countries');
        dispatch({ type: 'GET_COUNTRIES_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_COUNTRIES_FAILURE', payload: error.message });
    }
};
