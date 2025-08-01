import React from "react";
import { useContext, useEffect } from "react";
import { ContextCart } from "./ContextCart";
import NavBar from "./NavBar";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
//email config
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import PageWrapper from "./PageWrapper";
import { toast } from "react-toastify";

export default function Cart() {
  const { user, cartItems, setCartItems, setTotalQuantity } =
    useContext(ContextCart);
  const navigate = useNavigate();

  //email config

  const hasScheduledEmail = useRef(false);

  useEffect(() => {
    if (!hasScheduledEmail.current && Object.keys(cartItems).length > 0) {
      hasScheduledEmail.current = true;

      const timeout = setTimeout(() => {
        sendCombinedCartEmail();
      }, 10000); // 10sec

      return () => clearTimeout(timeout);
    }
  }, [cartItems]);

  const updateCart = (id, quantity) => {
    if (quantity === 0) {
      const copy = { ...cartItems };
      delete copy[id];
      setCartItems(copy);
      toast.info("Item removed from cart");
    } else {
      setCartItems({
        ...cartItems,
        [id]: {
          ...cartItems[id],
          quantity,
        },
      });
      toast.success("Cart updated");
    }
  };

  const cartArray = Object.values(cartItems);

  useEffect(() => {
    const newTotal = cartArray.reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(newTotal);
  }, [cartItems]);

  //email
  const SERVICE_ID = "";
  const TEMPLATE_ID = "";
  const PUBLIC_KEY = "";
  const sendCombinedCartEmail = () => {
    if (!user || !Object.keys(cartItems).length) return;

    let combinedInfo = Object.values(cartItems)
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
      to_email: "",
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((res) => {
        console.log("📩 Combined cart email sent:", res.status);
      })
      .catch((err) => {
        console.error("❌ Combined email failed:", err?.text || err);
      });
  };

  //Calculate Summary
  const subtotal = cartArray.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const vat = +(subtotal * 0.1).toFixed(2); // Example 10% VAT
  const discount = cartArray.reduce(
    (sum, item) =>
      sum +
      item.product.price *
        item.quantity *
        ((item.product.discountPercentage || 0) / 100),
    0
  );

  const total = subtotal + vat - discount;

  if (!user) {
    return (
      <div className="bg-base-200">
        <NavBar />
        <button
          className="group relative inline-block overflow-hidden border border-primary px-8 py-3 focus:ring-3 focus:outline-hidden cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <span className="absolute inset-y-0 right-0 w-[2px] bg-primary transition-all group-hover:w-full"></span>
          <span className="relative text-sm font-medium text-primary transition-colors group-hover:text-white">
            <LeftOutlined /> Back
          </span>
        </button>
        <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="mx-auto max-w-xl">
            <header className="text-center">
              <h1 className="text-xl font-bold text-base-content sm:text-3xl">
                Your Cart
              </h1>
            </header>
            <div role="alert" className="alert alert-error mt-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                  />
                </svg>
                <span>Please Login to view your cart.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="bg-base-200 min-h-screen">
        <NavBar />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-base-content mb-6">
            My Cart ({cartArray.length})
          </h1>

          {cartArray.length === 0 ? (
            <div>
              <div className="text-center text-base-content py-20">
                Your cart is empty.
              </div>
              <button
                onClick={() => navigate("/")}
                className="btn btn-outline btn-primary btn-sm"
              >
                &larr; Back to Shop
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="rounded-md p-6 bg-base-100 shadow-sm lg:col-span-2 space-y-6">
                {cartArray.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b bg-base-100 border-base-300"
                  >
                    <div className="flex gap-4">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="h-20 w-20 object-contain rounded cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      />
                      <div>
                        <h2 className="text-sm font-medium text-base-content">
                          {product.title}
                        </h2>
                        <p className="text-xs text-base-content opacity-60 mt-1">
                          Seller: <span>Demo Seller</span>
                        </p>
                        <p className="text-sm font-semibold mt-2 text-base-content">
                          ${product.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
                      <div className="join">
                        <button
                          className="join-item btn btn-xs border border-primary "
                          onClick={() => updateCart(product.id, quantity - 1)}
                        >
                          &minus;
                        </button>
                        <span className="join-item h-6 px-3 flex items-center border border-primary  text-sm text-base-content bg-base-100">
                          {quantity}
                        </span>
                        <button
                          className="join-item btn btn-xs border border-primary "
                          onClick={() =>
                            updateCart(
                              product.id,
                              Math.min(quantity + 1, product.stock)
                            )
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => updateCart(product.id, 0)}
                        className="btn btn-error btn-outline btn-xs"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-outline btn-primary btn-sm"
                  >
                    &larr; Back to Shop
                  </button>
                  <button
                    onClick={() => {
                      setCartItems({});
                      toast.info("All items removed from cart");
                    }}
                    className="btn btn-error btn-outline btn-sm"
                  >
                    Remove All
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-md p-6 bg-base-100 shadow-sm h-fit">
                <h3 className="text-lg font-medium text-base-content mb-4">
                  Order Summary
                </h3>
                <div className="space-y-3 text-sm text-base-content">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (10%)</span>
                    <span>${vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>- ${discount.toFixed(2)}</span>
                  </div>
                  <hr className="border-base-300" />
                  <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  className="mt-6 w-full btn btn-success text-white"
                  onClick={() => toast.success("Order placed successfully!")}
                >
                  Checkout
                </button>
              </div>
            </div>
          )}
          <div className="bg-base-200 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="ml-2 mt-10 py-6 lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-base-content">
                <div className="flex items-center gap-4">
                  <img
                    src="icon.png"
                    alt="Secure Payment"
                    className="h-8 w-8"
                  />
                  <div>
                    <strong>Secure payment</strong>
                    <p>You’re safe with us</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src="icon (1).png"
                    alt="Customer Support"
                    className="h-8 w-8"
                  />
                  <div>
                    <strong>Customer support</strong>
                    <p>We're here to help</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <img
                    src="icon (2).png"
                    alt="Free Delivery"
                    className="h-8 w-8"
                  />
                  <div>
                    <strong>Free delivery</strong>
                    <p>On all orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageWrapper>
  );
}
