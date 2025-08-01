import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleFilled, LeftOutlined } from "@ant-design/icons";
import { ContextCart } from "./ContextCart";
import { toast } from "react-toastify";

export default function LogIn() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser } = useContext(ContextCart);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const loginUser = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!userName.trim()) newErrors.userName = "Username is required";
    if (!password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      let response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userName,
          password: password,
          expiresInMins: 30,
        }),
      });

      const data = await response.json();

      if (data.accessToken) {
        toast.success("Login successful!");
        setUser(data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        console.log("Logged in user:", data);
        navigate("/");
      } else {
        setErrors({ general: "Invalid username or password" });
        toast.error("Invalid username or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Something went wrong. Please try again." });
      toast.error("Login failed. Please try again.");
    }
  };

  const logoutUser = () => {
    setUser(null);
    setUserName("");
    setPassword("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("👋 Logged out successfully");
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-base-100 shadow-md rounded-md border border-base-300 p-6 space-y-4">
        {!user ? (
          <form onSubmit={loginUser} className="space-y-4">
            <h2 className="text-2xl font-semibold text-center text-primary">
              Login
            </h2>

            {errors.general && (
              <p className="text-sm text-error flex items-center gap-1">
                <ExclamationCircleFilled className="text-error text-base" />
                {errors.general}
              </p>
            )}

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

            <button type="submit" className="btn btn-primary btn-sm w-full">
              Login
            </button>

            <p className="text-sm text-center text-base-content/70">
              Don&apos;t have an account?{" "}
              <span
                onClick={() => navigate("/SignIn")}
                className="text-primary font-medium cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          </form>
        ) : (
          <>
            <div className="text-sm text-base-content space-y-2">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email || "Not provided"}
              </p>
              <p>
                <strong>Token Expires In:</strong> {user.expiresInMins || 30}{" "}
                min
              </p>
            </div>

            <button
              onClick={logoutUser}
              className="btn btn-sm w-full border border-error text-error hover:bg-error hover:text-white "
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
