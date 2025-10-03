import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, Mail, MapPin } from "lucide-react";

export const CTASection = () => {
  return (
    <section className="py-24 px-6 bg-gradient-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">
              Pronto para
              <span className="block bg-gradient-accent bg-clip-text text-transparent">
                Dirigir o Futuro?
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Entre em contato e agende seu test drive exclusivo
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <p className="font-semibold">(11) 9999-9999</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">contato@amarok.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Endereço</p>
                <p className="font-semibold">São Paulo, SP</p>
              </div>
            </div>
          </div>

          <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50">
            <h3 className="text-2xl font-bold mb-6">Agende seu Test Drive</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Seu nome" 
                  className="bg-background border-border"
                />
                <Input 
                  type="email" 
                  placeholder="Seu email" 
                  className="bg-background border-border"
                />
              </div>
              <Input 
                type="tel" 
                placeholder="Seu telefone" 
                className="bg-background border-border"
              />
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-accent hover:shadow-glow transition-all duration-300"
              >
                Enviar Solicitação
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
