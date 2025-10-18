import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Toast from './Toast';
import pokeballBg from '../assets/pokeball-bg.png';
import pokeindexLogo from '../assets/pokeindex_logo.png';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Mock favorite Pokemon cards data
    const mockFavorites = [
      {
        id: 1,
        name: 'Charizard',
        type: 'Fire/Flying',
        rarity: 'Rare Holo',
        set: 'Base Set',
        cardNumber: '4/102',
        image: '/assets/pokemon-cards/charizard.png',
        price: 120.00
      },
      {
        id: 2,
        name: 'Blastoise',
        type: 'Water',
        rarity: 'Rare Holo',
        set: 'Base Set',
        cardNumber: '2/102',
        image: '/assets/pokemon-cards/blastoise.png',
        price: 85.00
      },
      {
        id: 3,
        name: 'Venusaur',
        type: 'Grass/Poison',
        rarity: 'Rare Holo',
        set: 'Base Set',
        cardNumber: '15/102',
        image: '/assets/pokemon-cards/venusaur.png',
        price: 75.00
      },
      {
        id: 4,
        name: 'Pikachu',
        type: 'Electric',
        rarity: 'Common',
        set: 'Base Set',
        cardNumber: '58/102',
        image: '/assets/pokemon-cards/pikachu.png',
        price: 25.00
      }
    ];
    
    // Load favorites from localStorage or API
    const savedFavorites = localStorage.getItem('pokemonFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    } else {
      setFavorites(mockFavorites);
    }
  }, []);

  const removeFavorite = (cardId) => {
    const updatedFavorites = favorites.filter(card => card.id !== cardId);
    setFavorites(updatedFavorites);
    localStorage.setItem('pokemonFavorites', JSON.stringify(updatedFavorites));
  };

  const addToCart = (card) => {
    const currentCart = JSON.parse(localStorage.getItem('pokemonCart') || '[]');
    const existingItem = currentCart.find(item => item.id === card.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...card, quantity: 1 });
    }
    
    localStorage.setItem('pokemonCart', JSON.stringify(currentCart));
    setToast({ message: `${card.name} added to cart!`, type: 'success' });
  };

  const filteredFavorites = favorites.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Header />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
              My Favorites
            </h1>
            <p className="text-lg text-gray-500">
              {filteredFavorites.length} {filteredFavorites.length === 1 ? 'card' : 'cards'} saved
            </p>
          </div>

          {filteredFavorites.length === 0 ? (
            <div className="flex items-center justify-center min-h-96 p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-center max-w-md">
                <div className="w-30 h-30 mx-auto mb-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <img 
                    src={pokeballBg} 
                    alt="Empty" 
                    className="w-20 h-20 opacity-60"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  No Favorite Cards Yet
                </h2>
                <p className="text-lg text-gray-500 mb-8">
                  Start collecting your favorite Pokemon cards!
                </p>
                <button 
                  onClick={() => navigate('/shop')} 
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                >
                  Browse Shop
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredFavorites.map(card => (
                <div 
                  key={card.id} 
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.borderColor = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}
                >
                  {/* Remove Button - Top Right */}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(card.id);
                    }}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0.25rem',
                      zIndex: 10,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                    title="Remove from favorites"
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ display: 'block' }}
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>

                  {/* Card Image */}
                  <div style={{ 
                    position: 'relative',
                    background: '#f9fafb',
                    padding: '2rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '220px'
                  }}>
                    <img 
                      src={card.image} 
                      alt={card.name} 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '180px',
                        objectFit: 'contain'
                      }}
                    />
                  </div>
                  
                  {/* Card Info */}
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: '600', 
                      color: '#1f2937',
                      marginBottom: '0.5rem',
                      lineHeight: '1.4'
                    }}>
                      {card.name}
                    </h3>
                    
                    {/* Type Badges */}
                    {card.type && (
                      <div style={{ 
                        display: 'flex', 
                        gap: '0.375rem',
                        marginBottom: '0.75rem',
                        flexWrap: 'wrap'
                      }}>
                        {card.type.split('/').map((type, idx) => (
                          <span 
                            key={idx}
                            style={{
                              background: '#f3f4f6',
                              color: '#6b7280',
                              padding: '0.25rem 0.625rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {type.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <p style={{ 
                      color: '#9ca3af', 
                      fontSize: '0.8125rem',
                      marginBottom: '0.75rem'
                    }}>
                      {card.rarity}
                    </p>
                    
                    {/* Set Info */}
                    {card.set && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #f3f4f6'
                      }}>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#9ca3af' 
                        }}>
                          {card.set}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: '#9ca3af',
                          fontWeight: '500'
                        }}>
                          #{card.cardNumber}
                        </span>
                      </div>
                    )}
                    
                    {/* Price & Add to Cart */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <span style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        color: '#1f2937'
                      }}>
                        ${card.price.toFixed(2)}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(card);
                        }}
                        style={{
                          background: '#fbbf24',
                          color: '#ffffff',
                          padding: '0.625rem 1.25rem',
                          borderRadius: '8px',
                          border: 'none',
                          fontWeight: '600',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#f59e0b';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#fbbf24';
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="home-footer" style={{ marginTop: '4rem' }}>
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
    </>
  );
};

export default Favorites;
