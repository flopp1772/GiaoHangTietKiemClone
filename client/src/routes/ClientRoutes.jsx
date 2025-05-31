import React from 'react';
import { Route } from 'react-router-dom';
import Homepage from '../pages/client/Home/Home.jsx';
import Business from '../pages/client/Business/Business';
import About from '../pages/client/About/About';
import Careers from '../pages/client/Careers/Careers';
import FAQ from '../pages/client/FAQ/FAQ';
import News from '../pages/client/News/News';
import ECommerce from '../pages/client/ECommerce/ECommerce';

export const clientRoutes = (
    <>
        <Route path="/" element={<Homepage />} />
        <Route path="/for-business/" element={<Business />} />
        <Route path="/for-ecommerce/" element={<ECommerce />} />
        <Route path="/about/" element={<About />} />
        <Route path="/careers/" element={<Careers />} />
        <Route path="/news/" element={<News />} />
        <Route path="/faq/" element={<FAQ />} />
    </>
);
