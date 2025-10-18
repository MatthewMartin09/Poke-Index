import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from "../contexts/UserContext";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import cartIcon from "../assets/cart.png";
import favoriteIcon from "../assets/favorite.png";
import UserDropdown from "./UserDropdown";

const Header = () => {
  const { isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="home-header">
      <div className="home-header-container">
        <div className="home-header-content">
          {/* Mobile Burger Menu */}
          <div className="home-burger-menu">
            <button 
              className="home-burger-button"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <div className="home-burger-line"></div>
              <div className="home-burger-line"></div>
              <div className="home-burger-line"></div>
            </button>
            
            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="home-dropdown-menu">
                <nav className="home-nav">
                  <Link to="/home" className="home-nav-item">Home</Link>
                  <Link to="/favorites" className="home-nav-item">Favorites</Link>
                  <Link to="/cart" className="home-nav-item">Cart</Link>
                  <Link to="/pokedex" className="home-nav-item">Pokedex</Link>
                  <Link to="/shop" className="home-nav-item">Shop</Link>
                  <Link to="/news" className="home-nav-item">News</Link>
                  <Link to="/collections" className="home-nav-item">My Collections</Link>

                  <div className="home-nav-divider"></div>
                  {!isLoggedIn ? (
                    <>
                      <Link to="/login" className="home-nav-item home-mobile-login">
                        <span>Login</span>
                      </Link>
                      <Link to="/signup" className="home-nav-item home-mobile-signup">
                        <span>Sign Up</span>
                      </Link>
                    </>
                  ) : (
                    <div className="home-nav-item">
                      <UserDropdown />
                    </div>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* Logo - Mobile: Centered, Desktop: Left */}
          <div className="home-logo-section">
            <Link to="/home">
              <img src={pokeindexLogo} alt="PokeIndex" className="home-logo" />
            </Link>
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="home-desktop-nav">
            <Link to="/home" className="home-desktop-nav-item">Home</Link>
            <Link to="/pokedex" className="home-desktop-nav-item">Pokedex</Link>
            <Link to="/shop" className="home-desktop-nav-item">Shop</Link>
            <Link to="/news" className="home-desktop-nav-item">News</Link>
            <Link to="/collections" className="home-desktop-nav-item">My Collections</Link>
          </nav>

          {/* Desktop Action Buttons - Hidden on mobile */}
          <div className="home-desktop-actions">
            <Link to="/favorites" className="home-icon-btn" aria-label="Favorites">
              <img src={favoriteIcon} alt="Favorites" className="home-icon" />
            </Link>
            <Link to="/cart" className="home-icon-btn" aria-label="Cart">
              <img src={cartIcon} alt="Cart" className="home-icon" />
            </Link>
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="home-desktop-btn home-login-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="home-desktop-btn home-signup-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span>Sign Up</span>
                </Link>
              </>
            ) : (
              <UserDropdown />
            )}
          </div>

          {/* Empty space for mobile layout balance */}
          <div className="home-spacer"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
