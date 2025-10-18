import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Toast from './Toast';
import cartIcon from '../assets/cart.png';
import pokeindexLogo from '../assets/pokeindex_logo.png';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('pokemonCart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const updateCartInStorage = (updatedCart) => {
    localStorage.setItem('pokemonCart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    const updatedCart = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    updateCartInStorage(updatedCart);
  };

  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    updateCartInStorage(updatedCart);
  };

  const clearCart = () => {
    updateCartInStorage([]);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.08; // 8% tax
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const shipping = subtotal > 50 ? 0 : 5.99;
    return subtotal + tax + shipping;
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      setToast({ message: 'Order placed successfully! Check your email for confirmation.', type: 'success' });
      setTimeout(() => {
        clearCart();
        setIsLoading(false);
        navigate('/home');
      }, 2000);
    }, 2000);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = calculateTotal();

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
              Shopping Cart
            </h1>
            <p className="text-lg text-gray-500">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="flex items-center justify-center min-h-96 p-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-center max-w-md">
                <div className="w-30 h-30 mx-auto mb-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <img 
                    src={cartIcon} 
                    alt="Empty Cart" 
                    className="w-15 h-15 opacity-70"
                  />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Your cart is empty
                </h2>
                <p className="text-lg text-gray-500 mb-8">
                  Add some Pokemon cards to get started!
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
            <div className="grid grid-cols-1 gap-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {cartItems.map(item => (
                    <div 
                      key={item.id} 
                      style={{
                        background: '#ffffff',
                        border: '2px solid #e5e7eb',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '140px 1fr auto',
                        gap: '1.5rem',
                        alignItems: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#fbbf24';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e5e7eb';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '12px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '120px'
                      }}>
                        <img 
                          src={item.image || '/assets/pokeball-bg.png'} 
                          alt={item.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100px',
                            objectFit: 'contain'
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div>
                        <h3 style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: '700', 
                          color: '#1f2937',
                          marginBottom: '0.5rem'
                        }}>
                          {item.name}
                        </h3>
                        <p style={{ 
                          color: '#6b7280', 
                          fontSize: '0.875rem',
                          marginBottom: '0.25rem'
                        }}>
                          {item.type}
                        </p>
                        <p style={{ 
                          color: '#3b82f6', 
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          marginBottom: '0.5rem'
                        }}>
                          {item.rarity}
                        </p>
                        {item.set && (
                          <p style={{ 
                            color: '#9ca3af', 
                            fontSize: '0.8rem' 
                          }}>
                            {item.set} - #{item.cardNumber}
                          </p>
                        )}
                        
                        {/* Quantity Controls */}
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          gap: '0.75rem',
                          marginTop: '1rem'
                        }}>
                          <span style={{ 
                            fontSize: '0.875rem', 
                            fontWeight: '600', 
                            color: '#6b7280' 
                          }}>
                            Quantity:
                          </span>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            border: '2px solid #e5e7eb',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              style={{
                                background: '#f9fafb',
                                border: 'none',
                                padding: '0.5rem 0.75rem',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '1rem',
                                color: '#374151',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#fbbf24'}
                              onMouseLeave={(e) => e.target.style.background = '#f9fafb'}
                            >
                              −
                            </button>
                            <span style={{ 
                              padding: '0.5rem 1rem',
                              fontWeight: '700',
                              minWidth: '50px',
                              textAlign: 'center',
                              background: '#ffffff'
                            }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              style={{
                                background: '#f9fafb',
                                border: 'none',
                                padding: '0.5rem 0.75rem',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '1rem',
                                color: '#374151',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => e.target.style.background = '#fbbf24'}
                              onMouseLeave={(e) => e.target.style.background = '#f9fafb'}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price & Remove */}
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '1rem'
                      }}>
                        <button 
                          onClick={() => removeItem(item.id)}
                          style={{
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: '8px',
                            width: '36px',
                            height: '36px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.25rem',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#ef4444';
                            e.target.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#fee2e2';
                            e.target.style.transform = 'scale(1)';
                          }}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                        
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ 
                            fontSize: '0.75rem', 
                            color: '#9ca3af',
                            marginBottom: '0.25rem'
                          }}>
                            ${item.price.toFixed(2)} each
                          </p>
                          <p style={{ 
                            fontSize: '1.5rem', 
                            fontWeight: '800',
                            color: '#1f2937'
                          }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div>
                  {/* Rewards Section */}
                  <div style={{
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    marginBottom: '1.5rem'
                  }}>
                    <h3 style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: '#92400e',
                      margin: '0 0 1rem 0',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Rewards & Promos
                    </h3>
                    
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem',
                      marginBottom: '0.75rem'
                    }}>
                      <input
                        type="text"
                        placeholder="Promo code"
                        style={{
                          flex: 1,
                          padding: '0.625rem 0.75rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          outline: 'none',
                          background: '#ffffff',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#fbbf24'}
                        onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                      />
                      <button
                        onClick={() => setToast({ message: 'Promo code applied! 🎉', type: 'success' })}
                        style={{
                          padding: '0.625rem 1.25rem',
                          background: '#fbbf24',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          whiteSpace: 'nowrap'
                        }}
                        onMouseEnter={(e) => e.target.style.background = '#f59e0b'}
                        onMouseLeave={(e) => e.target.style.background = '#fbbf24'}
                      >
                        Apply
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 0',
                      borderTop: '1px solid #fde68a',
                      marginTop: '0.75rem'
                    }}>
                      <span style={{ fontSize: '0.813rem', color: '#92400e' }}>
                        Points Available
                      </span>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#92400e' }}>
                        250 pts
                      </span>
                    </div>
                    
                    <button
                      onClick={() => setToast({ message: '50 points redeemed! $5 off applied 💰', type: 'success' })}
                      style={{
                        width: '100%',
                        padding: '0.625rem',
                        background: '#ffffff',
                        color: '#92400e',
                        border: '1px solid #fbbf24',
                        borderRadius: '6px',
                        fontSize: '0.813rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        marginTop: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#fbbf24';
                        e.target.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#ffffff';
                        e.target.style.color = '#92400e';
                      }}
                    >
                      Redeem 50 Points ($5 Off)
                    </button>
                  </div>

                  <div style={{
                    background: '#ffffff',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '2rem',
                    position: 'sticky',
                    top: '100px'
                  }}>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: '700', 
                      color: '#1f2937',
                      marginBottom: '1.5rem'
                    }}>
                      Order Summary
                    </h3>
                    
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      gap: '1rem',
                      marginBottom: '1.5rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '1rem',
                        color: '#6b7280'
                      }}>
                        <span>Subtotal ({cartItems.length} items)</span>
                        <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '1rem',
                        color: '#6b7280'
                      }}>
                        <span>Tax</span>
                        <span style={{ fontWeight: '600' }}>${tax.toFixed(2)}</span>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        fontSize: '1rem',
                        color: '#6b7280'
                      }}>
                        <span>Shipping</span>
                        <span style={{ fontWeight: '600', color: shipping === 0 ? '#10b981' : '#6b7280' }}>
                          {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                    
                    {subtotal < 50 && (
                      <div style={{
                        background: '#dbeafe',
                        padding: '0.875rem',
                        borderRadius: '10px',
                        marginBottom: '1.5rem'
                      }}>
                        <p style={{ 
                          fontSize: '0.875rem', 
                          color: '#1e40af',
                          fontWeight: '600',
                          textAlign: 'center',
                          margin: 0
                        }}>
                          Add ${(50 - subtotal).toFixed(2)} more for free shipping! 🚚
                        </p>
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      paddingTop: '1.5rem',
                      borderTop: '2px solid #e5e7eb',
                      marginBottom: '1.5rem'
                    }}>
                      <span style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700',
                        color: '#1f2937'
                      }}>
                        Total
                      </span>
                      <span style={{ 
                        fontSize: '1.75rem', 
                        fontWeight: '800',
                        color: '#1f2937'
                      }}>
                        ${total.toFixed(2)}
                      </span>
                    </div>
                    
                    <button 
                      onClick={handleCheckout}
                      disabled={isLoading}
                      style={{
                        width: '100%',
                        background: isLoading ? '#d1d5db' : '#fbbf24',
                        color: '#ffffff',
                        padding: '1.125rem',
                        borderRadius: '12px',
                        border: 'none',
                        fontWeight: '700',
                        fontSize: '1.125rem',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        boxShadow: isLoading ? 'none' : '0 4px 14px rgba(251, 191, 36, 0.4)',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!isLoading) {
                          e.target.style.background = '#f59e0b';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 20px rgba(251, 191, 36, 0.5)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isLoading) {
                          e.target.style.background = '#fbbf24';
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 14px rgba(251, 191, 36, 0.4)';
                        }
                      }}
                    >
                      {isLoading ? 'Processing...' : `Checkout - $${total.toFixed(2)}`}
                    </button>
                  </div>
                </div>
              </div>
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

export default Cart;
