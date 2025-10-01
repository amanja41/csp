import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const jwtToken = searchParams.get('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    if (jwtToken) {
      localStorage.setItem('jwtToken', jwtToken);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [jwtToken, navigate]);

  return null;
}
