import React from "react";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTwitter, FaYoutube } from "react-icons/fa";
import logo from "../../assets/nobglogo.png";

export default function Footer() {
  return (
    <footer className="bg-black text-white px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      {/* Top Section */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="space-y-4">
          <img src={logo} alt="Khaas Logo" className="w-48" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Premium hand-picked dry fruits delivered from the finest farms to your kitchen — the khaas way.
          </p>
          <div className="flex gap-4 mt-4 text-xl text-gray-500">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaInstagram /></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaTwitter /></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-white"><FaYoutube /></a>
          </div>
        </div>

        {/* Shop Links */}
        <div className="space-y-2 text-sm">
          <h3 className="uppercase text-gray-400 text-xs font-semibold mb-2">Shop</h3>
          <Link to="/all" className="block hover:text-gray-200">All Products</Link>
          <Link to="/" className="block hover:text-gray-200">Home</Link>
          <Link to="/cart" className="block hover:text-gray-200">Cart</Link>
        </div>

        {/* Company Info */}
        <div className="space-y-2 text-sm">
          <h3 className="uppercase text-gray-400 text-xs font-semibold mb-2">Company</h3>
          <Link to="/about" className="block hover:text-gray-200">About Us</Link>
          <Link to="/contact" className="block hover:text-gray-200">Contact</Link>
          <Link to="/faq" className="block hover:text-gray-200">FAQs</Link>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-4">
          <h3 className="uppercase text-gray-400 text-xs font-semibold">Join Our Newsletter</h3>
          <p className="text-sm text-gray-400">
            Be the first to know about new arrivals, exclusive offers, and storage tips.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded text-black w-full sm:w-auto"
            />
            <button
              type="submit"
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
            >
              Sign Me Up
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-12 pt-6 text-center text-xs text-gray-500 space-y-2">
        <div>© 2024 Khaas Dry Fruits. All Rights Reserved.</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/cookie-settings" className="hover:underline">Cookie Settings</Link>
          <Link to="/terms" className="hover:underline">Terms of Use</Link>
        </div>
      </div>
    </footer>
  );
}
