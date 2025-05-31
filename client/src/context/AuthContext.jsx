import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Kiểm tra trạng thái đăng nhập khi tải trang
    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                const token = localStorage.getItem('token');
                const userData = localStorage.getItem('user');

                if (token && userData) {
                    setUser(JSON.parse(userData));
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                logout(); // Đăng xuất nếu có lỗi
            } finally {
                setLoading(false);
            }
        };

        checkAuthStatus();
    }, []);

    // Hàm đăng nhập
    const login = async (email, password) => {
        try {
            // Mô phỏng API call - Thay bằng API thực tế sau
            // const response = await api.post('/auth/login', { email, password });

            // Demo data
            const mockUser = {
                id: '1',
                name: 'User Demo',
                email: email,
                role: email.includes('admin') ? 'admin' :
                    email.includes('staff') ? 'staff' : 'user',
            };

            const mockToken = 'demo-token-' + Date.now();

            // Lưu thông tin vào localStorage
            localStorage.setItem('token', mockToken);
            localStorage.setItem('user', JSON.stringify(mockUser));

            // Cập nhật state
            setUser(mockUser);
            setIsAuthenticated(true);

            return { success: true, user: mockUser };
        } catch (error) {
            console.error('Login failed:', error);
            return { success: false, error: error.message || 'Đăng nhập thất bại' };
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    // Hàm đăng ký
    const register = async (userData) => {
        try {
            // Mô phỏng API call - Thay bằng API thực tế sau
            // const response = await api.post('/auth/register', userData);

            return { success: true, message: 'Đăng ký thành công!' };
        } catch (error) {
            console.error('Registration failed:', error);
            return { success: false, error: error.message || 'Đăng ký thất bại' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            logout,
            register
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider; 