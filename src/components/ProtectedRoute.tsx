import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  requireSeller?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false,
  requireSeller = false 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isSeller } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireSeller && !isAdmin && !isSeller) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
