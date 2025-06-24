import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Phone,
  Building,
  Calendar,
  ArrowLeft,
  Plus,
  FileText,
  QrCode,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export const CustomerDocuments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { customers, addCustomerDocument } = useApp();
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: "",
    fileUrl: "",
    generateQR: true,
  });

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return <div>Customer not found</div>;
  }

  const handleAddDocument = () => {
    if (!newDocument.name || !newDocument.fileUrl) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const qrData = `Customer: ${customer.name}\nDocument: ${newDocument.name}\nFile: ${newDocument.fileUrl}`;
    const qrCodeUrl = newDocument.generateQR
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          qrData
        )}`
      : undefined;

    addCustomerDocument(customer.id, {
      name: newDocument.name,
      fileUrl: newDocument.fileUrl,
      qrCode: qrCodeUrl,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Document Added",
      description: "New document has been added successfully",
    });

    setNewDocument({ name: "", fileUrl: "", generateQR: true });
    setIsAddDocumentOpen(false);
  };

  const generateQRCode = (documentId: string) => {
    const document = customer.documents?.find((d) => d.id === documentId);
    if (document?.qrCode) {
      window.open(document.qrCode, "_blank");
    } else {
      const qrData = `Customer: ${customer.name}\nDocument: ${document?.name}\nFile: ${document?.fileUrl}`;
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        qrData
      )}`;
      window.open(qrUrl, "_blank");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Customer Documents: {customer.name}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/customers`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Customers
          </Button>
          <Button
            onClick={() => setIsAddDocumentOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Document
          </Button>
        </div>
      </div>

      {/* Customer Info Card */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="font-medium">{customer.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{customer.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{customer.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created At</p>
                  <p className="font-medium">
                    {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <Badge
                  variant={
                    customer.status === "active" ? "default" : "secondary"
                  }
                >
                  {customer.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Documents</h3>
        {customer.documents?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>File Link</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customer.documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      {document.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View Document
                    </a>
                  </TableCell>
                  <TableCell>
                    {new Date(document.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => generateQRCode(document.id)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Generate QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={document.fileUrl}
                          download
                          className="text-green-600 hover:text-green-900"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No documents found for this customer
            </p>
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      <Dialog open={isAddDocumentOpen} onOpenChange={setIsAddDocumentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name</Label>
              <Input
                id="documentName"
                placeholder="Enter document name"
                value={newDocument.name}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fileUrl">File URL</Label>
              <Input
                id="fileUrl"
                placeholder="Enter file URL"
                value={newDocument.fileUrl}
                onChange={(e) =>
                  setNewDocument({ ...newDocument, fileUrl: e.target.value })
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="generateQR"
                checked={newDocument.generateQR}
                onChange={(e) =>
                  setNewDocument({
                    ...newDocument,
                    generateQR: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <Label htmlFor="generateQR">Generate QR Code</Label>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddDocumentOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddDocument}>Add Document</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
