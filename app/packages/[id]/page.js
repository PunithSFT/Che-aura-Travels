"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
// Assuming these paths are correct relative to your project structure
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
// Assuming the data is located here
import packages from "../../data/packages.json"; 

/**
 * Helper component for displaying package details in a clean, consistent format.
 */
const DetailPoint = ({ label, value }) => (
    <div className="flex items-start py-3 border-b border-gray-100 last:border-b-0">
      <p className="w-1/3 text-base font-medium text-gray-700">{label}:</p>
      <p className="w-2/3 text-base text-gray-600">{value}</p>
    </div>
);


/**
 * Package view page component
 * @returns {JSX.Element} Package view UI with scrolling images, detailed description, and booking form.
 */
export default function PackageView() {
  const { id } = useParams();
  // Find package using ID
  const pkg = packages.find((p) => p.id === id);

  // Initialize state with default values based on pkg data, or sensible fallbacks
  const [currentImage, setCurrentImage] = useState(0);
  // Default members is 2, or the value from the data, if pkg exists
  const [members, setMembers] = useState(pkg?.members || 2); 
  // Default car is the first option, or a fallback string
  const [car, setCar] = useState(pkg?.carOptions[0] || "Standard Vehicle"); 
  const [showModal, setShowModal] = useState(false);

  // Auto-scroll images every 3 seconds
  useEffect(() => {
    if (!pkg || pkg.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % pkg.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [pkg]);

  // Handle submit action
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to an API
    setShowModal(true);
  };

  // --- Package Not Found State ---
  if (!pkg) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Adventure Package Not Found</h2>
            <p className="text-gray-600 mb-4">The package you're looking for might have been retired.</p>
            <Link href="/packages" className="text-blue-600 hover:underline font-medium">
              Explore Our Other Packages
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // --- Main Package View ---
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section with Scrolling Images */}
        <section className="relative h-[50vh] md:h-[60vh] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40"></div>
          {pkg.images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${pkg.name} ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-garamond font-bold mb-3 tracking-wide drop-shadow-lg">
              {pkg.name}
            </h1>
            <p className="text-lg md:text-xl font-sans max-w-3xl drop-shadow-md">
              {pkg.description}
            </p>
          </div>
        </section>

        {/* Main Content: Description and Booking Form */}
        <section className="max-w-7xl mx-auto p-4 md:p-10 -mt-16 z-20 relative">
          {/* Main grid: 2/3 for description, 1/3 for form */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Description & Details Section (2/3 width) */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Detailed Tour Overview Card */}
              <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8">
                <h2 className="text-3xl font-garamond font-bold text-gray-800 mb-6 border-b pb-3">
                  Comprehensive Tour Details
                </h2>
                
                <div className="space-y-4 text-gray-600 font-sans">
                  {/* Use full_description if available, otherwise use a generated summary */}
                  {pkg.full_description ? (
                    <p className="text-lg leading-relaxed">
                        {pkg.full_description}
                    </p>
                  ) : (
                     <p className="text-lg leading-relaxed">
                        Embark on a captivating journey with our **{pkg.name}** package. Designed to offer a deep immersion into the local culture and breathtaking landscapes, this tour is an unforgettable experience. Over the course of **{pkg.days} days**, you'll discover hidden gems and iconic landmarks, creating memories to last a lifetime.
                    </p>
                  )}
                  
                </div>

                {/* Key Facts/Highlights Section */}
                <div className="mt-8 border-t pt-6">
                    <h3 className="text-2xl font-garamond font-bold text-gray-800 mb-4">Key Itinerary Facts</h3>
                    <div className="space-y-1">
                        <DetailPoint label="Duration" value={`${pkg.days} Days / ${pkg.days - 1} Nights`} />
                        <DetailPoint label="Tour Nature" value={pkg.nature} />
                        <DetailPoint label="Highlights" value={pkg.highlights} />
                        <DetailPoint label="Inclusions" value={pkg.inclusions} />
                    </div>
                </div>

              </div>
            </div>

            {/* Booking Form Section (1/3 width, sticky) */}
            <div className="md:col-span-1">
              <form 
                onSubmit={handleSubmit} 
                className="sticky top-4 bg-white rounded-xl shadow-xl p-6 lg:p-8 border border-gray-100"
              >
                <h2 className="text-2xl font-garamond font-bold text-gray-800 mb-6 text-center">
                  Request Your Quote
                </h2>
                
                <div className="space-y-5">
                  
                  {/* Number of People Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
                          Number of People
                        </label>
                        <span className="text-xl font-bold text-black">{members}</span>
                    </div>
                    <input
                      id="members"
                      type="range"
                      min="1"
                      max="32"
                      value={members}
                      onChange={(e) => setMembers(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black transition-all duration-300"
                    />
                    <p className="text-xs text-gray-500 mt-1">Adjust based on your group size (Max 32)</p>
                  </div>

                  {/* Car Dropdown */}
                  <div>
                    <label htmlFor="car-select" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Transportation
                    </label>
                    <select
                      id="car-select"
                      value={car}
                      onChange={(e) => setCar(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black font-sans text-gray-800 shadow-sm transition-shadow duration-150"
                    >
                      {pkg.carOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-4 px-4 py-3 bg-black text-white rounded-lg font-semibold text-lg uppercase tracking-wider hover:bg-gray-800 transition duration-200 shadow-md hover:shadow-lg"
                  >
                    Send Booking Request
                  </button>
                  
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform scale-100 transition-transform duration-300 ease-in-out">
              <h3 className="text-2xl font-garamond font-bold text-gray-800 mb-3 text-center">
                Request Sent Successfully!
              </h3>
              <p className="text-gray-600 font-sans mb-6 text-center">
                Thank you for your interest in the **{pkg.name}** tour for **{members}** people, utilizing a **{car}**. Our team will email your personalized quotation shortly.
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition duration-150 text-base"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}