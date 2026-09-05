"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../../components/Footer";
import { useAuth } from "../../src/context/AuthContext"; // adjust path if needed
import packages from "../data/packages.json";

// Login Required Modal Component
function LoginRequiredModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Please Login First
        </h2>
        <p className="text-gray-600 mb-8">
          You need to be logged in to explore packages and customize your tour.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/auth"
            className="flex-1 bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition"
            onClick={onClose}
          >
            Login / Sign Up
          </Link>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Packages list page component
 * @returns {JSX.Element} Packages list UI
 */
export default function Packages() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState("All");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check auth when page loads
  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    }
  }, [user, loading]);

  // Function to determine the main cover image
  const getCoverImage = (pkg) =>
    pkg.images && pkg.images.length > 0
      ? pkg.images[0]
      : "/placeholder-image.jpg";

  // Protect Customize Tour button
  const handleCustomizeClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  // Optional: Protect individual package links
  const handleExploreClick = (e) => {
    if (!user) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4 mt-24 md:p-20 md:mt-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section: Title and Top Buttons */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 border-b pb-6">
            <h1 className="text-4xl font-garamond font-bold text-gray-800 mb-4 sm:mb-0">
              Our Exclusive Travel Packages 🗺️
            </h1>
            <div className="flex space-x-4">
              <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition duration-150 shadow-lg text-sm md:text-base">
                <span className="mr-2 text-xl">💳</span> Pay Now
              </button>

              {/* Protected Customize Tour Button */}
              <Link
                href={user ? "/customize-tour" : "#"}
                onClick={handleCustomizeClick}
              >
                <button className="flex items-center px-4 py-2 border border-black text-black bg-white rounded-lg font-medium hover:bg-gray-100 transition duration-150 shadow-lg text-sm md:text-base">
                  <span className="mr-2 text-xl">🛠️</span> Customize a Tour
                </button>
              </Link>
            </div>
          </header>

          {/* Packages List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition duration-300 ease-in-out border border-gray-100"
              >
                <div className="relative">
                  <img
                    src={getCoverImage(pkg)}
                    alt={pkg.name}
                    className="w-full h-56 object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    {pkg.days} DAYS | {pkg.nature}
                  </span>
                </div>

                <div className="p-6 flex flex-col justify-between h-auto">
                  <div>
                    <h3 className="text-2xl font-garamond font-bold text-gray-800 mb-2">
                      {pkg.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3 min-h-[4.5rem]">
                      {pkg.description}
                    </p>

                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                        Key Highlights:
                      </p>
                      <p className="text-sm text-gray-700 font-sans line-clamp-2">
                        {pkg.highlights}
                      </p>
                    </div>
                  </div>

                  {/* Protected Explore Details Button */}
                  <Link
                    href={user ? `/packages/${pkg.id}` : "#"}
                    onClick={handleExploreClick}
                    className="block mt-4"
                  >
                    <button className="group w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-black border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition duration-200 shadow-md">
                      <span className="text-base tracking-wider">
                        Explore Details
                      </span>
                      <img
                        src="/assets/Footer/view-icon.png"
                        alt="View Icon"
                        className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:scale-110 group-hover:invert"
                      />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />

      {/* Login Required Popup */}
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}