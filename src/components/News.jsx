import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "../contexts/UserContext";
import Toast from "./Toast";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import cartIcon from "../assets/cart.png";
import favoriteIcon from "../assets/favorite.png";
import UserDropdown from "./UserDropdown";
import news1 from "../assets/news1.jpg";
import news2 from "../assets/news2.png";
import news3 from "../assets/news3.jpg";
import news4 from "../assets/news4.jpg";

const News = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [newsArticles, setNewsArticles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mock news data using your actual news images
  const mockNews = [
    {
      id: 1,
      title: "New Pokémon Generation Announced",
      category: "releases",
      date: "2025-09-25",
      image: news4,
      excerpt: "Game Freak reveals exciting details about the upcoming Pokémon generation with new regions, legendary Pokémon, and innovative gameplay mechanics that will revolutionize the trading card game experience.",
      author: "Pokemon Company",
      readTime: "3 min read",
      trending: true
    },
    {
      id: 2,
      title: "Pokémon GO Community Day Event",
      category: "tournaments",
      date: "2025-09-22",
      image: news3,
      excerpt: "Join trainers worldwide for the monthly Community Day featuring special Pokémon spawns, exclusive moves, and limited-time bonuses. Don't miss this chance to catch rare Pokémon!",
      author: "Pokemon GO Team",
      readTime: "5 min read",
      trending: false
    },
    {
      id: 3,
      title: "Trading Card Game Championships",
      category: "market",
      date: "2025-09-20",
      image: news2,
      excerpt: "The World Championships conclude with intense battles and new strategies showcased by top players globally. Witness the most competitive Pokémon TCG matches of the year.",
      author: "TCG World Championships",
      readTime: "4 min read",
      trending: true
    },
    {
      id: 4,
      title: "New Scarlet & Violet Cards Released",
      category: "games",
      date: "2025-09-18",
      image: news1,
      excerpt: "Discover the latest additions to the Scarlet & Violet collection with powerful new Pokémon cards featuring unique abilities, stunning artwork, and game-changing mechanics.",
      author: "Pokemon TCG",
      readTime: "2 min read",
      trending: false
    },
    {
      id: 5,
      title: "Building the Perfect Deck: Strategy Guide",
      category: "strategy",
      date: "2025-09-15",
      image: news4,
      excerpt: "Expert tips on creating competitive Pokemon TCG decks for tournaments. Learn from pro players about card synergies and winning strategies.",
      author: "Pro Player Tips",
      readTime: "8 min read",
      trending: false
    },
    {
      id: 6,
      title: "Collector Spotlight: Most Valuable Cards of 2025",
      category: "collecting",
      date: "2025-09-12",
      image: news3,
      excerpt: "A comprehensive look at the most sought-after Pokemon cards this year. Market analysis and collector insights into rare card values.",
      author: "Collector's Weekly",
      readTime: "6 min read",
      trending: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All News', icon: '' },
    { id: 'releases', name: 'New Releases', icon: '' },
    { id: 'tournaments', name: 'Tournaments', icon: '' },
    { id: 'market', name: 'Market News', icon: '' },
    { id: 'games', name: 'Video Games', icon: '' },
    { id: 'strategy', name: 'Strategy', icon: '' },
    { id: 'collecting', name: 'Collecting', icon: '' }
  ];

  useEffect(() => {
    // Simulate loading news
    setIsLoading(true);
    setTimeout(() => {
      setNewsArticles(mockNews);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredNews = newsArticles
    .filter(article => selectedCategory === 'all' || article.category === selectedCategory)
    .filter(article => 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const featuredNews = newsArticles[0] || {};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading latest Pokemon news...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <style>{`
        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr !important;
          }
          .newsletter-inputs {
            flex-direction: column !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .news-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
      {/* Top Navigation Bar */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
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

      {/* Main Content */}
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '80px 1rem 3rem 1rem'
      }}>
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Categories */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          justifyContent: 'center', 
          gap: '0.75rem', 
          marginBottom: '2rem' 
        }}>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                border: 'none',
                fontWeight: '600',
                fontSize: '0.9375rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedCategory === category.id 
                  ? '#fbbf24'
                  : '#ffffff',
                color: selectedCategory === category.id ? '#ffffff' : '#374151',
                boxShadow: selectedCategory === category.id
                  ? '0 4px 12px rgba(251, 191, 36, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
                transform: selectedCategory === category.id ? 'translateY(-2px)' : 'translateY(0)'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = '#fef3c7';
                  e.target.style.color = '#d97706';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) {
                  e.target.style.background = '#ffffff';
                  e.target.style.color = '#374151';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <span style={{ fontSize: '1.125rem' }}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
            {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>📰</div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', color: '#111827', marginBottom: '1rem' }}>
              No news articles found
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '1.125rem' }}>
              Try adjusting your search or category filters
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              style={{
                background: '#fbbf24',
                color: '#ffffff',
                padding: '0.875rem 2rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(251, 191, 36, 0.3)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.4)';
                e.target.style.background = '#f59e0b';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.3)';
                e.target.style.background = '#fbbf24';
              }}
            >
              Show All News
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '2rem' 
          }}
          className="news-grid">
            {filteredNews.map(article => (
              <article 
                key={article.id} 
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s',
                  cursor: 'pointer',
                  border: '2px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
                  e.currentTarget.style.borderColor = '#fbbf24';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={article.image} 
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      transition: 'transform 0.3s'
                    }}
                    onError={(e) => {
                      e.target.src = '/assets/pokeball-bg.png';
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  
                  {/* Category Tag */}
                  <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      color: '#1f2937',
                      padding: '0.375rem 0.875rem',
                      borderRadius: '9999px',
                      fontSize: '0.8125rem',
                      fontWeight: '600',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {categories.find(cat => cat.id === article.category)?.icon} {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                  </div>
                  
                  {/* Trending Badge */}
                  {article.trending && (
                    <div style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: '#ffffff',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)',
                        animation: 'pulse 2s infinite'
                      }}>
                        🔥 Trending
                      </span>
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    fontSize: '0.8125rem', 
                    color: '#6b7280',
                    marginBottom: '1rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(article.date)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h2 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: '#111827', 
                    marginBottom: '0.75rem',
                    lineHeight: '1.4',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.title}
                  </h2>
                  
                  <p style={{ 
                    color: '#6b7280', 
                    marginBottom: '1.25rem',
                    lineHeight: '1.6',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {article.excerpt}
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button 
                      style={{
                        background: '#fbbf24',
                        color: '#ffffff',
                        padding: '0.625rem 1.25rem',
                        borderRadius: '10px',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '0.9375rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 8px rgba(251, 191, 36, 0.3)'
                      }}
                      onClick={() => {
                        setToast({ message: 'Full article would open here!', type: 'info' });
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.4)';
                        e.target.style.background = '#f59e0b';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 8px rgba(251, 191, 36, 0.3)';
                        e.target.style.background = '#fbbf24';
                      }}
                    >
                      <span>Read More</span>
                      <svg style={{ width: '1rem', height: '1rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button 
                      style={{
                        color: '#6b7280',
                        background: 'transparent',
                        border: 'none',
                        padding: '0.5rem',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      onClick={() => {
                        navigator.clipboard.writeText(`Check out this Pokemon TCG news: ${article.title}`);
                        setToast({ message: 'Article link copied to clipboard!', type: 'success' });
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = '#3b82f6';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = '#6b7280';
                      }}
                    >
                      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

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

export default News;
