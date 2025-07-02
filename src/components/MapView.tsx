
import { useEffect, useRef } from 'react';
import { MapPin, Navigation, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Station {
  id: number;
  name: string;
  address: string;
  distance: number;
  status: string;
  chargerTypes: string[];
  amenities: string[];
  availableChargers: number;
  totalChargers: number;
  pricePerKwh: number;
  coordinates: { lat: number; lng: number };
}

interface MapViewProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station | null) => void;
}

const MapView = ({ stations, selectedStation, onStationSelect }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // This is a mock map implementation. In a real app, you'd integrate with Google Maps, Mapbox, or similar
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100">
      {/* Mock Map Background */}
      <div 
        ref={mapRef}
        className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.3'%3E%3Cpath d='M0 20h40v20H0z'/%3E%3Cpath d='M20 0v40'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {/* Map Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
          <Button size="sm" variant="secondary" className="bg-white shadow-md">
            <Navigation className="w-4 h-4" />
          </Button>
          <div className="bg-white rounded-lg shadow-md p-2 text-sm">
            <div className="text-center font-medium">Hyderabad</div>
          </div>
        </div>

        {/* Station Markers */}
        {stations.map((station, index) => (
          <div
            key={station.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
              selectedStation?.id === station.id ? 'scale-125 z-20' : 'z-10'
            }`}
            style={{
              left: `${25 + index * 12}%`,
              top: `${35 + index * 8}%`,
            }}
            onClick={() => onStationSelect(selectedStation?.id === station.id ? null : station)}
          >
            <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg ${getStatusColor(station.status)}`}>
              <MapPin className="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
            
            {/* Station Info Popup */}
            {selectedStation?.id === station.id && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-72">
                <Card className="shadow-xl border-2 border-primary">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{station.name}</CardTitle>
                      <Badge variant={station.status === 'available' ? 'default' : station.status === 'busy' ? 'secondary' : 'destructive'}>
                        {getStatusText(station.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{station.address}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Distance:</span>
                      <span className="font-medium">{station.distance} km</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Available:</span>
                      <span className="font-medium">{station.availableChargers}/{station.totalChargers}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Price:</span>
                      <span className="font-medium flex items-center">
                        <IndianRupee className="w-3 h-3 mr-1" />
                        {station.pricePerKwh}/kWh
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {station.chargerTypes.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {station.amenities.map(amenity => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full gradient-bg text-white">
                      Get Directions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ))}

        {/* Map Attribution */}
        <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
          Hyderabad EV Charging Map - Indian Standards Supported
        </div>
      </div>
    </div>
  );
};

export default MapView;
