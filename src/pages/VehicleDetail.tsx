import { useParams, Link } from 'react-router-dom';
import { useVehicle } from '@/hooks/useVehicles';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Vehicle, 
  fuelLabels, 
  transmissionLabels 
} from '@/types/vehicle';
import { 
  ArrowLeft, 
  Fuel, 
  Gauge, 
  Calendar, 
  Palette,
  Zap,
  Cog,
  Shield,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { ChatWidget } from '@/components/ChatWidget';

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: vehicle, isLoading, error } = useVehicle(id || '');
  const [showChat, setShowChat] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('pt-BR').format(mileage) + ' km';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <Skeleton className="h-[60vh] w-full" />
          <div className="container px-6 py-12 space-y-4">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold">Veículo não encontrado</p>
            <Link to="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao catálogo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const specs = [
    { icon: Gauge, label: 'Quilometragem', value: formatMileage(vehicle.mileage) },
    { icon: Fuel, label: 'Combustível', value: fuelLabels[vehicle.fuel] },
    { icon: Cog, label: 'Câmbio', value: transmissionLabels[vehicle.transmission] },
    { icon: Calendar, label: 'Ano', value: vehicle.year.toString() },
    { icon: Palette, label: 'Cor', value: vehicle.color },
    ...(vehicle.engine ? [{ icon: Zap, label: 'Motor', value: vehicle.engine }] : []),
    ...(vehicle.power ? [{ icon: Shield, label: 'Potência', value: vehicle.power }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: vehicle.main_image ? `url(${vehicle.main_image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {!vehicle.main_image && (
            <div className="w-full h-full bg-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 px-6 py-20">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao catálogo
          </Link>

          <div className="max-w-3xl space-y-6">
            <div className="space-y-2">
              <Badge className="bg-primary text-primary-foreground text-lg px-4 py-1">
                {vehicle.year}
              </Badge>
              <p className="text-primary font-bold text-lg uppercase tracking-wider">
                {vehicle.brand}
              </p>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                {vehicle.model}
              </h1>
            </div>

            <p className="text-4xl md:text-5xl font-bold bg-gradient-accent bg-clip-text text-transparent">
              {formatPrice(vehicle.price)}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => setShowChat(true)}
                className="text-lg px-8 py-6 bg-gradient-accent hover:shadow-glow transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Tenho Interesse
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Specs Section */}
      <section className="py-24 px-6 bg-secondary/50">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            Especificações
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specs.map((spec, index) => (
              <Card
                key={index}
                className="bg-gradient-card border-border/50 p-6 hover:shadow-card transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <spec.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{spec.label}</p>
                    <p className="text-lg font-semibold">{spec.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Description Section */}
      {vehicle.description && (
        <section className="py-24 px-6">
          <div className="container max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Descrição
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {vehicle.description}
            </p>
          </div>
        </section>
      )}

      {/* Features Section */}
      {vehicle.features && vehicle.features.length > 0 && (
        <section className="py-24 px-6 bg-secondary/50">
          <div className="container max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Opcionais
            </h2>
            <div className="flex flex-wrap gap-3">
              {vehicle.features.map((feature, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="text-base px-4 py-2"
                >
                  {feature}
                </Badge>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Section */}
      {vehicle.images && vehicle.images.length > 0 && (
        <section className="py-24 px-6">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              Galeria
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicle.images.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] hover:shadow-elevated transition-all duration-500"
                >
                  <img
                    src={image}
                    alt={`${vehicle.brand} ${vehicle.model} - Foto ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Chat Widget */}
      <ChatWidget 
        open={showChat} 
        onOpenChange={setShowChat}
        vehicleId={vehicle.id}
        vehicleName={`${vehicle.brand} ${vehicle.model}`}
      />
    </div>
  );
}
