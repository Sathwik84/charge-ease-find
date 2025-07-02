import { MapPin, Zap, Wifi, Coffee, Car, Clock, IndianRupee } from 'lucide-react';
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

interface StationListProps {
  stations: Station[];
  selectedStation: Station | null;
  onStationSelect: (station: Station | null) => void;
  onBookSlot?: (station: Station) => void;
}

const StationList = ({ stations, selectedStation, onStationSelect, onBookSlot }: StationListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available Now';
      case 'busy': return 'Limited Spots';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="w-3 h-3" />;
      case 'coffee': return <Coffee className="w-3 h-3" />;
      case 'restaurant': return <Coffee className="w-3 h-3" />;
      case 'parking': return <Car className="w-3 h-3" />;
      case 'shopping': return <Car className="w-3 h-3" />;
      case 'atm': return <IndianRupee className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  if (stations.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-to-br from-white to-gray-50 shadow-lg border-0">
        <div className="text-gray-400 mb-4">
          <MapPin className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Stations Found</h3>
        <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {stations.map((station) => (
        <Card 
          key={station.id} 
          className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-white to-gray-50 border-0 shadow-md ${
            selectedStation?.id === station.id 
              ? 'ring-2 ring-blue-400 shadow-2xl scale-105' 
              : 'hover:ring-1 hover:ring-gray-200'
          }`}
          onClick={() => onStationSelect(selectedStation?.id === station.id ? null : station)}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {station.name}
                </CardTitle>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  {station.distance} km away
                </div>
                <p className="text-sm text-gray-600">{station.address}</p>
              </div>
              <Badge className={`${getStatusColor(station.status)} font-medium shadow-sm`}>
                {getStatusText(station.status)}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Availability and Pricing with enhanced styling */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <span className="text-blue-600 font-medium">Available:</span>
                <div className="font-bold text-blue-800">
                  {station.availableChargers}/{station.totalChargers} chargers
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <span className="text-green-600 font-medium">Price:</span>
                <div className="font-bold text-green-800 flex items-center">
                  <IndianRupee className="w-3 h-3 mr-1" />
                  {station.pricePerKwh}/kWh
                </div>
              </div>
            </div>

            {/* Charger Types */}
            <div>
              <span className="text-sm text-gray-500 block mb-2">Charger Types:</span>
              <div className="flex flex-wrap gap-1">
                {station.chargerTypes.map(type => (
                  <Badge key={type} variant="outline" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            {station.amenities.length > 0 && (
              <div>
                <span className="text-sm text-gray-500 block mb-2">Amenities:</span>
                <div className="flex flex-wrap gap-1">
                  {station.amenities.map(amenity => (
                    <Badge key={amenity} variant="secondary" className="text-xs">
                      {getAmenityIcon(amenity)}
                      <span className="ml-1">{amenity}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Actions */}
            <div className="flex space-x-2 pt-2">
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Directions
              </Button>
              {onBookSlot && station.availableChargers > 0 && (
                <Button 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookSlot(station);
                  }}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Book Slot
                </Button>
              )}
              {(!onBookSlot || station.availableChargers === 0) && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1 hover:bg-gray-50 transition-all"
                >
                  Details
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StationList;
