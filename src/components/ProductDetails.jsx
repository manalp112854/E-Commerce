import React from "react";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import { ContextCart } from "./ContextCart";
import { useContext } from "react";
import Footer from "./Footer";
import ReactImageZoom from "react-image-zoom";
//email config
import emailjs from "@emailjs/browser";
import PageWrapper from "./PageWrapper";
import { AnimatePresence } from "framer-motion";
import CartSidebar from "./CartSidebar";
import { toast } from "react-toastify";

export default function ProductDetails({ showCart, setShowCart }) {
  const { user, cartItems, setCartItems, setTotalQuantity } =
    useContext(ContextCart);
  const [productDetails, setProductDetails] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const count = cartItems[id]?.quantity || 0;

  const [msg, setMsg] = useState("");

  const [activeTab, setActiveTab] = useState("description");

  const [imageIndex, setImageIndex] = useState(0);

  const [imageLoaded, setImageLoaded] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setImageIndex(0);
    getProductDetails();
  }, [id]);

  async function getProductDetails() {
    let response = await fetch(`https://dummyjson.com/products/${id}`);
    response = await response.json();
    setProductDetails(response);

    // fetch similar products from same category
    if (response.category) {
      const res = await fetch(
        `https://dummyjson.com/products/category/${response.category}`
      );
      const data = await res.json();

      // Exclude the current product from the list
      const similar = data.products.filter((p) => p.id !== response.id);
      setRelatedProducts(similar.slice(0, 4));
    }
  }

  //email config

  const SERVICE_ID = "service_ism9hou";
  const TEMPLATE_ID = "template_ryzv0gr";
  const PUBLIC_KEY = "5ze-NTpf-azbTYzO6";

  const sendCartEmail = (product, quantity) => {
    const templateParams = {
      product_name: product.title,
      product_qty: quantity,
      product_price: product.price,
      to_email: "manalpatel.mn2854@gmail.com", // optional override
    };

    emailjs
      .send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then((res) => {
        console.log("✅ Email sent:", res.status);
      })
      .catch((err) => {
        console.error("❌ Email send failed:", err?.text || err);
      });
  };

  if (!productDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-base-200 text-base-content">
        <div className="animate-pulse text-lg font-medium text-primary bg-primary/10 px-6 py-3 rounded-xl shadow">
          Loading product details...
          <div className="flex items-center justify-center mt-4">
            <img
              src="/Animation - 1750684274271.gif"
              alt="Loading..."
              className="w-20 h-20"
            />
          </div>
        </div>
      </div>
    );
  }

  const updateCart = (quantity) => {
    if (!user) {
      setMsg("Please Login to view your cart.");
      toast.error("Please login to add items to cart.");
    } else {
      setMsg(""); // clear message
      let updatedCart;

      if (quantity === 0) {
        const copy = { ...cartItems };
        delete copy[id];
        updatedCart = copy;
        toast.info("Item removed from cart");
      } else {
        updatedCart = {
          ...cartItems,
          [id]: { product: productDetails, quantity },
        };
        if (!cartItems[id]) {
          toast.success("Item added to cart");
        } else {
          toast.success("Cart updated");
        }
      }

      setCartItems(updatedCart);

      const total = Object.values(updatedCart).reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setTotalQuantity(total);
    }
  };

  const zoomProps = {
    width: 400,
    height: 300,
    zoomWidth: 500,

    img: productDetails.images?.[imageIndex] || "",
    zoomPosition: "right",
    zoomStyle: `
      z-index: 999;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      
    `,
    zoomLensStyle: `
      opacity: 0.3;
      background-color: rgba(128, 128, 128, 0.3);
      border-radius: 4px;
      
    `,
    offset: {
      horizontal: 60,
      vertical: 0,
    },
  };

  return (
    <PageWrapper>
      <div className="relative bg-base-200 min-h-screen text-base-content">
        {/* Sidebar */}
        <AnimatePresence>
          {showCart && <CartSidebar onClose={() => setShowCart(false)} />}
        </AnimatePresence>

        {/* MAIN PAGE CONTENT */}
        <div
          className={`transition-all duration-300 ${
            showCart ? "blur-[2px] pointer-events-none select-none" : ""
          }`}
        >
          {/* <NavBar /> */}
          <NavBar onCartClick={() => setShowCart(true)} />
          <AnimatePresence>
            {showCart && <CartSidebar onClose={() => setShowCart(false)} />}
          </AnimatePresence>

          {/* Back Button */}
          <button
            className="btn btn-outline btn-primary m-4"
            onClick={() => navigate("/")}
          >
            <LeftOutlined className="mr-1" />
            Back
          </button>

          {/* Product Section */}
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto p-4 bg-base-100 rounded-md shadow border border-base-300">
            {/* Image Section */}
            <div className="space-y-4">
              <div className="border rounded-md w-full h-72 flex justify-center items-center bg-base-200 ">
                {/* Image Loader */}
                <img
                  src={productDetails.images?.[imageIndex]}
                  alt="preload"
                  className="hidden"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(false)}
                />
                {imageLoaded ? (
                  <ReactImageZoom {...zoomProps} />
                ) : (
                  <span className="text-sm text-base-content/60 animate-pulse">
                    Loading zoom...
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto mt-2">
                {productDetails.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`thumb-${i}`}
                    className={`w-16 h-16 object-contain border rounded-md cursor-pointer ${
                      i === imageIndex
                        ? "border-indigo-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setImageIndex(i)}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-xl font-semibold text-base-content">
                  {productDetails.title}
                </h1>
                <p className="text-xl text-error font-semibold">
                  ${productDetails.price}
                </p>
              </div>

              <div className="text-sm flex items-center gap-2 text-warning">
                ⭐ {productDetails.rating}
                <span className="text-base-content/60">
                  | {productDetails.stock} in stock
                </span>
              </div>

              <div className="w-[80%] text-sm divide-y divide-base-300">
                {[
                  ["Brand", productDetails.brand],
                  ["Category", productDetails.category],
                  ["SKU", productDetails.sku],
                  ["Warranty", productDetails.warrantyInformation || "N/A"],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex justify-between px-4 py-2">
                    <span className="text-base-content/60 w-1/3">{label}:</span>
                    <span className="text-base-content">{value}</span>
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              {!user ? (
                <p className="text-error text-sm">
                  Please login to add to cart
                </p>
              ) : count === 0 ? (
                <button
                  onClick={() => updateCart(1)}
                  className="btn btn-primary w-full"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="join ">
                    <button
                      className="join-item btn btn-xs border border-primary "
                      onClick={() => updateCart(count - 1)}
                    >
                      −
                    </button>
                    <span className="join-item h-6 px-3 flex items-center border border-primary  text-sm text-base-content bg-base-100">
                      {count}
                    </span>
                    <button
                      className="join-item btn btn-xs border border-primary "
                      onClick={() =>
                        updateCart(Math.min(count + 1, productDetails.stock))
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => updateCart(0)}
                    className="btn btn-error btn-sm"
                  >
                    <DeleteOutlined /> Remove
                  </button>
                </div>
              )}

              {msg && <p className="text-error text-sm">{msg}</p>}
            </div>
          </div>

          {/* Tabs Section */}

          <div className="max-w-5xl mx-auto mt-6 p-4 bg-base-100 rounded-md shadow border border-base-300">
            {/* Tabs Header */}
            <div role="tablist" className="tabs tabs-bordered text-sm">
              <button
                role="tab"
                className={`tab ${
                  activeTab === "description" ? "tab-active text-primary" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                role="tab"
                className={`tab ${
                  activeTab === "reviews" ? "tab-active text-primary" : ""
                }`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews ({productDetails.reviews?.length || 0})
              </button>
            </div>

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="mt-4 text-sm text-base-content space-y-4">
                <p>{productDetails.description}</p>

                <table className="table table-sm w-[80%] mt-4 border border-base-300">
                  <tbody>
                    <tr>
                      <th className="bg-base-200 w-1/3">Model</th>
                      <td>#{productDetails.id}</td>
                    </tr>
                    <tr>
                      <th className="bg-base-200">Brand</th>
                      <td>{productDetails.brand}</td>
                    </tr>
                    <tr>
                      <th className="bg-base-200">Size</th>
                      <td>
                        {productDetails.dimensions?.width} x{" "}
                        {productDetails.dimensions?.height} x{" "}
                        {productDetails.dimensions?.depth} mm
                      </td>
                    </tr>
                    <tr>
                      <th className="bg-base-200">Weight</th>
                      <td>{productDetails.weight} g</td>
                    </tr>
                  </tbody>
                </table>

                <ul className="list-disc list-inside text-base-content/70">
                  <li>Refund Policy: {productDetails.returnPolicy}</li>
                  <li>Shipping Info: {productDetails.shippingInformation}</li>
                  <li>Min Order: {productDetails.minimumOrderQuantity}</li>
                </ul>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="mt-4 space-y-4">
                {productDetails.reviews?.length > 0 ? (
                  productDetails.reviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="card bg-base-200 shadow-sm border border-base-300"
                    >
                      <div className="card-body p-4">
                        <div className="flex justify-between text-sm font-medium text-base-content/80">
                          <span>{review.reviewerName}</span>
                          <span className="text-yellow-500">
                            ⭐ {review.rating}
                          </span>
                        </div>
                        <p className="text-sm text-base-content/70 mt-1">
                          {review.comment}
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-base-content/60">
                    No reviews available.
                  </p>
                )}
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className="max-w-5xl mx-auto mt-6 p-4 bg-base-100 rounded-md shadow border border-base-300">
              <h3 className="text-lg font-semibold text-base-content mb-4">
                You may also like
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="card bg-base-200 hover:bg-base-300 transition-colors shadow-sm hover:shadow-md cursor-pointer"
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    <figure className="h-40 bg-white  flex items-center justify-center">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="object-contain h-full"
                      />
                    </figure>
                    <div className="card-body px-4 py-3 text-sm">
                      <h4 className="font-medium text-base-content truncate">
                        {item.title}
                      </h4>
                      <p className="text-primary font-semibold mt-1">
                        ${item.price}
                      </p>
                      <p className="text-yellow-500 text-xs">
                        ⭐ {item.rating.toFixed(1)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Footer />
        </div>
      </div>
    </PageWrapper>
  );
}
