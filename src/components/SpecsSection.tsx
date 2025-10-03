import { Card } from "@/components/ui/card";
import { Zap, Gauge, Shield, Cog } from "lucide-react";

const specs = [
  {
    icon: Zap,
    title: "Potência Máxima",
    value: "258 CV",
    description: "Motor V6 3.0 TDI turbodiesel",
  },
  {
    icon: Gauge,
    title: "Aceleração",
    value: "0-100 km/h",
    description: "Em apenas 7,3 segundos",
  },
  {
    icon: Shield,
    title: "Segurança",
    value: "5 Estrelas",
    description: "Máxima proteção Euro NCAP",
  },
  {
    icon: Cog,
    title: "Tração",
    value: "4Motion",
    description: "Tração permanente nas 4 rodas",
  },
];

export const SpecsSection = () => {
  return (
    <section className="py-24 px-6 bg-secondary/50">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Especificações
            <span className="block text-primary">de Elite</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Engenharia alemã de ponta em cada detalhe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {specs.map((spec, index) => (
            <Card
              key={index}
              className="bg-gradient-card border-border/50 p-8 hover:shadow-card hover:scale-105 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:shadow-glow transition-all duration-300">
                  <spec.icon className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    {spec.title}
                  </h3>
                  <p className="text-3xl font-bold mb-2">{spec.value}</p>
                  <p className="text-sm text-muted-foreground">
                    {spec.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
