import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../auth';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // Здесь может быть реальный API-запрос
    if (email && password) {
      login('dummy-token'); // сохраняем токен
      navigate('/'); // перенаправление на главную
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" type="password"/>
      <button onClick={handleLogin}>Вхід</button>
    </div>
  );
};

export default LoginPage;
