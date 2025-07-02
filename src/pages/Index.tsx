import { useState } from 'react';
import { MapPin, Zap, Filter, Search, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import MapView from '@/components/MapView';
import StationList from '@/components/StationList';
import FilterPanel from '@/components/FilterPanel';
import AuthModal from '@/components/AuthModal';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={() => setIsAuthOpen(true)} />
      
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <Zap className="w-12 h-12 mr-3" />
            <h1 className="text-5xl font-bold">ChargeEase</h1>
          </div>
          <p className="text-xl mb-2 opacity-90">
            Find EV charging stations in Hyderabad for your Tata, Mahindra, Ola, Ather & more
          </p>
          <p className="text-lg mb-8 opacity-80">
            Real-time availability with Indian charging standards
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by location or station name in Hyderabad..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-4 text-lg rounded-full border-0 shadow-lg bg-white text-gray-900"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Panel - Filters & Station List */}
          <div className="lg:w-1/3 space-y-6">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredStations.length} Stations Found in Hyderabad
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
              <FilterPanel filters={filters} setFilters={setFilters} />
            </div>

            {/* Station List */}
            <StationList 
              stations={filteredStations}
              selectedStation={selectedStation}
              onStationSelect={setSelectedStation}
            />
          </div>

          {/* Right Panel - Map */}
          <div className="lg:w-2/3">
            <Card className="h-[600px] overflow-hidden">
              <CardContent className="p-0 h-full">
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

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose ChargeEase in India?</h2>
          <p className="text-center text-gray-600 mb-12">Supporting all major Indian EV brands and charging standards</p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mb-4">Indian EV Support</CardTitle>
              <p className="text-gray-600">Compatible with Tata Nexon EV, Mahindra eVerito, Ola S1, Ather 450X and all major Indian EVs.</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mb-4">Indian Standards</CardTitle>
              <p className="text-gray-600">Support for CCS2, CHAdeMO, Type 2 AC, Bharat AC001/DC001, and 15A socket charging.</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mb-4">Local Pricing</CardTitle>
              <p className="text-gray-600">Prices in ₹/kWh with real-time availability across Hyderabad locations.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Index;
