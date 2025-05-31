import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserData } from '@/redux/modules/auth';

const AuthInitializer = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector(state => state.auth);
    const hasAttemptedLoad = useRef(false);

    useEffect(() => {
        let mounted = true;

        const initializeAuth = async () => {
            if (!isAuthenticated && !loading && !hasAttemptedLoad.current && mounted) {
                hasAttemptedLoad.current = true;
                try {
                    await dispatch(loadUserData());
                } catch (error) {
                    console.error('Failed to initialize auth:', error);
                }
            }
        };

        initializeAuth();

        return () => {
            mounted = false;
        };
    }, []);

    return null;
};

export default AuthInitializer; 