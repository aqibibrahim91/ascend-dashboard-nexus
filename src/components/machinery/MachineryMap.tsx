
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { MapPin, List, Factory } from 'lucide-react';

export const MachineryMap = () => {
  const { machinery } = useApp();

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

  return (
    <div className="space-y-6">
      {/* Map Container */}
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Machine Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg overflow-hidden">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {[...Array(48)].map((_, i) => (
                  <div
                    key={i}
                    className={`border border-gray-300 ${
                      Math.random() > 0.7 ? 'bg-green-100' : 'bg-blue-50'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Machine Markers */}
            {machinery.map((machine, index) => {
              const coords = getMockCoordinates(machine.location);
              const x = ((coords.lng + 74.1) / 0.3) * 100; // Convert to percentage
              const y = ((40.8 - coords.lat) / 0.1) * 100; // Convert to percentage
              
              return (
                <div
                  key={machine.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  style={{
                    left: `${Math.max(10, Math.min(90, x))}%`,
                    top: `${Math.max(10, Math.min(90, y))}%`,
                  }}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                      machine.status === 'operational'
                        ? 'bg-green-500'
                        : machine.status === 'maintenance'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    } hover:scale-125 transition-transform duration-200`}
                  />
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white p-2 rounded shadow-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                    <div className="text-sm font-medium">{machine.name}</div>
                    <div className="text-xs text-gray-600">{machine.location}</div>
                    <Badge className={`text-xs ${getStatusColor(machine.status)}`}>
                      {machine.status}
                    </Badge>
                  </div>
                </div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
              <div className="text-sm font-medium mb-2">Status Legend</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Operational</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Maintenance</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Offline</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
