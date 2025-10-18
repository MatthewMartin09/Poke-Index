import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './Header';
import Toast from './Toast';
import './Shop.css';
import pokemonItemImg from '../assets/pokemonitem.jpg';
import pokeindexLogo from '../assets/pokeindex_logo.png';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Mock product data for Pokemon TCG packs
  const mockProducts = [
    {
      id: 1,
      name: 'Base Set Booster Pack',
      category: 'booster-packs',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Original Pokemon Base Set booster pack. Contains 11 cards including rare holographic cards.',
      inStock: 5,
      rarity: 'Vintage',
      released: '1998-10-20',
      sold: 1215,
      rating: 4.8
    },
    {
      id: 2,
      name: 'Jungle Expansion Pack',
      category: 'booster-packs',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'First expansion set featuring Pokemon from the jungle. Includes powerful grass-type Pokemon.',
      inStock: 8,
      rarity: 'Vintage',
      released: '1999-06-16',
      sold: 2804,
      rating: 4.9
    },
    {
      id: 3,
      name: 'Fossil Booster Pack',
      category: 'booster-packs',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Discover ancient Pokemon fossils in this classic expansion set.',
      inStock: 12,
      rarity: 'Vintage',
      released: '1999-10-10',
      sold: 531,
      rating: 4.7
    },
    {
      id: 4,
      name: 'Team Rocket Pack',
      category: 'booster-packs',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Dark Pokemon from Team Rocket! Features evil versions of classic Pokemon.',
      inStock: 15,
      rarity: 'Vintage',
      released: '2000-04-24',
      sold: 944,
      rating: 4.6
    },
    {
      id: 5,
      name: 'Charizard Single Card',
      category: 'single-cards',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Shadowless Base Set Charizard in near mint condition. The most iconic Pokemon card.',
      inStock: 2,
      rarity: 'Ultra Rare',
      released: '1998-10-20',
      sold: 156,
      rating: 5.0
    },
    {
      id: 6,
      name: 'Blastoise Holo Rare',
      category: 'single-cards',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Base Set Blastoise holographic card in excellent condition.',
      inStock: 4,
      rarity: 'Rare Holo',
      released: '1998-10-20',
      sold: 328,
      rating: 4.9
    },
    {
      id: 7,
      name: 'Pokemon TCG Starter Deck',
      category: 'theme-decks',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Complete starter deck perfect for new players. Includes energy cards and instructions.',
      inStock: 25,
      rarity: 'Common',
      released: '2023-01-15',
      sold: 3456,
      rating: 4.5
    },
    {
      id: 8,
      name: 'Elite Trainer Box',
      category: 'accessories',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Complete training kit with booster packs, dice, and premium card sleeves.',
      inStock: 18,
      rarity: 'Special',
      released: '2023-06-10',
      sold: 1872,
      rating: 4.8
    },
        {
      id: 9,
      name: 'Elite Trainer Box',
      category: 'accessories',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Complete training kit with booster packs, dice, and premium card sleeves.',
      inStock: 18,
      rarity: 'Special',
      released: '2023-06-10',
      sold: 1872,
      rating: 4.8
    },
        {
      id: 10,
      name: 'Elite Trainer Box',
      category: 'accessories',
      price: 800,
      originalPrice: 1000,
      image: pokemonItemImg,
      description: 'Complete training kit with booster packs, dice, and premium card sleeves.',
      inStock: 18,
      rarity: 'Special',
      released: '2023-06-10',
      sold: 1872,
      rating: 4.8
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'booster-packs', name: 'Booster Packs' },
    { id: 'single-cards', name: 'Single Cards' },
    { id: 'theme-decks', name: 'Theme Decks' },
    { id: 'accessories', name: 'Accessories' }
  ];

  const sortOptions = [
    { id: 'name', name: 'Name A-Z' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest First' },
    { id: 'rarity', name: 'Rarity' }
  ];

  useEffect(() => {
    setProducts(mockProducts);
    // Load cart from localStorage
    const savedCart = localStorage.getItem('pokemonCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const filteredAndSortedProducts = () => {
    let filtered = selectedCategory === 'all' 
      ? products 
      : products.filter(product => product.category === selectedCategory);

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.released) - new Date(a.released);
        case 'rarity':
          return a.rarity.localeCompare(b.rarity);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const addToCart = (product) => {
    const currentCart = [...cart];
    const existingItem = currentCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }
    
    setCart(currentCart);
    localStorage.setItem('pokemonCart', JSON.stringify(currentCart));
    
    // Dispatch a custom event to notify the header to update
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show toast notification
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  const getRarityColor = (rarity) => {
    const colors = {
      'Common': '#6B7280',
      'Rare Holo': '#3B82F6',
      'Ultra Rare': '#8B5CF6',
      'Vintage': '#F59E0B',
      'Special': '#EF4444'
    };
    return colors[rarity] || '#6B7280';
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

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
      <div className="shop-page">
        <div className="shop-header">
          <div className="search-filter-container">
            <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search for Pokemon cards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filters">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

      <div className="products-count">
        Showing {filteredAndSortedProducts().length} products
      </div>

      <div className="products-grid">
        {filteredAndSortedProducts().map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img 
                src={product.image} 
                alt={product.name}
                className="product-image"
                onError={(e) => {
                  e.target.src = '/assets/pokeball-bg.png';
                }}
              />
              {product.originalPrice > product.price && (
                <div className="discount-badge">
                  -{calculateDiscount(product.originalPrice, product.price)}%
                </div>
              )}
              <div 
                className="rarity-badge"
                style={{ backgroundColor: getRarityColor(product.rarity) }}
              >
                {product.rarity}
              </div>
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              <div className="product-pricing">
                <span className="current-price">₱{product.price.toLocaleString('en-PH')}</span>
                {product.originalPrice > product.price && (
                  <span className="original-price">₱{product.originalPrice.toLocaleString('en-PH')}</span>
                )}
              </div>

              <div className="product-meta">
                <div className="product-rating">
                  <span className="stars">⭐</span>
                  <span>{product.rating}</span>
                </div>
                <div className="product-sales">
                  <span>{product.sold.toLocaleString()} sold</span>
                </div>
              </div>

              <p className="product-description">{product.description}</p>

              <div className="product-stock">
                {product.inStock > 0 ? (
                  <span className="in-stock">
                    {product.inStock} in stock
                  </span>
                ) : (
                  <span className="out-of-stock">Out of stock</span>
                )}
              </div>

              <div className="product-actions">
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.inStock === 0}
                  className="add-to-cart-button"
                >
                  {product.inStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button 
                  className="wishlist-button"
                  onClick={() => {
                    // Add to favorites functionality
                    const favorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
                    if (!favorites.find(fav => fav.id === product.id)) {
                      favorites.push(product);
                      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
                      setToast({ message: 'Added to favorites!', type: 'success' });
                    } else {
                      setToast({ message: 'Already in favorites!', type: 'info' });
                    }
                  }}
                >
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedProducts().length === 0 && (
        <div className="no-products">
          <h2>No products found</h2>
          <p>Try adjusting your filters or check back later for new arrivals!</p>
        </div>
      )}

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
    </>
  );
};

export default Shop;
