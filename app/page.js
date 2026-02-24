"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from "../components/Footer";


const HomeSkeleton = () => (
  <div className="animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="p-4 sm:p-[20px]">
      <div className="h-[600px] sm:h-[725px] bg-gray-300 rounded-lg sm:rounded-3xl"></div>
    </div>

    {/* Explore Popular Locations Section Skeleton */}
    <div className="py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="h-64 bg-gray-300 rounded-xl"></div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <div className="h-32 bg-gray-300 rounded-xl"></div>
            <div className="h-32 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Why Choose Us Section Skeleton */}
    <div className="py-10 px-4 bg-white mb-6 sm:mb-10">
      <div className="max-w-7xl mx-auto text-center">
        <div className="h-8 bg-gray-300 rounded w-1/3 mx-auto mb-3"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mb-10"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="p-6 bg-gray-200 rounded-xl h-40"></div>
          <div className="p-6 bg-gray-200 rounded-xl h-40"></div>
          <div className="p-6 bg-gray-200 rounded-xl h-40"></div>
          <div className="p-6 bg-gray-200 rounded-xl h-40"></div>
        </div>
      </div>
    </div>

    {/* Dream Journey CTA Section Skeleton */}
    <div className="py-20 sm:py-64 bg-gray-300">
      <div className="text-center mx-auto px-4">
        <div className="h-8 bg-gray-400 rounded w-1/2 mx-auto mb-3"></div>
        <div className="h-4 bg-gray-400 rounded w-1/3 mx-auto mb-10"></div>
        <div className="h-12 w-32 bg-gray-400 rounded-full mx-auto"></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a 1 second loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="flex-grow bg-bg-light-gray pt-4 sm:pt-0">
        {/* Hero Section */}
        <div className="p-4 bg-white rounded-xl sm:p-[20px] sm:rounded-3xl">
          <section
            className="relative h-[600px] sm:h-[725px] bg-cover bg-center rounded-lg sm:rounded-3xl overflow-hidden"
            style={{
              backgroundImage: "url('/assets/Home/background.png')"
            }}
          >
            <div className="relative z-10 flex flex-col h-full px-4">
              <div className="absolute bottom-0 left-0 right-0 flex flex-col sm:flex-row justify-between items-start sm:items-end p-4 sm:p-8">
                <h1
                  className="relative bottom-4 sm:bottom-10 left-0 sm:left-6 text-4xl leading-snug sm:text-6xl font-light font-poppins antialiased text-white text-left mb-8 sm:mb-0"
                  style={{
                    lineHeight: '1.2',
                    letterSpacing: '0.01em'
                  }}
                >
                  Begin your<br />journey at<br />Sri Lanka with us
                </h1>
                <div className="relative bottom-0 right-0 sm:bottom-10 sm:right-6 backdrop-blur-sm bg-white/20 rounded-full p-1 flex items-center shadow-2xl w-full max-w-sm sm:max-w-lg">
                  <input
                    type="text"
                    placeholder="Search destination"
                    className="flex-grow py-2 px-6 text-base sm:text-[16px] text-white placeholder-gray-300 bg-transparent outline-none"
                  />
                  <button className="text-white p-2 rounded-full mr-1">
                    <Search size={24} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Explore Popular Locations Section */}
        <section className="py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <p className="text-dark-text text-xs font-thin uppercase tracking-wider mb-1">TRAVELER’S FAVOURITE</p>
            <h2 className="text-3xl font-poppins font-medium text-dark-text mb-3">
              Explore All Popular<br className="sm:hidden" />Locations
            </h2>
            <p className="text-dark-text text-sm font-normal uppercase tracking-wider mb-8">
              Discover breathtaking destinations around the world.<br />Your next adventure starts here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="relative rounded-xl overflow-hidden">
                <img src="/assets/Home/mirissa.png" alt="Palm Trees" className="w-full object-cover" />
                <div className="absolute font-garamond bottom-4 left-4 text-white opacity-80">
                  <h3 className="text-2xl font-bold">Mirissa</h3>
                  <p className="text-base">Sri Lanka</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                <div className="relative rounded-xl overflow-hidden">
                  <img src="/assets/Home/sigiriya.png" alt="Sigiriya" className="w-full object-cover" />
                  <div className="absolute font-garamond bottom-4 left-4 text-white opacity-80">
                    <h3 className="text-xl font-bold">Sigiriya</h3>
                    <p className="text-sm">Sri Lanka</p>
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden">
                  <img src="/assets/Home/THALPE.png" alt="Waterfall" className="w-full object-cover" />
                  <div className="absolute font-garamond bottom-4 left-4 text-white opacity-80">
                    <h3 className="text-xl font-bold">Thalpe</h3>
                    <p className="text-sm">Sri Lanka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-10 px-4 bg-white mb-6 sm:mb-10">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-dark-text font-montserrat mb-3">Why Choose Us</h2>
            <p className="text-gray-600 mb-12 text-sm font-montserrat mx-auto">
              We believe travel should be simple, secure, and unforgettable. That’s why we bring you a seamless booking experience,<br/>trusted partners, and exclusive benefits designed to make every journey stress-free.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="p-6 bg-bg-light-gray rounded-xl shadow-sm flex flex-col items-center text-center">
                <img src="/assets/Home/bestSeller.png" alt="Best Price" className="mb-3 w-12 h-12" />
                <h3 className="text-lg font-semibold text-dark-text mb-1">Best Price</h3>
                <p className="text-gray-600 text-xs">Enjoy competitive rates and exclusive discounts you won’t find anywhere else.</p>
              </div>
              <div className="p-6 bg-bg-light-gray rounded-xl shadow-sm flex flex-col items-center text-center">
                <img src="/assets/Home/verified.png" alt="Verified Trip" className="mb-3 w-12 h-12" />
                <h3 className="text-lg font-semibold text-dark-text mb-1">Verified Trip</h3>
                <p className="text-gray-600 text-xs">Travel with confidence, led by experienced and certified local experts.</p>
              </div>
              <div className="p-6 bg-bg-light-gray rounded-xl shadow-sm flex flex-col items-center text-center">
                <img src="/assets/Home/customer-service.png" alt="Best Helper" className="mb-3 w-12 h-12" />
                <h3 className="text-lg font-semibold text-dark-text mb-1">24/7 Support</h3>
                <p className="text-gray-600 text-xs">Our support team is here around the clock to assist you wherever you are.</p>
              </div>
              <div className="p-6 bg-bg-light-gray rounded-xl shadow-sm flex flex-col items-center text-center">
                <img src="/assets/Home/booking.png" alt="Easy Booking" className="mb-3 w-12 h-12" />
                <h3 className="text-lg font-semibold text-dark-text mb-1">Easy Booking</h3>
                <p className="text-gray-600 text-xs">A quick, hassle-free booking process designed for smooth travel planning.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Dream Journey CTA Section */}
        <section className="relative py-20 sm:py-64 bg-cover bg-center font-montserrat" style={{ backgroundImage: "url('/assets/Home/banner2.png')" }}>
          <div className="relative z-10 text-center text-white mx-auto px-4">
            <h2 className="text-3xl font-semibold mb-3">Your Dream Journey Starts Here</h2>
            <p className="text-sm mb-10 font-thin font-montserrat max-w-sm mx-auto">
              Book your unforgettable adventure today and discover breathtaking destinations, unique cultures, and experiences that last a lifetime.
            </p>
            <Link href="/packages">
              <button className="backdrop-blur-lg text-white py-3 px-10 rounded-full text-sm font-thin hover:bg-primary-green/90 transition duration-300">
                BOOK NOW
              </button>
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}