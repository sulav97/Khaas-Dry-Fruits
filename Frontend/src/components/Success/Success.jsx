import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We'll process it and deliver it to you soon.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Details</h2>
          <p className="text-sm text-gray-600 mb-2">
            • You will receive a confirmation email shortly
          </p>
          <p className="text-sm text-gray-600 mb-2">
            • Our team will contact you for delivery details
          </p>
          <p className="text-sm text-gray-600">
            • Expected delivery: 2-3 business days
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/myorder")}
            className="w-full border border-black text-black py-3 px-6 rounded hover:bg-gray-50 transition"
          >
            View My Orders
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Redirecting to home page in 5 seconds...
        </p>
      </div>
    </div>
  );
};

export default Success; 