export type VehicleStatus = 'available' | 'reserved' | 'sold';
export type FuelType = 'gasoline' | 'diesel' | 'flex' | 'electric' | 'hybrid';
export type TransmissionType = 'manual' | 'automatic';

export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: FuelType;
  transmission: TransmissionType;
  color: string;
  description: string | null;
  engine: string | null;
  power: string | null;
  features: string[] | null;
  status: VehicleStatus;
  main_image: string | null;
  images: string[] | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export const fuelLabels: Record<FuelType, string> = {
  gasoline: 'Gasolina',
  diesel: 'Diesel',
  flex: 'Flex',
  electric: 'Elétrico',
  hybrid: 'Híbrido',
};

export const transmissionLabels: Record<TransmissionType, string> = {
  manual: 'Manual',
  automatic: 'Automático',
};

export const statusLabels: Record<VehicleStatus, string> = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
};
