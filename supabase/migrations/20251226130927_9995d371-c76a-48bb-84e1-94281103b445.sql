-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'seller', 'user');

-- Criar enum para status do veículo
CREATE TYPE public.vehicle_status AS ENUM ('available', 'reserved', 'sold');

-- Criar enum para tipo de combustível
CREATE TYPE public.fuel_type AS ENUM ('gasoline', 'diesel', 'flex', 'electric', 'hybrid');

-- Criar enum para transmissão
CREATE TYPE public.transmission_type AS ENUM ('manual', 'automatic');

-- Criar enum para status da conversa
CREATE TYPE public.conversation_status AS ENUM ('ai_handling', 'waiting_seller', 'seller_handling', 'completed');

-- Criar enum para tipo de pagamento
CREATE TYPE public.payment_type AS ENUM ('cash', 'financing');

-- Tabela de perfis de usuários
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de roles de usuários
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Tabela de veículos
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  mileage INTEGER NOT NULL DEFAULT 0,
  fuel fuel_type NOT NULL DEFAULT 'flex',
  transmission transmission_type NOT NULL DEFAULT 'automatic',
  color TEXT NOT NULL,
  description TEXT,
  engine TEXT,
  power TEXT,
  features TEXT[],
  status vehicle_status NOT NULL DEFAULT 'available',
  main_image TEXT,
  images TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conversas com clientes
CREATE TABLE public.conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_cpf TEXT,
  payment_type payment_type,
  credit_score INTEGER,
  score_approved BOOLEAN,
  assigned_seller_id UUID REFERENCES auth.users(id),
  status conversation_status NOT NULL DEFAULT 'ai_handling',
  scheduled_visit TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de mensagens das conversas
CREATE TABLE public.conversation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'ai', 'seller')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações (para integração futura com bureau de crédito)
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão para bureau de crédito
INSERT INTO public.settings (key, value, description) VALUES 
('credit_bureau', '{"enabled": false, "provider": null, "api_key": null, "api_url": null}', 'Configurações de integração com bureau de crédito'),
('min_credit_score', '{"value": 600}', 'Score mínimo para aprovação de financiamento');

-- Enable RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Função para verificar se usuário tem determinada role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Função para criar perfil e role automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  
  -- Por padrão, novos usuários são 'user', admin será atribuído manualmente
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil quando usuário é criado
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins and sellers can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'seller'));

-- RLS Policies para user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies para vehicles (público pode ver, admin/seller podem gerenciar)
CREATE POLICY "Anyone can view available vehicles" ON public.vehicles
  FOR SELECT USING (status = 'available');

CREATE POLICY "Admin and sellers can view all vehicles" ON public.vehicles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'seller'));

CREATE POLICY "Admin can manage vehicles" ON public.vehicles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can update vehicles" ON public.vehicles
  FOR UPDATE USING (public.has_role(auth.uid(), 'seller'));

-- RLS Policies para conversations
CREATE POLICY "Admin and sellers can view conversations" ON public.conversations
  FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'seller'));

CREATE POLICY "Admin can manage conversations" ON public.conversations
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Sellers can update assigned conversations" ON public.conversations
  FOR UPDATE USING (assigned_seller_id = auth.uid());

CREATE POLICY "Anyone can create conversations" ON public.conversations
  FOR INSERT WITH CHECK (true);

-- RLS Policies para conversation_messages
CREATE POLICY "Admin and sellers can view messages" ON public.conversation_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.conversations c 
      WHERE c.id = conversation_id 
      AND (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'seller'))
    )
  );

CREATE POLICY "Anyone can create messages" ON public.conversation_messages
  FOR INSERT WITH CHECK (true);

-- RLS Policies para settings
CREATE POLICY "Admin can manage settings" ON public.settings
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can view settings" ON public.settings
  FOR SELECT USING (true);