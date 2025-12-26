import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Car, LogIn, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';

export function Header() {
  const { user, isAdmin, isSeller, signOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">AutoElite</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              Veículos
            </Button>
          </Link>

          {(isAdmin || isSeller) && (
            <>
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/admin/conversations">
                <Button variant="ghost" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Conversas
                </Button>
              </Link>
            </>
          )}

          {user ? (
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          ) : (
            <Link to="/auth">
              <Button variant="default" size="sm">
                <LogIn className="h-4 w-4 mr-2" />
                Entrar
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
