import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDryfruitById, getAllDryfruits } from "../../api/api";
import { useCart } from "../../context/CartContext";
import { Heart } from "lucide-react";

const weights = [100, 250, 500, 1000];

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [weight, setWeight] = useState(100);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prod = await getDryfruitById(id);
        setProduct(prod);
        const all = await getAllDryfruits();
        setAllProducts(all.filter((p) => p._id !== id));
      } catch (err) {
        toast.error("Product not found");
      }
    };
    fetchData();
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center text-gray-500">Loading product...</div>;
  }

  const totalPrice = Number(((product.pricePerGram || 1) * weight).toFixed(2));
  const imageSrc = product.image
    ? `http://localhost:5000/uploads/${product.image}`
    : "http://localhost:5000/uploads/placeholder.jpg";

  const handleBuyNow = () => {
    addToCart({
      id: product._id,
      title: product.name,
      pricePerGram: product.pricePerGram,
      weight,
      totalPrice,
      image: imageSrc,
      stock: product.stock,
    });
    toast.success(`${product.name} added to cart!`);
    navigate("/cart");
  };

  return (
    <div className="bg-white text-black px-6 md:px-16 py-12 space-y-20">
      {/* Product Layout */}
      <div className="flex flex-col md:flex-row gap-10">
        {/* Image */}
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={imageSrc}
            alt={product.name}
            className="rounded-xl w-full max-w-md object-contain shadow-md"
            onError={(e) => {
              e.target.src = "http://localhost:5000/uploads/placeholder.jpg";
            }}
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <h1 className="text-3xl font-bold">{product.name}</h1>

          {/* Weight & Price */}
          <div className="flex items-center justify-between">
            <select
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none"
            >
              {weights.map((w) => (
                <option key={w} value={w}>
                  {w === 1000 ? "1kg" : `${w}g`}
                </option>
              ))}
            </select>

            <div className="text-right">
              <div className="text-xl font-semibold">Rs {totalPrice}</div>
              <div className={`text-sm mt-1 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </div>
            </div>
          </div>

          {/* Swift Delivery Note */}
          <p className="text-sm text-red-700 font-medium">
            Swift Delivery - Shipping Across Nepal. Bringing the goodness of dry fruits to your doorstep!
          </p>

          {/* Feature Icons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            <FeatureIcon label="Healthy Heart" />
            <FeatureIcon label="High Nutrition" />
            <FeatureIcon label="Gluten Free" />
            <FeatureIcon label="Cholesterol Free" />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 flex-col sm:flex-row">
            <button
              onClick={() => {
                addToCart({
                  id: product._id,
                  title: product.name,
                  pricePerGram: product.pricePerGram,
                  weight,
                  totalPrice,
                  image: imageSrc,
                  stock: product.stock,
                });
                toast.success(`${product.name} added to cart!`);
              }}
              className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full border border-black text-black py-3 rounded-md font-semibold hover:bg-black hover:text-white transition"
            >
              Buy Now
            </button>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <div className="w-14 h-[2px] bg-black mb-4" />
            <p className="text-gray-700 text-sm leading-relaxed">{product.description}</p>
            {product.bulletPoints?.length > 0 && (
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 pt-3">
                {product.bulletPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <div>
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Reuse the same product card used on home.j

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


function FeatureIcon({ label }) {
  return (
    <div className="flex flex-col items-center justify-center border border-gray-200 p-4 rounded-xl">
      <div className="text-2xl">🌟</div>
      <span>{label}</span>
    </div>
  );
}
