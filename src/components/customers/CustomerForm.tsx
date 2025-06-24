import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp, Customer } from "@/contexts/AppContext";
import { useToast } from "@/hooks/use-toast";

interface CustomerFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: "active" | "inactive";
}

interface CustomerFormProps {
  customer?: Customer;
  onSuccess?: () => void;
}

export const CustomerForm = ({ customer, onSuccess }: CustomerFormProps) => {
  const { addCustomer, updateCustomer } = useApp();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CustomerFormData>({
    defaultValues: customer
      ? {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          company: customer.company,
          status: customer.status,
        }
      : {
          status: "active",
        },
  });

  const status = watch("status");

  const onSubmit = (data: CustomerFormData) => {
    if (customer) {
      updateCustomer(customer.id, data);
      toast({
        title: "Customer Updated",
        description: "Customer information has been successfully updated.",
      });
    } else {
      addCustomer(data);
      toast({
        title: "Customer Added",
        description: "New customer has been successfully added.",
      });
    }
    onSuccess?.();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{customer ? "Edit Customer" : "Add New Customer"}</CardTitle>
        <CardDescription>
          {customer
            ? "Update customer information"
            : "Fill in the details to add a new customer"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register("name", { required: "Name is required" })}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Please enter a valid email",
                  },
                })}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                {...register("phone", { required: "Phone number is required" })}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Enter company name"
                {...register("company", { required: "Company is required" })}
                className={errors.company ? "border-red-500" : ""}
              />
              {errors.company && (
                <p className="text-sm text-red-500">{errors.company.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue("status", value as "active" | "inactive")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {customer ? "Update Customer" : "Add Customer"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
