import React from 'react';
import { Route } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm';
import RegisterForm from '../components/RegisterForm/RegisterForm';

const AuthRoutes = () => (
    <>
        <Route path="/auth/login" element={<LoginForm />} />
        <Route path="/auth/register" element={<RegisterForm />} />
    </>
);

export default AuthRoutes;
