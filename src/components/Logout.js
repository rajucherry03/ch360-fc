import React, { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const doLogout = async () => {
      try {
        await signOut(auth);
      } finally {
        navigate('/', { replace: true });
      }
    };
    doLogout();
  }, [navigate]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing out...</p>
    </div>
  );
};

export default Logout;


