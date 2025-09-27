import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "./contexts/UserContext";
import pokeindexLogo from "./assets/pokeindex_logo.png";
import gmailIcon from "./assets/gmail.png";
import facebookIcon from "./assets/facebook_logo.png";
import twitterIcon from "./assets/twitter.png";
import pokeballBg from "./assets/pokeball-bg.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, we'll extract name from email
      const userName = formData.email.split('@')[0];
      const userData = {
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: formData.email
      };
      
      login(userData);
      setIsSubmitting(false);
      navigate("/home");
    }, 1000);
  };
  return (
    <div className="login-bg login-bg-pokeball" style={{ backgroundImage: `url(${pokeballBg})` }}>
      <div className="login-content">
        <img src={pokeindexLogo} alt="PokeIndex Logo" className="login-logo" />
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email" className="login-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              className={`login-input ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="login-label">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              className={`login-input ${errors.password ? 'input-error' : ''}`}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          <div className="login-row">
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button 
            type="submit" 
            className="login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-social">
          <span className="login-social-text">or login with</span>
          <div className="login-social-icons">
            <img src={gmailIcon} alt="Google" className="login-social-icon" />
            <img src={facebookIcon} alt="Facebook" className="login-social-icon" />
            <img src={twitterIcon} alt="Twitter" className="login-social-icon" />
          </div>
        </div>
        <div className="login-signup">
          Don't have an account? <Link to="/signup" className="login-signup-link">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;