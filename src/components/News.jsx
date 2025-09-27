import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from "../contexts/UserContext";
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
    { id: 'all', name: 'All News', icon: '📰' },
    { id: 'releases', name: 'New Releases', icon: '🎉' },
    { id: 'tournaments', name: 'Tournaments', icon: '🏆' },
    { id: 'market', name: 'Market News', icon: '📈' },
    { id: 'games', name: 'Video Games', icon: '🎮' },
    { id: 'strategy', name: 'Strategy', icon: '🧠' },
    { id: 'collecting', name: 'Collecting', icon: '💎' }
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
    <div className="news-page">
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
                    <Link to="/news" className="home-nav-item">News</Link>

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

      {/* Page Header */}
      <div className="news-header">
        <div className="news-header-content">
          <h1 className="news-page-title">PokeNews</h1>
          <p className="news-page-subtitle">Stay updated with the latest Pokémon Trading Card Game news</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="news-main-content">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search news articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-200 font-medium ${
                selectedCategory === category.id 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-md'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} found
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${categories.find(cat => cat.id === selectedCategory)?.name}`}
          </p>
        </div>

        {/* News Grid */}
        {filteredNews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">📰</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No news articles found</h2>
            <p className="text-gray-600 mb-6">Try adjusting your search or category filters</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Show All News
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map(article => (
              <article key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/assets/pokeball-bg.png';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Category Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {categories.find(cat => cat.id === article.category)?.icon} {categories.find(cat => cat.id === article.category)?.name}
                    </span>
                  </div>
                  
                  {/* Trending Badge */}
                  {article.trending && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                        🔥 Trending
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center space-x-3 text-sm text-gray-500 mb-3">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(article.date)}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {article.author}
                    </span>
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {article.readTime}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {article.title}
                  </h2>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <button 
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                      onClick={() => {
                        alert('Full article would open here!');
                      }}
                    >
                      <span>Read More</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button 
                      className="text-gray-500 hover:text-blue-600 transition-colors duration-200 p-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`Check out this Pokemon TCG news: ${article.title}`);
                        alert('Article link copied to clipboard!');
                      }}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-4">Stay Updated with Pokemon TCG News</h3>
            <p className="text-purple-100 mb-6 text-lg">Get the latest news, deck guides, and market insights delivered to your inbox</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-white focus:outline-none"
              />
              <button className="bg-white text-purple-600 px-8 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors duration-200 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
            <p className="text-purple-200 text-sm mt-4">Join 10,000+ Pokemon TCG enthusiasts. Unsubscribe anytime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;
