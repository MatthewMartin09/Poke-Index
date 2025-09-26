import React from "react";
import { useNavigate } from "react-router-dom";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import gmailIcon from "../assets/gmail.png";
import facebookIcon from "../assets/facebook_logo.png";
import twitterIcon from "../assets/twitter.png";
import pokeballBg from "../assets/pokeball-bg.png";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  
  return (
    <div className="login-bg login-bg-pokeball" style={{ backgroundImage: `url(${pokeballBg})` }}>
      <div className="login-content">
        <img src={pokeindexLogo} alt="PokeIndex Logo" className="login-logo" />
        <h2 className="login-title">Sign Up</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <label htmlFor="fullname" className="login-label">Full Name</label>
          <input type="text" id="fullname" className="login-input" />
          <label htmlFor="email" className="login-label">Email Address</label>
          <input type="email" id="email" className="login-input"/>
          <label htmlFor="password" className="login-label">Password</label>
          <input type="password" id="password" className="login-input"/>
          <label htmlFor="confirmPassword" className="login-label">Confirm Password</label>
          <input type="password" id="confirmPassword" className="login-input"/>
          <button type="submit" className="sign-btn">Sign Up</button>
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
          Already have an account? <a href="/login" className="login-signup-link">Login</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
