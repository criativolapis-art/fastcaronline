import sideImage from "@/assets/amarok-side.jpg";
import interiorImage from "@/assets/amarok-interior.jpg";
import rearImage from "@/assets/amarok-rear.jpg";

const images = [
  {
    src: sideImage,
    title: "Perfil Aerodinâmico",
    description: "Design robusto e elegante",
  },
  {
    src: interiorImage,
    title: "Interior Premium",
    description: "Conforto e tecnologia",
  },
  {
    src: rearImage,
    title: "Vista Traseira",
    description: "Capacidade e estilo",
  },
];

export const GallerySection = () => {
  return (
    <section className="py-24 px-6">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Galeria
            <span className="block text-primary">Visual</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Cada ângulo revela perfeição
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-[4/3] hover:shadow-elevated transition-all duration-500"
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                  <p className="text-muted-foreground">{image.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
