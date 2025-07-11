import React from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="block w-full bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition duration-300"
          >
            Continue Shopping
          </Link>
          <Link
            to="/my-orders"
            className="block w-full bg-white text-black py-3 px-6 rounded-full font-semibold border-2 border-black hover:bg-gray-100 transition duration-300"
          >
            View Orders
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>You will receive an email confirmation shortly.</p>
          <p>For any queries, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess; 