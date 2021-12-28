import "./App.css";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Success from "./pages/Success"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user.currentUser);
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:category" element={<ProductList />} />
          <Route path="/products/search/" element={<ProductList />} />
          <Route path="/products/" element={<ProductList />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />}/>
          <Route path="/register" element={user ? <Navigate to="/"/> : < Register/>}/>
          <Route path="/login" element={user ? <Navigate to="/"/> : < Login/>}/>
          <Route path="/success" element={< Success/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
