import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Eye, Flame, Runes, Sparkles, MessageCircle } from 'lucide-react';

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

  const oracleTypes = [
    { value: 'tarot', label: 'Leitura de Tarô', icon: Sparkles },
    { value: 'mirror', label: 'Espelho do Abismo', icon: Eye },
    { value: 'runes', label: 'Runas Ancestrais', icon: Runes },
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

  const renderResult = () => {
    if (!result) return null;

    return (
      <Card className="mt-6 bg-black/40 border-red-900/30">
        <CardHeader>
          <CardTitle className="text-red-400">Revelação do Oracle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.cards && (
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Cartas Reveladas:</h4>
              <div className="flex flex-wrap gap-2">
                {result.cards.map((card, index) => (
                  <span key={index} className="bg-red-900/20 px-3 py-1 rounded text-red-200 text-sm">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.interpretation && (
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Interpretação:</h4>
              <p className="text-red-100 leading-relaxed">{result.interpretation}</p>
            </div>
          )}

          {result.reflection && (
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Reflexão do Espelho:</h4>
              <p className="text-red-100 leading-relaxed">{result.reflection}</p>
            </div>
          )}

          {result.runes && (
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Runas Reveladas:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {result.runes.map((rune, index) => (
                  <span key={index} className="bg-red-900/20 px-3 py-1 rounded text-red-200 text-sm">
                    {rune}
                  </span>
                ))}
              </div>
              {result.meaning && (
                <p className="text-red-100 leading-relaxed">{result.meaning}</p>
              )}
            </div>
          )}

          {result.flames && (
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Visão das Chamas:</h4>
              <p className="text-red-100 leading-relaxed">{result.flames}</p>
            </div>
          )}

          {result.voice && (
            <div>
              <h4 className="font-semibold text-red-300 mb-2">Voz do Abismo:</h4>
              <p className="text-red-100 leading-relaxed italic">{result.voice}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-black/60 border-red-900/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-400">Teste do Oracle IA</CardTitle>
            <CardDescription className="text-red-200">
              Teste direto das funcionalidades de inteligência artificial do Oracle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                Tipo de Consulta
              </label>
              <Select value={oracleType} onValueChange={setOracleType}>
                <SelectTrigger className="bg-black/40 border-red-800/50 text-red-100">
                  <SelectValue placeholder="Escolha o tipo de consulta" />
                </SelectTrigger>
                <SelectContent className="bg-black border-red-800/50">
                  {oracleTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.value} value={type.value} className="text-red-100 focus:bg-red-900/20">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                Sua Pergunta
              </label>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Faça sua pergunta ao Oracle..."
                className="bg-black/40 border-red-800/50 text-red-100 placeholder:text-red-400/60"
                rows={4}
              />
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-700 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <Button
              onClick={handleConsultation}
              disabled={isLoading || !question.trim() || !oracleType}
              className="w-full bg-red-900 hover:bg-red-800 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando o Oracle...
                </>
              ) : (
                'Consultar Oracle'
              )}
            </Button>

            {renderResult()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}