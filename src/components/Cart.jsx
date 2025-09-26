import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
      alert('Order placed successfully! Check your email for confirmation.');
      clearCart();
      setIsLoading(false);
      navigate('/home');
    }, 2000);
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = calculateTotal();

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1 className="page-title">Shopping Cart</h1>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="clear-cart-btn">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-state">
            <img src="/assets/cart.png" alt="Empty Cart" className="empty-cart-icon" />
            <h2>Your cart is empty</h2>
            <p>Add some Pokemon cards to get started!</p>
            <button onClick={() => navigate('/shop')} className="shop-button">
              Browse Shop
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img src={item.image || '/assets/pokeball-bg.png'} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-type">{item.type}</p>
                  <p className="item-rarity">{item.rarity}</p>
                  {item.set && (
                    <p className="item-set">{item.set} - #{item.cardNumber}</p>
                  )}
                </div>
                <div className="item-quantity">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="quantity-btn"
                  >
                    −
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>
                <div className="item-price">
                  <span className="unit-price">${item.price.toFixed(2)} each</span>
                  <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <button 
                  onClick={() => removeItem(item.id)}
                  className="remove-item-btn"
                  title="Remove item"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              <div className="summary-line">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {subtotal < 50 && (
                <p className="free-shipping-notice">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="summary-line total-line">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={handleCheckout}
                disabled={isLoading}
                className="checkout-btn"
              >
                {isLoading ? 'Processing...' : `Checkout - $${total.toFixed(2)}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
