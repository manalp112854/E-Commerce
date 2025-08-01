import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function SignIn() {
  const [userName, setUserName] = useState("");
  const [usersData, setUsersData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getUsersData();
  }, []);

  async function getUsersData() {
    try {
      const response = await fetch("https://dummyjson.com/users");
      const data = await response.json();
      setUsersData(data.users);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  }

  const createUser = async (event) => {
    event.preventDefault();

    const newErrors = {};

    // Validation patterns
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!userName.trim()) {
      newErrors.userName = "Username is required";
    } else if (!usernameRegex.test(userName)) {
      newErrors.userName =
        "Username can only contain letters, numbers, or underscores";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be 8+ characters with uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const response = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: userName,
          email: email,
          password: password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("🎉 Sign up successful!");
        console.log("Signed up user:", result);
        setUserName("");
        setEmail("");
        setPassword("");
        setErrors({});
      } else {
        toast.error("❌ Sign up failed");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("⚠️ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center px-4">
      {/* Sign Up Form */}
      <div className="w-full max-w-md bg-base-100 shadow-lg rounded-md border border-base-300 p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-center text-primary">
          Sign in or create account
        </h2>

        {/* Username */}
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter username"
          className={`input input-bordered input-sm w-full ${
            errors.userName && "!border-red-500 focus:ring-red-400"
          }`}
        />
        {errors.userName && (
          <p className="text-sm text-error flex items-center gap-1">
            <ExclamationCircleFilled className="text-error text-base" />
            {errors.userName}
          </p>
        )}

        {/* Email */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className={`input input-bordered input-sm w-full ${
            errors.email && "!border-red-500 focus:ring-red-400"
          }`}
        />
        {errors.email && (
          <p className="text-sm text-error flex items-center gap-1">
            <ExclamationCircleFilled className="text-error text-base" />
            {errors.email}
          </p>
        )}

        {/* Password */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={`input input-bordered input-sm w-full ${
            errors.password && "!border-red-500 focus:ring-red-400"
          }`}
        />
        {errors.password && (
          <p className="text-sm text-error flex items-center gap-1">
            <ExclamationCircleFilled className="text-error text-base" />
            {errors.password}
          </p>
        )}

        <button onClick={createUser} className="btn btn-primary btn-sm w-full">
          Sign Up
        </button>

        <p className="text-sm text-center text-base-content/70">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/LogIn")}
            className="text-primary font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
