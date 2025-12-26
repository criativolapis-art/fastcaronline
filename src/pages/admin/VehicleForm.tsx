import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useVehicle, useCreateVehicle, useUpdateVehicle } from '@/hooks/useVehicles';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FuelType, TransmissionType, VehicleStatus, fuelLabels, transmissionLabels, statusLabels } from '@/types/vehicle';
import { ArrowLeft, Loader2, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function VehicleForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id && id !== 'novo';
  const { isAdmin } = useAuth();

  const { data: existingVehicle, isLoading: loadingVehicle } = useVehicle(id || '');
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    mileage: 0,
    fuel: 'flex' as FuelType,
    transmission: 'automatic' as TransmissionType,
    color: '',
    description: '',
    engine: '',
    power: '',
    main_image: '',
    status: 'available' as VehicleStatus,
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useState(() => {
    if (existingVehicle) {
      setFormData({
        brand: existingVehicle.brand,
        model: existingVehicle.model,
        year: existingVehicle.year,
        price: existingVehicle.price,
        mileage: existingVehicle.mileage,
        fuel: existingVehicle.fuel,
        transmission: existingVehicle.transmission,
        color: existingVehicle.color,
        description: existingVehicle.description || '',
        engine: existingVehicle.engine || '',
        power: existingVehicle.power || '',
        main_image: existingVehicle.main_image || '',
        status: existingVehicle.status,
      });
      setFeatures(existingVehicle.features || []);
      setImages(existingVehicle.images || []);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.brand || !formData.model || !formData.color) {
      toast({
        variant: 'destructive',
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
      });
      return;
    }

    setLoading(true);

    try {
      const vehicleData = {
        ...formData,
        features: features.length > 0 ? features : undefined,
        images: images.length > 0 ? images : undefined,
      };

      if (isEditing && id) {
        await updateVehicle.mutateAsync({ id, ...vehicleData });
        toast({
          title: 'Veículo atualizado',
          description: 'As informações foram salvas com sucesso.',
        });
      } else {
        await createVehicle.mutateAsync(vehicleData);
        toast({
          title: 'Veículo cadastrado',
          description: 'O veículo foi adicionado ao estoque.',
        });
      }

      navigate('/admin');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (isEditing && loadingVehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12 px-6">
        <div className="container max-w-3xl">
          <button
            onClick={() => navigate('/admin')}
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao dashboard
          </button>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>
                {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca *</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="Volkswagen"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      placeholder="Amarok"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Ano *</Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Quilometragem</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: parseInt(e.target.value) })}
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Combustível</Label>
                    <Select
                      value={formData.fuel}
                      onValueChange={(value: FuelType) => setFormData({ ...formData, fuel: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(fuelLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Câmbio</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value: TransmissionType) => setFormData({ ...formData, transmission: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(transmissionLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Cor *</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="Preto"
                      className="bg-background"
                    />
                  </div>
                </div>

                {isEditing && isAdmin && (
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: VehicleStatus) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Technical Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engine">Motor</Label>
                    <Input
                      id="engine"
                      value={formData.engine}
                      onChange={(e) => setFormData({ ...formData, engine: e.target.value })}
                      placeholder="V6 3.0 TDI"
                      className="bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="power">Potência</Label>
                    <Input
                      id="power"
                      value={formData.power}
                      onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                      placeholder="258 CV"
                      className="bg-background"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição detalhada do veículo..."
                    className="bg-background min-h-[100px]"
                  />
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="main_image">Imagem Principal (URL)</Label>
                    <Input
                      id="main_image"
                      value={formData.main_image}
                      onChange={(e) => setFormData({ ...formData, main_image: e.target.value })}
                      placeholder="https://..."
                      className="bg-background"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Galeria de Imagens</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="URL da imagem"
                        className="bg-background"
                      />
                      <Button type="button" onClick={addImage} variant="secondary">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    {images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Imagem ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <Label>Opcionais</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Ex: Ar condicionado"
                      className="bg-background"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button type="button" onClick={addFeature} variant="secondary">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {features.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 bg-secondary px-3 py-1 rounded-full text-sm"
                        >
                          {feature}
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-accent hover:shadow-glow"
                    disabled={loading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isEditing ? 'Salvar Alterações' : 'Cadastrar Veículo'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
