import React from "react";
import {
  ShoppingCartOutlined,
  UserOutlined,
  MessageOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { ContextCart } from "./ContextCart";
import { SearchContext } from "./SearchContext";
import { ThemeContext } from "./ThemeContext";

export default function NavBar({ onCartClick }) {
  const { user, totalQuantity } = useContext(ContextCart);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const { selectedCategories, setSelectedCategories } =
    useContext(SearchContext);

  //sidecart
  const location = useLocation();
  const isProductPage = /^\/products\/\d+$/.test(location.pathname);

  //Theme
  const { theme, setTheme } = useContext(ThemeContext);

  // Local state for search input (user typing)
  const [inputValue, setInputValue] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-base-100 border-b border-base-200">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 flex-shrink-0 min-w-0">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img
              className="h-8 w-8 rounded-full object-cover"
              src="/Daco_4160577.png"
              alt="logo"
            />
            <span className="text-primary font-bold text-xl">Brand</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-6 border border-primary rounded-md overflow-hidden bg-base-100">
          <input
            type="text"
            placeholder="Search product title..."
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              if (value.trim() === "") setSearchQuery("");
            }}
            className="flex-3 px-3 py-2 text-sm input input-bordered input-sm rounded-none"
          />

          <select
            value={selectedCategories[0] || ""}
            onChange={(e) => {
              const value = e.target.value.toLowerCase();
              setSelectedCategories(value === "" ? [] : [value]);
            }}
            className="flex-1 select select-bordered select-sm rounded-none"
          >
            <option value="">All category</option>
            <option value="groceries">Groceries</option>
            <option value="laptops">Laptops</option>
            <option value="beauty">Beauty</option>
          </select>

          <button
            className="btn btn-primary btn-sm rounded-none"
            onClick={() => setSearchQuery(inputValue.trim().toLowerCase())}
          >
            Search
          </button>
        </div>

        <div className="md:flex md:items-center md:gap-12">
          <nav aria-label="Global" className="hidden md:block">
            <div className="flex items-center gap-6 text-base-content text-sm">
              <Link
                to={user ? "/Profile" : "/LogIn"}
                className="flex flex-col items-center hover:text-primary"
              >
                <UserOutlined style={{ fontSize: "20px" }} />
                <span className="text-xs">{user ? "Profile" : "Login"}</span>
              </Link>

              <Link
                to={"/contact"}
                className="flex flex-col items-center hover:text-primary"
              >
                <MessageOutlined style={{ fontSize: "20px" }} />
                <span className="text-xs">Message</span>
              </Link>

              <div className="flex flex-col items-center hover:text-primary">
                <HeartOutlined style={{ fontSize: "20px" }} />
                <span className="text-xs">Orders</span>
              </div>
              {isProductPage ? (
                // 👉 On product page — open side cart
                <div
                  onClick={onCartClick}
                  className="relative flex flex-col items-center hover:text-primary cursor-pointer"
                >
                  <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                  <span className="text-xs">My cart</span>
                  {user && totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-0 bg-error text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </div>
              ) : (
                // 👉 On other pages — navigate to cart
                <Link
                  to="/cart"
                  className="relative flex flex-col items-center hover:text-primary"
                >
                  <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                  <span className="text-xs">My cart</span>
                  {user && totalQuantity > 0 && (
                    <span className="absolute -top-1 -right-0 bg-error text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              )}

              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-sm m-1">
                  Theme
                  <svg
                    width="12px"
                    height="12px"
                    className="ml-1 inline-block h-2 w-2 fill-current opacity-60"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2048 2048"
                  >
                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content bg-base-300 rounded-box z-[99] w-52 p-2 shadow-2xl"
                >
                  {[
                    "light",
                    "dark",
                    "cupcake",
                    "bumblebee",
                    "emerald",
                    "synthwave",
                    "halloween",
                    "forest",
                    "dracula",
                    "valentine",
                    "lofi",
                    "pastel",
                    "fantasy",
                    "wireframe",
                    "black",
                    "luxury",
                  ].map((themeOption) => (
                    <li key={themeOption}>
                      <label
                        className={`w-full btn btn-sm btn-block justify-start cursor-pointer ${
                          theme === themeOption
                            ? "bg-primary text-primary-content"
                            : "btn-ghost"
                        }`}
                      >
                        <input
                          type="radio"
                          name="theme-dropdown"
                          className="hidden"
                          aria-label={
                            themeOption[0].toUpperCase() + themeOption.slice(1)
                          }
                          value={themeOption}
                          checked={theme === themeOption}
                          onChange={(e) => setTheme(e.target.value)}
                        />
                        {themeOption[0].toUpperCase() + themeOption.slice(1)}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </nav>

          <div className="block md:hidden relative ml-2 bg-base-300">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn btn-sm btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden absolute left-4 top-14 w-[calc(100%-2rem)] bg-base-100 rounded-lg shadow-xl p-4 z-50 space-y-4 animate-slide-down transition">
          <div className="flex flex-col items-center w-full gap-2 px-2">
            <input
              type="text"
              placeholder="Search product title..."
              value={inputValue}
              onChange={(e) => {
                const value = e.target.value;
                setInputValue(value);
                if (value.trim() === "") setSearchQuery("");
              }}
              className="input input-bordered input-sm w-full"
            />
            <select
              value={selectedCategories[0] || ""}
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setSelectedCategories(value === "" ? [] : [value]);
              }}
              className="select select-bordered select-sm w-full"
            >
              <option value="">All category</option>
              <option value="groceries">Groceries</option>
              <option value="laptops">Laptops</option>
              <option value="beauty">Beauty</option>
            </select>
            <button
              className="btn btn-primary btn-sm w-full"
              onClick={() => setSearchQuery(inputValue.trim().toLowerCase())}
            >
              Search
            </button>
            <Link
              to={user ? "/Profile" : "/LogIn"}
              className="flex items-center gap-2 hover:text-primary"
            >
              <UserOutlined />
              {user ? "Profile" : "Login"}
            </Link>
            <div className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <MessageOutlined />
              Message
            </div>
            <div className="flex items-center gap-2 hover:text-primary cursor-pointer">
              <HeartOutlined />
              Orders
            </div>

            {/* Link to full cart page - always available */}
            <div
              onClick={() => {
                if (isProductPage && onCartClick) {
                  onCartClick();
                } else {
                  // fallback for non-product pages
                  window.location.href = "/cart";
                }
              }}
              className="flex items-center gap-2 hover:text-primary cursor-pointer"
            >
              <ShoppingCartOutlined />
              <span className="text-xs">Cart: {totalQuantity}</span>
            </div>

            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-sm m-1">
                Theme
                <svg
                  width="12px"
                  height="12px"
                  className="ml-1 inline-block h-2 w-2 fill-current opacity-60"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 2048 2048"
                >
                  <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content bg-base-300 rounded-box z-[99] w-52 p-2 shadow-2xl"
              >
                {[
                  "light",
                  "dark",
                  "cupcake",
                  "bumblebee",
                  "emerald",
                  "synthwave",
                  "halloween",
                  "forest",
                  "dracula",
                  "valentine",
                  "lofi",
                  "pastel",
                  "fantasy",
                  "wireframe",
                  "black",
                  "luxury",
                ].map((themeOption) => (
                  <li key={themeOption}>
                    <input
                      type="radio"
                      name="theme-dropdown"
                      className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                      aria-label={
                        themeOption[0].toUpperCase() + themeOption.slice(1)
                      }
                      value={themeOption}
                      checked={theme === themeOption}
                      onChange={(e) => setTheme(e.target.value)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
