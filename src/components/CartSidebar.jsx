// components/CartSidebar.jsx
import { motion } from "framer-motion";
import { useContext } from "react";
import { ContextCart } from "./ContextCart";
import { DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const sidebarVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

export default function CartSidebar({ onClose }) {
  const { cartItems, setCartItems } = useContext(ContextCart);
  const navigate = useNavigate();

  const cartArray = Object.values(cartItems);

  const subtotal = cartArray.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const vat = +(subtotal * 0.1).toFixed(2);
  const discount = cartArray.reduce(
    (sum, item) =>
      sum +
      item.product.price *
        item.quantity *
        ((item.product.discountPercentage || 0) / 100),
    0
  );
  const total = subtotal + vat - discount;

  return (
    <motion.div
      className="fixed top-0 right-0 w-full sm:w-[400px] h-full bg-base-100 shadow-lg z-50 overflow-y-auto"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <button onClick={onClose} className="btn btn-sm btn-outline">
          Close
        </button>
      </div>

      <div className="p-4 space-y-4">
        {cartArray.length === 0 ? (
          <p className="text-sm">Your cart is empty.</p>
        ) : (
          cartArray.map(({ product, quantity }) => (
            <div
              key={product.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <img
                src={product.images[0]}
                alt={product.title}
                className="h-14 w-14 object-contain rounded"
              />
              <div className="flex-1 mx-2">
                <p className="text-sm font-medium">{product.title}</p>
                <p className="text-xs text-gray-500">Qty: {quantity}</p>
              </div>
              <p className="text-sm">
                ${(product.price * quantity).toFixed(2)}
              </p>
            </div>
          ))
        )}

        {cartArray.length > 0 && (
          <>
            <div className="mt-4 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>VAT:</span>
                <span>${vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-success">
                <span>Discount:</span>
                <span>-${discount.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button className="btn btn-success w-full mt-4 text-white">
              Proceed to Checkout
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
