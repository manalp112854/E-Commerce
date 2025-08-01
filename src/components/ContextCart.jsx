// import { createContext, useEffect, useState } from "react";

// export const ContextCart = createContext();

// export default function ContextCartProvider({ children }) {
//   const [cartItems, setCartItems] = useState({});
//   const [user, setUser] = useState(null);

//   const [totalQuantity, setTotalQuantity] = useState();

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");
//     if (storedToken && storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setUser(null);
//     setCartItems({});
//   };

//   return (
//     <ContextCart.Provider
//       value={{
//         cartItems,
//         setCartItems,
//         user,
//         setUser,
//         logout,
//         totalQuantity,
//         setTotalQuantity,
//       }}
//     >
//       {children}
//     </ContextCart.Provider>
//   );
// }
import React, { createContext, useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

export const ContextCart = createContext();

export default function ContextCartProvider({ children }) {
  const [cartItems, setCartItems] = useState({});
  const [user, setUser] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const emailTimeoutRef = useRef(null);

  // Email config
  const SERVICE_ID = "service_ism9hou";
  const TEMPLATE_ID = "template_ryzv0gr";
  const PUBLIC_KEY = "5ze-NTpf-azbTYzO6";

  // Restore user on app load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Auto-calculate total quantity
  useEffect(() => {
    const total = Object.values(cartItems).reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    setTotalQuantity(total);
  }, [cartItems]);

  // ⏳ Auto-schedule email when cart changes
  useEffect(() => {
    if (!user || Object.keys(cartItems).length === 0) return;

    clearTimeout(emailTimeoutRef.current); // Cancel previous timer

    emailTimeoutRef.current = setTimeout(() => {
      sendCombinedCartEmail();
    }, 30000); // 30 seconds delay
  }, [cartItems]);

  // ✉️ Send Abandoned Cart Email
  const sendCombinedCartEmail = () => {
    if (!user || Object.keys(cartItems).length === 0) return;

    const combinedInfo = Object.values(cartItems)
      .map(({ product, quantity }) => `${product.title} - Qty: ${quantity}`)
      .join("\n");

    const total = Object.values(cartItems).reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0
    );

    const templateParams = {
      product_name: "Combined Cart Summary",
      product_qty: combinedInfo,
      product_price: `$${total.toFixed(2)}`,
      to_email: user.email || "manalpatel.mn2854@gmail.com",
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((res) => console.log("✅ Cart email sent:", res.status))
      .catch((err) => console.error("❌ Email failed:", err?.text || err));
  };

  // 🔓 Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCartItems({});
  };

  return (
    <ContextCart.Provider
      value={{
        cartItems,
        setCartItems,
        user,
        setUser,
        logout,
        totalQuantity,
        setTotalQuantity,
      }}
    >
      {children}
    </ContextCart.Provider>
  );
}
