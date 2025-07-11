import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { getProfile } from "../../api/api";
import toast from "react-hot-toast";
import Payment from "../Payment/Payment";
import { v4 as uuidv4 } from "uuid";
import { generateEsewaSignature } from "../../utils/esewaSignature";

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
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const esewaFormRef = useRef(null);

  useEffect(() => {
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

  const handlePaymentSuccess = () => {
    setShowModal(true);
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-12 md:px-20">
      <h2 className="text-4xl font-bold text-center mb-10 tracking-tight">Your Cart</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Cart Items */}
        <div className="bg-[#fafafa] p-6 rounded-2xl shadow-sm">
          <h3 className="text-2xl font-semibold mb-6 border-b pb-4">Shopping Bag</h3>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id + "-" + item.weight}
                  className="flex flex-col sm:flex-row gap-6 items-center border-b pb-6"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl shadow"
                  />
                  <div className="flex-1 w-full space-y-2">
                    <p className="font-semibold text-lg">{item.title}</p>
                    <div className="flex items-center gap-2">
                      <select
                        value={item.weight}
                        onChange={(e) => updateWeight(item.id, item.weight, Number(e.target.value))}
                        className="border px-2 py-1 rounded text-sm"
                      >
                        {weightOptions.map((w) => (
                          <option key={w} value={w}>
                            {w === 1000 ? "1kg" : `${w}g`}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-gray-500">Weight</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">Qty:</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 rounded border text-sm hover:bg-gray-200"
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                        className="px-2 py-1 rounded border text-sm hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-sm font-semibold text-black">
                      Rs {Number(item.totalPrice || 0) * Number(item.quantity || 1)}
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id, item.weight)}
                      className="text-sm text-red-600 hover:underline mt-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout Section */}
        <div className="bg-[#fafafa] p-6 rounded-2xl shadow-sm space-y-8">
          {/* Shipping Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-4">Shipping Information</h3>
            <input
              type="text"
              placeholder="Full Address"
              className="w-full mb-4 px-4 py-2 border rounded text-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded text-sm"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Summary */}
          <div>
            <h4 className="text-xl font-medium mb-3">Order Summary</h4>
            <div className="flex justify-between text-sm border-b pb-2">
              <span>Subtotal</span>
              <span>Rs {subtotal}</span>
            </div>
            <div className="flex justify-between text-sm border-b pb-2">
              <span>Shipping</span>
              <span>Rs {shipping}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>Rs {total}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h4 className="text-xl font-medium mb-3">Payment Options</h4>
            <div className="space-y-2">
              {["cod", "khalti", "esewa"].map((method) => (
                <label key={method} className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method === "cod" && "Cash on Delivery"}
                  {method === "khalti" && "Khalti"}
                  {method === "esewa" && "eSewa"}
                </label>
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          {/* Payment Logic */}
          {paymentMethod !== "esewa" && (
            <Payment
              cart={cartItems}
              address={address}
              contact={phone}
              paymentMethod={paymentMethod}
              total={total}
              setError={setError}
              setLoading={setLoading}
              onSuccess={handlePaymentSuccess}
            />
          )}

          {paymentMethod === "esewa" && cartItems.length > 0 && (() => {
            const transaction_uuid = uuidv4();
            const { signedFieldNames, signature } = generateEsewaSignature({
              total_amount: total,
              transaction_uuid,
              product_code: "EPAYTEST",
            });

            return (
              <form
                ref={esewaFormRef}
                action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
                method="POST"
                className="mt-4"
              >
                <input type="hidden" name="amount" value={subtotal} />
                <input type="hidden" name="tax_amount" value="0" />
                <input type="hidden" name="total_amount" value={total} />
                <input type="hidden" name="transaction_uuid" value={transaction_uuid} />
                <input type="hidden" name="product_code" value="EPAYTEST" />
                <input type="hidden" name="product_service_charge" value="0" />
                <input type="hidden" name="product_delivery_charge" value={shipping} />
                <input type="hidden" name="success_url" value="http://localhost:5173/paymentsuccess" />
                <input type="hidden" name="failure_url" value="http://localhost:5173/paymentfailure" />
                <input type="hidden" name="signed_field_names" value={signedFieldNames} />
                <input type="hidden" name="signature" value={signature} />

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
                >
                  Pay with eSewa
                </button>
              </form>
            );
          })()}

          <p
            onClick={() => navigate("/")}
            className="text-center text-sm text-gray-500 hover:underline cursor-pointer"
          >
            ← Continue shopping
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold">Thank you for shopping with us!</h3>
            <p className="text-sm text-gray-600 mt-2">Redirecting to home...</p>
            <div className="mt-4 w-full h-1.5 bg-gray-200 rounded">
              <div className="h-full bg-black w-full animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
