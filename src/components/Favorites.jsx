import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  useEffect(() => {
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
    alert(`${card.name} added to cart!`);
  };

  const filteredFavorites = favorites.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Back
        </button>
        <h1 className="page-title">My Favorite Cards</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {filteredFavorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-state">
            <img src="/assets/pokeball-bg.png" alt="Empty" className="empty-icon" />
            <h2>No Favorite Cards Yet</h2>
            <p>Start collecting your favorite Pokemon cards!</p>
            <button onClick={() => navigate('/shop')} className="browse-button">
              Browse Shop
            </button>
          </div>
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredFavorites.map(card => (
            <div key={card.id} className="favorite-card">
              <div className="card-image-container">
                <img src={card.image} alt={card.name} className="card-image" />
                <button 
                  onClick={() => removeFavorite(card.id)}
                  className="remove-favorite"
                  title="Remove from favorites"
                >
                  ❤️
                </button>
              </div>
              <div className="card-details">
                <h3 className="card-name">{card.name}</h3>
                <p className="card-type">{card.type}</p>
                <p className="card-rarity">{card.rarity}</p>
                <div className="card-set">
                  <span>{card.set}</span>
                  <span className="card-number">#{card.cardNumber}</span>
                </div>
                <div className="card-actions">
                  <span className="card-price">${card.price.toFixed(2)}</span>
                  <button 
                    onClick={() => addToCart(card)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="favorites-stats">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{favorites.length}</span>
            <span className="stat-label">Total Favorites</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              ${favorites.reduce((total, card) => total + card.price, 0).toFixed(2)}
            </span>
            <span className="stat-label">Collection Value</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
