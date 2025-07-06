import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
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

  return (
    <div className="bg-white text-black">
      <Hero />
      <CompanySection />
      <ProductSection title="Shop New Releases" products={products.slice(0, 4)} loading={loading} error={error} />
      <ProductSection title="Shop Best Seller" products={products.slice(4, 8)} loading={loading} error={error} />
      <StoringInfo />
      <TestimonialSection />
      <div className="h-16" />
    </div>
  );
}

// ------------------------------ Company Section ------------------------------
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

function Stat({ icon, title, label }) {
  return (
    <div>
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-700">{label}</p>
    </div>
  );
}

// ------------------------------ Product Section ------------------------------
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
        <div className="text-center py-10 text-lg">Loading products...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product._id || i} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { _id, name, pricePerGram, stock, image } = product;
  const imgSrc = image ? `http://localhost:5000/uploads/${image}` : "";
  const productUrl = `/product/${_id}`;

  const handleAddToCart = () => {
    addToCart({ id: _id, title: name, price: pricePerGram ? Math.round(pricePerGram * 500) : 0, image: imgSrc, stock });
    toast.success(`${name} added to cart!`);
  };

  return (
    <Link to={productUrl} className="block group focus:outline-none">
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
          <h3 className="text-base font-semibold">{name} 500gm</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="line-through">NPR: Rs {pricePerGram ? Math.round(pricePerGram * 500 * 1.02) : 0}</span>
            <div className="flex items-center gap-1">
              <span>4.9</span>
              <Heart size={14} className="text-black fill-black" />
            </div>
          </div>
          <p className="text-[15px] font-bold text-black">
            Rs {pricePerGram ? Math.round(pricePerGram * 500) : 0} <span className="text-xs font-normal text-gray-500">(Rs {pricePerGram}/g)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={e => { e.preventDefault(); handleAddToCart(); }}
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

// ------------------------------ Storing Section ------------------------------
function StoringInfo() {
  return (
    <section className="bg-white px-6 md:px-16 py-12">
      <div className="border border-gray-200 rounded-2xl shadow-sm p-8 transition hover:shadow-md bg-[#fdfdfd]">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-2xl font-bold mb-3 text-black">
              STORING YOUR FAVOURITE DRY FRUITS
            </h2>
            <div className="w-16 h-[2px] bg-black mb-5" />

            <ul className="space-y-3 text-gray-700 text-base leading-relaxed">
              <li>
                ✅ Store in airtight containers at a cool, dry spot.
              </li>
              <li>
                ✅ Minimize exposure to light, oxygen, and moisture to maintain quality.
              </li>
              <li>
                ✅ Avoid heat sources to prevent rancidity or spoilage.
              </li>
              <li>
                ✅ For extended shelf life, refrigerate in tightly sealed jars.
              </li>
            </ul>
          </div>

          {/* Image */}
          <div className="overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
            <img
              src={storage}
              alt="Storage Guide"
              className="w-full h-full object-cover scale-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------------ Testimonials ------------------------------
function TestimonialSection() {
  const testimonials = [
    {
      quote: "Khaas truly stands out! The quality and freshness are unmatched.",
      name: "Aarav Shrestha",
    },
    {
      quote: "Beautiful packaging, quick delivery, and amazing taste.",
      name: "Nisha Gurung",
    },
    {
      quote: "The best shop for authentic dry fruits in Nepal.",
      name: "Hari Bhattarai",
    },
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
        <blockquote className="italic text-gray-800 text-lg mb-4">
          “{testimonials[current].quote}”
        </blockquote>
        <p className="text-md font-semibold">{testimonials[current].name}</p>
      </div>
    </section>
  );
}
