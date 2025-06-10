import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, Flame, Zap, Sparkles, MessageCircle, Download, Share2, Facebook, Twitter, MessageSquare, Send } from 'lucide-react';
import { OracleImageGenerator, SocialSharer } from '@/lib/oracleImageShare';
import { useToast } from '@/hooks/use-toast';

interface OracleResult {
  cards?: string[];
  interpretation?: string;
  reflection?: string;
  runes?: string[];
  meaning?: string;
  flames?: string;
  voice?: string;
}

export default function OracleTest() {
  const [question, setQuestion] = useState('');
  const [oracleType, setOracleType] = useState('');
  const [result, setResult] = useState<OracleResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { toast } = useToast();

  const oracleTypes = [
    { value: 'tarot', label: 'Leitura de Tarô', icon: Sparkles },
    { value: 'mirror', label: 'Espelho do Abismo', icon: Eye },
    { value: 'runes', label: 'Runas Ancestrais', icon: Zap },
    { value: 'fire', label: 'Chamas Reveladoras', icon: Flame },
    { value: 'voice', label: 'Voz Abissal', icon: MessageCircle }
  ];

  const handleConsultation = async () => {
    if (!question.trim() || !oracleType) {
      setError('Por favor, escolha um tipo de consulta e faça uma pergunta.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/oracle/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: oracleType,
          question: question.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha na consulta');
      }

      if (data.success && data.result) {
        setResult(data.result);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err: any) {
      console.error('Erro na consulta:', err);
      setError(err.message || 'Erro ao consultar o Oracle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!result || !question || !oracleType) return;
    
    setIsGeneratingImage(true);
    try {
      const generator = new OracleImageGenerator();
      const imageData = {
        type: oracleType,
        question: question,
        result: result,
        timestamp: new Date().toISOString()
      };
      
      const imageUrl = await generator.generateOracleImage(imageData);
      const filename = `oracle-${oracleType}-${Date.now()}.png`;
      generator.downloadImage(imageUrl, filename);
      
      toast({
        title: "Imagem gerada com sucesso",
        description: "Download da consulta iniciado com marca d'água do Templo do Abismo",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar imagem",
        description: "Não foi possível criar a imagem da consulta",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleShare = async (platform: string) => {
    if (!result || !question || !oracleType) return;
    
    const shareText = `Consulta realizada no Oracle ${oracleTypes.find(t => t.value === oracleType)?.label}:\n\n"${question}"\n\nTemplo do Abismo - Portal Luciferiano de Sabedoria Ancestral`;
    
    try {
      const generator = new OracleImageGenerator();
      const imageData = {
        type: oracleType,
        question: question,
        result: result,
        timestamp: new Date().toISOString()
      };
      
      const imageUrl = await generator.generateOracleImage(imageData);
      
      switch (platform) {
        case 'facebook':
          SocialSharer.shareToFacebook(imageUrl, shareText);
          break;
        case 'twitter':
          SocialSharer.shareToTwitter(imageUrl, shareText);
          break;
        case 'whatsapp':
          SocialSharer.shareToWhatsApp(imageUrl, shareText);
          break;
        case 'telegram':
          SocialSharer.shareToTelegram(imageUrl, shareText);
          break;
        case 'native':
          await SocialSharer.shareNative(imageUrl, shareText);
          break;
        default:
          break;
      }
      
      toast({
        title: "Compartilhamento iniciado",
        description: `Abrindo ${platform} para compartilhar sua consulta`,
      });
    } catch (error) {
      toast({
        title: "Erro no compartilhamento",
        description: "Não foi possível compartilhar a consulta",
        variant: "destructive",
      });
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="floating-card mt-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
        <div className="p-6">
          <h3 className="text-2xl font-cinzel-decorative text-amber-400 mb-6">
            Revelação do Oracle
          </h3>
          
          <div className="space-y-6">
            {result.cards && (
              <div>
                <h4 className="font-semibold text-amber-300 mb-3">Cartas Reveladas:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.cards.map((card, index) => (
                    <span key={index} className="bg-amber-900/20 px-3 py-1 rounded text-amber-200 text-sm">
                      {card}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {result.interpretation && (
              <div>
                <h4 className="font-semibold text-amber-300 mb-3">Interpretação:</h4>
                <p className="text-gray-300 leading-relaxed">{result.interpretation}</p>
              </div>
            )}

            {result.reflection && (
              <div>
                <h4 className="font-semibold text-amber-300 mb-3">Reflexão do Espelho:</h4>
                <p className="text-gray-300 leading-relaxed">{result.reflection}</p>
              </div>
            )}

            {result.runes && (
              <div>
                <h4 className="font-semibold text-amber-300 mb-3">Runas Reveladas:</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {result.runes.map((rune, index) => (
                    <span key={index} className="bg-amber-900/20 px-3 py-1 rounded text-amber-200 text-sm">
                      {rune}
                    </span>
                  ))}
                </div>
                {result.meaning && (
                  <p className="text-gray-300 leading-relaxed">{result.meaning}</p>
                )}
              </div>
            )}

            {result.flames && (
              <div>
                <h4 className="font-semibold text-amber-300 mb-3">Visão das Chamas:</h4>
                <p className="text-gray-300 leading-relaxed">{result.flames}</p>
              </div>
            )}

            {result.voice && (
              <div>
                <h4 className="font-semibold text-amber-300 mb-3">Voz do Abismo:</h4>
                <p className="text-gray-300 leading-relaxed italic">{result.voice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-20">
          <img 
            src="/seal.png" 
            alt="Selo do Templo do Abismo" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Mystical floating particles */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">🔮</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              TESTE DO ORACLE IA
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Sistema de Teste de Consultas Oraculares
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Interface de <strong className="text-amber-400">desenvolvimento</strong> para testar as 
              <strong className="text-red-400"> consultas místicas</strong> e verificar respostas da IA.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Veritas per Experimentum"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Verdade através do experimento
              </p>
            </div>
          </div>
        </div>

        {/* Oracle Test Interface */}
        <div className="floating-card max-w-4xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-8">
            <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6">
              Interface de Teste
            </h3>

            <div className="space-y-6">
              {/* Oracle Type Selection */}
              <div>
                <label className="block text-amber-300 font-medium mb-3">
                  Tipo de Consulta
                </label>
                <Select value={oracleType} onValueChange={setOracleType}>
                  <SelectTrigger className="bg-black/40 border-amber-500/30 text-gray-300">
                    <SelectValue placeholder="Escolha o tipo de consulta..." />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-amber-500/30">
                    {oracleTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Input */}
              <div>
                <label className="block text-amber-300 font-medium mb-3">
                  Sua Pergunta
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Digite sua pergunta para o Oracle..."
                  className="bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500 min-h-[100px]"
                />
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-900/20 border border-red-500/30 rounded p-4">
                  <p className="text-red-300">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleConsultation}
                disabled={isLoading || !question.trim() || !oracleType}
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-medium py-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Consultando Oracle...
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5 mr-2" />
                    Consultar Oracle
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        {renderResult()}

        {/* Development Note */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-amber-900/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Esta interface permite testar e validar as respostas do sistema de IA antes da implementação final"
            </p>
            <p className="text-amber-400 font-semibold">
              — Sistema de Desenvolvimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}