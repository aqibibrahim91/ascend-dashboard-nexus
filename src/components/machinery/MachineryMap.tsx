
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useApp } from '@/contexts/AppContext';
import { MapPin, List, Factory, Settings } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

export const MachineryMap = () => {
  const { machinery } = useApp();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock coordinates for demonstration - in real app, you'd get these from machine data
  const getMockCoordinates = (location: string) => {
    const locations: { [key: string]: { lat: number; lng: number } } = {
      'Factory Floor 1': { lat: 40.7128, lng: -74.0060 },
      'Factory Floor 2': { lat: 40.7589, lng: -73.9851 },
      'Warehouse A': { lat: 40.6892, lng: -74.0445 },
      'Production Line 1': { lat: 40.7505, lng: -73.9934 },
      'Production Line 2': { lat: 40.7282, lng: -73.7949 },
    };
    return locations[location] || { lat: 40.7128, lng: -74.0060 };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'operational':
        return '#10B981'; // green
      case 'maintenance':
        return '#F59E0B'; // yellow
      case 'offline':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  const initializeMap = async () => {
    if (!apiKey.trim()) {
      setError('Please enter your Google Maps API key');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['maps']
      });

      await loader.load();

      if (mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: 40.7128, lng: -74.0060 }, // Default to NYC
          zoom: 12,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        });

        setMap(mapInstance);
        setShowApiKeyInput(false);

        // Add markers for each machine
        machinery.forEach((machine) => {
          const coords = getMockCoordinates(machine.location);
          
          const marker = new google.maps.Marker({
            position: coords,
            map: mapInstance,
            title: machine.name,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: getMarkerColor(machine.status),
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            },
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-medium text-sm">${machine.name}</h3>
                <p class="text-xs text-gray-600">${machine.location}</p>
                <p class="text-xs text-gray-600">${machine.type} - ${machine.model}</p>
                <span class="inline-block px-2 py-1 text-xs rounded ${getStatusColor(machine.status)}">${machine.status}</span>
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstance, marker);
          });
        });
      }
    } catch (err) {
      setError('Failed to load Google Maps. Please check your API key.');
      console.error('Google Maps loading error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* API Key Input */}
      {showApiKeyInput && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Google Maps Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              To display the map, please enter your Google Maps API key. You can get one from the{' '}
              <a 
                href="https://console.cloud.google.com/google/maps-apis" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter your Google Maps API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={initializeMap}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? 'Loading...' : 'Load Map'}
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Map Container */}
      {!showApiKeyInput && (
        <Card className="h-96">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Machine Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={mapRef} className="w-full h-full rounded-lg" />
          </CardContent>
        </Card>
      )}

      {/* Machine List with Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Machine Locations Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {machinery.map((machine) => (
              <div
                key={machine.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      machine.status === 'operational'
                        ? 'bg-green-500'
                        : machine.status === 'maintenance'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <div className="font-medium text-sm">{machine.name}</div>
                    <div className="text-xs text-gray-600 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {machine.location}
                    </div>
                  </div>
                </div>
                <Badge className={getStatusColor(machine.status)}>
                  {machine.status}
                </Badge>
              </div>
            ))}
          </div>

          {machinery.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Factory className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No machines found</h3>
              <p className="text-gray-600">Add some machinery to see their locations on the map</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
