import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/amarok-hero.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </div>
      
      <div className="container relative z-10 px-6 py-20">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <div className="inline-block">
              <span className="text-primary font-bold text-sm uppercase tracking-wider bg-primary/10 px-4 py-2 rounded-full">
                Nova Geração
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
              Volkswagen
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                Amarok
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Potência, tecnologia e design premium em uma única máquina. 
              Descubra o poder da nova Amarok.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-accent hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              Agendar Test Drive
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:bg-secondary transition-all duration-300"
            >
              Ver Especificações
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
