// app/profile/edit/page.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../src/context/AuthContext";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function EditProfilePage() {
  const { user, loading: authLoading, refetchUser } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("/default-avatar.png");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }

    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });
      setPreviewUrl(user.profilePic || "/default-avatar.png");
    }
  }, [user, authLoading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitLoading(true);

    const data = new FormData();
    data.append("name", formData.name.trim());
    if (formData.phone) data.append("phone", formData.phone.trim());
    if (formData.bio) data.append("bio", formData.bio.trim());
    if (profilePic) data.append("profilePic", profilePic);

    try {
      console.log("Sending profile update request...");
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        body: data,
        credentials: "include",
      });

      console.log("Response status:", res.status);

      const result = await res.json();
      console.log("API response:", result);

      if (!res.ok) {
        throw new Error(result.error || "Update failed");
      }

      setSuccess("Profile updated successfully!");
      await refetchUser();
      router.push("/profile");
    } catch (err) {
      console.error("Update error:", err.message);
      setError(err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-xl text-gray-600 animate-pulse">Loading...</p>
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
            Please check your inbox ({user.email}) and click the verification link we sent you to activate your account and enable editing.
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center mt-10 py-20 px-4">
        <div className="max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,29,61,0.1)] border border-gray-100">
          
          {/* Header Section */}
          <div className="bg-[#001d3d] p-8 text-center">
            <h1 className="text-2xl font-bold text-white tracking-tight">Edit Your Explorer Profile</h1>
            <p className="text-blue-200 text-xs mt-2 uppercase tracking-widest opacity-80">Personalize your travel identity</p>
          </div>

          <div className="p-8 md:p-12">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
           
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg transition-transform group-hover:scale-105">
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <label className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full cursor-pointer hover:bg-[#001d3d] shadow-xl transition-colors border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-4">Profile Avatar</p>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div className="relative">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#001d3d] focus:ring-0 transition-all text-[#001d3d] font-medium"
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+94 XX XXX XXXX"
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#001d3d] focus:ring-0 transition-all text-[#001d3d] font-medium"
                  />
                </div>

                <div className="relative">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Bio / Travel Philosophy</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your travel style..."
                    className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-[#001d3d] focus:ring-0 transition-all text-[#001d3d] font-medium resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full bg-black text-white py-4 rounded-xl font-bold text-sm hover:bg-[#001d3d] disabled:bg-gray-300 transition-all shadow-lg shadow-black/10 flex justify-center items-center"
                >
                  {submitLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Updating...
                    </span>
                  ) : "Update Profile"}
                </button>

                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="w-full py-4 text-gray-500 text-sm font-bold border border-transparent rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}