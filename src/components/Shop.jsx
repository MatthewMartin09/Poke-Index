import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Shop = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);

  // Mock product data for Pokemon TCG packs
  const mockProducts = [
    {
      id: 1,
      name: 'Base Set Booster Pack',
      category: 'booster-packs',
      price: 499.99,
      originalPrice: 599.99,
      image: '/assets/Pack1.png',
      description: 'Original Pokemon Base Set booster pack. Contains 11 cards including rare holographic cards.',
      inStock: 5,
      rarity: 'Vintage',
      released: '1998-10-20'
    },
    {
      id: 2,
      name: 'Jungle Expansion Pack',
      category: 'booster-packs',
      price: 299.99,
      originalPrice: 349.99,
      image: '/assets/Pack2.png',
      description: 'First expansion set featuring Pokemon from the jungle. Includes powerful grass-type Pokemon.',
      inStock: 8,
      rarity: 'Vintage',
      released: '1999-06-16'
    },
    {
      id: 3,
      name: 'Fossil Booster Pack',
      category: 'booster-packs',
      price: 279.99,
      originalPrice: 319.99,
      image: '/assets/Pack3.png',
      description: 'Discover ancient Pokemon fossils in this classic expansion set.',
      inStock: 12,
      rarity: 'Vintage',
      released: '1999-10-10'
    },
    {
      id: 4,
      name: 'Team Rocket Pack',
      category: 'booster-packs',
      price: 199.99,
      originalPrice: 229.99,
      image: '/assets/Pack4.png',
      description: 'Dark Pokemon from Team Rocket! Features evil versions of classic Pokemon.',
      inStock: 15,
      rarity: 'Vintage',
      released: '2000-04-24'
    },
    {
      id: 5,
      name: 'Charizard Single Card',
      category: 'single-cards',
      price: 1299.99,
      originalPrice: 1499.99,
      image: '/assets/Ppack1.png',
      description: 'Shadowless Base Set Charizard in near mint condition. The most iconic Pokemon card.',
      inStock: 2,
      rarity: 'Ultra Rare',
      released: '1998-10-20'
    },
    {
      id: 6,
      name: 'Blastoise Holo Rare',
      category: 'single-cards',
      price: 899.99,
      originalPrice: 999.99,
      image: '/assets/Ppack2.png',
      description: 'Base Set Blastoise holographic card in excellent condition.',
      inStock: 4,
      rarity: 'Rare Holo',
      released: '1998-10-20'
    },
    {
      id: 7,
      name: 'Pokemon TCG Starter Deck',
      category: 'theme-decks',
      price: 89.99,
      originalPrice: 99.99,
      image: '/assets/Ppack3.png',
      description: 'Complete starter deck perfect for new players. Includes energy cards and instructions.',
      inStock: 25,
      rarity: 'Common',
      released: '2023-01-15'
    },
    {
      id: 8,
      name: 'Elite Trainer Box',
      category: 'accessories',
      price: 149.99,
      originalPrice: 169.99,
      image: '/assets/Ppack4.png',
      description: 'Complete training kit with booster packs, dice, and premium card sleeves.',
      inStock: 18,
      rarity: 'Special',
      released: '2023-06-10'
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
    
    // Show success message
    alert(`${product.name} added to cart!`);
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
    <div className="shop-page">
      <div className="shop-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1 className="page-title">Pokemon Card Shop</h1>
        <p className="page-subtitle">Discover rare and vintage Pokemon trading cards</p>
        <button 
          onClick={() => navigate('/cart')} 
          className="cart-button"
        >
          🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </button>
      </div>

      <div className="shop-filters">
        <div className="filter-section">
          <label>Category:</label>
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
        </div>

        <div className="filter-section">
          <label>Sort by:</label>
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
              <p className="product-description">{product.description}</p>
              
              <div className="product-pricing">
                <span className="current-price">${product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>

              <div className="product-stock">
                {product.inStock > 0 ? (
                  <span className="in-stock">
                    ✅ {product.inStock} in stock
                  </span>
                ) : (
                  <span className="out-of-stock">❌ Out of stock</span>
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
                      alert('Added to favorites!');
                    } else {
                      alert('Already in favorites!');
                    }
                  }}
                >
                  ❤️
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

      <div className="shop-footer">
        <div className="shop-info">
          <h3>Why Choose Our Shop?</h3>
          <div className="info-grid">
            <div className="info-item">
              <h4>🔍 Authentic Cards</h4>
              <p>All cards are verified for authenticity</p>
            </div>
            <div className="info-item">
              <h4>📦 Fast Shipping</h4>
              <p>Orders shipped within 24 hours</p>
            </div>
            <div className="info-item">
              <h4>💯 Money Back Guarantee</h4>
              <p>30-day return policy on all items</p>
            </div>
            <div className="info-item">
              <h4>🏆 Expert Grading</h4>
              <p>Professional card condition assessment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
