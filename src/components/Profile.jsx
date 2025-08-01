import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { ContextCart } from "./ContextCart";
import NavBar from "./NavBar";
import PageWrapper from "./PageWrapper";
import { toast } from "react-toastify";

export default function Profile() {
  const { user, setUser } = useContext(ContextCart);

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("👋 Logged out successfully");
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-base-200 text-base-content">
        <NavBar />
        <div className="max-w-md mx-auto mt-10 p-6 rounded-md shadow-lg bg-base-100 border border-base-300 text-center space-y-4">
          <h2 className="text-2xl font-semibold text-primary">My Profile</h2>

          {!user ? (
            <div className="space-y-4">
              <p className="text-base-content/70">You are not logged in.</p>

              <div className="flex justify-center gap-4">
                <Link to="/LogIn" className="btn btn-primary btn-sm">
                  Log In
                </Link>
                <Link
                  to="/SignIn"
                  className="btn btn-outline btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-base-content/70 space-y-2">
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
                className="btn btn-outline btn-error btn-sm mt-4"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
