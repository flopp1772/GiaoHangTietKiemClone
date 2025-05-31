import './topBar.css';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../image/image'; // hoặc đúng path của bạn tới file Image.jsx

const menuItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'For Business', path: '/for-business/' },
    { label: 'For E-Commerce', path: '/for-ecommerce/' },
    { label: 'Về chúng tôi', path: '/about/' },
    { label: 'Tuyển dụng', path: '/careers/' },
    { label: 'Tin tức', path: '/news/' },
    { label: 'Hỏi đáp', path: '/faq/' },
];

const TopBar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef();

    // Đóng menu khi click ra ngoài
    useEffect(() => {
        if (!menuOpen) return;
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    // Đóng menu khi resize lớn hơn 1024px
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="topBar-container">
            <div className="container topBar-content">
                {/* Logo */}
                <div className="logo">
                    <span className="logo-icon">
                        <Image
                            path="/general-ghtk/logo.svg"          // dùng path từ ImageKit nếu logo nằm trên ImageKit CDN
                            alt="GHTK Logo"
                            className="logo-img"     // tùy class bạn muốn
                            w={190}
                            h={48}
                        />
                    </span>
                </div>

                {/* Menu */}
                <nav ref={navRef} className={`navbar${menuOpen ? ' open' : ''}`}>
                    <ul className="navMenu">
                        {menuItems.map((item, idx) => (
                            <li key={item.label}>
                                <Link
                                    to={item.path}
                                    className={`navLink${activeIndex === idx ? ' active' : ''}`}
                                    onClick={() => {
                                        setActiveIndex(idx);
                                        setMenuOpen(false);
                                    }}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Hamburger menu toggle (mobile) */}
                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path
                            d="M3 6h18M3 12h18M3 18h18"
                            stroke="#333"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                {/* Button (PC only) */}
                <div className="right-btn">
                    <button className="consult-btn">Tư vấn Doanh nghiệp</button>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
