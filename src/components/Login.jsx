import React from "react";
import { useNavigate } from "react-router-dom";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import gmailIcon from "../assets/gmail.png";
import facebookIcon from "../assets/facebook_logo.png";
import twitterIcon from "../assets/twitter.png";
import pokeballBg from "../assets/pokeball-bg.png";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted, navigating to /home");
    navigate("/home");
  };
  
  return (
    <div className="login-bg login-bg-pokeball" style={{ backgroundImage: `url(${pokeballBg})` }}>
      <div className="login-content">
        <img src={pokeindexLogo} alt="PokeIndex Logo" className="login-logo" />
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="email" className="login-label">Email Address</label>
          <input type="email" id="email" className="login-input"/>
          <label htmlFor="password" className="login-label">Password</label>
          <input type="password" id="password" className="login-input"/>
          <div className="login-row">
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>
          <button type="submit" className="login-btn">Login</button>
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
          Don't have an account? <a href="/signup" className="login-signup-link">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
