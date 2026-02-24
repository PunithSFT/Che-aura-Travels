"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../src/context/AuthContext";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  const handleDeleteProfile = async () => {
    setDeleteError("");
    setDeleteLoading(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete profile");
      }
      alert("Account successfully deleted. We're sorry to see you go!");
      logout();
      router.push("/");
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-xl text-gray-600 animate-pulse">Loading your profile...</p>
      </div>
    );
  }

  if (!user) return null;

  // ADDED: Block unverified users with nice message
  if (!user.isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="text-center p-8 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,29,61,0.15)] border border-gray-100 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-[#001d3d] mb-4">Email Not Verified</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Please check your inbox ({user.email}) and click the verification link we sent you to activate your account.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#001d3d] text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10"
          >
            I've Verified — Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center mt-12 py-20 px-4 bg-[#f8f9fa]">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,29,61,0.15)] border border-gray-100">
          
          {/* Left Sidebar: Brand/Visual Column */}
          <div className="bg-[#001d3d] p-10 text-white flex flex-col items-center justify-center text-center">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl mb-6 transition-transform duration-500 group-hover:scale-105">
                <img
                  src={user.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{user.name || "Traveler"}</h2>
            <p className="text-blue-200 text-sm mt-2 opacity-80">Explorer Member</p>
           
            <div className="mt-10 pt-10 border-t border-white/10 w-full">
              <p className="text-xs uppercase tracking-[0.2em] text-blue-300 font-semibold mb-2">Member Since</p>
              <p className="text-sm">October 2023</p>
            </div>
          </div>

          {/* Right Content: Details Column */}
          <div className="md:col-span-2 p-10 md:p-16">
            <header className="flex justify-between items-center mb-12">
              <h1 className="text-3xl font-extrabold text-[#001d3d] tracking-tight">Account Details</h1>
              <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-widest rounded-full text-gray-500">Verified</span>
            </header>
            <div className="grid grid-cols-1 gap-y-8">
              <DetailItem label="Full Name" value={user.name} />
              <DetailItem label="Email Address" value={user.email} />
              <DetailItem label="Phone Number" value={user.phone} />
             
              <div className="pt-4">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Professional Bio / Note
                </label>
                <p className="text-[#001d3d] leading-relaxed bg-gray-50 p-4 rounded-xl italic">
                  "{user.bio || "Share your travel philosophy here..."}"
                </p>
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <Link href="/profile/edit" className="flex-1">
                <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-[#001d3d] transition-all duration-300 shadow-lg shadow-black/10">
                  Edit Profile
                </button>
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 py-4 text-red-500 text-sm font-bold border border-red-100 rounded-xl hover:bg-red-50 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>
            <p className="text-gray-700 mb-6">
              This action cannot be undone. All your data (bookings, profile, etc.) will be permanently deleted.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your password to confirm
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl focus:outline-none focus:border-red-500"
              />
              {deleteError && <p className="text-red-600 text-sm mt-2">{deleteError}</p>}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError("");
                  setPassword("");
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-800 rounded-xl font-medium hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProfile}
                disabled={deleteLoading || !password}
                className={`flex-1 py-3 text-white rounded-xl font-medium transition ${
                  deleteLoading || !password
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

// Reusable DetailItem component (unchanged)
function DetailItem({ label, value }) {
  return (
    <div className="border-b border-gray-50 pb-4">
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}
      </label>
      <p className="text-lg font-medium text-[#001d3d]">{value || "Not provided"}</p>
    </div>
  );
}