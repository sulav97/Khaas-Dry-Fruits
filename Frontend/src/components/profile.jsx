import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import toast from "react-hot-toast";
import { FaUserCircle, FaLock } from "react-icons/fa";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    dob: "", // ✅ Added DOB
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          dob: data.dob || "", // ✅ Load DOB
        });
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
      await updateProfile(form); // ✅ Includes DOB
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmNewPassword } = passwords;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await updateProfile({
        password: newPassword,
        currentPassword,
      });
      toast.success("Password changed successfully");
      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      toast.error(err.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-gray-50 rounded-2xl p-8 shadow-xl space-y-12">
        {/* Profile Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <FaUserCircle className="text-2xl text-black" />
            <h2 className="text-2xl font-semibold text-black">My Profile</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={saving}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={saving}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            disabled={saving}
          >
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2">
          <hr className="flex-1 border-t border-gray-300" />
          <FaLock className="text-gray-500" />
          <hr className="flex-1 border-t border-gray-300" />
        </div>

        {/* Change Password Section */}
        <form onSubmit={handleChangePassword} className="space-y-6">
          <h3 className="text-xl font-semibold text-black mb-2 flex items-center gap-2">
            <FaLock /> Change Password
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={savingPassword}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={savingPassword}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwords.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-black focus:outline-none"
                disabled={savingPassword}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            disabled={savingPassword}
          >
            {savingPassword ? "Changing..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
