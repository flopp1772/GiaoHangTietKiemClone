import React, { useState } from 'react';
import './LoginForm.css';

const API_BASE_URL = 'http://localhost:3000';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        login_id: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // nên có để nhận cookie token
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng nhập thành công!');
                localStorage.setItem('user', JSON.stringify(data.user));
                // TODO: chuyển trang sau khi login
            } else {
                setError(data?.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Không thể kết nối với server');
        }
    };

    return (
        <div className="authPage">
            <div className="authContainer">
                <h1>Đăng nhập</h1>

                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="login_id">Email hoặc SĐT</label>
                        <input
                            type="text"
                            id="login_id"
                            name="login_id"
                            placeholder="Email hoặc Số điện thoại"
                            required
                            value={formData.login_id}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Mật khẩu"
                            required
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit">Đăng nhập</button>

                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
