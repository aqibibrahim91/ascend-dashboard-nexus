import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useApp } from "@/contexts/AppContext";
import { Loader2 } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 0, // Default center (will be overridden if machines exist)
  lng: 0,
};

const MachineryMap = () => {
  const { machinery } = useApp();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );

  // Calculate center based on machinery locations if available
  const calculateCenter = () => {
    if (machinery.length === 0) return center;

    const latitudes = machinery.map((m) => m.latitude).filter(Boolean);
    const longitudes = machinery.map((m) => m.longitude).filter(Boolean);

    if (latitudes.length === 0 || longitudes.length === 0) return center;

    return {
      lat: latitudes.reduce((a, b) => a + b) / latitudes.length,
      lng: longitudes.reduce((a, b) => a + b) / longitudes.length,
    };
  };

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case "operational":
        return "http://maps.google.com/mapfiles/ms/icons/green-dot.png";
      case "maintenance":
        return "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
      case "offline":
        return "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
      default:
        return "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
    }
  };

  return (
    <div className="rounded-lg overflow-hidden border">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={machinery.length > 0 ? 10 : 2}
        center={calculateCenter()}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {machinery
          .filter((machine) => machine.latitude && machine.longitude)
          .map((machine) => (
            <Marker
              key={machine.id}
              position={{
                lat: machine.latitude,
                lng: machine.longitude,
              }}
              icon={{
                url: getMarkerIcon(machine.status),
              }}
              title={`${machine.name} (${machine.status})`}
            />
          ))}
      </GoogleMap>
    </div>
  );
};

export default MachineryMap;
