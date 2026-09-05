// components/LoginRequiredModal.js
"use client";

import Link from "next/link";

export default function LoginRequiredModal({ isOpen, onClose }) {
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