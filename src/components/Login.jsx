import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // --- FUNCTION 1: HANDLE LOGIN ---
  const handleLogin = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        navigate('/home');
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Login failed.");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  // --- FUNCTION 2: HANDLE SIGN UP (JOIN) ---
  const handleSignUp = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setMessage('✅ Credentials saved successfully! Please log in.');
        
        // Reset fields and switch to login after 2 seconds
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
          setName(''); // Clear name field
        }, 2000);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Sign up failed.");
      }
    } catch (err) {
      console.error("Sign up error:", err);
    }
  };

  // Dispatcher for the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      handleLogin();
    } else {
      handleSignUp();
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>{isLogin ? 'Login' : 'Create Account'}</h2>

        {message && <div className="success-msg">{message}</div>}
        
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Full Name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        )}

        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <div className="btn-group">
          <button type="submit" className="login-btn">
            {isLogin ? 'Enter Simulator' : 'Join Now'}
          </button>
          
          <button 
            type="button" 
            className="signup-btn" 
            onClick={() => {
                setIsLogin(!isLogin);
                setMessage('');
            }}
          >
            {isLogin ? 'Need an account? Sign Up' : 'Back to Login'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;