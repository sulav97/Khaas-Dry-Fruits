import React, { useState, useEffect, useMemo } from "react";
import { Heart } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { getAllDryfruits } from "../../api/api";
import { Link, useLocation } from "react-router-dom";

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = useQuery();

  const search = query.get("search") || "";
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    setLoading(true);
    getAllDryfruits()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load products");
        setLoading(false);
      });
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.name)))];

  const categoryFiltered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.name === selectedCategory);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return categoryFiltered;
    const term = debouncedSearch.trim().toLowerCase();
    return categoryFiltered.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(term)) ||
        (p.keywords && p.keywords.toLowerCase().includes(term))
    );
  }, [categoryFiltered, debouncedSearch]);

  return (
    <div className="bg-white text-black px-4 md:px-16 py-10 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      <h1 className="text-3xl font-bold text-center mb-8">Explore All Products</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 border ${
              selectedCategory === cat
                ? "bg-black text-white scale-105"
                : "border-black text-black hover:bg-black hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-lg">Loading products...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, name, pricePerGram, stock, image } = product;
  const [weight, setWeight] = useState(100);
  const navigate = useNavigate();

  const imgSrc = image
    ? `http://localhost:5000/uploads/${image}`
    : "http://localhost:5000/uploads/placeholder.jpg";
  const price = Math.round(pricePerGram * weight);
  const originalPrice = Math.round(price * 1.02);
  const pricePerGramDisplay = pricePerGram.toFixed(2);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: _id,
      title: `${name} ${weight}g`,
      price: price,
      image: imgSrc,
      stock,
    });
    toast.success(`${name} (${weight}g) added to cart!`);
  };

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  return (
    <div
      className="block group focus:outline-none"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
    >
      <div
        className="relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all text-white text-center"
        style={{
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "440px",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Top Labels */}
        <div className="absolute top-2 left-2 bg-white text-black text-xs font-bold px-2 py-0.5 rounded z-10">
          PREMIUM
        </div>
        <div className="absolute top-2 right-2 bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full z-10">
          2% off
        </div>

        {/* Product Name (bottom center above info section) */}
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-10">
          <h3 className="text-lg font-bold text-white">{name}</h3>
        </div>

        {/* Bottom-aligned content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-4 z-10 flex flex-col">
          {/* Weight & Price Row */}
          <div className="flex justify-between items-end mb-3">
            {/* Weight Selector */}
            <div className="text-left">
              <label className="text-xs text-white mb-1 block">Weight</label>
              <select
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value))}
                onClick={(e) => e.stopPropagation()} // prevent navigation
                className="bg-white/10 border border-white text-white text-sm px-3 py-1 rounded w-30 backdrop-blur-sm appearance-none"
              >
                <option className="bg-black text-white" value={100}>100g</option>
                <option className="bg-black text-white" value={250}>250g</option>
                <option className="bg-black text-white" value={500}>500g</option>
                <option className="bg-black text-white" value={1000}>1kg</option>
              </select>
            </div>

            {/* Price & Rating */}
            <div className="text-right text-sm text-white">
              <span className="line-through text-gray-300 block text-xs">Rs {originalPrice}</span>
              <div className="flex items-center justify-end gap-1 text-sm">
                <span>4.9</span>
                <Heart size={14} className="text-white fill-white" />
              </div>
              <span className="text-lg font-bold block leading-tight">Rs {price}</span>
              <span className="text-xs text-gray-200">(Rs {pricePerGramDisplay}/g)</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className="w-full bg-black text-white text-sm py-2 px-4 rounded hover:bg-white hover:text-black transition"
          >
            🛒 {stock === 0 ? "Out of Stock" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
