import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { MachineryForm } from "./MachineryForm";
import MachineryMap from "./MachineryMap";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Hash,
  Factory,
  QrCode,
  Map,
  List,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MachineryList = () => {
  const { machinery, deleteMachinery } = useApp();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingMachinery, setEditingMachinery] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const filteredMachinery = machinery.filter(
    (machine) =>
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (machine) => {
    setEditingMachinery(machine);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    deleteMachinery(id);
    toast({
      title: "Machinery Deleted",
      description: "Machinery has been successfully removed.",
    });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMachinery(null);
  };

  const generateQRCode = (machine) => {
    const qrData = `Machine: ${machine.name}\nType: ${machine.type}\nModel: ${machine.model}\nSerial: ${machine.serialNumber}\nLocation: ${machine.location}\nStatus: ${machine.status}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      qrData
    )}`;

    // Open QR code in new window
    window.open(qrUrl, "_blank");

    toast({
      title: "QR Code Generated",
      description: "QR code opened in new window.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (showForm) {
    return (
      <MachineryForm
        machinery={editingMachinery}
        onSuccess={handleFormSuccess}
      />
    );
  }

  if (viewMode === "map") {
    return (
      <div className="space-y-6">
        {/* Header with Map Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Machinery Map</h2>
            <p className="text-gray-600">View machine locations and status</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode("list")}
              className="flex items-center gap-2"
            >
              <List className="h-4 w-4" />
              List View
            </Button>
            {/* <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Machinery
            </Button> */}
          </div>
        </div>

        <MachineryMap />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Machinery</h2>
          <p className="text-gray-600">Manage your machinery inventory</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setViewMode("map")}
            className="flex items-center gap-2"
          >
            <Map className="h-4 w-4" />
            Map View
          </Button>
          {/* <Button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Machinery
          </Button> */}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search machinery..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Machinery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMachinery.map((machine) => (
          <Card
            key={machine.id}
            className="hover:shadow-lg transition-shadow duration-200"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{machine.name}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {machine.type} - {machine.model}
                  </p>
                </div>
                <Badge className={getStatusColor(machine.status)}>
                  {machine.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Hash className="h-4 w-4" />
                <span>{machine.serialNumber}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{machine.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>
                  Purchased:{" "}
                  {new Date(machine.purchaseDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(machine)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateQRCode(machine)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <QrCode className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(machine.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMachinery.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Factory className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No machinery found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Get started by adding your first machinery"}
          </p>
          {!searchTerm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Machinery
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
