
import { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, Navigation, IndianRupee } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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

const MapComponent = ({ stations, selectedStation, onStationSelect }: MapViewProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'busy': return '#eab308';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
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

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center: { lat: 17.4399, lng: 78.4983 }, // Hyderabad center
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#eeeeee' }]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#757575' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#c9c9c9' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      // Clear existing markers
      markers.forEach(marker => marker.setMap(null));
      
      const newMarkers = stations.map(station => {
        const marker = new window.google.maps.Marker({
          position: station.coordinates,
          map: map,
          title: station.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: getStatusColor(station.status),
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#ffffff'
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="max-width: 300px; padding: 10px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${station.name}</h3>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">${station.address}</p>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px;">Distance:</span>
                <span style="font-weight: 500; font-size: 14px;">${station.distance} km</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="font-size: 14px;">Available:</span>
                <span style="font-weight: 500; font-size: 14px;">${station.availableChargers}/${station.totalChargers}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="font-size: 14px;">Price:</span>
                <span style="font-weight: 500; font-size: 14px;">₹${station.pricePerKwh}/kWh</span>
              </div>
              <div style="display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px;">
                ${station.chargerTypes.map(type => `<span style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${type}</span>`).join('')}
              </div>
              <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                ${station.amenities.map(amenity => `<span style="background: #dbeafe; padding: 2px 6px; border-radius: 4px; font-size: 12px; color: #1e40af;">${amenity}</span>`).join('')}
              </div>
            </div>
          `
        });

        marker.addListener('click', () => {
          onStationSelect(selectedStation?.id === station.id ? null : station);
          infoWindow.open(map, marker);
        });

        if (selectedStation?.id === station.id) {
          infoWindow.open(map, marker);
        }

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, stations, selectedStation, onStationSelect]);

  return <div ref={ref} className="w-full h-full" />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-red-600">
            <p className="mb-4">Failed to load Google Maps</p>
            <p className="text-sm text-gray-500">Please check your API key</p>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const MapView = ({ stations, selectedStation, onStationSelect }: MapViewProps) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('googleMapsApiKey') || '');
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      localStorage.setItem('googleMapsApiKey', apiKey.trim());
      setShowApiKeyInput(false);
    }
  };

  if (showApiKeyInput) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Google Maps Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleApiKeySubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  To display the interactive map, please enter your Google Maps API key.
                </p>
                <p className="text-xs text-blue-600 mb-3">
                  Get your API key from: <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a>
                </p>
                <Input
                  type="text"
                  placeholder="Enter your Google Maps API Key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Load Map
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Wrapper apiKey={apiKey} render={render}>
        <MapComponent 
          stations={stations}
          selectedStation={selectedStation}
          onStationSelect={onStationSelect}
        />
      </Wrapper>
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <Button 
          size="sm" 
          variant="secondary" 
          className="bg-white shadow-md"
          onClick={() => setShowApiKeyInput(true)}
        >
          <Navigation className="w-4 h-4" />
        </Button>
        <div className="bg-white rounded-lg shadow-md p-2 text-sm">
          <div className="text-center font-medium">Hyderabad</div>
        </div>
      </div>

      {/* Map Attribution */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
        Hyderabad EV Charging Map - Powered by Google Maps
      </div>
    </div>
  );
};

export default MapView;
