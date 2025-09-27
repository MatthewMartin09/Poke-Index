import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import pokeindexLogo from "./assets/pokeindex_logo.png";
import gmailIcon from "./assets/gmail.png";
import facebookIcon from "./assets/facebook_logo.png";
import twitterIcon from "./assets/twitter.png";
import pokeballBg from "./assets/pokeball-bg.png";

const Signup = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Password must be at least 8 characters and contain at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    } else if (formData.fullname.trim().length < 2) {
      newErrors.fullname = 'Full name must be at least 2 characters long';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters long and contain at least one letter and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
    
    // Clear confirm password error if passwords now match
    if (name === 'password' && formData.confirmPassword && value === formData.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ''
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
      setIsSubmitting(false);
      // Show success message and redirect to login
      alert('Account created successfully! Please login with your credentials.');
      navigate("/login");
    }, 1000);
  };
  return (
    <div className="login-bg login-bg-pokeball" style={{ backgroundImage: `url(${pokeballBg})` }}>
      <div className="login-content">
        <img src={pokeindexLogo} alt="PokeIndex Logo" className="login-logo" />
        <h2 className="login-title">Sign Up</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="fullname" className="login-label">Full Name</label>
            <input 
              type="text" 
              id="fullname" 
              name="fullname"
              className={`login-input ${errors.fullname ? 'input-error' : ''}`}
              value={formData.fullname}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
            {errors.fullname && <span className="error-message">{errors.fullname}</span>}
          </div>
          
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
          
          <div className="input-group">
            <label htmlFor="confirmPassword" className="login-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              className={`login-input ${errors.confirmPassword ? 'input-error' : ''}`}
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          
          <button 
            type="submit" 
            className="sign-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="login-social">
          <span className="login-social-text">or sign up with</span>
          <div className="login-social-icons">
            <img src={gmailIcon} alt="Google" className="login-social-icon" />
            <img src={facebookIcon} alt="Facebook" className="login-social-icon" />
            <img src={twitterIcon} alt="Twitter" className="login-social-icon" />
          </div>
        </div>
        <div className="login-signup">
          Already have an account? <Link to="/login" className="login-signup-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;