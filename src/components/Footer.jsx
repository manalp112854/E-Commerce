import React from "react";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  MailOutlined,
} from "@ant-design/icons";

export default function Footer() {
  return (
    <footer className="bg-base-100 text-base-content mt-6">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 items-start">
          {/* Brand Column */}
          <div>
            <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
              <img
                className="h-10 w-10 rounded-full object-cover"
                src="/Daco_4160577.png"
                alt="logo"
              />
              Brand
            </h2>

            <p className="text-sm mt-2">
              Best information about the company goes here but now lorem ipsum
              is
            </p>
            <div className="flex gap-3 mt-4 text-lg text-base-content">
              <FacebookOutlined className="hover:text-primary" />
              <TwitterOutlined className="hover:text-primary" />
              <LinkedinOutlined className="hover:text-primary" />
              <MailOutlined className="hover:text-error" />
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-medium text-base-content mb-4">About</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Find store</li>
              <li>Categories</li>
              <li>Blogs</li>
            </ul>
          </div>

          {/* Partnership */}
          <div>
            <h3 className="font-medium text-base-content mb-4">Partnership</h3>
            <ul className="space-y-2 text-sm">
              <li>About Us</li>
              <li>Find store</li>
              <li>Categories</li>
              <li>Blogs</li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-medium text-base-content mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>Help Center</li>
              <li>Money Refund</li>
              <li>Shipping</li>
              <li>Contact us</li>
            </ul>
          </div>

          {/* For users + App links */}
          <div>
            <h3 className="font-medium text-base-content mb-4">For users</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>Login</li>
              <li>Register</li>
              <li>Settings</li>
              <li>My Orders</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-base-content mb-4">Get App</h3>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="w-32"
                />
              </li>
              <li>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="w-32"
                />
              </li>
            </ul>
            <div className="space-y-2"></div>
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div className="bg-base-200 p-5 mt-10 text-sm text-center text-base-content/60">
        © 2025 Ecommerce.
      </div>
    </footer>
  );
}
