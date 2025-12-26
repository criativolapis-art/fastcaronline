import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle, VehicleStatus, FuelType, TransmissionType } from '@/types/vehicle';

interface CreateVehicleData {
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  description?: string;
  engine?: string;
  power?: string;
  features?: string[];
  main_image?: string;
  images?: string[];
}

interface UpdateVehicleData extends Partial<CreateVehicleData> {
  id: string;
  status?: VehicleStatus;
}

export function useVehicles() {
  return useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vehicle[];
    },
  });
}

export function useAvailableVehicles() {
  return useQuery({
    queryKey: ['vehicles', 'available'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Vehicle[];
    },
  });
}

export function useVehicle(id: string) {
  return useQuery({
    queryKey: ['vehicles', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data as Vehicle | null;
    },
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicle: CreateVehicleData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          ...vehicle,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateVehicleData) => {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles', data.id] });
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
