import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user); // set user from response
      toast.success("Login successful!");
      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || "Login failed");
    }
  };

  return (
<div className="bg-white px-4 pt-[96px] pb-36 flex justify-center">
      <div className="w-full max-w-md bg-gray-50 rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Sign in.</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              EMAIL
            </label>
            <input
              placeholder="EMAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="PASSWORD"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 bg-transparent py-2 px-1 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="text-right mb-2">
            <Link to="/forgot-password" className="text-sm text-black-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-sm hover:bg-gray-900 transition"
          >
            Login
          </button>

          <div className="text-sm text-center text-gray-700">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-black">
              Sign up.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
