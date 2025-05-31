import React from "react";
import "./QuickLinksBar.css";
import { Link } from "react-router-dom";

const quickLinks = [
    {
        label: "Đăng ký / Đăng nhập",
        href: "/login",
        isInternal: true,
        bgColor: "rgb(1, 181, 59)",
    },
    {
        label: "Tra cứu bưu cục",
        href: "/",
        bgColor: "rgb(5, 211, 70)",
    },
    {
        label: "Tra cứu đơn hàng",
        href: "https://i.ghtk.vn",
        bgColor: "rgb(1, 229, 60)",
    },
    {
        label: "Tra cứu cước phí",
        href: "https://cache.giaohangtietkiem.vn/d/0825f2f1ea60848f7d18108c19cb01f9.pdf",
        bgColor: "rgb(88, 244, 113)",
    },
];

const QuickLinksBar = () => {
    return (
        <div className="quick-links-bar">
            {quickLinks.map((link, index) => (
                link.isInternal ? (
                    <Link
                        key={index}
                        to={link.href}
                        className="quick-link"
                        style={{ backgroundColor: link.bgColor, color: '#0B100C', transition: 'background-color 45ms, color 45ms' }}
                    >
                        <div className="quick-link-text">{link.label}</div>
                        <div>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                                <g clipPath="url(#clip0)">
                                    <path d="M11.4533 22.12L17.56 16L11.4533 9.88L13.3333 8L21.3333 16L13.3333 24L11.4533 22.12Z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="32" height="32" rx="8" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </Link>
                ) : (
                    <a
                        key={index}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : "_self"}
                        rel="noopener noreferrer"
                        className="quick-link"
                        style={{ backgroundColor: link.bgColor, color: '#0B100C', transition: 'background-color 45ms, color 45ms' }}
                    >
                        <div className="quick-link-text">{link.label}</div>
                        <div>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
                                <g clipPath="url(#clip0)">
                                    <path d="M11.4533 22.12L17.56 16L11.4533 9.88L13.3333 8L21.3333 16L13.3333 24L11.4533 22.12Z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0">
                                        <rect width="32" height="32" rx="8" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </a>
                )
            ))}
        </div>
    );
};

export default QuickLinksBar;
