
import { useState } from 'react';
import { Filter, X, Zap, MapPin, Wifi, Coffee, Car, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';

interface Filters {
  chargerType: string;
  availability: string;
  amenities: string[];
  maxDistance: number;
}

interface FilterPanelProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const FilterPanel = ({ filters, setFilters }: FilterPanelProps) => {
  // Indian EV charger types
  const chargerTypes = ['CCS2', 'CHAdeMO', 'Type 2 AC', 'Bharat AC001', 'Bharat DC001', '15A Socket'];
  const availabilityOptions = [
    { value: 'all', label: 'All Stations' },
    { value: 'available', label: 'Available Now' },
    { value: 'busy', label: 'Limited Spots' }
  ];
  
  const amenityOptions = [
    { value: 'Restaurant', label: 'Restaurant', icon: Coffee },
    { value: 'WiFi', label: 'WiFi', icon: Wifi },
    { value: 'Shopping', label: 'Shopping', icon: Car },
    { value: 'Parking', label: 'Parking', icon: Car },
    { value: 'Coffee', label: 'Coffee', icon: Coffee },
    { value: 'ATM', label: 'ATM', icon: Clock },
  ];

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setFilters({ ...filters, amenities: [...filters.amenities, amenity] });
    } else {
      setFilters({ ...filters, amenities: filters.amenities.filter(a => a !== amenity) });
    }
  };

  const clearFilters = () => {
    setFilters({
      chargerType: 'all',
      availability: 'all',
      amenities: [],
      maxDistance: 20
    });
  };

  const activeFiltersCount = [
    filters.chargerType !== 'all',
    filters.availability !== 'all',
    filters.amenities.length > 0,
    filters.maxDistance !== 20
  ].filter(Boolean).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Charger Type Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Charger Type (Indian Standards)</Label>
          <Select 
            value={filters.chargerType} 
            onValueChange={(value) => setFilters({ ...filters, chargerType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="All charger types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {chargerTypes.map(type => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    {type}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Availability</Label>
          <Select 
            value={filters.availability} 
            onValueChange={(value) => setFilters({ ...filters, availability: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any availability" />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distance Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Max Distance: {filters.maxDistance} km
          </Label>
          <Slider
            value={[filters.maxDistance]}
            onValueChange={([value]) => setFilters({ ...filters, maxDistance: value })}
            max={50}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 km</span>
            <span>50 km</span>
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="space-y-2">
            {amenityOptions.map(({ value, label, icon: Icon }) => (
              <div key={value} className="flex items-center space-x-2">
                <Checkbox
                  id={value}
                  checked={filters.amenities.includes(value)}
                  onCheckedChange={(checked) => handleAmenityChange(value, checked as boolean)}
                />
                <Label htmlFor={value} className="flex items-center text-sm cursor-pointer">
                  <Icon className="w-4 h-4 mr-2 text-gray-500" />
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterPanel;
