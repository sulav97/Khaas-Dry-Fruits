import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUserCircle,
  FaChevronDown,
  FaShoppingCart,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { UserContext } from "../../context/UserContext";

export default function Navbar() {
  const { user, logout, loading } = useContext(UserContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const [navbarSearch, setNavbarSearch] = useState("");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownClick = (path) => {
    setDropdownOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleNavbarSearch = (e) => {
    e.preventDefault();
    if (navbarSearch.trim()) {
      navigate(`/allproducts?search=${encodeURIComponent(navbarSearch.trim())}`);
    } else {
      navigate("/allproducts");
    }
  };

  if (loading) return null;

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-4 py-4 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
  to="/"
  className="text-2xl font-bold text-gray-800 tracking-wide ml-14 hover:opacity-90 transition"
>
  Khaas <span className="text-red-500">DryFruits</span>
</Link>


        {/* Center: Navigation */}
        <nav className="hidden lg:flex gap-10 text-base font-medium text-gray-700">
          <Link to="/" className="hover:text-black transition">Home</Link>
          <Link to="/allproducts" className="hover:text-black transition">All</Link>
          <Link to="/about" className="hover:text-black transition">About Us</Link>
          <Link to="/contact" className="hover:text-black transition">Contact Us</Link>
        </nav>

        {/* Right: Search, Cart, User */}
        <div className="flex items-center gap-4 mr-10">
          {/* Search */}
          <form
            onSubmit={handleNavbarSearch}
            className="hidden sm:flex items-center border rounded-md px-3 py-1.5 bg-white"
          >
            <input
              type="text"
              placeholder="Search..."
              value={navbarSearch}
              onChange={e => setNavbarSearch(e.target.value)}
              className="bg-transparent focus:outline-none text-sm w-32 text-black"
            />
            <button type="submit" className="ml-2 text-gray-500 hover:text-black">
              <FaSearch />
            </button>
          </form>

          {/* Cart icon always visible */}
          {user && (
            <Link
              to="/cart"
              className="flex items-center gap-1 text-gray-700 hover:text-black transition"
              title="Cart"
            >
              <FaShoppingCart size={20} />
            </Link>
          )}

          {/* User dropdown or Sign In / Sign Up */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700"
              >
                <FaUserCircle size={20} />
                <span>{user.name}</span>
                <FaChevronDown size={12} />
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 bg-white border rounded-md shadow-lg w-44 text-sm font-medium text-gray-700 z-50">
                  <button
                    onClick={() => handleDropdownClick("/my-orders")}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                  >
                    Orders <FaClipboardList size={14} />
                  </button>
                  <button
                    onClick={() => handleDropdownClick("/profile")}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                  >
                    Profile <FaUserCircle size={14} />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-100"
                  >
                    Logout <FaSignOutAlt size={14} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                className="text-sm px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-sm px-4 py-2 border border-black rounded-md hover:bg-black hover:text-white transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
