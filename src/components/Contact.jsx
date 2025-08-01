import React, { useState } from "react";
import NavBar from "./NavBar";
import PageWrapper from "./PageWrapper";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, message } = formData;

    if (!name || !email || !message) {
      toast.warn(" Please fill out all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.warn(" Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(" Your message has been sent. Thank you!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(" Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error("Contact error:", error);
      toast.error(" Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-base-200 text-base-content">
        <NavBar />

        <div className="max-w-3xl mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="text-primary">Contact Us</span>
          </h1>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            We’d love to hear from you. Send us your queries or feedback!
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-base-300 p-6 rounded-lg shadow-md"
          >
            <div>
              <label htmlFor="name" className="label label-text font-medium">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="input input-bordered w-full"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="email" className="label label-text font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                aria-required="true"
              />
            </div>

            <div>
              <label htmlFor="message" className="label label-text font-medium">
                Your Message
              </label>
              <textarea
                id="message"
                className="textarea textarea-bordered w-full"
                placeholder="Write your message here..."
                rows="5"
                value={formData.message}
                onChange={handleChange}
                aria-required="true"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {status && (
              <div className="text-sm mt-2 text-center">
                <span
                  className={`${
                    status.startsWith("✅")
                      ? "text-green-500"
                      : status.startsWith("⚠️")
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {status}
                </span>
              </div>
            )}
          </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Contact;
