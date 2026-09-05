// app/customize-tour/details/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Users,
  Car,
  Hotel,
  Home,
  Tent,
  ChevronRight,
  MapPin,
  Star
} from 'lucide-react';

const vehicles = [
  {
    id: 'vezel',
    name: 'Honda Vezel',
    type: 'SUV',
    capacity: '4–5 passengers',
    description: 'Comfortable and fuel-efficient for small groups',
  },
  {
    id: 'premio',
    name: 'Toyota Premio',
    type: 'Sedan',
    capacity: '3–4 passengers',
    description: 'Premium sedan for a smooth and elegant ride',
  },
  {
    id: 'coaster',
    name: 'Toyota Coaster',
    type: 'Mini Bus',
    capacity: '12–18 passengers',
    description: 'Perfect for larger groups and family tours',
  },
];

const stayOptions = [
  { id: 'hotel-5', label: '5★ Hotel', icon: <Hotel className="w-4 h-4" /> },
  { id: 'hotel-4', label: '4★ Hotel', icon: <Hotel className="w-4 h-4" /> },
  { id: 'hotel-3', label: '3★ or Lower', icon: <Hotel className="w-4 h-4" /> },
  { id: 'villa', label: 'Villa', icon: <Home className="w-4 h-4" /> },
  { id: 'cabana', label: 'Cabana', icon: <Tent className="w-4 h-4" /> },
];

export default function TourDetailsPage() {
  const router = useRouter();
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [vehicle, setVehicle] = useState('');
  const [members, setMembers] = useState(2);
  const [accommodations, setAccommodations] = useState({}); // { placeId: stayOptionId }

  useEffect(() => {
    const saved = localStorage.getItem('selectedTour');
    if (saved) {
      try {
        const places = JSON.parse(saved);
        setSelectedPlaces(places);

        // Initialize empty accommodation for each place
        const initial = {};
        places.forEach((p) => {
          initial[p.id] = '';
        });
        setAccommodations(initial);
      } catch (e) {
        console.error('Failed to load selected tour');
      }
    }
  }, []);

  const handleAccommodationChange = (placeId, value) => {
    setAccommodations((prev) => ({
      ...prev,
      [placeId]: value,
    }));
  };

  const handleNext = () => {
    // Check if all places have accommodation selected
    const allSelected = selectedPlaces.every((p) => accommodations[p.id]);
    if (!vehicle || !allSelected) {
      alert('Please select a vehicle and accommodation for every place.');
      return;
    }

    const tourDetails = {
      places: selectedPlaces,
      vehicle,
      members,
      accommodations, // per place
    };

    localStorage.setItem('tourDetails', JSON.stringify(tourDetails));
    
    // Go to Guest Information page
    router.push('/customize-tour/guest-info');
  };

  const isFormValid =
    vehicle &&
    selectedPlaces.length > 0 &&
    selectedPlaces.every((p) => accommodations[p.id]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/customize-tour"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Map
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">Tour Details</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
        {/* Selected Places Preview */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Your Selected Stops
          </h2>
          <div className="flex flex-wrap gap-2">
            {selectedPlaces.map((place, index) => (
              <div
                key={place.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full text-sm"
              >
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                {place.name}
              </div>
            ))}
          </div>
        </section>

        {/* Vehicle Selection */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Car className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold">Choose Your Vehicle</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => setVehicle(v.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all ${
                  vehicle === v.id
                    ? 'border-slate-900 bg-slate-50 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 mb-1">{v.name}</div>
                <div className="text-xs text-slate-500 mb-2">{v.type} • {v.capacity}</div>
                <p className="text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Number of Travelers */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold">Number of Travelers</h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setMembers((prev) => Math.max(1, prev - 1))}
              className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-lg font-medium hover:bg-slate-50"
            >
              −
            </button>
            <span className="text-2xl font-semibold w-12 text-center">{members}</span>
            <button
              onClick={() => setMembers((prev) => prev + 1)}
              className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-lg font-medium hover:bg-slate-50"
            >
              +
            </button>
          </div>
        </section>

        {/* Per-Place Accommodation Selection */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Hotel className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold">Accommodation for Each Stop</h2>
          </div>

          <div className="space-y-8">
            {selectedPlaces.map((place, index) => (
              <div
                key={place.id}
                className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{place.name}</h3>
                    <p className="text-xs text-slate-500">{place.category}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {stayOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => handleAccommodationChange(place.id, option.id)}
                      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 text-sm transition-all ${
                        accommodations[place.id] === option.id
                          ? 'border-slate-900 bg-white shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <span className="text-slate-700">{option.icon}</span>
                      <span className="font-medium text-slate-800 text-xs text-center leading-tight">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next Button */}
        <div className="pt-6 border-t border-slate-200">
          <button
            onClick={handleNext}
            disabled={!isFormValid}
            className="w-full sm:w-auto sm:min-w-[280px] py-4 px-8 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          {!isFormValid && (
            <p className="text-xs text-slate-500 mt-3">
              Please select a vehicle and accommodation for every place to continue.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}