import { loginUser, logoutUser } from '../thunks/authThunk';
import { clearError } from '../reducers/authReducer';

export {
    // Async actions
    loginUser,
    logoutUser,

    // Sync actions
    clearError
}; 