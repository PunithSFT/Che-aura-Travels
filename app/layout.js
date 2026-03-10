"use client";

import '../app/globals.css';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import { AuthProvider } from '../src/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow min-h-screen">{children}</main>

          {/* ────────────────────────────────────────────────
              Professional White Cookie Consent Banner
              - Cross button now in top-right white space (clear separation)
              - Accept/Reject grouped at bottom-right
          ──────────────────────────────────────────────── */}
          <div
            id="cookie-banner"
            className={`fixed bottom-0 left-0 right-0 bg-white text-gray-800 text-sm p-6 shadow-2xl z-50 border-t border-gray-200 transition-all duration-300 ${
              typeof window !== "undefined" &&
              (document.cookie.includes("cookie_consent=accepted") ||
                document.cookie.includes("cookie_consent=declined"))
                ? "hidden"
                : ""
            }`}
          >
            <div className="max-w-7xl mx-auto ">
              {/* Cross button – positioned in top-right white space */}
              <button
                onClick={() => {
                  const banner = document.getElementById("cookie-banner");
                  if (banner) banner.classList.add("hidden");
                }}
                className="absolute top-1 right-4 text-gray-500 hover:text-gray-700 text-3xl font-light focus:outline-none transition-colors duration-200"
                aria-label="Close cookie banner temporarily"
              >
                ×
              </button>

              {/* Banner content – main text + buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pr-16 sm:pr-0 pt-2">
                <p className="text-gray-600 leading-relaxed flex-1">
                  We use cookies to enhance your browsing experience, enable secure login, remember your preferences, and improve our services. 
                  By continuing, you agree to our use of cookies.{" "}
                  <a href="/privacy" className="text-blue-600 hover:underline font-medium">
                    Learn more
                  </a>
                </p>

                {/* Accept & Reject buttons – grouped bottom-right */}
                <div className="flex gap-4 shrink-0 mt-4 sm:mt-0">
                  <button
                    onClick={() => {
                      document.cookie = "cookie_consent=accepted; path=/; max-age=" + 60 * 60 * 24 * 365; // 1 year
                      const banner = document.getElementById("cookie-banner");
                      if (banner) banner.classList.add("hidden");
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition shadow-md min-w-[140px]"
                  >
                    Accept All
                  </button>

                  <button
                    onClick={() => {
                      document.cookie = "cookie_consent=declined; path=/; max-age=" + 60 * 60 * 24 * 90; // 90 days
                      const banner = document.getElementById("cookie-banner");
                      if (banner) banner.classList.add("hidden");
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition min-w-[140px]"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Auto-hide banner on future visits ONLY if accepted or declined */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                if (document.cookie.includes("cookie_consent=accepted") || document.cookie.includes("cookie_consent=declined")) {
                  const banner = document.getElementById("cookie-banner");
                  if (banner) banner.classList.add("hidden");
                }
              `,
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}