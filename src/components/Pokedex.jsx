import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "../contexts/UserContext";
import pokeindexLogo from "../assets/pokeindex_logo.png";
import cartIcon from "../assets/cart.png";
import favoriteIcon from "../assets/favorite.png";
import UserDropdown from "./UserDropdown";
import './PokedexLoading.css';
import './PokedexPagination.css';
import './PokedexCards.css';

const Pokedex = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();
  const [pokemon, setPokemon] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedGeneration, setSelectedGeneration] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonPerPage] = useState(10);
  const [isMobileView, setIsMobileView] = useState(false);

  // Handle window resize for responsive pagination
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 480);
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Touch handlers for swipe navigation on mobile
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) > minSwipeDistance) {
      if (distance > 0 && currentPage < totalPages) {
        // Swipe left - next page
        handlePageChange(currentPage + 1);
      } else if (distance < 0 && currentPage > 1) {
        // Swipe right - previous page
        handlePageChange(currentPage - 1);
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Fetch Pokemon data from PokeAPI
  const fetchPokemonData = async (limit = 1010) => {
    try {
      setIsLoading(true);
      setLoadingProgress(0);
      
      // First, get the list of Pokemon
      const listResponse = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
      const listData = await listResponse.json();
      
      // Process Pokemon in batches to avoid overwhelming the API
      const batchSize = 50;
      const batches = [];
      for (let i = 0; i < listData.results.length; i += batchSize) {
        batches.push(listData.results.slice(i, i + batchSize));
      }
      
      const allPokemonData = [];
      
      for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
        const batch = batches[batchIndex];
        
        // Process batch in parallel
        const batchPromises = batch.map(async (pokemon) => {
          try {
            const detailResponse = await fetch(pokemon.url);
            const detailData = await detailResponse.json();
            
            // Fetch species data for description and generation
            const speciesResponse = await fetch(detailData.species.url);
            const speciesData = await speciesResponse.json();
            
            // Get English description
            const englishDescription = speciesData.flavor_text_entries.find(
              entry => entry.language.name === 'en'
            )?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
            
            // Calculate generation based on species data
            const generationUrl = speciesData.generation.url;
            const generationNumber = parseInt(generationUrl.split('/').slice(-2, -1)[0]);
            
            return {
              id: detailData.id,
              name: detailData.name.charAt(0).toUpperCase() + detailData.name.slice(1),
              types: detailData.types.map(type => 
                type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)
              ),
              generation: generationNumber,
              height: `${Math.floor(detailData.height / 3.048)}'${String(Math.round((detailData.height % 3.048) * 10)).padStart(2, '0')}"`,
              weight: `${(detailData.weight / 4.536).toFixed(1)} lbs`,
              abilities: detailData.abilities.map(ability => 
                ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1).replace('-', ' ')
              ),
              description: englishDescription,
              image: detailData.sprites.other['official-artwork'].front_default || detailData.sprites.front_default,
              stats: {
                hp: detailData.stats.find(stat => stat.stat.name === 'hp')?.base_stat || 0,
                attack: detailData.stats.find(stat => stat.stat.name === 'attack')?.base_stat || 0,
                defense: detailData.stats.find(stat => stat.stat.name === 'defense')?.base_stat || 0,
                speed: detailData.stats.find(stat => stat.stat.name === 'speed')?.base_stat || 0
              }
            };
          } catch (error) {
            console.error(`Error fetching data for ${pokemon.name}:`, error);
            return null; // Skip failed Pokemon
          }
        });
        
        const batchResults = await Promise.all(batchPromises);
        const validResults = batchResults.filter(result => result !== null);
        allPokemonData.push(...validResults);
        
        // Update loading progress
        const progress = ((batchIndex + 1) / batches.length) * 100;
        setLoadingProgress(Math.round(progress));
        
        // Add a small delay between batches to be respectful to the API
        if (batchIndex < batches.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      // Sort by ID to maintain proper order
      allPokemonData.sort((a, b) => a.id - b.id);
      
      setPokemon(allPokemonData);
      setFilteredPokemon(allPokemonData);
      
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
      // You could add fallback data here if needed
    } finally {
      setIsLoading(false);
      setLoadingProgress(0);
    }
  };

  const types = ['all', 'Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy'];
  const generations = ['all', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  useEffect(() => {
    // Fetch Pokemon data from API
    fetchPokemonData();
  }, []);

  useEffect(() => {
    let filtered = pokemon;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.types.some(type => type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(p => p.types.includes(selectedType));
    }

    // Filter by generation
    if (selectedGeneration !== 'all') {
      filtered = filtered.filter(p => p.generation === parseInt(selectedGeneration));
    }

    setFilteredPokemon(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedType, selectedGeneration, pokemon]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPokemon.length / pokemonPerPage);
  const startIndex = (currentPage - 1) * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;
  const currentPokemon = filteredPokemon.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    
    // Responsive max visible pages based on screen size
    const isMobile = window.innerWidth <= 480;
    const isTablet = window.innerWidth <= 768;
    
    let maxVisiblePages = 5;
    if (isMobile) maxVisiblePages = 3;
    else if (isTablet) maxVisiblePages = 4;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    if (currentPage > 1) {
      buttons.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          className="pagination-btn pagination-prev"
        >
          ← Previous
        </button>
      );
    }

    // First page button
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="pagination-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots1" className="pagination-dots">...</span>);
      }
    }

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      const isActive = currentPage === i;
      const shouldShowOnMobile = isMobile && (isActive || i === 1 || i === totalPages);
      
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`pagination-btn ${isActive ? 'active' : ''} ${shouldShowOnMobile ? 'show-mobile' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page button
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots2" className="pagination-dots">...</span>);
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="pagination-btn"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    if (currentPage < totalPages) {
      buttons.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          className="pagination-btn pagination-next"
        >
          Next →
        </button>
      );
    }

    return buttons;
  };

  const getTypeColor = (type) => {
    const colors = {
      Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Electric: '#F8D030',
      Grass: '#78C850', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
      Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
      Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Dark: '#705848',
      Steel: '#B8B8D0', Fairy: '#EE99AC'
    };
    return colors[type] || '#68A090';
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="pokeball-loader">
            <div className="pokeball">
              <div className="pokeball-top"></div>
              <div className="pokeball-bottom"></div>
              <div className="pokeball-center">
                <div className="pokeball-button"></div>
              </div>
            </div>
          </div>
          <h2 className="loading-title">Loading Pokemon data...</h2>
          <p className="loading-subtitle">Fetching Pokemon from all regions</p>
          {loadingProgress > 0 && (
            <div className="loading-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
              <p className="progress-text">{loadingProgress}% complete</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pokedex-page">
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
      
      <div className="pokedex-filters">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="filter-select"
          >
            {types.map(type => (
              <option key={type} value={type}>
                {type === 'all' ? 'All Types' : type}
              </option>
            ))}
          </select>

          <select 
            value={selectedGeneration} 
            onChange={(e) => setSelectedGeneration(e.target.value)}
            className="filter-select"
          >
            {generations.map(gen => (
              <option key={gen} value={gen}>
                {gen === 'all' ? 'All Generations' : `Gen ${gen}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pokemon-count">
        Showing {startIndex + 1}-{Math.min(endIndex, filteredPokemon.length)} of {filteredPokemon.length} Pokemon 
        {filteredPokemon.length !== pokemon.length && ` (filtered from ${pokemon.length} total)`}
      </div>

      {filteredPokemon.length === 0 ? (
        <div className="no-results">
          <h2>No Pokemon found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={`pokedex-content ${selectedPokemon ? 'has-selection' : ''}`}>
          <div className="pokemon-grid-container">
            <div 
              className="pokemon-grid"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}  
              onTouchEnd={handleTouchEnd}
            >
              {currentPokemon.map(poke => (
                <div 
                  key={poke.id} 
                  className={`pokemon-card ${selectedPokemon?.id === poke.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPokemon(poke)}
                >
                  <div className="pokemon-card-inner">
                    <div className="pokemon-image">
                      <img 
                        src={poke.image} 
                        alt={poke.name}
                        onError={(e) => {
                          e.target.src = '/assets/pokeball-bg.png';
                        }}
                      />
                    </div>
                    <div className="pokemon-info">
                      <span className="pokemon-number">#{String(poke.id).padStart(3, '0')}</span>
                      <h3 className="pokemon-name">{poke.name}</h3>
                      <div className="pokemon-types">
                        {poke.types.map(type => (
                          <span 
                            key={type} 
                            className="type-tag"
                            style={{ backgroundColor: getTypeColor(type) }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Side Panel for Pokemon Details */}
          <div className={`pokemon-details-panel ${selectedPokemon ? 'visible' : ''}`}>
            {selectedPokemon ? (
              <div className="pokemon-details">
                <div className="details-header">
                  <button 
                    className="close-details" 
                    onClick={() => setSelectedPokemon(null)}
                    aria-label="Close details"
                  >
                    ×
                  </button>
                  <div className="pokemon-hero">
                    <img 
                      src={selectedPokemon.image} 
                      alt={selectedPokemon.name}
                      className="hero-image"
                    />
                    <div className="hero-info">
                      <span className="hero-number">#{String(selectedPokemon.id).padStart(3, '0')}</span>
                      <h2 className="hero-name">{selectedPokemon.name}</h2>
                      <div className="hero-types">
                        {selectedPokemon.types.map(type => (
                          <span 
                            key={type} 
                            className="hero-type-tag"
                            style={{ backgroundColor: getTypeColor(type) }}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="details-content">
                  <div className="details-section">
                    <h3>About</h3>
                    <p className="pokemon-description">{selectedPokemon.description}</p>
                  </div>

                  <div className="details-section">
                    <h3>Physical Stats</h3>
                    <div className="physical-stats">
                      <div className="stat-item">
                        <span className="stat-label">Height</span>
                        <span className="stat-value">{selectedPokemon.height}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Weight</span>
                        <span className="stat-value">{selectedPokemon.weight}</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Generation</span>
                        <span className="stat-value">{selectedPokemon.generation}</span>
                      </div>
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Abilities</h3>
                    <div className="abilities">
                      {selectedPokemon.abilities.map((ability, index) => (
                        <span key={index} className="ability-tag">
                          {ability}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="details-section">
                    <h3>Base Stats</h3>
                    <div className="stats-grid">
                      {Object.entries(selectedPokemon.stats).map(([statName, value]) => (
                        <div key={statName} className="stat-row">
                          <span className="stat-name">{statName.toUpperCase()}</span>
                          <div className="stat-bar">
                            <div 
                              className="stat-fill"
                              style={{ width: `${(value / 200) * 100}%` }}
                            ></div>
                          </div>
                          <span className="stat-number">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection">
                <div className="no-selection-content">
                  <div className="pokeball-placeholder">⚪</div>
                  <h3>Select a Pokemon</h3>
                  <p>Click on any Pokemon card to view detailed information</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}



      {/* Pagination */}
      {filteredPokemon.length > pokemonPerPage && (
        <div className="pagination-container">
          {isMobileView && (
            <div className="mobile-swipe-hint">
              👈 Swipe to navigate pages 👉
            </div>
          )}
          <div className="pagination">
            {renderPaginationButtons()}
          </div>
          <div className="pagination-info">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default Pokedex;
