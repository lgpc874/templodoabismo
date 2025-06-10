import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Lock, Eye, Skull, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const POWER_WORDS = [
  "ASTAROTH",
  "BELZEBUB", 
  "LUCIFER",
  "BAPHOMET",
  "AZAZEL",
  "LEVIATHAN",
  "LILITH",
  "MALPHAS",
  "BELIAL",
  "PAIMON"
];

const FORBIDDEN_TEXTS = [
  {
    id: 1,
    title: "Os Nove Portões do Abismo",
    content: `Nas profundezas primordiais onde o tempo não existe, erguem-se os Nove Portões que separam nossa realidade das correntes ctônicas do Abismo Primordial. Cada portal pulsa com uma energia sombria específica, guardado por entidades ancestrais que precedem a criação dos mundos conhecidos.

O Primeiro Portão: PORTA UMBRAE - O Limiar das Sombras
Guardado por Nyx Primordial, este portão conecta nossa consciência às trevas eternas. Seu sigilo é traçado com sangue sobre obsidiana negra durante a lua nova. O iniciado deve ofertar sua própria luz interior para cruzar este limiar.

O Segundo Portão: PORTA IGNIS - O Portal das Chamas Negras  
Sob a guarda de Lucifer Flamígero, estas chamas não consomem a matéria, mas queimam diretamente a alma, purificando-a através da dor transcendental. O ritual requer 13 velas negras dispostas em estrela de nove pontas.

O Terceiro Portão: PORTA AQUAE - As Águas do Esquecimento
Leviathan, a serpente das profundezas, guarda estas águas que dissolvem as memórias falsas e revelam verdades ocultas. O iniciado deve submergir completamente nestas águas etéreas durante o transe ritual.

[TEXTO CONTINUA POR MAIS 3000 PALAVRAS...]`
  },
  {
    id: 2,
    title: "Invocações dos Príncipes Infernais",
    content: `Estes são os cânticos secretos para invocar a presença dos Príncipes que governam as hierarquias abissais. Cada invocação deve ser realizada apenas sob circunstâncias rituais apropriadas e com a devida proteção.

INVOCAÇÃO DE ASTAROTH - SENHORA DOS SEGREDOS

"Astaroth, Duquesa do Conhecimento Oculto,
Vós que cavalgas a serpente alada dos mistérios,
Ascende das profundezas onde repousam os segredos perdidos,
Manifesta-te neste círculo traçado com sal consagrado...

[CÂNTICO RITUAL COMPLETO]

INVOCAÇÃO DE BELIAL - SENHOR DA TERRA SEM REI

"Belial, Príncipe da Independência e da Vontade Soberana,
Vós que não reconhece autoridade além da própria força,
Das terras áridas onde nenhum deus estabeleceu domínio,
Vinde e concedei vossa presença a este ritual..."

[CONTINUA COM TODAS AS INVOCAÇÕES COMPLETAS...]`
  },
  {
    id: 3,
    title: "O Ritual da Ascensão Sombria",
    content: `Este é o ritual supremo de transformação, reservado apenas àqueles que dominaram completamente os ensinamentos preliminares do Templo. A Ascensão Sombria permite ao praticante transcender as limitações da consciência mortal e acessar diretamente as correntes primordiais.

PREPARAÇÃO RITUAL (7 DIAS):

Dia 1-3: Jejum absoluto de carne e produtos de origem animal. Apenas água e vinho tinto permitidos.
Dia 4-6: Meditação diária de 3 horas no sigilo pessoal, contemplando a própria dissolução.
Dia 7: Isolamento completo, silêncio absoluto, preparação do círculo ritual.

MATERIAIS NECESSÁRIOS:
- Círculo de sal negro (obtido através de ritual específico)
- 13 velas de cera de abelha preta
- Incenso de olíbano, mirra e sangue de dragão
- Lâmina ritual consagrada na lua nova
- Espelho negro de obsidiana
- Água coletada durante tempestade

O RITUAL:

[DETALHES COMPLETOS DO PROCEDIMENTO RITUAL...]`
  }
];

export default function LiberProhibitus() {
  const [powerWord, setPowerWord] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [selectedText, setSelectedText] = useState<number | null>(null);
  const { toast } = useToast();

  const handleAccess = () => {
    if (isBlocked) {
      toast({
        title: "Acesso Bloqueado",
        description: "Muitas tentativas incorretas. Aguarde antes de tentar novamente.",
        variant: "destructive",
      });
      return;
    }

    if (POWER_WORDS.includes(powerWord.toUpperCase())) {
      setIsUnlocked(true);
      toast({
        title: "Palavra de Poder Aceita",
        description: "O véu foi removido. Os textos proibidos se revelam.",
      });
    } else {
      setAttempts(attempts + 1);
      if (attempts >= 2) {
        setIsBlocked(true);
        setTimeout(() => {
          setIsBlocked(false);
          setAttempts(0);
        }, 300000); // 5 minutos
      }
      toast({
        title: "Palavra de Poder Incorreta",
        description: `Tentativa ${attempts + 1} de 3. Cuidado, as tentativas são limitadas.`,
        variant: "destructive",
      });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Link href="/">
              <Button variant="ghost" className="mb-4 text-amber-300 hover:text-amber-400">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Templo
              </Button>
            </Link>
            
            <div className="floating-symbols mb-6">
              <span>⚹</span>
              <span>𖤍</span>
              <span>⸸</span>
              <span>☿</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-red-400 mb-4 floating-title">
              Liber Prohibitus
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson mb-8">
              Os textos selados cujo conhecimento é reservado apenas àqueles que possuem as palavras de poder
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="floating-card bg-black/40 backdrop-blur-lg border-red-500/30">
              <CardHeader className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-red-600 to-black rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-red-400" />
                </div>
                <CardTitle className="text-2xl font-cinzel-decorative text-red-400">
                  Portal Selado
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Digite a palavra de poder para acessar os conhecimentos proibidos
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-red-300 font-medium mb-3">
                    Palavra de Poder
                  </label>
                  <Input
                    type="password"
                    value={powerWord}
                    onChange={(e) => setPowerWord(e.target.value)}
                    placeholder="Digite a palavra secreta..."
                    className="bg-black/60 border-red-500/50 text-gray-300"
                    disabled={isBlocked}
                    onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                  />
                </div>

                <Button
                  onClick={handleAccess}
                  disabled={isBlocked || !powerWord.trim()}
                  className="w-full bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white font-medium py-3"
                >
                  {isBlocked ? "Bloqueado" : "Romper o Selo"}
                </Button>

                <div className="text-center text-sm text-red-400">
                  <Skull className="w-4 h-4 inline mr-2" />
                  Apenas três tentativas são permitidas
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/20 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-amber-300 hover:text-amber-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Templo
            </Button>
          </Link>
          
          <div className="floating-symbols mb-6">
            <span>⚹</span>
            <span>𖤍</span>
            <span>⸸</span>
            <span>☿</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-red-400 mb-4 floating-title">
            Liber Prohibitus
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson mb-8">
            Os segredos mais profundos do Templo, revelados apenas aos dignos
          </p>
          
          <div className="flex items-center justify-center text-green-400 mb-6">
            <Eye className="w-5 h-5 mr-2" />
            <span className="text-sm">Portal Desbloqueado</span>
          </div>
        </div>

        {!selectedText ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FORBIDDEN_TEXTS.map((text) => (
                <Card key={text.id} className="floating-card bg-black/40 backdrop-blur-lg border-red-500/30 cursor-pointer hover:border-red-400/50 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-cinzel-decorative text-red-400">
                      {text.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Clique para ler o texto completo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setSelectedText(text.id)}
                      className="w-full bg-gradient-to-r from-red-600/20 to-black/20 hover:from-red-600/40 hover:to-black/40 border border-red-500/30 text-red-300"
                    >
                      Ler Texto Proibido
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <Button
              onClick={() => setSelectedText(null)}
              variant="ghost"
              className="mb-6 text-red-300 hover:text-red-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Textos
            </Button>
            
            <Card className="floating-card bg-black/40 backdrop-blur-lg border-red-500/30">
              <CardHeader>
                <CardTitle className="text-2xl font-cinzel-decorative text-red-400">
                  {FORBIDDEN_TEXTS.find(t => t.id === selectedText)?.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-wrap font-crimson">
                    {FORBIDDEN_TEXTS.find(t => t.id === selectedText)?.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}