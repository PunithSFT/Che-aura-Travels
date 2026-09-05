// app/customize-tour/page.js
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  X, 
  Plus, 
  Trash2, 
  Compass, 
  Sparkles,
  Info,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

// Dynamic import with SSR completely disabled
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium">
      Loading Interactive Map...
    </div>
  ),
});

const attractions = [
  { 
    id: 1, 
    name: "Sigiriya Rock Fortress", 
    category: "UNESCO World Heritage",
    lat: 7.9570, 
    lng: 80.7603, 
    description: "Ancient rock fortress featuring stunning 5th-century frescoes and gardens.", 
    photos: ["https://images.unsplash.com/photo-1566971289-4d2e8b3f8c1d?q=80&w=800"] 
  },
  { 
    id: 2, 
    name: "Temple of the Tooth Relic", 
    category: "Culture & History",
    lat: 7.2936, 
    lng: 80.6413, 
    description: "Sacred Buddhist temple located in Kandy, housing the tooth relic of the Buddha.", 
    photos: ["https://images.unsplash.com/photo-1588598128229-2169b61d3e18?q=80&w=800"] 
  },
  { 
    id: 3, 
    name: "Galle Dutch Fort", 
    category: "Coastal Heritage",
    lat: 6.0535, 
    lng: 80.2210, 
    description: "Colonial-era fortified city blending European architecture with South Asian traditions.", 
    photos: ["https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=800"] 
  },
  { 
    id: 4, 
    name: "Nine Arch Bridge", 
    category: "Scenic Landmark",
    lat: 6.8667, 
    lng: 81.0466, 
    description: "Iconic colonial-era railway bridge nestled within lush green tea plantations of Ella.", 
    photos: ["https://images.unsplash.com/photo-1546708973-b339540b5162?q=80&w=800"] 
  },
  { 
    id: 5, 
    name: "Yala National Park", 
    category: "Wildlife Safari",
    lat: 6.3667, 
    lng: 81.5167, 
    description: "Premier wildlife safari destination famous for its wild leopard population.", 
    photos: ["https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=800"] 
  },
];

export default function CustomizeTourPage() {
  const router = useRouter();
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);
  const [isTourDrawerOpen, setIsTourDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedTour');
    if (saved) {
      try {
        setSelectedPlaces(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to read tour from local storage", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedTour', JSON.stringify(selectedPlaces));
  }, [selectedPlaces]);

  const addToTour = (place) => {
    if (!selectedPlaces.some((p) => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  const removeFromTour = (id) => {
    setSelectedPlaces(selectedPlaces.filter((p) => p.id !== id));
  };

  const handleNext = () => {
    if (selectedPlaces.length === 0) return;
    
    // Save selected places so the next page can use them
    localStorage.setItem('selectedTour', JSON.stringify(selectedPlaces));
    router.push('/customize-tour/details');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 pt-20 sm:pt-12 pb-4">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>

          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Customize Your Sri Lanka Journey
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 font-medium mt-1">
              Select destinations on the interactive map to build your custom itinerary
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTourDrawerOpen(!isTourDrawerOpen)}
              className="relative lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-full shadow-md"
            >
              <Compass className="w-4 h-4" />
              <span>Itinerary</span>
              {selectedPlaces.length > 0 && (
                <span className="bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {selectedPlaces.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1920px] mx-auto pt-6 px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-14rem)]">
          
          {/* LEFT PANEL */}
          <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 w-80 lg:w-auto lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xl lg:shadow-sm transform transition-transform duration-300 ease-in-out flex flex-col ${
              isTourDrawerOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="font-semibold text-slate-900">Your Itinerary</h2>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                {selectedPlaces.length} {selectedPlaces.length === 1 ? 'Stop' : 'Stops'}
              </span>
              <button
                onClick={() => setIsTourDrawerOpen(false)}
                className="lg:hidden text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[500px] lg:max-h-none">
              {selectedPlaces.length === 0 ? (
                <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <MapPin className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="font-medium text-sm text-slate-700">No destinations added</p>
                  <p className="text-xs mt-1 text-slate-400">
                    Explore map markers or place details to add stops to your route.
                  </p>
                </div>
              ) : (
                selectedPlaces.map((place, index) => (
                  <div
                    key={place.id}
                    className="group flex items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl hover:bg-white hover:border-slate-300 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 shrink-0 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-semibold">
                        {index + 1}
                      </span>
                      <div className="truncate">
                        <h3 className="font-medium text-sm text-slate-800 truncate">{place.name}</h3>
                        <span className="text-[11px] text-slate-400">{place.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromTour(place.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50"
                      title="Remove location"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Next Button */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl mt-auto">
              <button
                onClick={handleNext}
                disabled={selectedPlaces.length === 0}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </aside>

          {/* CENTER MAP CONTAINER */}
          <section className="lg:col-span-6 xl:col-span-6 h-[500px] lg:h-full min-h-[450px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm relative bg-slate-100">
            <InteractiveMap 
              attractions={attractions} 
              setActivePlace={setActivePlace} 
            />
            
            <div className="absolute top-4 left-4 z-[400] bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-sm flex items-center gap-2 text-xs font-medium text-slate-600">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Click pins to view highlights</span>
            </div>
          </section>

          {/* RIGHT PANEL */}
          <aside
            className={`fixed lg:static inset-y-0 right-0 z-40 w-80 lg:w-auto lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-xl lg:shadow-sm transform transition-transform duration-300 ease-in-out flex flex-col ${
              activePlace ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
            }`}
          >
            {activePlace ? (
              <div className="h-full flex flex-col">
                <div className="p-5 border-b border-slate-100 flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 text-[11px] font-semibold rounded-md mb-1">
                      {activePlace.category}
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">{activePlace.name}</h2>
                  </div>
                  <button
                    onClick={() => setActivePlace(null)}
                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {activePlace.photos?.length > 0 ? (
                    <div className="relative h-48 w-full rounded-xl overflow-hidden shadow-inner bg-slate-100">
                      <img 
                        src={activePlace.photos[0]} 
                        alt={activePlace.name} 
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs">
                      No Image Available
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {activePlace.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl mt-auto">
                  {selectedPlaces.some((p) => p.id === activePlace.id) ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-sm rounded-xl flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Added to Itinerary</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => addToTour(activePlace)}
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Destination</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <Compass className="w-6 h-6 text-slate-400" />
                </div>
                <p className="font-medium text-sm text-slate-700">Select a Location</p>
                <p className="text-xs mt-1 text-slate-400">
                  Click on any interactive marker on the map to reveal detailed location information.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}