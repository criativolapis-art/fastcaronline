import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle, fuelLabels, transmissionLabels } from '@/types/vehicle';
import { Fuel, Gauge, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('pt-BR').format(mileage) + ' km';
  };

  return (
    <Link to={`/veiculo/${vehicle.id}`}>
      <Card className="group overflow-hidden bg-gradient-card border-border/50 hover:shadow-elevated hover:scale-[1.02] transition-all duration-500">
        <div className="relative aspect-[16/10] overflow-hidden">
          {vehicle.main_image ? (
            <img
              src={vehicle.main_image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-secondary flex items-center justify-center">
              <span className="text-muted-foreground">Sem imagem</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              {vehicle.year}
            </Badge>
          </div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-sm text-primary font-medium uppercase tracking-wider">
              {vehicle.brand}
            </p>
            <h3 className="text-2xl font-bold">{vehicle.model}</h3>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              <span>{fuelLabels[vehicle.fuel]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{transmissionLabels[vehicle.transmission]}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border/50">
            <p className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              {formatPrice(vehicle.price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
