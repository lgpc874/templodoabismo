import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Sparkles, Crown, User, Bot } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  type: 'user' | 'oracle';
  content: string;
  timestamp: Date;
  oracleType?: string;
  entityName?: string;
}

export default function OracleChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'oracle',
      content: 'Salve, consultante... As forças primordiais sussurram através dos véus da realidade. Que mistérios buscas desvendar nas profundezas do Abismo?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'free' | 'premium'>('free');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await apiRequest("/api/oracle/chat-consult", {
        method: "POST",
        body: JSON.stringify({
          question: userMessage.content,
          tier: selectedTier,
          conversationHistory: messages.slice(-5) // Últimas 5 mensagens para contexto
        }),
      });

      const oracleMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'oracle',
        content: response.response,
        timestamp: new Date(),
        isPremium: selectedTier === 'premium'
      };

      setMessages(prev => [...prev, oracleMessage]);

      if (selectedTier === 'premium') {
        toast({
          title: "Consulta Premium Realizada",
          description: "O oráculo revelou os mistérios mais profundos para você.",
        });
      }
    } catch (error: any) {
      console.error("Erro na consulta:", error);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível consultar o oráculo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/oraculos">
            <Button 
              variant="ghost" 
              className="mb-6 text-amber-300 hover:text-amber-400 hover:bg-amber-500/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Oráculos
            </Button>
          </Link>
          
          <div className="floating-symbols mb-6">
            <span>⚹</span>
            <span>𖤍</span>
            <span>⚹</span>
            <span>☿</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-300 mb-4 floating-title mystical-glow">
            ORÁCULO CONVERSACIONAL
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson">
            Dialogue diretamente com as forças ancestrais através do chat místico do Abismo
          </p>
        </div>

        {/* Tier Selection */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all floating-card ${
                selectedTier === 'free' 
                  ? 'border-blue-500/50 bg-blue-900/20' 
                  : 'border-gray-500/20 bg-black/20'
              }`}
              onClick={() => setSelectedTier('free')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-amber-300 font-cinzel-decorative">
                  Consulta Gratuita
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Respostas superficiais dos véus superiores
                </CardDescription>
              </CardHeader>
            </Card>

            <Card 
              className={`cursor-pointer transition-all floating-card ${
                selectedTier === 'premium' 
                  ? 'border-amber-500/50 bg-amber-900/20' 
                  : 'border-gray-500/20 bg-black/20'
              }`}
              onClick={() => setSelectedTier('premium')}
            >
              <CardHeader className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-amber-300 font-cinzel-decorative">
                  Consulta Premium - R$ 4,99
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Revelações completas das profundezas abissais
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="floating-card bg-black/30 backdrop-blur-lg border-amber-500/20 h-[600px] flex flex-col">
            <CardHeader className="border-b border-amber-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-cinzel-decorative text-amber-300">Oráculo do Abismo</h3>
                    <p className="text-xs text-gray-400">Entidade Ancestral Ativa</p>
                  </div>
                </div>
                <Badge 
                  variant={selectedTier === 'premium' ? 'default' : 'secondary'}
                  className={selectedTier === 'premium' ? 'bg-amber-600' : 'bg-blue-600'}
                >
                  {selectedTier === 'premium' ? 'Premium' : 'Gratuita'}
                </Badge>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-amber-600' 
                        : message.isPremium 
                          ? 'bg-gradient-to-br from-amber-600 to-orange-600'
                          : 'bg-gradient-to-br from-purple-600 to-indigo-600'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-amber-600/20 border border-amber-500/30'
                        : message.isPremium
                          ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30'
                          : 'bg-blue-900/30 border border-blue-500/30'
                    }`}>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        {message.content}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t border-amber-500/20 p-4">
              <div className="flex space-x-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua pergunta aos mistérios do Abismo..."
                  className="bg-black/40 border-amber-500/30 text-gray-300"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className={`${
                    selectedTier === 'premium'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  } text-white`}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {selectedTier === 'premium' && (
                <p className="text-xs text-amber-400 mt-2 text-center">
                  Consulta Premium: Respostas profundas e completas - R$ 4,99
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}