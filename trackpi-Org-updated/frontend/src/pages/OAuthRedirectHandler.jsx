import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext';

const OAuthRedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useContext(AuthContext)

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        if (token) {
          login(token);
          if (location.pathname === '/phone-number') {
            navigate('/phone-number/enter', { replace: true });
          } else if (location.pathname === '/start-course') {
            navigate('/start-course/dashboard', { replace: true });
          } else {
            navigate('/');
          }
        } else {
          navigate('/');
        }
      }, [location, login, navigate]);
  return (
    <>
    <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    </>
  )
}

export default OAuthRedirectHandler