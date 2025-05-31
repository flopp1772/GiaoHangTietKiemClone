import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/modules/auth/authThunks';

const AuthLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (values) => {
        try {
            const response = await dispatch(loginUser(values)).unwrap();
            console.log('Login response in component:', response);

            // Kiểm tra response trước khi navigate
            if (response && response.user) {
                switch (response.user.role) {
                    case 'admin':
                        navigate('/admin');
                        break;
                    case 'shipper':
                        navigate('/shipper');
                        break;
                    case 'customer':
                        navigate('/customer');
                        break;
                    default:
                        navigate('/');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    return (
        <div>
            {/* Render your form here */}
        </div>
    );
};

export default AuthLogin; 