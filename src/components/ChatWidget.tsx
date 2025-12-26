import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatWidgetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleName: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'customer' | 'ai';
  timestamp: Date;
}

interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
}

type ChatStep = 'info' | 'chat';

export function ChatWidget({ open, onOpenChange, vehicleId, vehicleName }: ChatWidgetProps) {
  const [step, setStep] = useState<ChatStep>('info');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    email: '',
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStartChat = async () => {
    if (!customerInfo.name || !customerInfo.phone) {
      toast({
        variant: 'destructive',
        title: 'Preencha os campos obrigatórios',
        description: 'Nome e telefone são obrigatórios.',
      });
      return;
    }

    setLoading(true);

    try {
      // Create conversation
      const { data: conversation, error } = await supabase
        .from('conversations')
        .insert({
          vehicle_id: vehicleId,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_email: customerInfo.email || null,
          status: 'ai_handling',
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(conversation.id);

      // Add welcome message
      const welcomeMessage: Message = {
        id: '1',
        content: `Olá ${customerInfo.name}! 👋 Sou o assistente virtual da AutoElite. Vi que você tem interesse no ${vehicleName}. Como posso ajudá-lo hoje?\n\nVocê pode me perguntar sobre:\n• Condições de pagamento\n• Financiamento\n• Agendar uma visita\n• Informações do veículo`,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages([welcomeMessage]);
      setStep('chat');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao iniciar conversa',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !conversationId) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'customer',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      // Save message to database
      await supabase.from('conversation_messages').insert({
        conversation_id: conversationId,
        sender_type: 'customer',
        content: inputMessage,
      });

      // Call AI function
      const response = await supabase.functions.invoke('chat-assistant', {
        body: {
          conversationId,
          message: inputMessage,
          vehicleId,
          customerName: customerInfo.name,
        },
      });

      if (response.error) throw response.error;

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.message,
        sender: 'ai',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);

      // Save AI response to database
      await supabase.from('conversation_messages').insert({
        conversation_id: conversationId,
        sender_type: 'ai',
        content: response.data.message,
      });

      // Check if conversation should be transferred to seller
      if (response.data.transferToSeller) {
        await supabase
          .from('conversations')
          .update({ status: 'waiting_seller' })
          .eq('id', conversationId);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Fallback response if AI is not available
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, estou com dificuldades técnicas no momento. Um de nossos vendedores entrará em contato em breve!',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Assistente Virtual
          </DialogTitle>
          <DialogDescription>
            {vehicleName}
          </DialogDescription>
        </DialogHeader>

        {step === 'info' ? (
          <div className="flex-1 p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <Button 
              onClick={handleStartChat} 
              className="w-full bg-gradient-accent hover:shadow-glow"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Iniciar Conversa
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.sender === 'customer' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.sender === 'customer'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                    </div>
                    {message.sender === 'customer' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-secondary rounded-2xl px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  disabled={loading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !inputMessage.trim()}
                  size="icon"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
