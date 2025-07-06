import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getDryfruitById, getAllDryfruits } from "../../api/api";
import { useCart } from "../../context/CartContext";

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
        setAllProducts(all.filter((p) => p._id !== id)); // exclude current product
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
    : require(`../../assets/placeholder.jpg`);

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
    <div className="min-h-screen bg-white text-black px-6 md:px-16 py-12 space-y-20">
      {/* Main Product */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-12">
        {/* Image */}
        <div className="w-full md:w-[40%]">
          <img
            src={imageSrc}
            alt={product.name}
            className="rounded-xl shadow-md w-full max-h-[400px] object-contain"
          />
        </div>

        {/* Details */}
        <div className="w-full md:w-[55%] space-y-6">
          <div className="flex justify-between items-start md:items-center">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex flex-col items-end">
              <span className="text-xl font-semibold bg-black text-white px-4 py-1.5 rounded-lg shadow">
                Rs {totalPrice}
              </span>
              <span className={`text-sm mt-2 font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Weight Selector */}
          <div>
            <label className="block text-sm font-medium mb-1">Select Weight</label>
            <select
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            >
              {weights.map((w) => (
                <option key={w} value={w}>
                  {w === 1000 ? "1kg" : `${w}g`}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
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
              className="w-full sm:w-1/2 bg-black text-white py-3 rounded-md text-sm font-semibold hover:bg-gray-900 transition"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full sm:w-1/2 border border-black text-black py-3 rounded-md text-sm font-semibold hover:bg-black hover:text-white transition"
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
          {allProducts.slice(0, 4).map((item) => (
            <Link
              to={`/product/${item._id}`}
              key={item._id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition group"
            >
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.name}
                className="w-full h-40 object-contain bg-white p-4"
              />
              <div className="p-4 space-y-1">
                <p className="text-xs uppercase text-gray-500 font-medium">KHAAS</p>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-700">Rs {(item.pricePerGram * 100).toFixed(0)} / 100g</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
