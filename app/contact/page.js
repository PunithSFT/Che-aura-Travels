"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";



/**
 * Skeleton component for contact form loading state
 * @returns {JSX.Element} Skeleton UI for contact form
 */
const ContactFormSkeleton = () => (
  <div className="p-6 md:p-12 space-y-6 animate-pulse order-2 md:order-1">
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-2/4 mb-2"></div>
    <div className="h-16 bg-gray-200 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
    <div className="h-8 bg-gray-200 rounded"></div>
    <div className="flex justify-end pt-4 md:pt-8">
      <div className="h-8 w-16 bg-gray-300 rounded"></div>
    </div>
  </div>
);

/**
 * Contact page component
 * @returns {JSX.Element} Contact page content
 */
export default function ContactUs() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-bg-light-gray">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative h-[60vh] bg-cover bg-center text-center text-white"
          style={{ backgroundImage: "url('/assets/ContactUs/pinnawala.png')" }}
        >
          <div className="absolute inset-0"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
            <h1 className="text-4xl md:text-[64px] font-garamond font-thin uppercase">
              Contact Us
            </h1>
          </div>
        </section>

        {/* Main Contact Content */}
        <section className="py-10 md:py-20 px-4 -mt-16 md:-mt-24 relative z-20">
          <div className="max-w-xl md:max-w-5xl mx-auto bg-[#EEEDF1] shadow-2xl block md:grid md:grid-cols-2 min-h-[500px]">
            {/* Contact Form or Skeleton */}
            {loading ? (
              <ContactFormSkeleton />
            ) : (
              <div className="p-6 md:p-12 flex flex-col justify-between order-2 md:order-1">
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-garamond font-thin text-gray-700 text-sm"
                    >
                      Hello there, my name is
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary-green text-[14px] text-dark-text bg-transparent"
                      placeholder="your name here"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block font-garamond font-thin text-gray-700 text-sm"
                    >
                      and I'm looking for a team to help with me
                    </label>
                    <textarea
                      id="description"
                      rows="3"
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary-green text-[14px] text-dark-text bg-transparent resize-none"
                      placeholder="short description..."
                    ></textarea>
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-garamond font-thin text-gray-700 text-sm"
                    >
                      you can reach me at
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary-green text-[14px] text-dark-text bg-transparent"
                      placeholder="your email address"
                    />
                  </div>
                  <div className="flex justify-end pt-4 md:pt-8">
                    <button
                      type="submit"
                      className="text-xl md:text-2xl font-semibold font-garamond text-dark-text"
                    >
                      SEND
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-[#61A5A1] p-6 md:p-12 flex flex-col justify-center space-y-4 md:space-y-6 order-1 md:order-2">
              <div className="bg-gray-800 w-full p-3 text-gray-400 text-sm md:w-[350px] md:-ml-14">
                077 4761 092
              </div>
              <div className="bg-gray-800 w-full p-3 text-gray-400 text-sm md:w-[350px] md:-ml-14">
                chehanawamini43@gmail.com
              </div>
              <div className="bg-gray-800 w-full p-3 text-gray-400 text-sm md:w-[350px] md:-ml-14">
                64 Stratford Ave, Colombo 00600
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}