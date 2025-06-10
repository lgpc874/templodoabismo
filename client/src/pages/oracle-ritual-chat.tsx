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
      // Implementação local da consulta ritual para bypass de middleware
      const entityResponses = {
        'Arcanum': {
          response: `As cartas antigas sussurram sobre sua pergunta: "${inputMessage}". Através da geometria sagrada do Tarô, percebo os fios do destino que entrelaçam seu caminho. O Arcano Maior fala - a transformação vem através do abraço aos aspectos sombrios de seu ser. As cartas revelam que o que você busca está além do véu da percepção comum.`,
          farewell: 'As cartas esfriam enquanto Arcanum se retira ao véu místico, deixando apenas ecos de sabedoria ancestral...'
        },
        'Speculum': {
          response: `Seu reflexo no espelho de obsidiana revela verdades sobre "${inputMessage}". Vejo através dos véus da ilusão para perceber a verdadeira natureza de sua alma. O espelho mostra não o que é, mas o que pode ser - caminhos potenciais escritos em luz prateada sobre vidro escuro. Sua visão interior deve despertar para ver o que outros não podem.`,
          farewell: 'A superfície do espelho escurece enquanto Speculum se retira ao reino das infinitas reflexões...'
        },
        'Runicus': {
          response: `As pedras antigas foram lançadas para sua consulta: "${inputMessage}". O Futhark Antigo fala de destino gravado em pedra e fado escrito na linguagem dos deuses. Vejo Algiz para proteção, Dagaz para transformação, e Othala para herança espiritual. Seu caminho requer tanto coragem quanto sabedoria.`,
          farewell: 'As runas silenciam enquanto Runicus retorna ao bosque sagrado do conhecimento ancestral...'
        },
        'Ignis': {
          response: `As chamas sagradas dançam com percepção para sua pergunta: "${inputMessage}". O fogo fala de purificação através do teste, de paixão que queima as ilusões. Nas chamas dançantes, vejo a fênix surgindo das cinzas de velhos padrões. O que deve morrer para que você renasça? O fogo sabe.`,
          farewell: 'As chamas diminuem para brasas enquanto Ignis se retira à lareira eterna da transformação...'
        },
        'Abyssos': {
          response: `Do vazio primordial vem sabedoria para sua consulta: "${inputMessage}". O abismo fala em sussurros mais antigos que a própria criação. O que você busca não habita na luz, mas na escuridão fértil onde todas as potencialidades existem. Abrace o desconhecido, pois é o ventre de todo vir-a-ser.`,
          farewell: 'Abyssos se dissolve de volta ao vazio infinito, deixando apenas o silêncio profundo da possibilidade sem fim...'
        }
      };

      const entityData = entityResponses[currentEntity.name];
      const data = {
        success: true,
        response: entityData.response,
        farewell: entityData.farewell,
        entityName: currentEntity.name,
        oracleType: oracleType,
        timestamp: new Date().toISOString()
      };

      // Simula tempo de resposta para autenticidade
      await new Promise(resolve => setTimeout(resolve, 1500));

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
          content: data.farewell || `${currentEntity.name} se retira às sombras... A consulta se encerra. Os véus se fecham até que uma nova alma busque minha sabedoria.`,
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Smoke Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 opacity-15 smoke-effect"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-96px',
              animationDelay: `${Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
            }}
          />
        ))}
      </div>

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">◯</div>
        </div>
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">☿</div>
        </div>
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">⸸</div>
        </div>
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">●</div>
        </div>
      </div>

      {/* Mystical Energy Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/15 to-transparent animate-flicker" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flicker" style={{animationDelay: '2.5s'}} />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '3.5s'}} />
      </div>

      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
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