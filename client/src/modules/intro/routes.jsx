import React from 'react';
import { Navigate } from 'react-router-dom';
import ClientLayout from './ClientLayout/ClientLayout';
import { Outlet } from 'react-router-dom';

// Home Page và các trang intro
import Homepage from '@/modules/intro/pages/Home/Home';
import Business from '@/modules/intro/pages/Business/Business';
import About from '@/modules/intro/pages/About/About';
import Careers from '@/modules/intro/pages/Careers/Careers';
import FAQ from '@/modules/intro/pages/FAQ/FAQ';
import News from '@/modules/intro/pages/News/News';
import ECommerce from '@/modules/intro/pages/ECommerce/ECommerce';

// Các route dành cho intro (public)
const introRoutes = [
    {
        path: '/',
        element: <ClientLayout />, // Bọc layout cho tất cả route con
        children: [
            { path: '', element: <Homepage /> },              // /
            { path: 'for-business', element: <Business /> },  // /for-business
            { path: 'for-ecommerce', element: <ECommerce /> },
            { path: 'about', element: <About /> },
            { path: 'careers', element: <Careers /> },
            { path: 'news', element: <News /> },
            { path: 'faq', element: <FAQ /> },
        ],
    }
];

export default introRoutes;