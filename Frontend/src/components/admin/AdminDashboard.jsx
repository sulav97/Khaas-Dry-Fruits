import React, { useState, useEffect } from "react";
import {
  getAllDryfruits,
  getAllBookings,
  getAllUsers,
  createDryfruit,
  updateDryfruit,
  deleteDryfruit,
  updateBookingStatus,
  blockUser,
  unblockUser,
  getProfile,
  updateProfile,
} from "../../api/api";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const sections = [
  { key: "overview", label: "Dashboard Overview" },
  { key: "products", label: "Product Management" },
  { key: "orders", label: "Order Management" },
  { key: "users", label: "User Management" },
  { key: "contacts", label: "Contact/Inquiry Management" },
  { key: "profile", label: "Admin Profile & Settings" },
];

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  if (error) {
    return <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded mb-4">{error.toString()}</div>;
  }
  return React.cloneElement(children, { setError });
}

function DashboardOverview({ setError }) {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAllBookings(),
      getAllUsers(),
      getAllDryfruits(),
    ])
      .then(([orders, users, products]) => {
        setOrders(orders);
        setUsers(users);
        setProducts(products);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      });
  }, [setError]);

  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalUsers = users.length;
  const totalProducts = products.length;
  const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentOrders = sortedOrders.slice(0, 5);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Total Sales (Rs)" value={totalSales} />
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Products" value={totalProducts} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {recentOrders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{o._id.slice(-6)}</td>
                  <td className="px-4 py-2">{o.user?.name || "-"}</td>
                  <td className="px-4 py-2">{o.dryfruit?.name || "-"}</td>
                  <td className="px-4 py-2">Rs {o.totalPrice}</td>
                  <td className="px-4 py-2">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-black text-white rounded-lg p-6 flex flex-col items-center shadow">
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-sm uppercase tracking-wider text-gray-300">{label}</div>
    </div>
  );
}

function ProductManagement({ setError }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    getAllDryfruits()
      .then(setProducts)
      .catch((err) => setError(err.message || "Failed to load products"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchProducts, [setError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await updateDryfruit(editing, form);
        toast.success("Product updated.");
      } else {
        await createDryfruit(form);
        toast.success("Product added.");
      }
      setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" });
      setEditing(null);
      fetchProducts();
    } catch (err) {
      setError(err.message || "Failed to save product");
      toast.error(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      pricePerGram: product.pricePerGram,
      stock: product.stock,
      image: product.image,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    setSaving(true);
    try {
      await deleteDryfruit(id);
      fetchProducts();
      toast.success("Product deleted.");
    } catch (err) {
      setError(err.message || "Failed to delete product");
      toast.error(err.message || "Failed to delete product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <form onSubmit={handleSubmit} className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" className="border px-3 py-2 rounded" required disabled={saving} />
        <input name="pricePerGram" value={form.pricePerGram} onChange={handleChange} placeholder="Price Per Gram (Rs)" type="number" className="border px-3 py-2 rounded" required disabled={saving} />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" type="number" className="border px-3 py-2 rounded" required disabled={saving} />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image filename (e.g. almonds.jpg)" className="border px-3 py-2 rounded" required disabled={saving} />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border px-3 py-2 rounded md:col-span-2" required disabled={saving} />
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800 transition md:col-span-2" disabled={saving}>{editing ? "Update" : "Add"} Product</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "", pricePerGram: "", stock: "", image: "" }); }} className="text-sm text-gray-500 underline md:col-span-2">Cancel Edit</button>}
      </form>
      {loading ? <div>Loading...</div> : products.length === 0 ? <div>No products found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700 uppercase">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Price/Gram</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {products.map((p) => {
                const imgSrc = p.image
                  ? `http://localhost:5000/uploads/${p.image}`
                  : "http://localhost:5000/uploads/placeholder.jpg";
                return (
                  <tr key={p._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{p.name}</td>
                    <td className="px-4 py-3">
                      <img 
                        src={imgSrc} 
                        alt={p.name} 
                        className="h-10 w-10 object-contain rounded"
                        onError={(e) => {
                          e.target.src = "http://localhost:5000/uploads/placeholder.jpg";
                        }}
                      />
                    </td>
                    <td className="px-4 py-3">Rs {p.pricePerGram}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button onClick={() => handleEdit(p)} className="text-xs bg-black text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDelete(p._id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function OrderManagement({ setError }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getAllBookings()
      .then(setOrders)
      .catch((err) => setError(err.message || "Failed to load orders"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchOrders, [setError]);

  const handleStatus = async (id, status) => {
    setSaving(true);
    try {
      await updateBookingStatus(id, status);
      fetchOrders();
      toast.success("Order status updated.");
    } catch (err) {
      setError(err.message || "Failed to update status");
      toast.error(err.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const statusOptions = ["pending", "shipped", "delivered", "cancelled"];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>
      {loading ? <div>Loading...</div> : orders.length === 0 ? <div>No orders found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">Order ID</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Weight (g)</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Total Price</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {orders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{o._id.slice(-6)}</td>
                  <td className="px-4 py-2">{o.user?.name || "-"}</td>
                  <td className="px-4 py-2">{o.dryfruit?.name || "-"}</td>
                  <td className="px-4 py-2">{o.weight}</td>
                  <td className="px-4 py-2">{o.quantity}</td>
                  <td className="px-4 py-2">Rs {o.totalPrice}</td>
                  <td className="px-4 py-2">
                    <span className="capitalize font-semibold">{o.status}</span>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      className="border rounded px-2 py-1 text-xs"
                      value={o.status}
                      onChange={e => handleStatus(o._id, e.target.value)}
                      disabled={saving}
                    >
                      {statusOptions.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function UserManagement({ setError }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(err.message || "Failed to load users"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchUsers, [setError]);

  const handleBlock = async (id, block) => {
    setSaving(true);
    try {
      if (block) {
        await blockUser(id);
        toast.success("User blocked.");
      } else {
        await unblockUser(id);
        toast.success("User unblocked.");
      }
      fetchUsers();
    } catch (err) {
      setError(err.message || "Failed to update user");
      toast.error(err.message || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      {loading ? <div>Loading...</div> : users.length === 0 ? <div>No users found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">User ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {users.map((u) => (
                <tr key={u._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{u._id.slice(-6)}</td>
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.isAdmin ? "Admin" : "Customer"}</td>
                  <td className="px-4 py-2">{u.blocked ? <span className="text-red-600 font-semibold">Blocked</span> : <span className="text-green-600 font-semibold">Active</span>}</td>
                  <td className="px-4 py-2">
                    {u.isAdmin ? (
                      <span className="text-xs text-gray-400">-</span>
                    ) : u.blocked ? (
                      <button onClick={() => handleBlock(u._id, false)} className="text-xs bg-black text-white px-2 py-1 rounded" disabled={saving}>Unblock</button>
                    ) : (
                      <button onClick={() => handleBlock(u._id, true)} className="text-xs bg-red-600 text-white px-2 py-1 rounded" disabled={saving}>Block</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ContactManagement({ setError }) {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  const fetchContacts = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/contact", { headers })
      .then(res => setContacts(res.data))
      .catch((err) => setError(err.response?.data?.msg || err.message || "Failed to load messages"))
      .finally(() => setLoading(false));
  };
  useEffect(fetchContacts, [setError]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setSaving(true);
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`, { headers });
      fetchContacts();
      toast.success("Message deleted.");
    } catch (err) {
      setError(err.response?.data?.msg || err.message || "Failed to delete message");
      toast.error(err.response?.data?.msg || err.message || "Failed to delete message");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Contact/Inquiry Management</h2>
      {loading ? <div>Loading...</div> : contacts.length === 0 ? <div>No messages found.</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-900">
              {contacts.map((c) => (
                <tr key={c._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{c.name}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2 max-w-xs truncate">{c.message}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => handleDelete(c._id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded" disabled={saving}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function AdminProfileSettings({ setError }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((data) => {
        setProfile(data);
        setForm({ email: data.email, password: "" });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, [setError]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    try {
      await updateProfile(form);
      setSuccess("Profile updated successfully.");
      setForm(f => ({ ...f, password: "" }));
      toast.success("Profile updated.");
    } catch (err) {
      setError(err.message || "Failed to update profile");
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Admin Profile & Settings</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} type="email" className="border px-3 py-2 rounded w-full" required disabled={saving} />
        </div>
        <div>
          <label className="block font-semibold mb-1">New Password</label>
          <input name="password" value={form.password} onChange={handleChange} type="password" className="border px-3 py-2 rounded w-full" placeholder="Leave blank to keep current password" disabled={saving} />
        </div>
        <button type="submit" className="bg-black text-white py-2 rounded hover:bg-gray-800 transition w-full" disabled={saving}>Update Profile</button>
        {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      </form>
      <div className="mt-8">
        <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition">Logout</button>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [section, setSection] = useState("overview");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-white text-black">
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen px-6 py-8 shadow-md">
  <div className="text-3xl font-bold mb-10">Admin Panel</div>
  <nav className="space-y-3">
    {sections.map((s) => (
      <button
        key={s.key}
        onClick={() => setSection(s.key)}
        className={`w-full text-left px-4 py-2 rounded-lg font-medium border transition duration-150 ${
          section === s.key
            ? "bg-black text-white border-black"
            : "border-gray-300 hover:bg-gray-100"
        }`}
      >
        {s.label}
      </button>
    ))}
  </nav>
  <div className="mt-10 text-xs text-gray-400">
    &copy; {new Date().getFullYear()} Khaas Dry Fruits
  </div>
</aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 bg-white min-h-screen">
        {section === "overview" && <ErrorBoundary><DashboardOverview /></ErrorBoundary>}
        {section === "products" && <ErrorBoundary><ProductManagement /></ErrorBoundary>}
        {section === "orders" && <ErrorBoundary><OrderManagement /></ErrorBoundary>}
        {section === "users" && <ErrorBoundary><UserManagement /></ErrorBoundary>}
        {section === "contacts" && <ErrorBoundary><ContactManagement /></ErrorBoundary>}
        {section === "profile" && <ErrorBoundary><AdminProfileSettings /></ErrorBoundary>}
      </main>
    </div>
  );
} 