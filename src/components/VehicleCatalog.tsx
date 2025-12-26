import { useAvailableVehicles } from '@/hooks/useVehicles';
import { VehicleCard } from './VehicleCard';
import { Skeleton } from '@/components/ui/skeleton';

export function VehicleCatalog() {
  const { data: vehicles, isLoading, error } = useAvailableVehicles();

  if (isLoading) {
    return (
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Nosso
              <span className="block text-primary">Estoque</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veículos selecionados com garantia de qualidade
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[16/10] rounded-lg" />
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-6">
        <div className="container text-center">
          <p className="text-destructive">Erro ao carregar veículos.</p>
        </div>
      </section>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <section className="py-24 px-6">
        <div className="container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Nosso
              <span className="block text-primary">Estoque</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Veículos selecionados com garantia de qualidade
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              Nenhum veículo disponível no momento.
            </p>
            <p className="text-muted-foreground">
              Volte em breve para conferir nossas novidades!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Nosso
            <span className="block text-primary">Estoque</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Veículos selecionados com garantia de qualidade
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
