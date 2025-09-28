import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import LandingPage from "./components/LandingPage";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./components/Home";
import Pokedex from "./components/Pokedex";
import Shop from "./components/Shop";
import Favorites from "./components/Favorites";
import Cart from "./components/Cart";
import News from "./components/News";
import MyCollections from "./components/MyCollections";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <BrowserRouter basename="/Poke-Index">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/news" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/collections" element={<MyCollections />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;