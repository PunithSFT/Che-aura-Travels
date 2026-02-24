"use client";

import { Facebook, Instagram, Linkedin, Mail, Twitter } from "lucide-react";
import Link from "next/link";

/**
 * Footer component with newsletter, navigation links, and social media icons
 * @returns {JSX.Element} Footer UI
 */
export default function Footer() {
  const socialIcons = [
    { Icon: Linkedin, href: "#" },
    { Icon: Twitter, href: "#" },
    { Icon: Facebook, href: "#" },
    { Icon: Instagram, href: "#" },
  ];

  return (
    <footer className="bg-white py-20 px-4 md:px-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-32">
          {/* Column 1: Logo, Brand Text, and Newsletter */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-900">
                <img
                  src="/assets/Footer/logo1.png"
                  alt="CheAura Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <Link
                href="/"
                className="text-gray-900 text-xl font-garamond font-medium tracking-tight"
              >
                CheAura Travels
              </Link>
            </div>
            <h3 className="text-gray-900 text-xl font-garamond font-medium mb-1 mt-12">
              Join Our Newsletter
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Connect, share and get exclusive tips!
            </p>
            <div className="flex items-center border border-gray-300 rounded-full p-0.5 -ml-1 shadow-sm w-full max-w-sm">
              <Mail className="text-gray-500 ml-4 mr-2 flex-shrink-0" size={20} />
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-grow py-3 px-1 text-gray-700 outline-none border-none bg-transparent text-sm"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2.5 ml-1 flex-shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-send"
                >
                  <line x1="22" x2="11" y1="2" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>

          {/* Column 2 & 3: Navigation Links */}
          <div className="md:col-span-2 flex justify-between">
            {/* Link Group 1: Navigation */}
            <div className="space-y-4">
              <ul className="space-y-4 text-sm">
                <li>
                  <Link
                    href="/"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/packages"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    Packages
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Link Group 2: Policy */}
            <div className="space-y-4">
              <ul className="space-y-4 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    How to Book?
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-800 font-garamond hover:text-blue-500 transition-colors duration-200"
                  >
                    Terms and Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media Icons (Desktop) */}
            <div className="hidden lg:flex items-start space-x-6">
              {socialIcons.map(({ Icon, href }, index) => (
                <a
                  key={index}
                  href={href}
                  className="text-gray-800 hover:text-blue-500 transition-colors duration-200 border border-gray-300 rounded-full p-2"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Social Icons */}
        <div className="flex justify-center space-x-6 mt-16 lg:hidden">
          {socialIcons.map(({ Icon, href }, index) => (
            <a
              key={index}
              href={href}
              className="text-gray-800 hover:text-blue-500 transition-colors duration-200 border border-gray-300 rounded-full p-2"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-20 text-center text-xs text-gray-500">
          <p>&copy; 2025 codemiDesignX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}