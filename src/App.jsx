// App.jsx
import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import SignIn from "./components/SignIn";
import LogIn from "./components/LogIn";
import Cart from "./components/Cart";
// 👈 New
import Profile from "./components/Profile";
import GuestGuard from "./components/GuestGuard";
import AuthGuard from "./components/AuthGuard";
import Contact from "./components/Contact";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  const location = useLocation();
  const [showCart, setShowCart] = useState(false); // 👈 Global cart modal control

  return (
    <>
      {/* // Add this once in your root layout: */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        pauseOnHover={false}
        theme="light"
      />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Products />} />
          <Route
            path="/products/:id"
            element={
              <ProductDetails showCart={showCart} setShowCart={setShowCart} />
            }
          />
          <Route path="/cart" element={<Cart />} />{" "}
          {/* Optional full-page fallback */}
          <Route
            path="/login"
            element={
              <GuestGuard>
                <LogIn />
              </GuestGuard>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route
            path="/profile"
            element={
              <AuthGuard>
                <Profile />
              </AuthGuard>
            }
          />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
