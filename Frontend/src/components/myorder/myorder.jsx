import React, { useState, useEffect } from "react";
import { getUserBookings } from "../../api/api";

const MyOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    setLoading(true);
    getUserBookings()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load orders");
        setLoading(false);
      });
  }, []);

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModal(true);
    setCancelReason("");
  };

  const confirmCancel = () => {
    setOrders(orders.filter((order) => order._id !== selectedOrderId));
    setCancelModal(false);
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10 md:px-12">
      <h2 className="text-2xl font-semibold mb-6 text-black">My Orders</h2>

      {loading ? (
        <div className="text-center py-20 text-lg">Loading orders...</div>
      ) : error ? (
        <div className="text-center py-20 text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 py-12">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700 uppercase">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {orders.map((order) => {
                const imgSrc = order.dryfruit?.image 
                  ? `http://localhost:5000/uploads/${order.dryfruit.image}` 
                  : "http://localhost:5000/uploads/placeholder.jpg";
                return (
                  <tr key={order._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{order._id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <img
                        src={imgSrc}
                        alt={order.dryfruit?.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "http://localhost:5000/uploads/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">{order.dryfruit?.name}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3">Rs {order.totalPrice}</td>
                    <td className="px-4 py-3">{order.address}</td>
                    <td className="px-4 py-3">{order.phone}</td>
                    <td className="px-4 py-3">{order.status}</td>
                    <td className="px-4 py-3 text-center">
                      {order.status === "pending" ? (
                        <button
                          onClick={() => openCancelModal(order._id)}
                          className="w-full bg-black text-white px-3 py-1.5 rounded hover:bg-gray-800 transition duration-200 text-xs md:text-sm"
                        >
                          Cancel
                        </button>
                      ) : order.status === "delivered" ? (
                        <span className="text-green-600 font-semibold text-xs">✓ Delivered</span>
                      ) : order.status === "shipped" ? (
                        <span className="text-blue-600 font-semibold text-xs">🚚 Shipped</span>
                      ) : order.status === "cancelled" ? (
                        <span className="text-red-600 font-semibold text-xs">❌ Cancelled</span>
                      ) : (
                        <span className="text-gray-600 font-semibold text-xs">⏳ Processing</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Why do you want to cancel the order?
            </h3>

            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            >
              <option value="">-- Select Reason --</option>
              <option value="Changed my mind">Changed my mind</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Found cheaper elsewhere">Found cheaper elsewhere</option>
              <option value="Other">Other</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition text-sm"
              >
                Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancelReason}
                className={`px-4 py-2 rounded text-white text-sm transition ${
                  cancelReason
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrder;
