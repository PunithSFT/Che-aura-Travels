"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Footer from "../../components/Footer";




/**
 * Skeleton component for loading state
 * @returns {JSX.Element} Skeleton UI for About page
 */
const AboutUsSkeleton = () => (
  <div className="animate-pulse">
    {/* Hero Section Skeleton */}
    <div className="h-[70vh] bg-gray-300"></div>

    {/* Founder Card Skeleton */}
    <div className="relative max-w-5xl mx-auto px-4 -mt-16">
      <div className="relative block md:grid md:grid-cols-[850px_240px] md:gap-20 md:items-start md:-ml-[250px]">
        <div className="relative md:hidden h-72 w-full flex justify-center order-1 mb-8">
          <div className="w-52 h-64 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="relative mt-0 md:mt-64 md:ml-[450px]">
          <div className="relative w-full max-w-[900px] mx-auto h-auto pt-10 pb-6 md:w-[565px] md:h-[423.42px] z-10 bg-gray-200 shadow-xl flex flex-col items-center justify-center p-6 md:p-[75px]">
            <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>
        <div className="hidden md:block relative">
          <div className="w-[246px] h-[307px] bg-gray-300 mt-10 ml-8"></div>
        </div>
      </div>
    </div>

    {/* Our Mission Skeleton */}
    <div className="max-w-5xl mx-auto px-4 mt-20 md:mt-48 md:ml-[350px]">
      <div className="block md:grid md:grid-cols-[300px_1fr] md:gap-10 md:items-start">
        <div className="flex justify-center order-2 md:order-1">
          <div className="w-full max-w-sm h-auto md:w-[472px] md:h-[500px] bg-gray-300 rounded-md"></div>
        </div>
        <div className="relative mt-8 md:mt-[150px] ml-0 md:ml-[100px] order-1 md:order-2 text-center md:text-left">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4 md:mb-8"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 сімей: bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    </div>

    {/* Meet the Team Skeleton */}
    <div className="mt-16 py-16 md:mt-20 md:py-24 bg-gray-100 text-center">
      <div className="h-6 bg-gray-300 rounded w-1/4 mx-auto"></div>
    </div>

    {/* Mountain CTA Skeleton */}
    <div className="h-[300px] md:h-[526px] bg-gray-300"></div>
  </div>
);

/**
 * About page component
 * @returns {JSX.Element} About page content
 */
export default function AboutUs() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <AboutUsSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative h-[70vh] bg-cover bg-center text-white"
          style={{ backgroundImage: "url('/assets/AboutUs/Kalawewa.png')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
            <h1 className="text-5xl md:text-6xl tracking-[0.2em] font-semibold uppercase mb-4">
              About Us
            </h1>
            <p className="max-w-3xl leading-relaxed">
              Our Mission is to provide safe, comfortable, and memorable travel
              experiences delivering personalized service, punctuality, and
              hospitality that exceed expectations, while promoting the beauty and
              culture of our destinations.
            </p>
          </div>
        </section>

        {/* Founder Card Section */}
        <section className="relative max-w-5xl mx-auto px-4 -mt-16">
          <div className="relative block md:grid md:grid-cols-[850px_240px] md:gap-20 md:items-start md:-ml-[250px]">
            {/* Mobile Image and Logo Overlay */}
            <div className="relative md:hidden h-72 w-full flex justify-center order-1 mb-8">
              <img
                src="/assets/AboutUs/Founder.png"
                alt="Founder"
                className="w-52 h-64 object-cover shadow-2xl rounded-lg"
              />
              <div className="absolute bottom-4 right-1/2 translate-x-[25%] z-20 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center p-1">
                <img
                  src="/assets/AboutUs/Logo.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Text Card & Logo (Desktop) */}
            <div className="relative mt-0 md:mt-64 md:ml-[450px]">
              <div className="relative w-full max-w-[900px] mx-auto h-auto pt-10 pb-6 md:w-[565px] md:h-[423.42px] z-10 bg-white shadow-xl flex flex-col items-center justify-center p-6 md:p-[75px]">
                <h2 className="text-xl md:text-3xl font-semibold mb-4 text-center">
                  Meet Our Founder
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  At CheAura Travel, our story began with a simple vision — to
                  share the unmatched beauty of Sri Lanka with the world. Guided by
                  passion and years of experience, our founder built CheAura
                  Travels on the belief that every journey should be more than a
                  trip — it should be an authentic experience filled with culture,
                  adventure, and unforgettable memories.
                </p>
                <div className="hidden md:block relative mt-2 mr-16">
                  <div className="border-l border-gray-700 h-12 -mt-8 -ml-[200px]"></div>
                  <div className="border-t border-gray-700 w-12 -ml-[200px]"></div>
                </div>
              </div>
              <div className="hidden md:block absolute -left-[320px] bottom-[0px] z-0">
                <div className="w-[233px] h-[290px] rounded-lg bg-white shadow flex items-center justify-center">
                  <img
                    src="/assets/AboutUs/Logo.png"
                    alt="Logo"
                    className="w-[233px] h-[290px] object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Founder Image & Black Background (Desktop) */}
            <div className="hidden md:block relative">
              <img
                src="/assets/AboutUs/Founder.png"
                alt="Founder"
                className="relative z-10 w-[246px] h-[307px] object-cover shadow-xl mt-10 ml-8"
              />
              <div className="absolute top-[64px] -left-[125px] w-[321px] h-[708px] bg-black/90" />
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="max-w-5xl mx-auto px-4 mt-20 md:mt-48 md:ml-[350px]">

                {/* MOBILE: block flow | DESKTOP: Original grid preserved with md: */}
                <div className="block md:grid md:grid-cols-[300px_1fr] md:gap-10 md:items-start">

                    {/* Image: MOBILE: Centered, w-full, max-w-sm, h-auto. DESKTOP: Original fixed size preserved with md: */}
                    <div className="flex justify-center order-2 md:order-1">
                        <img
                            src="/assets/AboutUs/mission.png"
                            alt="Mission"
                            className="w-full max-w-sm h-auto object-cover rounded-md shadow md:w-[472px] md:h-[500px]"
                        />
                    </div>

                    {/* Text Block: MOBILE: Centered text, standard mt-8, ml-0. DESKTOP: Original offsets preserved with md: */}
                    <div className="relative mt-8 md:mt-[150px] ml-0 md:ml-[100px] order-1 md:order-2 text-center md:text-left">
                        <h3 className="text-2xl font-semibold mb-4 md:mb-8">Our Mission</h3>
                        <p className="text-gray-600 text-sm leading-relaxed px-2 md:px-0">
                            At CheAura Travels, our mission is to craft journeys that go beyond<span className='hidden md:inline'><br /></span>
                            sightseeing — experiences that connect travelers with the heart of<span className='hidden md:inline'><br /></span>Sri Lanka. We are dedicated to offering personalized tours that<span className='hidden md:inline'><br /></span>highlight the island's rich culture, breathtaking landscapes, and<span className='hidden md:inline'><br /></span>warm hospitality. By combining authenticity with comfort, we strive<span className='hidden md:inline'><br /></span>to make every journey unforgettable, turning each trip into a story<span className='hidden md:inline'><br /></span>worth sharing.
                        </p>
                        {/* Decorative Borders (Hidden on mobile, preserved with md: for desktop) */}
                        <div className="hidden md:block">
                            <div className="border-l border-gray-700 h-12 -mt-8 ml-[472px]"></div>
                            <div className=" border-t border-gray-700 w-12 ml-[425px]"></div>
                        </div>
                    </div>
                </div>
            </section>

        {/* Meet the Team Spacer */}
        <section className="mt-16 py-16 md:mt-20 md:py-24 bg-gray-100 text-center">
          <p className="tracking-widest text-gray-500 -mt-0 md:-mt-20">MEET THE TEAM</p>
        </section>

        {/* Mountain CTA Section */}
        <section
          className="relative h-[300px] md:h-[526px] bg-cover bg-center text-white"
          style={{ backgroundImage: "url('/assets/AboutUs/banner.png')" }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
            <h3 className="text-xl md:text-2xl mb-2">Discover Sri Lanka With Us</h3>
            <p className="text-xs md:text-sm max-w-xl opacity-90 mb-4">
              Your next adventure is just a click away. Explore our carefully
              curated travel packages and find the journey that's perfect for you.
            </p>
            <Link href="/packages">
              <button className="px-8 py-2 md:px-10 border text-sm bg-transparent text-white hover:bg-gray-300/40 transition duration-300">
                Explore
              </button>
            </Link>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}