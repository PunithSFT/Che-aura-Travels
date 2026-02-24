"use client";

import { useState } from "react";
import Link from "next/link";
// Assuming these paths are correct relative to your project structure
import Footer from "../../components/Footer";

// Assuming the data is located here
import packages from "../data/packages.json"; 

/**
 * Packages list page component
 * @returns {JSX.Element} Packages list UI
 */
export default function Packages() {
  // Simple state for potential filtering/sorting features (not implemented here but good to keep)
  const [filter, setFilter] = useState("All"); 

  // Function to determine the main cover image
  // Your packages.json uses 'images' array, so we'll grab the first one.
  const getCoverImage = (pkg) => pkg.images && pkg.images.length > 0 ? pkg.images[0] : '/placeholder-image.jpg';

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
              <button className="flex items-center px-4 py-2 border border-black text-black bg-white rounded-lg font-medium hover:bg-gray-100 transition duration-150 shadow-lg text-sm md:text-base">
                <span className="mr-2 text-xl">🛠️</span> Customize a Tour
              </button>
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
                  {/* Tag for Nature/Days */}
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

                    {/* Highlights Section */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Key Highlights:</p>
                      <p className="text-sm text-gray-700 font-sans line-clamp-2">
                        {pkg.highlights}
                      </p>
                    </div>
                  </div>

                  {/* View Package Button with Image Icon */}
                  <Link href={`/packages/${pkg.id}`} className="block mt-4">
                    <button className="group w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white text-black border border-black rounded-lg font-semibold hover:bg-black hover:text-white transition duration-200 shadow-md">
                      <span className="text-base tracking-wider">Explore Details</span>
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
    </div>
  );
}