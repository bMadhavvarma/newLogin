import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// 🔔 Toast Functions
const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
  });
};

const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
  });
};

// ✅ LOGIN COMPONENT
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showErrorToast("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/v1/login", {
        email,
        password,
      });

      if (res.data.success) {
        showSuccessToast("Login successful!");
        localStorage.setItem("token", res.data.token);
        setTimeout(() => navigate("/home"), 1500);
      } else {
        showErrorToast(res.data.message || "Login failed");
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md shadow-slate-300 p-5 rounded-2xl border-slate-300 min-h-full min-w-80"
      >
        <h1 className="font-bold text-2xl text-purple-900">Sign In</h1>

        <div className="flex flex-col mt-2 px-4 py-2">
          <label htmlFor="login-email" className="text-xl font-semibold">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none text-md ml-2 mt-2 border-b-2 border-gray-400"
          />
        </div>

        <div className="flex flex-col mt-2 px-4 py-2">
          <label htmlFor="login-password" className="text-xl font-semibold">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="outline-none text-md ml-2 mt-2 border-b-2 border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-900 text-white rounded-2xl h-10 mt-4 w-full text-center"
        >
          Sign In
        </button>

        <p className="text-center pt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 underline cursor-pointer">
            Signup
          </Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
};

// ✅ SIGNUP COMPONENT
const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { email, name, password } = formData;

    if (!email || !name || !password) {
      showErrorToast("All fields are required");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/v1/signup", {
        email,
        userName: name,
        password,
      });

      if (res.data.success) {
        showSuccessToast("Signup successful! Redirecting...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showErrorToast(res.data.message || "Signup failed");
      }
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Signup error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-700">
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md shadow-slate-300 p-5 rounded-2xl border-slate-300 min-h-full min-w-80"
      >
        <h1 className="font-bold text-2xl text-purple-900">Sign Up</h1>

        <div className="flex flex-col mt-2 px-4 py-2">
          <label htmlFor="email" className="text-xl font-semibold">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="outline-none text-md ml-2 mt-2 border-b-2 border-gray-400"
          />
        </div>

        <div className="flex flex-col mt-2 px-4 py-2">
          <label htmlFor="name" className="text-xl font-semibold">
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="outline-none text-md ml-2 mt-2 border-b-2 border-gray-400"
          />
        </div>

        <div className="flex flex-col mt-2 px-4 py-2">
          <label htmlFor="password" className="text-xl font-semibold">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="outline-none text-md ml-2 mt-2 border-b-2 border-gray-400"
          />
        </div>

        <button
          type="submit"
          className="bg-purple-900 text-white rounded-2xl h-10 mt-4 w-full text-center"
        >
          Sign Up
        </button>

        <p className="text-center pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 underline cursor-pointer">
            Signin
          </Link>
        </p>

        <ToastContainer />
      </form>
    </div>
  );
};

export { SignUp, Login };
