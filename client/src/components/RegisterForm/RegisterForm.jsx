import React, { useState } from 'react';
import './RegisterForm.css';
import Image from '../image/image';
// API endpoint configuration
const API_BASE_URL = 'http://localhost:3000';

const RegisterForm = () => {
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        store_name: '',
        email: '',
        phone: '',
        password: '',
        address_detail: '',
        province: '',
        district: '',
        ward: '',
        street: '',
        agreed_terms: false
    });

    /**
     * Handle input changes for all form fields
     * @param {Event} e - The input change event
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    /**
     * Handle form submission for both register and login
     * @param {Event} e - The form submission event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'omit',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công!');
                // Reset form
                setFormData({
                    store_name: '',
                    email: '',
                    phone: '',
                    password: '',
                    address_detail: '',
                    province: '',
                    district: '',
                    ward: '',
                    street: '',
                    agreed_terms: false
                });
            } else {
                setError(data?.message || 'Có lỗi xảy ra khi xử lý yêu cầu');
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi kết nối với server');
        }
    };

    /**
     * Render address form fields
     */
    const renderAddressFields = () => (
        <>
            <div className="formGroup">
                <label htmlFor="address_detail">Địa chỉ chi tiết</label>
                <input
                    type="text"
                    placeholder="Số nhà, ngõ, đường..."
                    name="address_detail"
                    id="address_detail"
                    value={formData.address_detail}
                    onChange={handleChange}
                />
            </div>

            <div className="formGroup">
                <label htmlFor="province">Tỉnh/Thành phố</label>
                <select
                    name="province"
                    id="province"
                    value={formData.province}
                    onChange={handleChange}
                >
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option value="hanoi">Hà Nội</option>
                    <option value="hcm">TP. Hồ Chí Minh</option>
                </select>
            </div>

            <div className="formGroup">
                <label htmlFor="district">Quận/Huyện</label>
                <select
                    name="district"
                    id="district"
                    value={formData.district}
                    onChange={handleChange}
                >
                    <option value="">Chọn Quận/Huyện</option>
                    {/* Add districts based on selected province */}
                </select>
            </div>

            <div className="formGroup">
                <label htmlFor="ward">Phường/Xã</label>
                <select
                    name="ward"
                    id="ward"
                    value={formData.ward}
                    onChange={handleChange}
                >
                    <option value="">Chọn Phường/Xã</option>
                    {/* Add wards based on selected district */}
                </select>
            </div>

            <div className="formGroup">
                <label htmlFor="street">Đường</label>
                <input
                    type="text"
                    placeholder="Tên đường"
                    name="street"
                    id="street"
                    value={formData.street}
                    onChange={handleChange}
                />
            </div>
        </>
    );

    return (
        <div className="authPage">
            <div className="authContainer">
                <h1>Tạo tài khoản mới</h1>

                <form onSubmit={handleSubmit}>
                    <div className="formGroup">
                        <label htmlFor="store_name">Tên cửa hàng</label>
                        <input
                            type="text"
                            placeholder="Tên cửa hàng"
                            required
                            name="store_name"
                            id="store_name"
                            value={formData.store_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            name="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            type="tel"
                            placeholder="Số điện thoại"
                            required
                            name="phone"
                            id="phone"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="formGroup">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            required
                            name="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {renderAddressFields()}

                    <div className="formGroup checkbox">
                        <label>
                            <input
                                type="checkbox"
                                name="agreed_terms"
                                checked={formData.agreed_terms}
                                onChange={handleChange}
                            />
                            Tôi đồng ý với các điều khoản dịch vụ
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={!formData.agreed_terms}
                    >
                        Đăng ký
                    </button>

                    {error && <p className="error">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default RegisterForm; 