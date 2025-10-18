import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Toast from './Toast';
import './MyCollections.css';
import pokeindexLogo from '../assets/pokeindex_logo.png';

const defaultBinders = [
  { name: 'Custom Binder', cards: [] },
  { name: 'Fire Binder', cards: [] },
  { name: 'Water Binder', cards: [] },
];

export default function MyCollections() {
  // Load binders from localStorage on initial mount
  const [binders, setBinders] = useState(() => {
    const saved = localStorage.getItem('pokemonBinders');
    return saved ? JSON.parse(saved) : defaultBinders;
  });
  const [selectedBinder, setSelectedBinder] = useState(0);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cardDetail, setCardDetail] = useState(null);
  const [newBinderName, setNewBinderName] = useState('');
  const [searchCache, setSearchCache] = useState({}); // Cache for search results
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // { idx, name }

  // Save binders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pokemonBinders', JSON.stringify(binders));
  }, [binders]);

  // Fetch Pokemon using reliable PokeAPI
  useEffect(() => {
    const currentSearch = search.toLowerCase().trim();
    
    // Empty search - clear results immediately
    if (search.length < 2) {
      setSearchResults([]);
      setError('');
      setLoading(false);
      return;
    }
    
    // Check cache FIRST - instant results!
    if (searchCache[currentSearch]) {
      setSearchResults(searchCache[currentSearch]);
      setLoading(false);
      setError('');
      return;
    }
    
    // Not cached - need to fetch from API
    const abortController = new AbortController();
    
    const fetchPokemon = async () => {
      setLoading(true);
      setError('');
      
      try {
        // First, search for Pokemon by name using PokeAPI (much faster!)
        const searchResponse = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${currentSearch.toLowerCase()}`,
          { signal: abortController.signal }
        );
        
        if (!searchResponse.ok) {
          // If exact match fails, try to get a list and filter
          const listResponse = await fetch(
            `https://pokeapi.co/api/v2/pokemon?limit=1000`,
            { signal: abortController.signal }
          );
          
          if (!listResponse.ok) {
            throw new Error('Unable to search Pokemon');
          }
          
          const listData = await listResponse.json();
          const matches = listData.results.filter(p => 
            p.name.includes(currentSearch.toLowerCase())
          ).slice(0, 12);
          
          if (matches.length === 0) {
            setSearchResults([]);
            setError(`No Pokemon found matching "${search}"`);
            setLoading(false);
            return;
          }
          
          // Fetch details for each match
          const pokemonDetails = await Promise.all(
            matches.map(async (pokemon) => {
              const detailResponse = await fetch(pokemon.url);
              const detail = await detailResponse.json();
              
              // Convert to card format
              return {
                id: `pokemon-${detail.id}`,
                name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
                images: {
                  small: detail.sprites.front_default || detail.sprites.other['official-artwork'].front_default,
                  large: detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default
                },
                types: detail.types.map(t => t.type.name),
                hp: detail.stats.find(s => s.stat.name === 'hp')?.base_stat || 'N/A',
                set: { name: 'PokéDex Collection' },
                rarity: detail.base_experience > 200 ? 'Rare' : 'Common',
                artist: 'Game Freak',
                pokedexNumber: detail.id
              };
            })
          );
          
          if (currentSearch === search.toLowerCase().trim()) {
            setSearchResults(pokemonDetails);
            setSearchCache(prev => ({
              ...prev,
              [currentSearch]: pokemonDetails
            }));
          }
        } else {
          // Exact match found
          const detail = await searchResponse.json();
          
          const pokemonCard = {
            id: `pokemon-${detail.id}`,
            name: detail.name.charAt(0).toUpperCase() + detail.name.slice(1),
            images: {
              small: detail.sprites.front_default || detail.sprites.other['official-artwork'].front_default,
              large: detail.sprites.other['official-artwork'].front_default || detail.sprites.front_default
            },
            types: detail.types.map(t => t.type.name),
            hp: detail.stats.find(s => s.stat.name === 'hp')?.base_stat || 'N/A',
            set: { name: 'PokéDex Collection' },
            rarity: detail.base_experience > 200 ? 'Rare' : 'Common',
            artist: 'Game Freak',
            pokedexNumber: detail.id
          };
          
          if (currentSearch === search.toLowerCase().trim()) {
            setSearchResults([pokemonCard]);
            setSearchCache(prev => ({
              ...prev,
              [currentSearch]: [pokemonCard]
            }));
          }
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        
        if (currentSearch === search.toLowerCase().trim()) {
          console.error('Error fetching Pokemon:', err);
          setError(err.message || 'Failed to fetch Pokemon. Please try again.');
          setSearchResults([]);
        }
      } finally {
        if (currentSearch === search.toLowerCase().trim()) {
          setLoading(false);
        }
      }
    };

    // Fast debounce - 300ms
    const timeoutId = setTimeout(() => {
      fetchPokemon();
    }, 300);

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [search]); // Only depend on search term

  const addBinder = () => {
    if (newBinderName.trim()) {
      setBinders([...binders, { name: newBinderName, cards: [] }]);
      setNewBinderName('');
    }
  };

  const deleteBinder = (idx) => {
    if (binders.length <= 1) {
      setToast({ message: 'You must have at least one binder', type: 'error' });
      return;
    }
    
    setConfirmDelete({ idx, name: binders[idx].name });
  };

  const confirmDeleteBinder = () => {
    const { idx, name } = confirmDelete;
    const updatedBinders = binders.filter((_, i) => i !== idx);
    setBinders(updatedBinders);
    
    // Adjust selected binder if necessary
    if (selectedBinder >= updatedBinders.length) {
      setSelectedBinder(updatedBinders.length - 1);
    } else if (selectedBinder === idx && idx > 0) {
      setSelectedBinder(idx - 1);
    }
    
    setToast({ message: `"${name}" deleted successfully`, type: 'success' });
    setConfirmDelete(null);
  };

  const addCardToBinder = card => {
    const updatedBinders = [...binders];
    if (!updatedBinders[selectedBinder].cards.find(c => c.id === card.id)) {
      updatedBinders[selectedBinder].cards.push(card);
      setBinders(updatedBinders);
      setToast({ message: `${card.name} added to ${binders[selectedBinder].name}`, type: 'success' });
    } else {
      setToast({ message: `${card.name} is already in this binder`, type: 'info' });
    }
  };

  const removeCardFromBinder = cardId => {
    const updatedBinders = [...binders];
    updatedBinders[selectedBinder].cards = updatedBinders[selectedBinder].cards.filter(c => c.id !== cardId);
    setBinders(updatedBinders);
  };

  const fetchCardDetail = async (cardData) => {
    // Since we already have the card data, just set it directly
    setCardDetail(cardData);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Header />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', paddingTop: '80px', paddingBottom: '2rem', minHeight: 'calc(100vh - 80px)', background: '#ffffff' }}>
        {/* Top Bar with Binders Tabs */}
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {binders.map((binder, idx) => (
              <button
                key={binder.name}
                className={selectedBinder === idx ? 'binder-tab active' : 'binder-tab'}
                onClick={() => setSelectedBinder(idx)}
              >
                <span className="binder-tab-name">{binder.name}</span>
                <span className="binder-tab-count">{binder.cards.length}</span>
                {binders.length > 1 && (
                  <span 
                    className="delete-binder-btn" 
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBinder(idx);
                    }}
                    title="Delete binder"
                  >
                    ×
                  </span>
                )}
              </button>
            ))}
            <div className="add-binder-inline">
              <input
                type="text"
                className="add-binder-input-inline"
                placeholder="+ New Binder"
                value={newBinderName}
                onChange={e => setNewBinderName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addBinder()}
              />
            </div>
          </div>
        </div>

        <div className="my-collections-main">
          {/* Search Section */}
          <div className="my-collections-search">
            <div className="search-input-wrapper">
              <input
                type="text"
                className="search-cards-input"
                placeholder="Search Pokémon (e.g., pikachu, charizard)"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearch('')}
                >
                  ×
                </button>
              )}
            </div>
            
            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Searching cards...</p>
              </div>
            )}
            
            {error && !loading && (
              <div className="error-state">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}
            
            {!loading && searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map(card => (
                  <div key={card.id} className="minimal-card" onClick={() => fetchCardDetail(card)}>
                    <div className="minimal-card-header">
                      <span className="minimal-card-name">{card.name}</span>
                      <span className="minimal-card-hp">{card.hp} HP</span>
                    </div>
                    
                    <div className="minimal-card-image">
                      <img
                        src={card.images?.small}
                        alt={card.name}
                      />
                    </div>
                    
                    <div className="minimal-card-footer">
                      <div className="minimal-card-types">
                        {card.types?.map((type, idx) => (
                          <span key={idx} className={`minimal-type ${type}`}>
                            {type}
                          </span>
                        ))}
                      </div>
                      <button 
                        className="minimal-add-btn" 
                        onClick={(e) => {
                          e.stopPropagation();
                          addCardToBinder(card);
                        }}
                        title="Add to binder"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && !error && searchResults.length === 0 && search.length > 1 && (
              <div className="no-results">
                <p>No Pokémon found matching "{search}"</p>
                <small>Check the spelling and try again</small>
              </div>
            )}
            
            {search.length < 2 && (
              <div className="search-prompt">
                <p>Start typing to search for Pokémon</p>
                <small>Try: pikachu, charizard, blastoise, mewtwo, eevee</small>
              </div>
            )}
          </div>

          {/* Binder Cards Display */}
          <div className="my-collections-binder-display">
            <div className="binder-header-bar">
              <h3>{binders[selectedBinder].name}</h3>
              <span className="binder-count-badge">
                {binders[selectedBinder].cards.length} cards
              </span>
            </div>
            
            {binders[selectedBinder].cards.length === 0 ? (
              <div className="empty-binder">
                <p>This binder is empty</p>
                <small>Search and add cards to start your collection</small>
              </div>
            ) : (
              <div className="binder-cards-grid">
                {binders[selectedBinder].cards.map(card => (
                  <div key={card.id} className="minimal-card">
                    <button 
                      className="remove-card-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCardFromBinder(card.id);
                      }}
                      title="Remove from binder"
                    >
                      ×
                    </button>
                    
                    <div onClick={() => fetchCardDetail(card)} style={{ cursor: 'pointer' }}>
                      <div className="minimal-card-header">
                        <span className="minimal-card-name">{card.name}</span>
                        <span className="minimal-card-hp">{card.hp} HP</span>
                      </div>
                      
                      <div className="minimal-card-image">
                        <img
                          src={card.images?.small}
                          alt={card.name}
                        />
                      </div>
                      
                      <div className="minimal-card-footer">
                        <div className="minimal-card-types">
                          {card.types?.map((type, idx) => (
                            <span key={idx} className={`minimal-type ${type}`}>
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {cardDetail && (
        <div className="minimal-modal-overlay" onClick={() => setCardDetail(null)}>
          <div className="minimal-modal" onClick={(e) => e.stopPropagation()}>
            <button className="minimal-close-btn" onClick={() => setCardDetail(null)}>×</button>
            
            <div className="minimal-modal-image">
              <img
                src={cardDetail.images?.large || cardDetail.images?.small}
                alt={cardDetail.name}
              />
            </div>
            
            <div className="minimal-modal-content">
              <h2 className="minimal-modal-title">{cardDetail.name}</h2>
              
              <div className="minimal-stats">
                <div className="minimal-stat">
                  <span className="minimal-stat-label">Type</span>
                  <div className="minimal-stat-types">
                    {cardDetail.types?.map((type, idx) => (
                      <span key={idx} className={`minimal-type ${type}`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="minimal-stat">
                  <span className="minimal-stat-label">HP</span>
                  <span className="minimal-stat-value">{cardDetail.hp || 'N/A'}</span>
                </div>
                
                <div className="minimal-stat">
                  <span className="minimal-stat-label">Pokédex</span>
                  <span className="minimal-stat-value">#{cardDetail.pokedexNumber}</span>
                </div>
                
                <div className="minimal-stat">
                  <span className="minimal-stat-label">Rarity</span>
                  <span className="minimal-stat-value">{cardDetail.rarity || 'Common'}</span>
                </div>
              </div>
              
              <button 
                className="minimal-modal-add-btn"
                onClick={() => {
                  addCardToBinder(cardDetail);
                  setCardDetail(null);
                }}
              >
                Add to {binders[selectedBinder].name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Deleting Binder */}
      {confirmDelete && (
        <div className="minimal-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-delete-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', color: '#1f2937' }}>
              Delete "{confirmDelete.name}" and all its cards?
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#6b7280', fontSize: '0.95rem' }}>
              This action cannot be undone. All cards in this binder will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteBinder}
                style={{
                  padding: '0.625rem 1.25rem',
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500',
                  color: 'white',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#dc2626'}
                onMouseLeave={(e) => e.target.style.background = '#ef4444'}
              >
                Delete
              </button>
            </div>
          </div>
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
    </>
  );
}
