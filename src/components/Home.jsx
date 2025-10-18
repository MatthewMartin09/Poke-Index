import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import cartIcon from "../assets/cart.png";
import favoriteIcon from "../assets/favorite.png";
import pack1 from "../assets/Ppack1.png";
import pack2 from "../assets/Ppack2.png";
import pack3 from "../assets/Ppack3.png";
import pack4 from "../assets/Ppack4.png";
import news1 from "../assets/news1.jpg";
import news2 from "../assets/news2.png";
import news3 from "../assets/news3.jpg";
import news4 from "../assets/news4.jpg";
import news5 from "../assets/news5.jpg";
import news6 from "../assets/news6.png";
import ShinyText from "./ShinyText";
import TiltedCard from "./TiltedCard";
import UserDropdown from "./UserDropdown";

const Home = () => {
  const { isLoggedIn } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const isDragging = useRef(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const packCards = [
    { id: 1, title: "Scarlet & Violet Pack", price: "$4.99", image: pack1 },
    { id: 2, title: "Paldean Fates Pack", price: "$5.99", image: pack2 },
    { id: 3, title: "Paradox Rift Pack", price: "$4.49", image: pack3 },
    { id: 4, title: "Obsidian Flames Pack", price: "$4.99", image: pack4 },
  ];

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % packCards.length);
  };

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + packCards.length) % packCards.length);
  };

  // Touch/Swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // Minimum distance for a swipe

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0) {
        // Swiped left - go to next card
        nextCard();
      } else {
        // Swiped right - go to previous card
        prevCard();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
    touchEndX.current = null;
    e.preventDefault(); // Prevent text selection
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minDragDistance = 50; // Minimum distance for a drag

    if (Math.abs(distance) > minDragDistance) {
      if (distance > 0) {
        // Dragged left - go to next card
        nextCard();
      } else {
        // Dragged right - go to previous card
        prevCard();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      isDragging.current = false;
      touchStartX.current = null;
      touchEndX.current = null;
    }
  };

  return (
    <div className="home-container">
      {/* Top Navigation Bar */}
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
              <img src={pokeindexLogo} alt="PokeIndex" className="home-logo" />
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
                  <Link to="/login" className="home-desktop-btn home-login-btn flex items-center justify-center">
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="home-desktop-btn home-signup-btn flex items-center justify-center">
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

      {/* Main Content Area */}
      <main className="home-main">
        <div className="home-content">
          {/* Pokemon Pack Card Carousel */}
          <div className="pack-carousel-container">
            <h2 className="pack-carousel-title">
              <ShinyText 
                text="Latest Packs" 
                disabled={false} 
                speed={15} 
              />
            </h2>
            {/* Spacer to push carousel down */}
            <div className="h-2.5"></div>
            
            <div className="pack-carousel">
              {/* Card Stack */}
              <div 
                className="pack-card-stack"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {packCards.map((pack, index) => {
                  const position = (index - currentIndex + packCards.length) % packCards.length;
                  return (
                    <div
                      key={pack.id}
                      className={`pack-card ${position === 0 ? 'active' : ''} ${position === 1 ? 'next' : ''} ${position === packCards.length - 1 ? 'prev' : ''}`}
                      style={{ zIndex: packCards.length - position }}
                    >
                      <TiltedCard
                        imageSrc={pack.image}
                        altText={pack.title}
                        captionText={`${pack.title} - ${pack.price}`}
                        containerHeight="100%"
                        containerWidth="100%"
                        imageHeight="600px"
                        imageWidth="450px"
                        rotateAmplitude={8}
                        scaleOnHover={1.05}
                        showMobileWarning={false}
                        showTooltip={false}
                        displayOverlayContent={false}
                        customContent={
                          <div className="pack-card-inner">
                            <div className="pack-card-front">
                              <img 
                                src={pack.image} 
                                alt={pack.title} 
                                className="pack-image bg-transparent" 
                                style={{ 
                                  mixBlendMode: 'normal' 
                                }}
                              />
                            </div>
                          </div>
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* PokeNews Section */}
          <div className="poke-news-container">
            <h2 className="poke-news-title">PokeNews!</h2>
            <div className="news-cards-grid">
              {/* News Card 1 */}
              <div className="news-card">
                <div className="news-card-image">
                  <img src={news4} alt="New Pokemon Generation" className="news-image" />
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-category">Updates</span>
                    <span className="news-date">Sept 25, 2025</span>
                  </div>
                  <h3 className="news-title">New Pokémon Generation Announced</h3>
                  <p className="news-description">
                    Game Freak reveals exciting details about the upcoming Pokémon generation with new regions, legendary Pokémon, and innovative gameplay mechanics that will revolutionize the trading card game experience.
                  </p>
                  <Link to="/news" className="read-more-btn">Read More</Link>
                </div>
              </div>

              {/* News Card 2 */}
              <div className="news-card">
                <div className="news-card-image">
                  <img src={news3} alt="Pokemon GO Community Day" className="news-image" />
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-category">Events</span>
                    <span className="news-date">Sept 22, 2025</span>
                  </div>
                  <h3 className="news-title">Pokémon GO Community Day Event</h3>
                  <p className="news-description">
                    Join trainers worldwide for the monthly Community Day featuring special Pokémon spawns, exclusive moves, and limited-time bonuses. Don't miss this chance to catch rare Pokémon!
                  </p>
                  <Link to="/news" className="read-more-btn">Read More</Link>
                </div>
              </div>

              {/* News Card 3 */}
              <div className="news-card">
                <div className="news-card-image">
                  <img src={news2} alt="Trading Card Championships" className="news-image" />
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-category">Tournaments</span>
                    <span className="news-date">Sept 20, 2025</span>
                  </div>
                  <h3 className="news-title">Trading Card Game Championships</h3>
                  <p className="news-description">
                    The World Championships conclude with intense battles and new strategies showcased by top players globally. Witness the most competitive Pokémon TCG matches of the year.
                  </p>
                  <Link to="/news" className="read-more-btn">Read More</Link>
                </div>
              </div>

              {/* News Card 4 */}
              <div className="news-card">
                <div className="news-card-image">
                  <img src={news1} alt="New Scarlet Violet Cards" className="news-image" />
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-category">Releases</span>
                    <span className="news-date">Sept 18, 2025</span>
                  </div>
                  <h3 className="news-title">New Scarlet & Violet Cards Released</h3>
                  <p className="news-description">
                    Discover the latest additions to the Scarlet & Violet collection with powerful new Pokémon cards featuring unique abilities, stunning artwork, and game-changing mechanics.
                  </p>
                  <Link to="/news" className="read-more-btn">Read More</Link>
                </div>
              </div>

              {/* News Card 5 */}
              <div className="news-card">
                <div className="news-card-image">
                  <img src={news6} alt="New Scarlet Violet Cards" className="news-image" />
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-category">Releases</span>
                    <span className="news-date">Sept 24, 2025</span>
                  </div>
                  <h3 className="news-title">Pokémon Horizons: Season 2—The Search for Laqua Part 4 Now Available</h3>
                  <p className="news-description">
                    Witness the deepened bonds between Liko and Floragato and between Roy and Crocalor as the gang encounters the last of the Six Heroes.
                  </p>
                  <Link to="/news" className="read-more-btn">Read More</Link>
                </div>
              </div>

              {/* News Card 6 */}
              <div className="news-card">
                <div className="news-card-image">
                  <img src={news5} alt="New Scarlet Violet Cards" className="news-image" />
                </div>
                <div className="news-card-content">
                  <div className="news-meta">
                    <span className="news-category">Releases</span>
                    <span className="news-date">Oct 28, 2025</span>
                  </div>
                  <h3 className="news-title">News from the August 2022 Pokémon Presents</h3>
                  <p className="news-description">
                    Pokémon Scarlet and Pokémon Violet games arriving on the Nintendo Switch November 18, 2022. This presentation also included updates for Pokémon GO, Pokémon UNITE, and Pokémon Café ReMix.
                  </p>
                  <Link to="/news" className="read-more-btn">Read More</Link>
                </div>
              </div>
            </div>
          </div>
          {/* Get Started Section */}
          <div id="get-started" className="get-started-section">
            <div className="get-started-container">
              <h2 className="get-started-main-title">Get Started!</h2>
              <p className="get-started-subtitle">Your First Steps in the Pokémon Trading Card Game</p>
              
              <div className="get-started-cards">
                {/* Card 1 - Learn the Basics */}
                <div className="get-started-card">
                  <div className="get-started-icon">
                    <div className="pokeball-icon">
                      <div className="pokeball-top"></div>
                      <div className="pokeball-middle"></div>
                      <div className="pokeball-bottom"></div>
                      <div className="pokeball-center"></div>
                    </div>
                  </div>
                  <h3 className="get-started-card-title">1. Learn the Basics</h3>
                  <p className="get-started-card-description">
                    Discover how the Pokémon TCG works — Pokémon, Energy, and Trainer cards form your winning strategy.
                  </p>
                </div>

                {/* Card 2 - Choose Your Deck */}
                <div className="get-started-card">
                  <div className="get-started-icon">
                    <div className="cards-icon">
                      <div className="card card-back"></div>
                      <div className="card card-front"></div>
                    </div>
                  </div>
                  <h3 className="get-started-card-title">2. Choose Your Deck</h3>
                  <p className="get-started-card-description">
                    Start with a ready-to-play Battle Deck or an Elite Trainer Box packed with booster packs and accessories.
                  </p>
                </div>

                {/* Card 3 - Start Battling */}
                <div className="get-started-card">
                  <div className="get-started-icon">
                    <div className="lightning-icon">
                      <div className="lightning-bolt"></div>
                    </div>
                  </div>
                  <h3 className="get-started-card-title">3. Start Battling</h3>
                  <p className="get-started-card-description">
                    Challenge friends, join events, or play online with Pokémon TCG Live.
                  </p>
                </div>
              </div>

              <button className="get-started-cta-btn">
                Let's go
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* Logo Section */}
            <div className="footer-logo-section">
              <img src={pokeindexLogo} alt="PokeIndex" className="footer-logo" />
            </div>

            {/* Footer Links */}
            <div className="footer-links">
              {/* Shop Column */}
              <div className="footer-column">
                <h4 className="footer-column-title">Shop</h4>
                <ul className="footer-links-list">
                  <li><Link to="/shop" className="footer-link">Starter Decks</Link></li>
                  <li><Link to="/shop" className="footer-link">Elite Trainer Boxes</Link></li>
                  <li><Link to="/shop" className="footer-link">Booster Packs</Link></li>
                  <li><Link to="/shop" className="footer-link">Accessories</Link></li>
                </ul>
              </div>

              {/* About Column */}
              <div className="footer-column">
                <h4 className="footer-column-title">About</h4>
                <ul className="footer-links-list">
                  <li><Link to="/about" className="footer-link">Our Story</Link></li>
                  <li><Link to="/faq" className="footer-link">FAQs</Link></li>
                  <li><Link to="/contact" className="footer-link">Contact Us</Link></li>
                </ul>
              </div>

              {/* Support Column */}
              <div className="footer-column">
                <h4 className="footer-column-title">Support</h4>
                <ul className="footer-links-list">
                  <li><Link to="/shipping" className="footer-link">Shipping & Returns</Link></li>
                  <li><Link to="/orders" className="footer-link">Order Tracking</Link></li>
                  <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
                </ul>
              </div>

              {/* Newsletter Column */}
              <div className="footer-column newsletter-column">
                <h4 className="footer-column-title">Newsletter</h4>
                <p className="newsletter-description">
                  Be the first to know about new card drops, expansions, and special promotions.
                </p>
                <div className="newsletter-form">
                  <input 
                    type="email" 
                    placeholder="Enter your email here" 
                    className="newsletter-input"
                  />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
