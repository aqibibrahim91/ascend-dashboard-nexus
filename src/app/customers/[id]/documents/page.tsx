"use client";

import { CustomerDocuments } from "@/components/customers/CustomerDocument";

interface CustomerDocumentsPageProps {
  params: {
    id: string;
  };
}

export default function CustomerDocumentsPage({
  params,
}: CustomerDocumentsPageProps) {
  return <CustomerDocuments customerId={params.id} />;
}
