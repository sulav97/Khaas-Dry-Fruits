import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createBooking, getProfile } from "../../api/api";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    updateWeight,
  } = useCart();

  const [showModal, setShowModal] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Prefill address and phone from user profile
    getProfile()
      .then((data) => {
        setAddress(data.address || "");
        setPhone(data.phone || "");
      })
      .catch((err) => {
        toast.error(err.message || "Failed to fetch profile info");
      });
  }, []);

  const weightOptions = [100, 250, 500, 1000];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + Number(item.totalPrice || 0) * Number(item.quantity || 1),
    0
  );
  const shipping = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + shipping;

  const handleCompletePayment = async () => {
    setError("");
    if (!address || !phone) {
      setError("Please enter address and contact number.");
      return;
    }
    if (cartItems.length === 0) return;
    setLoading(true);
    try {
      // Send each cart item as a separate booking
      for (const item of cartItems) {
        await createBooking({
          dryfruit: item.id,
          quantity: item.quantity,
          totalPrice: item.totalPrice * item.quantity,
          address,
          phone,
        });
      }
      setShowModal(true);
      clearCart();
      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to complete order");
      toast.error(err.message || "Failed to complete order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 md:px-12">
      <h2 className="text-3xl font-semibold text-center mb-12 tracking-tight">Checkout</h2>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Shopping Bag */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-6 border-b pb-4">Shopping Bag</h3>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id + '-' + item.weight} className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover rounded border"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lg">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <select
                          value={item.weight}
                          onChange={e => updateWeight(item.id, item.weight, Number(e.target.value))}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          {weightOptions.map(w => (
                            <option key={w} value={w}>{w === 1000 ? "1kg" : `${w}g`}</option>
                          ))}
                        </select>
                        <span className="text-gray-500 text-xs">Weight</span>
                      </div>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">Rs {Number(item.totalPrice || 0) * Number(item.quantity || 1)}</p>
                  </div>
                  <div className="flex items-center mt-3 gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 border rounded hover:bg-gray-200 transition"
                    >
                      −
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                      className="px-3 py-1 border rounded hover:bg-gray-200 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id, item.weight)}
                      className="ml-auto text-sm px-3 py-1 border border-gray-300 rounded hover:bg-red-100 text-red-600 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Info */}
        <div className="bg-gray-50 rounded-lg p-6 shadow-md space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Shipping Information</h3>
            <input
              type="text"
              placeholder="Address"
              className="w-full mb-3 px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={address}
              onChange={e => setAddress(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="text"
              placeholder="Contact"
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-3 text-lg">Order Summary</h4>
            <div className="flex justify-between text-sm py-1">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span>Shipping Fee</span>
              <span>Rs {shipping}</span>
            </div>
            <div className="flex justify-between font-semibold text-base mt-3">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="font-medium mb-3 text-lg">Payment Method</h4>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" defaultChecked disabled />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                <input type="radio" name="payment" disabled />
                Khalti
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">Thank you for shopping with us…!</p>
          </div>

          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

          {/* Complete Payment */}
          <button
            onClick={handleCompletePayment}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={cartItems.length === 0 || loading}
          >
            {loading ? "Processing..." : "Complete Payment"}
          </button>
          <p
            onClick={() => navigate("/")}
            className="text-center text-sm text-gray-500 hover:underline cursor-pointer"
          >
            continue shopping
          </p>
        </div>
      </div>

      {/* Thank You Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-sm">
            <h3 className="text-lg font-semibold text-black mb-2">
              Thank you for shopping with us!
            </h3>
            <p className="text-sm text-gray-600 mb-4">Redirecting to home...</p>
            <div className="w-full h-1.5 bg-gray-200 rounded">
              <div className="h-full bg-black w-full animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
