// app/customize-tour/summary/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MessageCircle,
  Package,
  ShieldCheck,
  Clock,
  Sparkles
} from 'lucide-react';

export default function SummaryPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Optional: Load data just to confirm it exists
  useEffect(() => {
    const tourDetails = localStorage.getItem('tourDetails');
    const guestInfo = localStorage.getItem('guestInfo');
    
    if (!tourDetails || !guestInfo) {
      // If data is missing, send user back
      router.push('/customize-tour');
    }
  }, [router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Simulate API call (you can later replace this with real API)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Here you can later send data to your backend + email
    // For now we just show success

    setIsSubmitting(false);
    setShowSuccessModal(true);
  };

  const handleDone = () => {
    // Clear temporary data (optional)
    // localStorage.removeItem('selectedTour');
    // localStorage.removeItem('tourDetails');
    // localStorage.removeItem('guestInfo');

    router.push('/packages');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/customize-tour/guest-info"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Almost Done</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
            <Sparkles className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Your Custom Tour is Almost Ready
          </h2>
          <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto">
            Thank you for choosing <span className="font-semibold text-slate-900">CheAura Travels</span>. 
            We are excited to craft a memorable journey for you in Sri Lanka.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-10 space-y-8">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            What happens next?
          </h3>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-600" />
                  Detailed Tour Plan via Email
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Within a short time, you will receive a complete itinerary including day-by-day plan, 
                  selected accommodations, vehicle details, and estimated cost to your email address.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-600" />
                  View Anytime in “My Tours”
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  You can also check the status and full details of your customized tour anytime 
                  by going to the <span className="font-medium">Packages</span> page and clicking 
                  the <span className="font-medium">My Tours</span> button.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-slate-600" />
                  Personal Support via WhatsApp
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our customer care team will contact you on WhatsApp to confirm details, 
                  answer any questions, and assist you throughout the process.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  Secure Your Tour with 30% Advance
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Once the final tour plan is ready and approved by you, you can confirm the booking 
                  by paying only <span className="font-semibold text-slate-900">30% of the total amount</span> as an advance. 
                  The remaining balance can be settled later. This helps us reserve hotels and vehicles for your dates.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Message */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-12 text-center">
          <p className="text-emerald-800 text-sm leading-relaxed">
            At <span className="font-semibold">CheAura Travels</span>, your comfort and trust are our highest priority. 
            We carefully plan every detail so you can enjoy a smooth and unforgettable experience in Sri Lanka.
            <br />
            <span className="font-medium">Nice to meet you — we look forward to hosting you!</span>
          </p>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-w-[280px] py-4 px-10 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Tour Request'
            )}
          </button>
          <p className="text-xs text-slate-500 mt-4">
            By submitting, you agree that our team will contact you regarding this tour request.
          </p>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              Request Submitted Successfully!
            </h3>

            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              Thank you! Your customized tour request has been received.  
              Our team will carefully review your preferences and contact you shortly 
              via email and WhatsApp with the complete tour plan.
            </p>

            <button
              onClick={handleDone}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}