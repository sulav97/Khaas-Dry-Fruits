import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import toast from "react-hot-toast";

export default function Profile() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setLoading(true);
    getProfile()
      .then((data) => {
        setForm({ name: data.name || "", phone: data.phone || "", email: data.email || "", address: data.address || "" });
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
      });
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await updateProfile({
        password: passwords.newPassword,
        currentPassword: passwords.currentPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-lg text-black">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-white px-4 py-10 md:px-12 flex justify-center items-center">
      <div className="w-full max-w-xl bg-gray-50 rounded-lg p-8 shadow-md space-y-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-black">My Profile</h2>
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={saving}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={saving}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={saving}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Gmail / Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={saving}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {/* Change Password Section */}
        <form onSubmit={handleChangePassword} className="space-y-6 border-t pt-8 mt-4">
          <h3 className="text-xl font-semibold mb-2 text-black">Change Password</h3>
          <div>
            <label className="block font-medium mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={savingPassword}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={savingPassword}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwords.confirmNewPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
              disabled={savingPassword}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
            disabled={savingPassword}
          >
            {savingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
} 