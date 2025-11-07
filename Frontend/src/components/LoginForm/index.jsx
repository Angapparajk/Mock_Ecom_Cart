import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/api';

import './index.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const onChangeEmail = event => setEmail(event.target.value);
  const onChangePassword = event => setPassword(event.target.value);

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
      const data = await loginUser(email, password);
      if (data && data.jwt_token) {
        onSubmitSuccess(data.jwt_token);
      } else {
        onSubmitFailure(data.message || data.error_msg || 'Invalid credentials');
      }
    } catch (err) {
      onSubmitFailure('Something went wrong. Please try again.');
    }
  };

  const renderEmailField = () => (
    <>
      <label className="input-label" htmlFor="email">EMAIL</label>
      <input
        type="email"
        id="email"
        className="email-input-field"
        value={email}
        onChange={onChangeEmail}
        placeholder="Email"
      />
    </>
  );

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">PASSWORD</label>
      <input
        type="password"
        id="password"
        className="password-input-field"
        value={password}
        onChange={onChangePassword}
        placeholder="Password"
      />
    </>
  );

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-form-container">
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
        <div className="input-container">{renderEmailField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">Login</button>
        {showSubmitError && <p className="error-message">*{errorMsg}</p>}
        <p className="switch-auth">New here? <Link to="/register" className="switch-link">Create an account</Link></p>
      </form>
    </div>
  );
};

export default LoginForm;
