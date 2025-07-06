import React, { useState, useEffect, useMemo } from "react";
import { ShoppingCart, Heart } from "lucide-react";
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
  const location = useLocation();
  const query = useQuery();

  // Read search query from URL
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

  // Generate categories from backend data
  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.name)))
  ];

  // Filter by category first
  const categoryFiltered = selectedCategory === "All"
    ? products
    : products.filter((p) => p.name === selectedCategory);

  // Then filter by search
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

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, name, pricePerGram, image, stock } = product;

  const imgSrc = image ? `http://localhost:5000/uploads/${image}` : "http://localhost:5000/uploads/placeholder.jpg";

  const defaultWeight = 100;
  const finalPrice = Math.round((pricePerGram || 0) * defaultWeight);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart({ id: _id, title: name, price: finalPrice, image: imgSrc, stock, weight: defaultWeight, pricePerGram });
    toast.success(`${name} added to cart!`);
  };

  return (
    <Link to={`/product/${_id}`} className="block group focus:outline-none">
      <div className="relative bg-white rounded-xl border border-gray-300 shadow hover:shadow-lg transition p-4 group-hover:ring-2 group-hover:ring-black">
        <div className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2 py-0.5 rounded">
          PREMIUM
        </div>
        <div className="absolute top-3 right-3 bg-gray-100 text-black text-xs font-semibold px-2 py-0.5 rounded-full">
          2% off
        </div>
        <img src={imgSrc} alt={name} className="w-full h-44 object-contain my-2" />
        <div className="mt-4 space-y-1">
          <p className="text-xs text-gray-500 font-bold uppercase">KHAAS</p>
          <h3 className="text-base font-semibold">{name} {defaultWeight}g</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="line-through">NPR: Rs {Math.round(finalPrice * 1.02)}</span>
            <div className="flex items-center gap-1">
              <span>4.9</span>
              <Heart size={14} className="text-black fill-black" />
            </div>
          </div>
          <p className="text-[15px] font-bold text-black">
            Rs {finalPrice} <span className="text-xs font-normal text-gray-500">(Rs {pricePerGram?.toFixed(2)}/g)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full mt-4 bg-black hover:bg-gray-900 text-white text-sm py-2 rounded-md transition"
          disabled={stock === 0}
        >
          <ShoppingCart size={16} className="inline-block mr-2" />
          {stock === 0 ? "Out of Stock" : "Add To Cart"}
        </button>
      </div>
    </Link>
  );
}
