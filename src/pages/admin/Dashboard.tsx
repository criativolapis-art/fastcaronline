import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useVehicles, useDeleteVehicle } from '@/hooks/useVehicles';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Vehicle, statusLabels } from '@/types/vehicle';
import { Plus, Pencil, Trash2, Search, Car, Users, MessageSquare, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { data: vehicles, isLoading } = useVehicles();
  const deleteVehicle = useDeleteVehicle();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredVehicles = vehicles?.filter((v) =>
    `${v.brand} ${v.model}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteVehicle.mutateAsync(deleteId);
      toast({
        title: 'Veículo excluído',
        description: 'O veículo foi removido do estoque.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir',
        description: error.message,
      });
    } finally {
      setDeleteId(null);
    }
  };

  const stats = {
    total: vehicles?.length || 0,
    available: vehicles?.filter((v) => v.status === 'available').length || 0,
    reserved: vehicles?.filter((v) => v.status === 'reserved').length || 0,
    sold: vehicles?.filter((v) => v.status === 'sold').length || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12 px-6">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Gerencie seu estoque de veículos</p>
            </div>
            {isAdmin && (
              <Link to="/admin/veiculos/novo">
                <Button className="bg-gradient-accent hover:shadow-glow">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Veículo
                </Button>
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total
                </CardTitle>
                <Car className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.total}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Disponíveis
                </CardTitle>
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.available}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Reservados
                </CardTitle>
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.reserved}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Vendidos
                </CardTitle>
                <div className="w-3 h-3 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.sold}</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link to="/admin/conversations">
              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all cursor-pointer">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Conversas</p>
                    <p className="text-sm text-muted-foreground">Ver atendimentos</p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {isAdmin && (
              <>
                <Link to="/admin/usuarios">
                  <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Usuários</p>
                        <p className="text-sm text-muted-foreground">Gerenciar equipe</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                <Link to="/admin/configuracoes">
                  <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all cursor-pointer">
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Settings className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Configurações</p>
                        <p className="text-sm text-muted-foreground">Bureau de crédito</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </>
            )}
          </div>

          {/* Vehicle Table */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Estoque</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar veículo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : !filteredVehicles || filteredVehicles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum veículo encontrado</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {vehicle.main_image && (
                              <img
                                src={vehicle.main_image}
                                alt={vehicle.model}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <p className="font-medium">{vehicle.brand}</p>
                              <p className="text-sm text-muted-foreground">{vehicle.model}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.year}</TableCell>
                        <TableCell>{formatPrice(vehicle.price)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              vehicle.status === 'available'
                                ? 'default'
                                : vehicle.status === 'reserved'
                                ? 'secondary'
                                : 'outline'
                            }
                          >
                            {statusLabels[vehicle.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link to={`/admin/veiculos/${vehicle.id}`}>
                              <Button variant="ghost" size="icon">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            {isAdmin && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteId(vehicle.id)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este veículo? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
