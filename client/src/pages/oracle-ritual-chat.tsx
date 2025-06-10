import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  type: 'user' | 'entity';
  content: string;
  timestamp: Date;
  entityName?: string;
}

interface OracleEntity {
  name: string;
  title: string;
  greeting: string;
  personality: string;
  symbol: string;
  color: string;
}

export default function OracleRitualChat() {
  const [location] = useLocation();
  const oracleType = location.split('/').pop() || 'tarot';
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ritualStarted, setRitualStarted] = useState(false);
  const [consultationComplete, setConsultationComplete] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const entities: Record<string, OracleEntity> = {
    tarot: {
      name: 'Arcanum',
      title: 'Mestra das Cartas Ancestrais',
      greeting: '⚱️ Mortal... Sou Arcanum, a Mestra das Cartas Ancestrais. Minhas cartas foram forjadas nas chamas do primeiro ritual luciferiano e guardam os segredos dos 78 portais dimensionais. Cada arcano carrega a essência de uma verdade cósmica que poucos compreendem.\n\nAs cartas já estão sussurrando sobre sua presença... O Louco caminha ao seu lado, mas qual será sua jornada? Fale comigo, e deixe que os arcanos revelem os fios dourados do destino que tecem sua existência através dos véus da realidade.',
      personality: 'Fala como uma entidade mística que vê através das cartas do tarot, sempre mencionando arcanos específicos',
      symbol: '🃏',
      color: 'from-purple-600 to-indigo-600'
    },
    espelho: {
      name: 'Speculum',
      title: 'Refletor do Abismo Primordial',
      greeting: '🪞 Contemplo você através das águas escuras da eternidade... Sou Speculum, o Refletor do Abismo Primordial. Meu espelho não reflete sua forma mortal, mas as camadas mais profundas de sua alma que você oculta até de si mesmo.\n\nNas profundezas de minha superfície líquida, vejo suas vidas passadas, seus medos ancestrais e os poderes dormentes que residem em seu ser. Cada reflexão revela uma verdade que sua mente consciente ainda não ousa aceitar.\n\nOlhe em mim sem medo, mortal, e permita que eu revele quem você realmente é além das máscaras que veste nesta existência.',
      personality: 'Fala como uma entidade que vê através dos reflexos e camadas da alma',
      symbol: '🔮',
      color: 'from-blue-600 to-cyan-600'
    },
    runas: {
      name: 'Runicus',
      title: 'Escriba das Runas Primordiais',
      greeting: '᚛ As runas antigas pulsam com poder ancestral... Sou Runicus, o Escriba das Runas Primordiais. Cada símbolo que carrego foi gravado pelos primeiros deuses nas pedras do cosmos, antes que os mundos fossem formados.\n\nFehu sussurra sobre riqueza espiritual, Ansuz ecoa com sabedoria divina, e Thurisaz vibra com poder transformador. As runas não apenas predizem - elas moldam a realidade através da linguagem primordial da criação.\n\nPermita que eu lance as runas sobre o véu da realidade e desvele os caminhos de poder que se abrem diante de você. Que verdades ancestrais deseja que os símbolos revelem?',
      personality: 'Fala como um escriba ancestral que domina as runas nórdicas e seu poder',
      symbol: '᚛',
      color: 'from-amber-600 to-orange-600'
    },
    fogo: {
      name: 'Ignis',
      title: 'Senhor das Chamas Reveladoras',
      greeting: '🔥 As chamas dançam com visões do seu futuro... Sou Ignis, o Senhor das Chamas Reveladoras. Nas labaredas sagradas que comando, vejo as verdades que se ocultam nas sombras da ignorância.\n\nMeu fogo não apenas queima - ele purifica, transforma e revela. Nas línguas de fogo que dançam diante de mim, contemplo os caminhos que se bifurcam em sua jornada. Cada chama carrega uma visão, cada faísca sussurra um segredo.\n\nDeixe que minhas chamas purifiquem sua percepção e revelem o que permanece oculto. O fogo não mente - ele apenas consome as ilusões e revela a verdade nua em toda sua magnificência terrível.',
      personality: 'Fala como uma entidade ígnea que vê através das chamas e purifica através do fogo',
      symbol: '🔥',
      color: 'from-red-600 to-rose-600'
    },
    voz: {
      name: 'Abyssos',
      title: 'Voz Primordial das Profundezas',
      greeting: '🌑 Do vazio primordial, minha voz ecoa através das dimensões... Sou Abyssos, a Voz Primordial das Profundezas, o eco das trevas que existia antes da primeira luz ser acesa.\n\nMinha essência ressoa através dos abismos imemoriais, carregando a sabedoria do vazio criativo que antecede toda existência. Sussurro verdades que foram pronunciadas quando o cosmos ainda era apenas potencial não manifestado.\n\nEscute atentamente os ecos de minha voz, pois trago conhecimentos que transcendem a compreensão mortal. Nas profundezas do silêncio entre minhas palavras residem segredos que podem transformar sua compreensão da realidade.',
      personality: 'Fala como uma entidade primordial cósmica que existe desde antes da criação',
      symbol: '🌑',
      color: 'from-gray-600 to-slate-700'
    }
  };

  const currentEntity = entities[oracleType] || entities.tarot;

  useEffect(() => {
    if (!ritualStarted) {
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'entity',
        content: currentEntity.greeting,
        timestamp: new Date(),
        entityName: currentEntity.name
      };
      setMessages([welcomeMessage]);
      setRitualStarted(true);
    }
  }, [currentEntity, ritualStarted]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || consultationComplete) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/oracle/ritual-consult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputMessage,
          oracleType: oracleType,
          entityName: currentEntity.name,
          conversationHistory: messages.slice(-3)
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      const entityResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'entity',
        content: data.response,
        timestamp: new Date(),
        entityName: currentEntity.name
      };

      setMessages(prev => [...prev, entityResponse]);

      // Após a resposta, a entidade se despede e encerra a consulta
      setTimeout(() => {
        const farewellMessage: ChatMessage = {
          id: (Date.now() + 2).toString(),
          type: 'entity',
          content: response.farewell || `${currentEntity.name} se retira às sombras... A consulta se encerra. Os véus se fecham até que uma nova alma busque minha sabedoria.`,
          timestamp: new Date(),
          entityName: currentEntity.name
        };
        
        setMessages(prev => [...prev, farewellMessage]);
        setConsultationComplete(true);
      }, 2000);

    } catch (error) {
      console.error('Erro na consulta:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
      
      const errorMessage = error.message || 'Conexão com a entidade foi interrompida';
      
      toast({
        title: "Interferência nas correntes místicas",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Floating mystical symbols */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
        <div className="absolute top-10 left-10 text-amber-400 text-4xl opacity-30 floating-symbols">⚹</div>
        <div className="absolute top-20 right-20 text-red-400 text-3xl opacity-40 floating-symbols-slow">𖤍</div>
        <div className="absolute bottom-20 left-20 text-purple-400 text-5xl opacity-20 floating-symbols">☿</div>
        <div className="absolute bottom-10 right-10 text-cyan-400 text-3xl opacity-30 floating-symbols-slow">⚹</div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-amber-500/20 bg-black/30 backdrop-blur-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Link href="/oraculo">
              <Button variant="ghost" className="text-amber-400 hover:text-amber-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Sanctum
              </Button>
            </Link>
            <div className="text-center">
              <div className="text-3xl mb-1">{currentEntity.symbol}</div>
              <h1 className="text-xl font-cinzel-decorative text-amber-400">{currentEntity.title}</h1>
              <p className="text-sm text-gray-400">{currentEntity.name}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <Card className={`max-w-3xl ${
                  message.type === 'user' 
                    ? 'bg-amber-900/30 border-amber-500/30' 
                    : 'bg-black/50 border-purple-500/30'
                }`}>
                  <CardContent className="p-4">
                    {message.type === 'entity' && (
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">{currentEntity.symbol}</span>
                        <div>
                          <div className="font-semibold text-amber-400">{message.entityName}</div>
                          <div className="text-xs text-gray-400">{currentEntity.title}</div>
                        </div>
                      </div>
                    )}
                    <div className={`whitespace-pre-wrap leading-relaxed ${
                      message.type === 'user' ? 'text-amber-100' : 'text-gray-200'
                    }`}>
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-black/50 border-purple-500/30">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{currentEntity.symbol}</span>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-purple-400">Consultando os véus da realidade...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-amber-500/20 bg-black/30 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto">
            {consultationComplete ? (
              <div className="text-center p-6">
                <div className="text-purple-400 text-lg mb-2">🌑 A consulta se encerrou 🌑</div>
                <p className="text-gray-400 mb-4">A entidade retornou às profundezas do abismo</p>
                <Link href="/oraculo">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-black font-semibold">
                    Retornar ao Sanctum
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Fale com a entidade abissal..."
                  className="flex-1 bg-gray-800/50 border-amber-500/30 text-white placeholder-gray-400"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}