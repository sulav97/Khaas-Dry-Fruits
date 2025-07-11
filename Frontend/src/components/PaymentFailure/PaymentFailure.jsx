import React from "react";
import { Link } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const PaymentFailure = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payment Failed
          </h1>
          <p className="text-gray-600 text-lg">
            Sorry, your payment could not be processed. Please try again.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/cart"
            className="block w-full bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition duration-300"
          >
            Try Again
          </Link>
          <Link
            to="/"
            className="block w-full bg-white text-black py-3 px-6 rounded-full font-semibold border-2 border-black hover:bg-gray-100 transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>If the problem persists, please contact our support team.</p>
          <p>Your cart items are still saved for your convenience.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure; 