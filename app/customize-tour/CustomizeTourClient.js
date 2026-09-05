// app/customize-tour/CustomizeTourClient.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Link from 'next/link';
import { useAuth } from '../../src/context/AuthContext';
import { 
  MapPin, Calendar, Users, Car, Plus, Trash2, ArrowUp, ArrowDown, 
  Search, Sparkles, Check, ChevronRight, Clock, Compass, 
  X, ArrowLeft, CheckCircle2, Map, List, Navigation, Send, HelpCircle
} from 'lucide-react';

// Sample attractions in Sri Lanka
const attractions = [
  {
    id: 1,
    name: "Sigiriya Rock Fortress",
    category: "Historical & Cultural",
    lat: 7.9570,
    lng: 80.7603,
    description: "An ancient rock fortress and palace ruin of outstanding historical value, surrounded by remains of a unique network of gardens, reservoirs, and other structures. Famous for its beautiful frescoes and the massive lion paw gate. Climbing to the top offers unparalleled panoramic views of the surrounding jungle.",
    image: "https://images.unsplash.com/photo-1588598130953-2ef2415afab0?auto=format&fit=crop&w=800&q=80",
    nature: "Cultural & Adventure",
    duration: "3 - 4 Hours",
    bestTime: "Early Morning / Late Afternoon"
  },
  {
    id: 2,
    name: "Temple of the Tooth (Kandy)",
    category: "Historical & Cultural",
    lat: 7.2936,
    lng: 80.6413,
    description: "Located in the royal palace complex of the former Kingdom of Kandy, this sacred temple houses the relic of the tooth of the Buddha and is a key pilgrimage site for Buddhists worldwide. It features exquisite Sri Lankan architecture, traditional drumming ceremonies, and a gold-canopied shrine.",
    image: "https://images.unsplash.com/photo-1620619767323-b95a89183081?auto=format&fit=crop&w=800&q=80",
    nature: "Cultural & Spiritual",
    duration: "1.5 - 2 Hours",
    bestTime: "During Evening Pooja Ceremony"
  },
  {
    id: 3,
    name: "Galle Dutch Fort",
    category: "Historical & Cultural",
    lat: 6.0535,
    lng: 80.2210,
    description: "A stunning coastal UNESCO World Heritage site showcasing European architecture and South Asian traditions. Explore ancient ramparts, the iconic white lighthouse, narrow cobblestone streets lined with boutique shops, chic restaurants, and gorgeous Indian Ocean views.",
    image: "https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&w=800&q=80",
    nature: "Coastal & Heritage",
    duration: "2 - 3 Hours",
    bestTime: "Sunset Hours"
  },
  {
    id: 4,
    name: "Nine Arch Bridge (Ella)",
    category: "Nature & Wildlife",
    lat: 6.8667,
    lng: 81.0466,
    description: "Located in the misty hill town of Ella, this spectacular 91-meter-long railway bridge is surrounded by lush green tea plantations and dense forests. Built entirely of brick, rock, and cement without steel, it represents a pinnacle of colonial-era engineering and is highly photogenic.",
    image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
    nature: "Scenic & Hiking",
    duration: "1 - 2 Hours",
    bestTime: "When trains pass (Check local timetable)"
  },
  {
    id: 5,
    name: "Yala National Park",
    category: "Nature & Wildlife",
    lat: 6.3667,
    lng: 81.5167,
    description: "The second-largest national park in Sri Lanka, boasting one of the highest leopard densities in the world. It is an extraordinary safari destination where you can observe wild Asian elephants, sloth bears, spotted deer, crocodiles, and hundreds of tropical bird species roaming free.",
    image: "https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&w=800&q=80",
    nature: "Wildlife Safari",
    duration: "Half-Day / Full-Day",
    bestTime: "6:00 AM Safari or 3:00 PM Safari"
  },
  {
    id: 6,
    name: "Mirissa Beach",
    category: "Beach & Leisure",
    lat: 5.9482,
    lng: 80.4578,
    description: "A beautiful, crescent-shaped sandy beach lined with leaning coconut palms. Mirissa is globally renowned as a prime spot for whale watching (blue whales, sperm whales, and dolphins), alongside exceptional surf breaks, coral reefs for snorkeling, and vibrant beach cafes.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
    nature: "Coastal & Surfing",
    duration: "1 - 2 Days",
    bestTime: "November to April"
  },
  {
    id: 7,
    name: "Ella Rock",
    category: "Nature & Wildlife",
    lat: 6.8583,
    lng: 81.0560,
    description: "A towering cliff that stands majestically overlooking the Ella gap. The challenging trek up Ella Rock takes you through train tracks, eucalyptus forests, and tea plantations, culminating in jaw-dropping panoramic views of the southern plains of Sri Lanka.",
    image: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?auto=format&fit=crop&w=800&q=80",
    nature: "Adventure & Hiking",
    duration: "3 - 4 Hours",
    bestTime: "Early Morning (Starts around 6:00 AM)"
  },
  {
    id: 8,
    name: "Pinnawala Elephant Orphanage",
    category: "Nature & Wildlife",
    lat: 7.3014,
    lng: 80.3837,
    description: "Established in 1975 to care for orphaned and unweaned wild Asian elephants, this sanctuary has grown into one of the largest captive herds in the world. The highlight is watching these majestic animals herd down to the river for their daily bath and playtime.",
    image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80",
    nature: "Animal Conservation",
    duration: "2 Hours",
    bestTime: "During River Bathing (10 AM & 2 PM)"
  },
  {
    id: 9,
    name: "Anuradhapura Ancient City",
    category: "Historical & Cultural",
    lat: 8.3114,
    lng: 80.4037,
    description: "One of the ancient capitals of Sri Lanka, famous for its well-preserved ruins of ancient Lankan civilization. Features massive brick dagobas (stupa), ancient ponds, royal gardens, and the sacred 'Jaya Sri Maha Bodhi' - the oldest historically documented tree in the world.",
    image: "https://images.unsplash.com/photo-1566971289-4d2e8b3f8c1d?auto=format&fit=crop&w=800&q=80",
    nature: "Archaeology & Heritage",
    duration: "3 - 5 Hours",
    bestTime: "Cooler parts of the day"
  },
  {
    id: 10,
    name: "Bentota Beach & Lagoon",
    category: "Beach & Leisure",
    lat: 6.4200,
    lng: 79.9950,
    description: "A gorgeous golden sand spit nestled between the Indian Ocean and the calm waters of the Bentota River lagoon. Bentota is the water-sports capital of Sri Lanka, offering windsurfing, jet-skiing, water-skiing, parasailing, and boat safaris through pristine mangrove tunnels.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    nature: "Water Sports & Relaxation",
    duration: "1 - 2 Days",
    bestTime: "October to April"
  }
];

// Helper component to control map panning/zooming programmatically
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom DivIcons for Leaflet
const createNumberIcon = (number, isActive) => {
  return L.divIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Pulse Effect for Active Pin -->
        ${isActive ? '<div class="absolute w-10 h-10 bg-black/10 rounded-full animate-ping"></div>' : ''}
        <!-- Shadow -->
        <div class="absolute w-5 h-5 bg-black/20 rounded-full blur-[2px] translate-y-3.5"></div>
        <!-- Pin Container -->
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-white shadow-xl transition-all duration-300 ${
          isActive 
            ? 'bg-black text-white scale-110 z-50' 
            : 'bg-neutral-900 text-white hover:scale-105'
        }">
          <span class="text-xs font-bold leading-none">${number}</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });
};

const createStandardIcon = (isActive) => {
  return L.divIcon({
    className: 'custom-leaflet-icon-wrapper',
    html: `
      <div class="relative flex items-center justify-center">
        <!-- Shadow -->
        <div class="absolute w-4 h-4 bg-black/10 rounded-full blur-[2px] translate-y-3"></div>
        <!-- Pin Container -->
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full border border-white shadow-md transition-all duration-300 ${
          isActive 
            ? 'bg-neutral-900 text-white scale-110 z-40' 
            : 'bg-white text-neutral-600 hover:scale-110 hover:bg-neutral-100'
        }">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.418-8 12-8 12s-8-7.582-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function CustomizeTourClient() {
  const { user } = useAuth();
  
  // States
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [activePlace, setActivePlace] = useState(null);
  const [leftTab, setLeftTab] = useState('itinerary'); // 'itinerary' or 'explore'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [mapCenter, setMapCenter] = useState([7.8731, 80.7718]);
  const [mapZoom, setMapZoom] = useState(8);
  const [mobileView, setMobileView] = useState('map'); // 'map' or 'panel' for mobile screens
  
  // Booking Form States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    travelers: 2,
    vehicle: 'Luxury SUV (1-4 travelers)',
    notes: ''
  });

  // Load selected places from local storage
  useEffect(() => {
    const saved = localStorage.getItem('selectedTour');
    if (saved) {
      try {
        setSelectedPlaces(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tour plan", e);
      }
    }
  }, []);

  // Save selected places to local storage
  useEffect(() => {
    localStorage.setItem('selectedTour', JSON.stringify(selectedPlaces));
  }, [selectedPlaces]);

  // Pre-fill form when user state changes or modal opens
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user, isBookingModalOpen]);

  // Actions
  const addToTour = (place) => {
    if (!selectedPlaces.some(p => p.id === place.id)) {
      setSelectedPlaces([...selectedPlaces, place]);
      // Notify slightly or auto-open itinerary tab
      setLeftTab('itinerary');
    }
  };

  const removeFromTour = (id) => {
    setSelectedPlaces(selectedPlaces.filter(p => p.id !== id));
  };

  const moveItem = (index, direction) => {
    const updated = [...selectedPlaces];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < updated.length) {
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      setSelectedPlaces(updated);
    }
  };

  const selectPlaceToFocus = (place) => {
    setActivePlace(place);
    setMapCenter([place.lat, place.lng]);
    setMapZoom(11);
    if (window.innerWidth < 1024) {
      setMobileView('panel'); // open drawer on mobile
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Simulate booking submission
    setBookingSubmitted(true);
  };

  const resetBookingForm = () => {
    setIsBookingModalOpen(false);
    setBookingSubmitted(false);
    // clear selected places if requested, or keep them
  };

  // Filtered attractions based on search query & category tab
  const filteredAttractions = attractions.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || place.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Dynamic values for Polyline
  const routePositions = selectedPlaces.map(place => [place.lat, place.lng]);

  const categories = ['All', 'Historical & Cultural', 'Nature & Wildlife', 'Beach & Leisure'];

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans text-neutral-800 antialiased overflow-hidden">
      
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-neutral-200 shrink-0 z-30 pt-20 pb-4 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              className="group flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 hover:border-neutral-400 transition"
              aria-label="Back to home"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-600 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CheAura Travels Customizer</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-neutral-900">
                Design Your Sri Lanka Journey
              </h1>
            </div>
          </div>
          
          {/* Quick stats banner */}
          <div className="flex items-center gap-6 text-sm text-neutral-600 bg-neutral-100 rounded-full py-1.5 px-5 w-fit self-start md:self-auto border border-neutral-200">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-neutral-700" />
              <span className="font-semibold text-neutral-900">{selectedPlaces.length}</span>
              <span className="text-neutral-500">stops chosen</span>
            </div>
            <div className="w-px h-4 bg-neutral-300"></div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-700" />
              <span>Est. {selectedPlaces.length * 1.5 || 1} - {selectedPlaces.length * 2 || 2} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE PANEL / MAP TOGGLE */}
      <div className="lg:hidden bg-white border-b border-neutral-200 flex shrink-0 z-20">
        <button
          onClick={() => setMobileView('map')}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
            mobileView === 'map' ? 'border-black text-black' : 'border-transparent text-neutral-500'
          }`}
        >
          <Map className="w-4 h-4" />
          Map View
        </button>
        <button
          onClick={() => setMobileView('panel')}
          className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition ${
            mobileView === 'panel' ? 'border-black text-black' : 'border-transparent text-neutral-500'
          }`}
        >
          <List className="w-4 h-4" />
          Planner & Details
          {selectedPlaces.length > 0 && (
            <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
              {selectedPlaces.length}
            </span>
          )}
        </button>
      </div>

      {/* MAIN APPLICATION CONTAINER */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* LEFT HUB: TOUR PLANNER & SEARCH ATTRACTIONS */}
        <div className={`
          w-full lg:w-[420px] bg-white border-r border-neutral-200 flex flex-col h-full shrink-0 z-10 transition-all duration-300
          ${mobileView === 'panel' ? 'block' : 'hidden lg:flex'}
        `}>
          
          {/* TAB SYSTEM */}
          <div className="p-4 border-b border-neutral-100 bg-neutral-50 shrink-0">
            <div className="flex bg-neutral-200 p-1 rounded-xl">
              <button
                onClick={() => setLeftTab('itinerary')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  leftTab === 'itinerary' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>Itinerary</span>
                {selectedPlaces.length > 0 && (
                  <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {selectedPlaces.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setLeftTab('explore')}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  leftTab === 'explore' 
                    ? 'bg-white text-black shadow-sm' 
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>Explore Sri Lanka</span>
              </button>
            </div>
          </div>

          {/* TAB 1 CONTENT: ITINERARY PLANNER */}
          {leftTab === 'itinerary' && (
            <div className="flex-1 overflow-y-auto flex flex-col">
              {selectedPlaces.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-400 my-auto">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 mb-4">
                    <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '20s' }} />
                  </div>
                  <h3 className="text-lg font-serif font-bold text-neutral-800 mb-2">No Destinations Selected</h3>
                  <p className="text-sm max-w-xs text-neutral-500 mb-6 leading-relaxed">
                    Begin crafting your customized adventure! Toggle the explore tab or click pins on the map to add destinations.
                  </p>
                  <button
                    onClick={() => setLeftTab('explore')}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-black text-white px-5 py-3 rounded-xl hover:bg-neutral-800 transition"
                  >
                    <Plus className="w-4 h-4" /> Browse Locations
                  </button>
                </div>
              ) : (
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 px-2">
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Selected Stops</span>
                      <button 
                        onClick={() => setSelectedPlaces([])}
                        className="text-xs text-neutral-400 hover:text-red-500 font-medium transition"
                      >
                        Reset Itinerary
                      </button>
                    </div>

                    {/* Timeline List */}
                    <div className="relative pl-6 border-l-2 border-dashed border-neutral-200 ml-4 space-y-6">
                      {selectedPlaces.map((place, index) => (
                        <div key={`${place.id}-${index}`} className="relative group">
                          {/* Circle indicator on timeline */}
                          <div className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 text-[10px] font-bold z-10 transition ${
                            activePlace?.id === place.id 
                              ? 'bg-black border-black text-white scale-110 shadow-md ring-4 ring-neutral-100' 
                              : 'bg-white border-neutral-300 text-neutral-500 hover:border-black hover:text-black'
                          }`}>
                            {index + 1}
                          </div>

                          <div 
                            onClick={() => selectPlaceToFocus(place)}
                            className={`p-3 rounded-xl border transition cursor-pointer text-left ${
                              activePlace?.id === place.id
                                ? 'bg-neutral-50 border-neutral-400 shadow-sm'
                                : 'bg-white border-neutral-200 hover:border-neutral-300 shadow-sm'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="font-semibold text-sm text-neutral-900 group-hover:text-black transition">{place.name}</h4>
                                <span className="text-[10px] text-neutral-400 font-medium tracking-wide uppercase">{place.category}</span>
                              </div>
                              
                              {/* Sequence & remove controls */}
                              <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => moveItem(index, -1)}
                                  disabled={index === 0}
                                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 disabled:pointer-events-none transition"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => moveItem(index, 1)}
                                  disabled={index === selectedPlaces.length - 1}
                                  className="p-1 rounded text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 disabled:opacity-20 disabled:pointer-events-none transition"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => removeFromTour(place.id)}
                                  className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition ml-1"
                                  title="Remove Stop"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Complete Itinerary Quote Request Trigger */}
                  <div className="mt-8 border-t border-neutral-100 pt-6 px-2">
                    <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-4 text-left">
                      <div className="flex items-start gap-2 text-xs text-neutral-500 mb-1">
                        <HelpCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                        <p>Our expert planners will optimize this route, secure premium hotels, arrange personal drivers, and coordinate entry passes.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-semibold hover:bg-neutral-800 transition shadow-lg text-sm uppercase tracking-wider"
                    >
                      <Send className="w-4 h-4" /> Book This Customized Tour
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2 CONTENT: EXPLORE & BROWSE LOCATIONS */}
          {leftTab === 'explore' && (
            <div className="flex-1 overflow-y-auto flex flex-col p-4">
              
              {/* SEARCH BOX */}
              <div className="relative mb-4 shrink-0">
                <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search Sigiriya, Ella, Galle..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:border-neutral-400 text-sm bg-neutral-50"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* HORIZONTAL CATEGORY SCROLL */}
              <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 shrink-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      activeCategory === cat 
                        ? 'bg-neutral-900 text-white shadow-sm' 
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {cat === 'All' ? 'All Places' : cat.split(' & ')[0]}
                  </button>
                ))}
              </div>

              {/* LOCATIONS LIST */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {filteredAttractions.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400">
                    <Compass className="w-10 h-10 mx-auto mb-3 stroke-1" />
                    <p className="text-sm">No locations match your search criteria.</p>
                  </div>
                ) : (
                  filteredAttractions.map((place) => {
                    const isSelected = selectedPlaces.some(p => p.id === place.id);
                    return (
                      <div
                        key={place.id}
                        onClick={() => selectPlaceToFocus(place)}
                        className={`group p-3 rounded-2xl border transition text-left cursor-pointer flex gap-4 ${
                          activePlace?.id === place.id 
                            ? 'bg-neutral-50 border-neutral-400 shadow-sm' 
                            : 'bg-white border-neutral-150 hover:border-neutral-300 shadow-sm'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 shrink-0 relative">
                          <img 
                            src={place.image} 
                            alt={place.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white stroke-[3px]" />
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-sm text-neutral-900 truncate">{place.name}</h4>
                            <p className="text-xs text-neutral-400 font-medium uppercase mt-0.5 tracking-wide">{place.category}</p>
                          </div>
                          
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <span className="text-[10px] text-neutral-500 font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {place.duration}
                            </span>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isSelected) removeFromTour(place.id);
                                else addToTour(place);
                              }}
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg transition shrink-0 ${
                                isSelected 
                                  ? 'bg-neutral-100 text-neutral-400 hover:bg-red-50 hover:text-red-600'
                                  : 'bg-black text-white hover:bg-neutral-800'
                              }`}
                            >
                              {isSelected ? 'Added' : '+ Add'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* CENTER COLUMN: MAP VIEW */}
        <div className={`
          flex-1 h-[50vh] lg:h-full relative overflow-hidden transition-all duration-300
          ${mobileView === 'map' ? 'block' : 'hidden lg:block'}
        `}>
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false} // Disable default zoom controls to reposition nicely
          >
            {/* Minimal High-End TileLayer (CartoDB Positron) */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />

            {/* Custom map controller */}
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* Render all attractions */}
            {attractions.map((place) => {
              const selectedIndex = selectedPlaces.findIndex(p => p.id === place.id);
              const isSelected = selectedIndex !== -1;
              const isActive = activePlace?.id === place.id;
              
              // Custom divIcon depending on status
              const icon = isSelected 
                ? createNumberIcon(selectedIndex + 1, isActive) 
                : createStandardIcon(isActive);

              return (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  icon={icon}
                  eventHandlers={{
                    click: () => {
                      selectPlaceToFocus(place);
                    },
                  }}
                >
                  <Popup closeButton={false} offset={[0, -10]} className="custom-premium-popup">
                    <div className="p-1 text-center bg-white font-sans">
                      <p className="font-bold text-xs text-neutral-900 leading-none mb-1">{place.name}</p>
                      <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider leading-none">{place.category}</p>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Draw a slick route path connecting itinerary points */}
            {routePositions.length > 1 && (
              <Polyline
                positions={routePositions}
                color="#171717"
                weight={3.5}
                dashArray="6, 8"
                opacity={0.85}
              />
            )}
          </MapContainer>
          
          {/* Custom zoom buttons on Map */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-1.5">
            <button
              onClick={() => setMapZoom(prev => Math.min(prev + 1, 18))}
              className="w-10 h-10 rounded-xl bg-white text-black font-semibold text-lg flex items-center justify-center shadow-lg hover:bg-neutral-50 active:bg-neutral-100 transition border border-neutral-200"
            >
              +
            </button>
            <button
              onClick={() => setMapZoom(prev => Math.max(prev - 1, 6))}
              className="w-10 h-10 rounded-xl bg-white text-black font-semibold text-lg flex items-center justify-center shadow-lg hover:bg-neutral-50 active:bg-neutral-100 transition border border-neutral-200"
            >
              −
            </button>
          </div>
        </div>

        {/* RIGHT DRAWER: DETAILED ATTRACTION INSPECTOR */}
        <div className={`
          w-full lg:w-[400px] bg-white border-l border-neutral-200 flex flex-col h-full shrink-0 z-20 transition-all duration-500
          lg:static absolute top-0 bottom-0 right-0 shadow-2xl lg:shadow-none
          ${activePlace ? 'translate-x-0' : 'translate-x-full lg:hidden'}
        `}>
          {activePlace ? (
            <div className="h-full flex flex-col overflow-hidden text-left">
              
              {/* Cover Image & Close Button */}
              <div className="h-56 relative bg-neutral-900 overflow-hidden shrink-0">
                <img 
                  src={activePlace.image} 
                  alt={activePlace.name} 
                  className="w-full h-full object-cover opacity-95 hover:scale-105 transition duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                
                {/* Float Close Button */}
                <button
                  onClick={() => setActivePlace(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center border border-white/10 transition"
                  aria-label="Close details"
                >
                  <X className="w-5 h-5" />
                </button>
                
                {/* Title overlay */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-black/45 backdrop-blur-sm border border-white/20 px-2 py-0.5 rounded-md">
                    {activePlace.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif tracking-tight mt-2 drop-shadow-md">
                    {activePlace.name}
                  </h2>
                </div>
              </div>

              {/* Content Panel */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Key Facts grid */}
                <div className="grid grid-cols-2 gap-4 border-b border-neutral-150 pb-5">
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-150 flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Visit Time</p>
                      <p className="text-xs font-semibold text-neutral-800 mt-1 leading-normal">{activePlace.duration}</p>
                    </div>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-150 flex items-start gap-2.5">
                    <Navigation className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider leading-none">Best Period</p>
                      <p className="text-xs font-semibold text-neutral-800 mt-1 leading-normal">{activePlace.bestTime || 'Morning / Evening'}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">About Location</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed font-normal">
                    {activePlace.description}
                  </p>
                </div>

                {/* Highlights tags */}
                <div className="space-y-2.5 pt-2">
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Experience Vibe</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-lg border border-neutral-200">
                      ✨ {activePlace.nature}
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-lg border border-neutral-200">
                      🌍 UNESCO Heritage Area
                    </span>
                  </div>
                </div>
              </div>

              {/* Add/Remove Action Button Footer */}
              <div className="p-4 border-t border-neutral-200 shrink-0 bg-white">
                {selectedPlaces.some(p => p.id === activePlace.id) ? (
                  <button
                    onClick={() => removeFromTour(activePlace.id)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-red-50 hover:text-red-600 border border-neutral-200 hover:border-red-200 text-neutral-500 py-3.5 rounded-xl text-sm font-semibold transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove From Itinerary
                  </button>
                ) : (
                  <button
                    onClick={() => addToTour(activePlace)}
                    className="w-full inline-flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white py-3.5 rounded-xl text-sm font-semibold shadow-md transition"
                  >
                    <Plus className="w-4 h-4" /> Add to Itinerary
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-neutral-400 my-auto">
              <Compass className="w-12 h-12 stroke-1 mb-3 animate-pulse" />
              <p className="text-sm max-w-[240px]">Select a location pin on the map to inspect descriptions, durations, and highlights.</p>
            </div>
          )}
        </div>
      </div>

      {/* BOOKING MODAL OVERLAY */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform scale-100 transition-all overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-150 flex items-center justify-between bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neutral-900" />
                <h3 className="text-lg font-bold font-serif tracking-tight text-neutral-900">
                  Request Customized Itinerary Quote
                </h3>
              </div>
              <button
                onClick={resetBookingForm}
                className="text-neutral-400 hover:text-black transition p-1 rounded-full hover:bg-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto p-6">
              {!bookingSubmitted ? (
                <form onSubmit={handleBookingSubmit} className="space-y-5 text-left">
                  
                  {/* Selected route recap summary */}
                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Your Custom Route</span>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-800 font-semibold">
                      {selectedPlaces.map((place, idx) => (
                        <div key={place.id} className="flex items-center gap-1.5">
                          <span className="bg-black text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold shrink-0">{idx + 1}</span>
                          <span>{place.name}</span>
                          {idx < selectedPlaces.length - 1 && <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Personal Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        required
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="john@example.com"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="+94 77 123 4567"
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50"
                      />
                    </div>
                    <div>
                      <label htmlFor="startDate" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Departure Date</label>
                      <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        required
                        value={formData.startDate}
                        onChange={handleFormChange}
                        className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50"
                      />
                    </div>
                  </div>

                  {/* Select Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label htmlFor="travelers" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">Number of Travelers</label>
                        <span className="text-xs font-bold text-black">{formData.travelers} Guests</span>
                      </div>
                      <input
                        type="range"
                        name="travelers"
                        id="travelers"
                        min="1"
                        max="24"
                        value={formData.travelers}
                        onChange={handleFormChange}
                        className="w-full h-1.5 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-black"
                      />
                    </div>
                    <div>
                      <label htmlFor="vehicle" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Preferred Transport</label>
                      <select
                        name="vehicle"
                        id="vehicle"
                        value={formData.vehicle}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50"
                      >
                        <option>Luxury Sedan (1-3 travelers)</option>
                        <option>Luxury SUV (1-4 travelers)</option>
                        <option>Mini Coach / Van (5-12 travelers)</option>
                        <option>Full Tour Coach (13+ travelers)</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Special Notes & Wishes</label>
                    <textarea
                      name="notes"
                      id="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleFormChange}
                      placeholder="E.g., Preferred hotel stars, vegetarian foods, accessibility needs, specific activities you want to highlight..."
                      className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:border-neutral-500 bg-neutral-50 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Trigger */}
                  <button
                    type="submit"
                    className="w-full bg-black hover:bg-neutral-800 text-white py-4 rounded-xl font-semibold text-sm uppercase tracking-wider transition shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Send Request For Quotation
                  </button>
                </form>
              ) : (
                /* SUCCESS SCREEN */
                <div className="text-center py-6 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold font-serif text-neutral-900">Itinerary Request Submitted!</h4>
                    <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Thank you, <strong className="text-neutral-800">{formData.name}</strong>. Your customized route request has been received. Our luxury travel planning team is now preparing your tailored quote.
                    </p>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-150 max-w-sm mx-auto text-left space-y-3.5">
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-neutral-400 w-16 uppercase">Contact:</span>
                      <span className="text-neutral-700">{formData.email} {formData.phone ? `| ${formData.phone}` : ''}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-neutral-400 w-16 uppercase">Departure:</span>
                      <span className="text-neutral-700">{formData.startDate}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-neutral-400 w-16 uppercase">Guests:</span>
                      <span className="text-neutral-700">{formData.travelers} Guests via {formData.vehicle}</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs">
                      <span className="font-bold text-neutral-400 w-16 uppercase">Route:</span>
                      <span className="text-neutral-700 font-semibold">
                        {selectedPlaces.map(p => p.name).join(' → ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                    We've sent a detailed confirmation email of your itinerary summary to <strong className="text-neutral-500">{formData.email}</strong>.
                  </p>

                  <button
                    onClick={resetBookingForm}
                    className="px-8 py-3 bg-black hover:bg-neutral-800 text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
