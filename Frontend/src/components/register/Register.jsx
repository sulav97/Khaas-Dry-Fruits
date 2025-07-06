import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.msg || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-white px-4 pt-20 pb-10 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Sign up.</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              USERNAME*
            </label>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              EMAIL*
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              PASSWORD*
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              CONFIRM PASSWORD*
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:outline-none focus:border-black"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-sm hover:bg-gray-900 transition"
          >
            Sign up
          </button>

          <div className="text-sm text-center text-gray-700">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-black">
              Sign in.
            </Link>
          </div>

          <p className="text-[10px] text-gray-500 text-center mt-1">
            Note: use gmail account to login,
          </p>
        </form>
      </div>
    </div>
  );
}
