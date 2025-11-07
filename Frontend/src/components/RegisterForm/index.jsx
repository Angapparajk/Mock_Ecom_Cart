import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { registerUser } from '../../services/api';

import './index.css';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    try { window.dispatchEvent(new Event('auth-changed')) } catch (e) {}
    navigate('/', { replace: true });
  };

  const onSubmitFailure = message => {
    setShowSubmitError(true);
    setErrorMsg(message);
  };

  const submitForm = async event => {
    event.preventDefault();
    try {
      const data = await registerUser(name, email, password);
      if (data && data.jwt_token) {
        onSubmitSuccess(data.jwt_token);
      } else if (data && data.token) {
        onSubmitSuccess(data.token);
      } else {
        onSubmitFailure(data.message || data.error_msg || 'Registration failed');
      }
    } catch (err) {
      onSubmitFailure('Something went wrong. Please try again.');
    }
  };

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="register-form-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
        className="login-website-logo-mobile-img"
        alt="website logo"
      />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="login-img"
        alt="website login"
      />
      <form className="form-container" onSubmit={submitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="input-container">
          <label className="input-label" htmlFor="name">NAME</label>
          <input
            type="text"
            id="name"
            className="name-input-field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="email">EMAIL</label>
          <input
            type="email"
            id="email"
            className="email-input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password">PASSWORD</label>
          <input
            type="password"
            id="password"
            className="password-input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="register-button">Register</button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <p className="switch-auth">Already have an account? <Link to="/login" className="switch-link">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterForm;
