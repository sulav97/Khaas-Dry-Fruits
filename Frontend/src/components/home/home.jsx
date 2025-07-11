import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import Hero from "../Hero/Hero";
import { getAllDryfruits } from "../../api/api";
import storage from "../../assets/storage.jpg";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllDryfruits()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch products");
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white text-black">
      <Hero />
      <ProductSection
        title="Shop New Releases"
        products={products.slice(0, 4)}
        loading={loading}
        error={error}
      />
      <ProductSection
        title="Shop Best Seller"
        products={products.slice(4, 8)}
        loading={loading}
        error={error}
      />
      <CompanySection />
      <StoringInfo />
      <TestimonialSection />
      <div className="h-16" />
    </div>
  );
}

function Stat({ icon, title, label }) {
  return (
    <div>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-700">{label}</p>
    </div>
  );
}

function ProductSection({ title, products, loading, error }) {
  const navigate = useNavigate();
  return (
    <section className="px-6 py-12 md:px-16 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <button
          onClick={() => navigate("/all")}
          className="text-sm px-4 py-2 border border-black hover:bg-black hover:text-white transition"
        >
          Shop All
        </button>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

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



function CompanySection() {
  return (
    <section className="bg-white py-12 px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-bold mb-2">KHAAS DRY FRUITS</h2>
          <div className="w-20 h-[2px] bg-black mb-4" />
          <p className="text-gray-800 leading-relaxed">
            Welcome to Khaas, your trusted destination for premium dry fruits.
            We bring handpicked dry fruits straight from the best farms with
            uncompromising quality. With over 20+ varieties and 1000+ happy
            customers, Khaas is your one-stop source for wholesome goodness.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-center">
          <Stat icon="🏆" title="Quality Assured" label="Handpicked, Hygienic, and Verified" />
          <Stat icon="🌍" title="10+" label="Districts Served Across Nepal" />
          <Stat icon="🥣" title="1000+" label="Customers Served" />
          <Stat icon="🌰" title="5+" label="Premium Varieties Available" />
        </div>
      </div>
    </section>
  );
}

function StoringInfo() {
  return (
    <section className="bg-white px-6 md:px-16 py-12">
      <div className="border border-gray-200 rounded-2xl shadow-sm p-8 transition hover:shadow-md bg-[#fdfdfd]">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-3 text-black">
              STORING YOUR FAVOURITE DRY FRUITS
            </h2>
            <div className="w-16 h-[2px] bg-black mb-5" />
            <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
              <li>✅ Store in airtight containers at a cool, dry spot.</li>
              <li>✅ Minimize exposure to light, oxygen, and moisture to maintain quality.</li>
              <li>✅ Avoid heat sources to prevent rancidity or spoilage.</li>
              <li>✅ For extended shelf life, refrigerate in tightly sealed jars.</li>
            </ul>
          </div>
          <div className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <img src={storage} alt="Storage Guide" className="w-full h-full object-cover scale-100" />
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  const testimonials = [
    { quote: "Khaas truly stands out! The quality and freshness are unmatched.", name: "Aarav Shrestha" },
    { quote: "Beautiful packaging, quick delivery, and amazing taste.", name: "Nisha Gurung" },
    { quote: "The best shop for authentic dry fruits in Nepal.", name: "Hari Bhattarai" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-12 px-6 md:px-16 mt-6 text-center">
      <h2 className="text-2xl font-semibold mb-4">WHAT OUR CUSTOMERS SAY</h2>
      <div className="max-w-2xl mx-auto">
        <blockquote className="italic text-gray-800 text-lg mb-4">“{testimonials[current].quote}”</blockquote>
        <p className="text-md font-semibold">{testimonials[current].name}</p>
      </div>
    </section>
  );
}
