import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('auth_token');
    navigate('/login');
  }, [navigate]);

  return null;
}
