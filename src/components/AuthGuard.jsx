import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ContextCart } from "./ContextCart";

export default function AuthGuard({ children }) {
  const { user } = useContext(ContextCart);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
