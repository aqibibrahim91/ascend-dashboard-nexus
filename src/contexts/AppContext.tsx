import React, { createContext, useContext, useState, ReactNode } from "react";

export interface CustomerDocument {
  id: string;
  name: string;
  fileUrl: string;
  qrCode?: string;
  createdAt: string;
}
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "inactive";
  createdAt: string;
  documents?: CustomerDocument[];
}

export interface Machinery {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: "operational" | "maintenance" | "offline";
  location: string;
  purchaseDate: string;
  latitude: number;
  longitude: number;
}

interface AppContextType {
  customers: Customer[];
  machinery: Machinery[];
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => void;
  addMachinery: (machinery: Omit<Machinery, "id">) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  updateMachinery: (id: string, machinery: Partial<Machinery>) => void;
  deleteCustomer: (id: string) => void;
  deleteMachinery: (id: string) => void;
  addCustomerDocument: (
    customerId: string,
    document: Omit<CustomerDocument, "id">
  ) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy data
const DUMMY_CUSTOMERS: Customer[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+61234567890",
    company: "Tech Corp",
    status: "active",
    createdAt: "2024-01-15",
    documents: [
      {
        id: "doc1",
        name: "Service Agreement",
        fileUrl: "https://example.com/docs/service-agreement.pdf",
        qrCode:
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Service%20Agreement",
        createdAt: "2024-01-16",
      },
      {
        id: "doc2",
        name: "Invoice January 2024",
        fileUrl: "https://example.com/docs/invoice-jan-2024.pdf",
        qrCode:
          "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Invoice%20January%202024",
        createdAt: "2024-01-20",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+61234567891",
    company: "Innovation Inc",
    status: "active",
    createdAt: "2024-01-20",
  },
];

const DUMMY_MACHINERY: Machinery[] = [
  {
    id: "1",
    name: "CNC Machine A1",
    type: "CNC",
    model: "X-2000",
    serialNumber: "CNC001",
    status: "operational",
    location: "Factory Floor 1",
    purchaseDate: "2023-06-15",
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: "2",
    name: "Hydraulic Press B2",
    type: "Press",
    model: "HP-500",
    serialNumber: "HP001",
    status: "maintenance",
    location: "Factory Floor 2",
    purchaseDate: "2023-08-20",
    latitude: 40.7128,
    longitude: -74.006,
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [customers, setCustomers] = useState<Customer[]>(DUMMY_CUSTOMERS);
  const [machinery, setMachinery] = useState<Machinery[]>(DUMMY_MACHINERY);

  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt">) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCustomers((prev) => [...prev, newCustomer]);
  };

  const addMachinery = (machineryData: Omit<Machinery, "id">) => {
    const newMachinery: Machinery = {
      ...machineryData,
      id: Date.now().toString(),
    };
    setMachinery((prev) => [...prev, newMachinery]);
  };

  const updateCustomer = (id: string, customerData: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === id ? { ...customer, ...customerData } : customer
      )
    );
  };

  const updateMachinery = (id: string, machineryData: Partial<Machinery>) => {
    setMachinery((prev) =>
      prev.map((machine) =>
        machine.id === id ? { ...machine, ...machineryData } : machine
      )
    );
  };

  const deleteCustomer = (id: string) => {
    setCustomers((prev) => prev.filter((customer) => customer.id !== id));
  };

  const deleteMachinery = (id: string) => {
    setMachinery((prev) => prev.filter((machine) => machine.id !== id));
  };
  const addCustomerDocument = (
    customerId: string,
    documentData: Omit<CustomerDocument, "id">
  ) => {
    const newDocument: CustomerDocument = {
      ...documentData,
      id: Date.now().toString(),
    };

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? {
              ...customer,
              documents: [...(customer.documents || []), newDocument],
            }
          : customer
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        customers,
        machinery,
        addCustomer,
        addMachinery,
        updateCustomer,
        updateMachinery,
        deleteCustomer,
        deleteMachinery,
        addCustomerDocument,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
