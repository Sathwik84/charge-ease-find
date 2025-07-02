import { useState } from 'react';
import { MapPin, Zap, Filter, Search, User, Menu, X, CreditCard, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import StationList from '@/components/StationList';
import FilterPanel from '@/components/FilterPanel';
import AuthModal from '@/components/AuthModal';
import PaymentModal from '@/components/PaymentModal';

// Mock data for Hyderabad EV charging stations
const mockStations = [
  {
    id: 1,
    name: "Tata Power Charging Station - Hitech City",
    address: "HITEC City, Cyberabad, Hyderabad, Telangana 500081",
    distance: 2.5,
    status: "available",
    chargerTypes: ["CCS2", "CHAdeMO", "Type 2 AC"],
    amenities: ["Restaurant", "WiFi", "Shopping", "Coffee"],
    availableChargers: 6,
    totalChargers: 8,
    pricePerKwh: 12.50,
    coordinates: { lat: 17.4475, lng: 78.3563 }
  },
  {
    id: 2,
    name: "Ather Grid - Jubilee Hills",
    address: "Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033",
    distance: 4.2,
    status: "busy",
    chargerTypes: ["Type 2 AC", "15A Socket"],
    amenities: ["Coffee", "WiFi", "Parking"],
    availableChargers: 1,
    totalChargers: 4,
    pricePerKwh: 8.00,
    coordinates: { lat: 17.4326, lng: 78.4071 }
  },
  {
    id: 3,
    name: "ChargeZone - Gachibowli",
    address: "DLF Cyber City, Gachibowli, Hyderabad, Telangana 500032",
    distance: 1.8,
    status: "available",
    chargerTypes: ["CCS2", "Type 2 AC", "Bharat AC001"],
    amenities: ["Restaurant", "Shopping", "WiFi"],
    availableChargers: 4,
    totalChargers: 6,
    pricePerKwh: 10.80,
    coordinates: { lat: 17.4239, lng: 78.3438 }
  },
  {
    id: 4,
    name: "IOCL EV Charging - Banjara Hills",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana 500034",
    distance: 5.7,
    status: "available",
    chargerTypes: ["CCS2", "CHAdeMO", "Bharat DC001"],
    amenities: ["Parking", "ATM"],
    availableChargers: 3,
    totalChargers: 4,
    pricePerKwh: 9.50,
    coordinates: { lat: 17.4123, lng: 78.4443 }
  },
  {
    id: 5,
    name: "Mahindra Electric Mobility - Kondapur",
    address: "Kondapur Main Road, Kondapur, Hyderabad, Telangana 500084",
    distance: 3.1,
    status: "busy",
    chargerTypes: ["Type 2 AC", "CCS2", "15A Socket"],
    amenities: ["Restaurant", "WiFi", "Coffee"],
    availableChargers: 2,
    totalChargers: 5,
    pricePerKwh: 11.20,
    coordinates: { lat: 17.4643, lng: 78.3683 }
  },
  {
    id: 6,
    name: "Reliance BP Pulse - Madhapur",
    address: "Ayyappa Society Main Road, Madhapur, Hyderabad, Telangana 500081",
    distance: 2.9,
    status: "available",
    chargerTypes: ["CCS2", "Type 2 AC", "Bharat AC001"],
    amenities: ["Shopping", "Coffee", "Parking", "WiFi"],
    availableChargers: 5,
    totalChargers: 7,
    pricePerKwh: 13.00,
    coordinates: { lat: 17.4483, lng: 78.3915 }
  },
  {
    id: 7,
    name: "Ola Electric Hub - Begumpet",
    address: "Begumpet Main Road, Secunderabad, Telangana 500016",
    distance: 8.4,
    status: "available",
    chargerTypes: ["Type 2 AC", "15A Socket"],
    amenities: ["Parking", "Coffee"],
    availableChargers: 8,
    totalChargers: 10,
    pricePerKwh: 7.50,
    coordinates: { lat: 17.4399, lng: 78.4983 }
  },
  {
    id: 8,
    name: "HPCL EV Charging - Kukatpally",
    address: "KPHB Colony, Kukatpally, Hyderabad, Telangana 500072",
    distance: 12.3,
    status: "offline",
    chargerTypes: ["CCS2", "CHAdeMO", "Bharat DC001"],
    amenities: ["Restaurant", "ATM", "Parking"],
    availableChargers: 0,
    totalChargers: 6,
    pricePerKwh: 10.00,
    coordinates: { lat: 17.4943, lng: 78.4066 }
  }
];

const Index = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [filters, setFilters] = useState({
    chargerType: 'all',
    availability: 'all',
    amenities: [],
    maxDistance: 20
  });

  const filteredStations = mockStations.filter(station => {
    // Search filter
    if (searchQuery && !station.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !station.address.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Charger type filter
    if (filters.chargerType !== 'all' && !station.chargerTypes.includes(filters.chargerType)) {
      return false;
    }
    
    // Availability filter
    if (filters.availability !== 'all' && station.status !== filters.availability) {
      return false;
    }
    
    // Distance filter
    if (station.distance > filters.maxDistance) {
      return false;
    }
    
    // Amenities filter
    if (filters.amenities.length > 0 && 
        !filters.amenities.every(amenity => station.amenities.includes(amenity))) {
      return false;
    }
    
    return true;
  });

  const handleBookSlot = (station) => {
    setSelectedStation(station);
    setIsPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <Header onAuthClick={() => setIsAuthOpen(true)} />
      
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 opacity-90"></div>
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8 animate-pulse">
              <div className="relative">
                <Zap className="w-16 h-16 mr-4 text-yellow-300 animate-bounce" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                ChargeEase
              </h1>
            </div>
            <p className="text-2xl mb-4 opacity-95 font-light">
              Find EV charging stations in Hyderabad for your Tata, Mahindra, Ola, Ather & more
            </p>
            <p className="text-lg mb-12 opacity-80">
              Real-time availability • Indian charging standards • Instant booking
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
                <div className="flex items-center">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white/70 w-6 h-6" />
                  <Input
                    type="text"
                    placeholder="Search by location or station name in Hyderabad..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 pr-6 py-6 text-lg bg-transparent border-0 text-white placeholder-white/70 focus:ring-0"
                  />
                  <Button className="absolute right-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full px-8 py-3 font-semibold shadow-lg">
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-white/80">Charging Stations</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-green-300">24/7</div>
                <div className="text-white/80">Availability</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-blue-300">₹8-15</div>
                <div className="text-white/80">Per kWh</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content with Enhanced Styling */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Enhanced */}
          <div className="lg:w-1/3 space-y-6">
            {/* Filter Toggle with Animation */}
            <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                {filteredStations.length} Stations Found
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden bg-gradient-to-r from-blue-500 to-green-500 text-white border-0 hover:shadow-lg transition-all"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Enhanced Filter Panel */}
            <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block transition-all duration-300`}>
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <FilterPanel filters={filters} setFilters={setFilters} />
              </div>
            </div>

            {/* Enhanced Station List */}
            <div className="space-y-4">
              <StationList 
                stations={filteredStations}
                selectedStation={selectedStation}
                onStationSelect={setSelectedStation}
                onBookSlot={handleBookSlot}
              />
            </div>
          </div>

          {/* Right Panel - Enhanced Map */}
          <div className="lg:w-2/3">
            <Card className="h-[700px] overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-0 h-full relative">
                <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg">
                  <span className="text-sm font-medium text-gray-700">Live Map View</span>
                </div>
                <MapView 
                  stations={filteredStations}
                  selectedStation={selectedStation}
                  onStationSelect={setSelectedStation}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-r from-white via-blue-50 to-green-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Why Choose ChargeEase in India?
            </h2>
            <p className="text-xl text-gray-600">Supporting all major Indian EV brands and charging standards</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50 border-0">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="mb-4 text-xl">Indian EV Support</CardTitle>
              <p className="text-gray-600">Compatible with Tata Nexon EV, Mahindra eVerito, Ola S1, Ather 450X and all major Indian EVs.</p>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-green-50 border-0">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="mb-4 text-xl">Indian Standards</CardTitle>
              <p className="text-gray-600">Support for CCS2, CHAdeMO, Type 2 AC, Bharat AC001/DC001, and 15A socket charging.</p>
            </Card>
            
            <Card className="text-center p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-white to-purple-50 border-0">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="mb-4 text-xl">Instant Booking & Payment</CardTitle>
              <p className="text-gray-600">Book charging slots instantly with secure payment options and real-time availability.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)}
        station={selectedStation}
      />
    </div>
  );
};

export default Index;
