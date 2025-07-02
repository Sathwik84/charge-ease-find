
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

// Mock data for demonstration
const mockStations = [
  {
    id: 1,
    name: "Tesla Supercharger - Downtown",
    address: "123 Main St, San Francisco, CA",
    distance: 0.5,
    status: "available",
    chargerTypes: ["Tesla", "CCS"],
    amenities: ["Restaurant", "WiFi", "Shopping"],
    availableChargers: 8,
    totalChargers: 12,
    pricePerKwh: 0.28,
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 2,
    name: "ChargePoint Station",
    address: "456 Oak Ave, San Francisco, CA",
    distance: 1.2,
    status: "busy",
    chargerTypes: ["CCS", "CHAdeMO"],
    amenities: ["Restaurant", "Parking"],
    availableChargers: 2,
    totalChargers: 6,
    pricePerKwh: 0.32,
    coordinates: { lat: 37.7849, lng: -122.4094 }
  },
  {
    id: 3,
    name: "EVgo Fast Charging",
    address: "789 Pine St, San Francisco, CA",
    distance: 2.1,
    status: "available",
    chargerTypes: ["CCS", "CHAdeMO"],
    amenities: ["WiFi", "Coffee"],
    availableChargers: 4,
    totalChargers: 4,
    pricePerKwh: 0.35,
    coordinates: { lat: 37.7649, lng: -122.4294 }
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
    maxDistance: 10
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
          <p className="text-xl mb-8 opacity-90">
            Find the perfect EV charging station near you with real-time availability
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search by location or station name..."
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
                {filteredStations.length} Stations Found
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
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ChargeEase?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mb-4">Real-time Availability</CardTitle>
              <p className="text-gray-600">Get live updates on charger availability and never arrive at a full station again.</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mb-4">Smart Filtering</CardTitle>
              <p className="text-gray-600">Filter by charger type, amenities, and distance to find exactly what you need.</p>
            </Card>
            
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="mb-4">Comprehensive Data</CardTitle>
              <p className="text-gray-600">Detailed information about pricing, amenities, and charger specifications.</p>
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
