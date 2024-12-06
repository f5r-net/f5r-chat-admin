import axios from 'axios';

// جلب جميع المستخدمين
export const getAllUsers = () => async (dispatch) => {
    try {
        const response = await axios.get('/api/users');
        dispatch({ type: 'GET_USERS_SUCCESS', payload: response.data });
    } catch (error) {
        dispatch({ type: 'GET_USERS_FAILURE', payload: error.message });
    }
};

// تسجيل الخروج
export const logout = () => (dispatch) => {
    dispatch({ type: 'USER_LOGOUT' });
};
