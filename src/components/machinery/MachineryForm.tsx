
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp, Machinery } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

interface MachineryFormData {
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  status: 'operational' | 'maintenance' | 'offline';
  location: string;
  purchaseDate: string;
}

interface MachineryFormProps {
  machinery?: Machinery;
  onSuccess?: () => void;
}

export const MachineryForm = ({ machinery, onSuccess }: MachineryFormProps) => {
  const { addMachinery, updateMachinery } = useApp();
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<MachineryFormData>({
    defaultValues: machinery ? {
      name: machinery.name,
      type: machinery.type,
      model: machinery.model,
      serialNumber: machinery.serialNumber,
      status: machinery.status,
      location: machinery.location,
      purchaseDate: machinery.purchaseDate
    } : {
      status: 'operational'
    }
  });

  const status = watch('status');

  const onSubmit = (data: MachineryFormData) => {
    if (machinery) {
      updateMachinery(machinery.id, data);
      toast({
        title: "Machinery Updated",
        description: "Machinery information has been successfully updated.",
      });
    } else {
      addMachinery(data);
      toast({
        title: "Machinery Added",
        description: "New machinery has been successfully added.",
      });
    }
    onSuccess?.();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{machinery ? 'Edit Machinery' : 'Add New Machinery'}</CardTitle>
        <CardDescription>
          {machinery ? 'Update machinery information' : 'Fill in the details to add new machinery'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Machine Name</Label>
              <Input
                id="name"
                placeholder="Enter machine name"
                {...register('name', { required: 'Machine name is required' })}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Input
                id="type"
                placeholder="Enter machine type"
                {...register('type', { required: 'Machine type is required' })}
                className={errors.type ? 'border-red-500' : ''}
              />
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                placeholder="Enter model number"
                {...register('model', { required: 'Model is required' })}
                className={errors.model ? 'border-red-500' : ''}
              />
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input
                id="serialNumber"
                placeholder="Enter serial number"
                {...register('serialNumber', { required: 'Serial number is required' })}
                className={errors.serialNumber ? 'border-red-500' : ''}
              />
              {errors.serialNumber && (
                <p className="text-sm text-red-500">{errors.serialNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter location"
                {...register('location', { required: 'Location is required' })}
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                {...register('purchaseDate', { required: 'Purchase date is required' })}
                className={errors.purchaseDate ? 'border-red-500' : ''}
              />
              {errors.purchaseDate && (
                <p className="text-sm text-red-500">{errors.purchaseDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as 'operational' | 'maintenance' | 'offline')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              {machinery ? 'Update Machinery' : 'Add Machinery'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
