// app/customize-tour/guest-info/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Phone,
  Plane,
  Calendar,
  Clock,
  MessageCircle,
  FileText,
  ChevronRight,
} from 'lucide-react';

export default function GuestInfoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    passportNumber: '',
    nationality: '',
    email: '',
    whatsapp: '',
    arrivalDate: '',
    arrivalTime: '',
    flightNumber: '',
    arrivalAirport: 'CMB',
    specialRequests: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const saved = localStorage.getItem('guestInfo');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Required';
    if (!formData.passportNumber.trim()) newErrors.passportNumber = 'Required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Required';
    if (!formData.email.trim()) newErrors.email = 'Required';
    if (!formData.whatsapp.trim()) newErrors.whatsapp = 'Required';
    if (!formData.arrivalDate) newErrors.arrivalDate = 'Required';
    if (!formData.arrivalTime) newErrors.arrivalTime = 'Required';
    if (!formData.flightNumber.trim()) newErrors.flightNumber = 'Required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    // Save guest info
    localStorage.setItem('guestInfo', JSON.stringify(formData));

    // Go to Summary page
    router.push('/customize-tour/summary');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/customize-tour/details"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Guest Information</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us about the guest</h2>
          <p className="text-slate-500 text-sm">
            This information is required for airport pickup and hotel arrangements in Sri Lanka.
          </p>
        </div>

        <div className="space-y-8">
          {/* Personal Details */}
          <section className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name (as on passport) *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.fullName ? 'border-red-400' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  placeholder="John Alexander Smith"
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Passport Number *
                </label>
                <input
                  type="text"
                  name="passportNumber"
                  value={formData.passportNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.passportNumber ? 'border-red-400' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  placeholder="N1234567"
                />
                {errors.passportNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.passportNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nationality *
                </label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.nationality ? 'border-red-400' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  placeholder="United Kingdom"
                />
                {errors.nationality && (
                  <p className="text-xs text-red-500 mt-1">{errors.nationality}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.email ? 'border-red-400' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  placeholder="john@email.com"
                />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contact Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                WhatsApp Number (with country code) *
              </label>
              <div className="relative">
                <MessageCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                    errors.whatsapp ? 'border-red-400' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  placeholder="+44 7700 900123"
                />
              </div>
              {errors.whatsapp && <p className="text-xs text-red-500 mt-1">{errors.whatsapp}</p>}
              <p className="text-xs text-slate-500 mt-1.5">
                We will use this number for pickup coordination
              </p>
            </div>
          </section>

          {/* Arrival Details */}
          <section className="space-y-5">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Plane className="w-4 h-4" />
              Arrival Details (Sri Lanka)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Landing Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    name="arrivalDate"
                    value={formData.arrivalDate}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      errors.arrivalDate ? 'border-red-400' : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  />
                </div>
                {errors.arrivalDate && (
                  <p className="text-xs text-red-500 mt-1">{errors.arrivalDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Landing Time *
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="time"
                    name="arrivalTime"
                    value={formData.arrivalTime}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      errors.arrivalTime ? 'border-red-400' : 'border-slate-300'
                    } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  />
                </div>
                {errors.arrivalTime && (
                  <p className="text-xs text-red-500 mt-1">{errors.arrivalTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Flight Number *
                </label>
                <input
                  type="text"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.flightNumber ? 'border-red-400' : 'border-slate-300'
                  } focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900`}
                  placeholder="UL503 / QR658"
                />
                {errors.flightNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.flightNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Arrival Airport
                </label>
                <select
                  name="arrivalAirport"
                  value={formData.arrivalAirport}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 bg-white"
                >
                  <option value="CMB">Bandaranaike International (CMB) - Colombo</option>
                  <option value="HRI">Mattala Rajapaksa International (HRI) - Hambantota</option>
                  <option value="JAF">Jaffna International Airport</option>
                </select>
              </div>
            </div>
          </section>

          {/* Special Requests */}
          <section>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4" />
              Special Requests (Optional)
            </h3>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 resize-none"
              placeholder="Dietary requirements, wheelchair assistance, child seat, late arrival notes..."
            />
          </section>
        </div>

        {/* Continue to Summary Button */}
        <div className="mt-12 pt-6 border-t border-slate-200">
          <button
            onClick={handleNext}
            className="w-full sm:w-auto sm:min-w-[260px] py-4 px-8 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <span>Continue to Summary</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
}