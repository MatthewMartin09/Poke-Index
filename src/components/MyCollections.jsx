import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import cartIcon from "../assets/cart.png";
import favoriteIcon from "../assets/favorite.png";
import UserDropdown from "./UserDropdown";
import './MyCollections.css';

const defaultBinders = [
  { name: 'Custom Binder', cards: [] },
  { name: 'Fire Binder', cards: [] },
  { name: 'Water Binder', cards: [] },
];

export default function MyCollections() {
  const { isLoggedIn } = useUser();
  const [binders, setBinders] = useState(defaultBinders);
  const [selectedBinder, setSelectedBinder] = useState(0);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardDetail, setCardDetail] = useState(null);
  const [newBinderName, setNewBinderName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Mock card data
  const MOCK_CARDS = [
    {
      id: 'xy7-54',
      name: 'Pikachu',
      images: {
        small: 'https://images.pokemontcg.io/xy7/54.png',
        large: 'https://images.pokemontcg.io/xy7/54_hires.png',
      },
      types: ['Lightning'],
      rarity: 'Common',
      set: { name: 'Ancient Origins' },
      hp: '60',
      supertype: 'Pokémon',
      artist: 'Mitsuhiro Arita',
    },
    {
      id: 'base1-4',
      name: 'Charizard',
      images: {
        small: 'https://images.pokemontcg.io/base1/4.png',
        large: 'https://images.pokemontcg.io/base1/4_hires.png',
      },
      types: ['Fire'],
      rarity: 'Rare Holo',
      set: { name: 'Base Set' },
      hp: '120',
      supertype: 'Pokémon',
      artist: 'Mitsuhiro Arita',
    },
  ];

  useEffect(() => {
    if (search.length > 2) {
      setLoading(true);
      setError('');
      const results = MOCK_CARDS.filter(card => 
        card.name.toLowerCase().includes(search.toLowerCase())
      );
      setTimeout(() => {
        setSearchResults(results);
        if (results.length === 0) {
          setError('No cards found.');
        }
        setLoading(false);
      }, 500);
    } else {
      setSearchResults([]);
      setError('');
    }
  }, [search]);

  const addBinder = () => {
    if (newBinderName.trim()) {
      setBinders([...binders, { name: newBinderName, cards: [] }]);
      setNewBinderName('');
    }
  };

  const addCardToBinder = card => {
    const updatedBinders = [...binders];
    if (!updatedBinders[selectedBinder].cards.find(c => c.id === card.id)) {
      updatedBinders[selectedBinder].cards.push(card);
      setBinders(updatedBinders);
    }
  };

  const removeCardFromBinder = cardId => {
    const updatedBinders = [...binders];
    updatedBinders[selectedBinder].cards = updatedBinders[selectedBinder].cards.filter(c => c.id !== cardId);
    setBinders(updatedBinders);
  };

  const fetchCardDetail = (id) => {
    setLoading(true);
    setError('');
    const card = MOCK_CARDS.find(card => card.id === id);
    setTimeout(() => {
      if (card) {
        setCardDetail(card);
      } else {
        setError('Card not found.');
      }
      setLoading(false);
    }, 300);
  };

  return (
    <>
      <header className="home-header">
        <div className="home-header-container">
          <div className="home-header-content">
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
              {isMenuOpen && (
                <div className="home-dropdown-menu">
                  <nav className="home-nav">
                    <Link to="/home" className="home-nav-item">Home</Link>
                    <Link to="/favorites" className="home-nav-item">Favorites</Link>
                    <Link to="/cart" className="home-nav-item">Cart</Link>
                    <Link to="/pokedex" className="home-nav-item">Pokedex</Link>
                    <Link to="/shop" className="home-nav-item">Shop</Link>
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
            <div className="home-logo-section">
              <img src={pokeindexLogo} alt="PokeIndex" className="home-logo" />
            </div>
            <nav className="home-desktop-nav">
              <Link to="/home" className="home-desktop-nav-item">Home</Link>
              <Link to="/pokedex" className="home-desktop-nav-item">Pokedex</Link>
              <Link to="/shop" className="home-desktop-nav-item">Shop</Link>
              <Link to="/collections" className="home-desktop-nav-item">My Collections</Link>
            </nav>
            <div className="home-desktop-actions">
              <Link to="/favorites" className="home-icon-btn" aria-label="Favorites">
                <img src={favoriteIcon} alt="Favorites" className="home-icon" />
              </Link>
              <Link to="/cart" className="home-icon-btn" aria-label="Cart">
                <img src={cartIcon} alt="Cart" className="home-icon" />
              </Link>
              {!isLoggedIn ? (
                <>
                  <Link to="/login" className="home-desktop-btn home-login-btn">
                    <span>Login</span>
                  </Link>
                  <Link to="/signup" className="home-desktop-btn home-signup-btn">
                    <span>Sign Up</span>
                  </Link>
                </>
              ) : (
                <UserDropdown />
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="my-collections-container">
        <h2 className="my-collections-title">
          Create <span style={{color: '#b0b0b0'}}>+</span>
        </h2>
        
        <div className="my-collections-filters" style={{display: 'flex', justifyContent: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px'}}>
          <button className="filter-btn selected">Type: Fire</button>
          <button className="filter-btn">Rarity +</button>
        </div>
        
        <div className="my-collections-main">
          <div className="my-collections-binders">
            <h3 className="my-collections-subtitle">Binders</h3>
            <ul className="my-collections-binder-list">
              {binders.map((binder, idx) => (
                <li key={binder.name}>
                  <button
                    className={`my-collections-binder-btn${selectedBinder === idx ? ' selected' : ''}`}
                    onClick={() => setSelectedBinder(idx)}
                  >
                    {binder.name} <span className="binder-count">({binder.cards.length})</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="my-collections-add-binder">
              <input
                type="text"
                className="add-binder-input"
                placeholder="New binder name"
                value={newBinderName}
                onChange={e => setNewBinderName(e.target.value)}
              />
              <button className="add-binder-btn" onClick={addBinder}>Add</button>
            </div>
          </div>

          <div className="my-collections-cards">
            <h3 className="my-collections-subtitle">Search Cards</h3>
            <input
              type="text"
              className="search-cards-input"
              placeholder="Search Pokémon cards..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {loading && <div className="loading">Loading...</div>}
            {error && !loading && <div className="error">{error}</div>}
            <div className="search-results">
              {!loading && !error && searchResults.length === 0 && search.length > 2 && (
                <div className="no-cards">No cards found.</div>
              )}
              {searchResults.map(card => (
                <div key={card.id} className="card-item">
                  <img
                    src={card.images?.small}
                    alt={card.name}
                    className="card-img"
                  />
                  <div className="card-name">{card.name}</div>
                  <button className="add-card-btn" onClick={() => addCardToBinder(card)}>
                    Add to Binder
                  </button>
                </div>
              ))}
            </div>
            <h3 className="my-collections-subtitle">Cards in {binders[selectedBinder].name}</h3>
            <div className="binder-cards">
              {binders[selectedBinder].cards.map(card => (
                <div key={card.id} className="binder-card-item">
                  <img
                    src={card.images?.small}
                    alt={card.name}
                    className="binder-card-img"
                  />
                  <div className="binder-card-name">{card.name}</div>
                  <button className="remove-card-btn" onClick={() => removeCardFromBinder(card.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {cardDetail && (
        <div className="card-detail-modal-bg">
          <div className="card-detail-modal">
            <button className="close-modal-btn" onClick={() => setCardDetail(null)}>&times;</button>
            <img
              src={cardDetail.images?.large || cardDetail.images?.small}
              alt={cardDetail.name}
              className="card-detail-img"
            />
            <div className="card-detail-name">{cardDetail.name}</div>
            <div className="card-detail-info"><span>Type:</span> {cardDetail.types?.join(', ') || 'N/A'}</div>
            <div className="card-detail-info"><span>Rarity:</span> {cardDetail.rarity || 'N/A'}</div>
            <div className="card-detail-info"><span>Set:</span> {cardDetail.set?.name || 'N/A'}</div>
            <div className="card-detail-info"><span>HP:</span> {cardDetail.hp || 'N/A'}</div>
            <div className="card-detail-info"><span>Artist:</span> {cardDetail.artist || 'N/A'}</div>
          </div>
        </div>
      )}
    </>
  );
}
