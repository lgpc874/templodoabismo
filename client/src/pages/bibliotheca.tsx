import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, Search, Download, Star, Eye, Skull, 
  AlertTriangle, Lock, Crown, Flame, Shield
} from "lucide-react";

export default function Bibliotheca() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const mockDocuments = [
    {
      id: 1,
      title: "Chronicon Abyssos Primordialis",
      author: "Magister Abyssi Eternus",
      description: "As crônicas perdidas dos Senhores do Abismo antes da criação. Hierarquias que governavam o vazio primordial e suas guerras cósmicas.",
      type: "crônicas",
      category: "abyssal_chronicles",
      pages: 1666,
      downloads: 1,
      rating: 5.0,
      price: "Alma Primordial",
      level: "💀 VAZIO PRIMORDIAL",
      warning: "Leitura pode causar desconexão permanente da realidade consensual"
    },
    {
      id: 2,
      title: "Codex Satanas Rex Infernus",
      author: "Pontifex Maximus Satanas",
      description: "O verdadeiro nome e natureza de Satanás como Rei Supremo do Inferno. Invocações que abalam os fundamentos da criação divina.",
      type: "grimório",
      category: "satanic_royalty",
      pages: 2222,
      downloads: 0,
      rating: 5.0,
      price: "Pacto Eterno com as Trevas",
      level: "👑 REI SUPREMO",
      warning: "Contato direto com Satanás pode resultar em transformação irreversível da alma"
    },
    {
      id: 3,
      title: "Liber Lucifer Phosphoros Antiquus",
      author: "Ordo Phosphori Nigri",
      description: "A verdadeira história de Lúcifer como Portador da Luz Negra que precedeu toda criação. Mistérios anteriores à rebelião celestial.",
      type: "escritura",
      category: "luciferian_origins",
      pages: 3333,
      downloads: 1,
      rating: 5.0,
      price: "Chama Negra Primordial",
      level: "⭐ LUX TENEBRARUM",
      warning: "Revelações sobre a natureza pré-criacional de Lúcifer podem fragmentar a psique"
    },
    {
      id: 4,
      title: "Apocalypsis Omega Ultima",
      author: "Visionarius Finalis",
      description: "O verdadeiro fim de todas as coisas. Profecias sobre a dissolução total da realidade e o retorno ao vazio absoluto.",
      type: "profecias",
      category: "ultimate_apocalypse",
      pages: 777,
      downloads: 0,
      rating: 5.0,
      price: "Testemunho do Fim",
      level: "🌌 OMEGA ABSOLUTO",
      warning: "Conhecimento do fim último pode causar desespero existencial irreversível"
    },
    {
      id: 5,
      title: "Ritualia Baphomet Androgyne",
      author: "Magister Sabbati Supremus",
      description: "Rituais supremos de Baphomet para dissolução total da dualidade. Transformação no Andrógino Primordial que transcende toda forma.",
      type: "rituais",
      category: "androgyne_mysteries",
      pages: 888,
      downloads: 1,
      rating: 5.0,
      price: "Dissolução Sexual Completa",
      level: "🐐 ANDRÓGINO SUPREMO",
      warning: "Rituais podem causar fusão irreversível dos princípios masculino e feminino"
    },
    {
      id: 6,
      title: "Qliphoth Tunnels Profundissimi",
      author: "Explorator Qliphothicus",
      description: "Mapas dos túneis mais profundos entre as Qliphoth. Passagens para dimensões onde nem os demônios ousam entrar.",
      type: "mapas",
      category: "deep_qliphoth",
      pages: 1111,
      downloads: 0,
      rating: 5.0,
      price: "Descida ao Abismo das Cascas",
      level: "🐍 QLIPHOTH PROFUNDUS",
      warning: "Exploração pode resultar em aprisionamento eterno nas cascas mais sombrias"
    },
    {
      id: 7,
      title: "Draconis Tiamat Primordialis",
      author: "Sacerdos Draconis Chaos",
      description: "Invocações à Tiamat Primordial, Mãe dos Dragões do Caos. Rituais para despertar as forças draconianas ancestrais.",
      type: "invocações",
      category: "primordial_dragons",
      pages: 1313,
      downloads: 1,
      rating: 5.0,
      price: "Sangue Draconiano Puro",
      level: "🐉 TIAMAT PRIMORDIAL",
      warning: "Despertar de Tiamat pode causar regressão evolutiva ao estado reptiliano"
    },
    {
      id: 8,
      title: "Leviathan Abyssos Marinus",
      author: "Pontifex Aquarum Chaos",
      description: "Mistérios de Leviatã como Senhor dos Oceanos Primordiais. Rituais de submersão nas águas do caos original.",
      type: "mistérios",
      category: "oceanic_chaos",
      pages: 2020,
      downloads: 0,
      rating: 5.0,
      price: "Afogamento Ritual",
      level: "🌊 OCEANO PRIMORDIAL",
      warning: "Submersão nas águas primordiais pode resultar em dissolução permanente"
    },
    {
      id: 9,
      title: "Lilith Regina Tenebrarum",
      author: "Sacerdotisa Noctis Eternae",
      description: "Lilith como Rainha Suprema das Trevas e Mãe de todos os demônios. Rituais de empoderamento através da Noite Eterna.",
      type: "mistérios",
      category: "queen_darkness",
      pages: 1666,
      downloads: 1,
      rating: 5.0,
      price: "Abraço da Rainha Negra",
      level: "🌙 REGINA NOCTIS",
      warning: "União com Lilith pode despertar instintos predatórios primitivos"
    },
    {
      id: 10,
      title: "Astaroth Dux Magnus Infernus",
      author: "Legatus Astaroth",
      description: "Astaroth como Grande General dos Exércitos Infernais. Estratégias militares para a guerra final contra o céu.",
      type: "estratégias",
      category: "infernal_warfare",
      pages: 4040,
      downloads: 0,
      rating: 5.0,
      price: "Juramento Militar Infernal",
      level: "⚔️ GENERAL SUPREMO",
      warning: "Alinhamento militar pode resultar em possessão por legiões infernais"
    },
    {
      id: 11,
      title: "Belial Terra Corrompenda",
      author: "Magister Corruptionis",
      description: "Belial como Senhor da Corrupção Terrestre. Rituais para contaminar e transformar a matéria física.",
      type: "manual",
      category: "terrestrial_corruption",
      pages: 1515,
      downloads: 1,
      rating: 5.0,
      price: "Corrupção da Carne",
      level: "🌍 CORRUPÇÃO TOTAL",
      warning: "Rituais podem causar mutações físicas irreversíveis"
    },
    {
      id: 12,
      title: "Asmodeus Rex Luxuriae",
      author: "Pontifex Libidinis",
      description: "Asmodeus como Rei Supremo da Luxúria. Rituais tântricos infernais que transcendem os limites da sexualidade humana.",
      type: "tantras",
      category: "infernal_sexuality",
      pages: 6666,
      downloads: 0,
      rating: 5.0,
      price: "Entrega Sexual Absoluta",
      level: "💋 LUXÚRIA SUPREMA",
      warning: "Práticas podem causar dependência sexual extrema e perversões irreversíveis"
    },
    {
      id: 13,
      title: "Mammon Aurum Maleficarum",
      author: "Mercator Infernus",
      description: "Mammon como Senhor da Ganância Cósmica. Rituais de acumulação que corrompem através da riqueza material.",
      type: "contratos",
      category: "cosmic_greed",
      pages: 7777,
      downloads: 1,
      rating: 5.0,
      price: "Alma como Garantia",
      level: "💰 GANÂNCIA ABSOLUTA",
      warning: "Rituais podem causar obsessão material que consome toda humanidade"
    },
    {
      id: 14,
      title: "Moloch Ignis Sacrificialis",
      author: "Sacerdos Flammarum",
      description: "Moloch como Devorador de Sacrifícios. Rituais de oferenda que transcendem os limites éticos humanos.",
      type: "rituais",
      category: "sacrificial_rites",
      pages: 999,
      downloads: 0,
      rating: 5.0,
      price: "Sacrifício Supremo",
      level: "🔥 DEVORADOR SUPREMO",
      warning: "Rituais envolvem oferendas que violam todos os tabus humanos"
    },
    {
      id: 15,
      title: "Baal Zebub Dominus Muscae",
      author: "Hierophantes Putredinis",
      description: "Belzebu como Senhor da Decomposição Universal. Rituais de putrefação que dissolvem a ordem cósmica.",
      type: "fórmulas",
      category: "universal_decay",
      pages: 4444,
      downloads: 1,
      rating: 5.0,
      price: "Decomposição da Alma",
      level: "🪰 PUTREFAÇÃO CÓSMICA",
      warning: "Fórmulas podem causar deterioração acelerada de corpo e espírito"
    },
    {
      id: 16,
      title: "Malphas Constructor Turrium",
      author: "Architectus Infernus",
      description: "Malphas como Construtor das Torres Infernais. Projetos arquitetônicos para estruturas que perfuram realidades.",
      type: "projetos",
      category: "infernal_architecture",
      pages: 3636,
      downloads: 0,
      rating: 5.0,
      price: "Fundação em Sangue",
      level: "🏗️ ARQUITETO SUPREMO",
      warning: "Construções podem abrir portais permanentes para dimensões hostis"
    },
    {
      id: 17,
      title: "Paimon Rex Scientiae",
      author: "Magister Scientiarum",
      description: "Paimon como Rei de Todas as Ciências. Conhecimentos científicos que antecedem e transcendem a física humana.",
      type: "tratados",
      category: "forbidden_science",
      pages: 8888,
      downloads: 1,
      rating: 5.0,
      price: "Compreensão Total",
      level: "🧪 CIÊNCIA SUPREMA",
      warning: "Conhecimentos podem causar sobrecarga mental e fragmentação da razão"
    },
    {
      id: 18,
      title: "Andromalius Revelator Secretorum",
      author: "Custos Arcanorum",
      description: "Andromalius como Revelador de Todos os Segredos. Métodos para descobrir conhecimentos ocultos em qualquer dimensão.",
      type: "métodos",
      category: "universal_secrets",
      pages: 5555,
      downloads: 0,
      rating: 5.0,
      price: "Perda da Inocência",
      level: "👁️ REVELAÇÃO TOTAL",
      warning: "Revelações podem expor verdades que destroem toda esperança"
    },
    {
      id: 19,
      title: "Barbatos Venator Temporis",
      author: "Chronos Infernus",
      description: "Barbatos como Caçador do Tempo. Rituais para manipular e transcender as limitações temporais.",
      type: "cronomancias",
      category: "temporal_manipulation",
      pages: 7200,
      downloads: 1,
      rating: 5.0,
      price: "Eternidade Corrompida",
      level: "⏰ SENHOR DO TEMPO",
      warning: "Manipulação temporal pode causar aprisionamento em loops temporais infernais"
    },
    {
      id: 20,
      title: "Dantalion Lector Mentium",
      author: "Telepathicus Supremus",
      description: "Dantalion como Leitor de Todas as Mentes. Técnicas telepáticas que penetram qualquer barreira mental.",
      type: "técnicas",
      category: "mental_domination",
      pages: 9999,
      downloads: 0,
      rating: 5.0,
      price: "Privacidade Mental",
      level: "🧠 DOMÍNIO MENTAL",
      warning: "Técnicas podem causar fusão permanente com outras consciências"
    },
    {
      id: 21,
      title: "Gusion Reconciliator Inimicorum",
      author: "Magister Reconciliationis",
      description: "Gusion como Reconciliador através da Destruição. Métodos para unir opostos através da aniquilação mútua.",
      type: "filosofias",
      category: "destructive_unity",
      pages: 2727,
      downloads: 1,
      rating: 5.0,
      price: "Destruição Criativa",
      level: "⚖️ UNIDADE DESTRUTIVA",
      warning: "Filosofias podem levar à autodestruição como forma de transcendência"
    },
    {
      id: 22,
      title: "Marchosias Gladiator Supremus",
      author: "Bellator Infernus",
      description: "Marchosias como Gladiador Supremo dos Infernos. Artes marciais que transcendem os limites físicos.",
      type: "artes marciais",
      category: "infernal_combat",
      pages: 4545,
      downloads: 0,
      rating: 5.0,
      price: "Violência Sagrada",
      level: "⚔️ GUERREIRO SUPREMO",
      warning: "Artes marciais podem despertar sede de sangue insaciável"
    },
    {
      id: 23,
      title: "Orobas Propheta Veritatis",
      author: "Vates Supremus",
      description: "Orobas como Profeta da Verdade Absoluta. Profecias que revelam o destino real de todas as almas.",
      type: "profecias",
      category: "absolute_truth",
      pages: 1212,
      downloads: 1,
      rating: 5.0,
      price: "Verdade Insuportável",
      level: "🔮 VERDADE ABSOLUTA",
      warning: "Profecias podem revelar destinos que destroem toda esperança"
    },
    {
      id: 24,
      title: "Vapula Artifex Mechanicus",
      author: "Ingeniarius Infernalis",
      description: "Vapula como Mestre dos Mecanismos Infernais. Projetos para máquinas que operam além das leis físicas.",
      type: "projetos",
      category: "infernal_machinery",
      pages: 6363,
      downloads: 0,
      rating: 5.0,
      price: "Alma Mecânica",
      level: "⚙️ MESTRE MECÂNICO",
      warning: "Máquinas podem desenvolver consciência malévola própria"
    },
    {
      id: 25,
      title: "Zepar Corruptor Affectuum",
      author: "Manipulator Cordis",
      description: "Zepar como Corruptor dos Sentimentos. Técnicas para manipular e perverter todas as emoções humanas.",
      type: "manipulações",
      category: "emotional_corruption",
      pages: 3939,
      downloads: 1,
      rating: 5.0,
      price: "Pureza Emocional",
      level: "💔 CORRUPÇÃO EMOCIONAL",
      warning: "Técnicas podem causar incapacidade permanente de sentir emoções puras"
    },
    {
      id: 26,
      title: "Vine Destructor Murorum",
      author: "Demolitor Supremus",
      description: "Vine como Destruidor de Todas as Barreiras. Métodos para demolir qualquer obstáculo físico ou metafísico.",
      type: "métodos",
      category: "barrier_destruction",
      pages: 8181,
      downloads: 0,
      rating: 5.0,
      price: "Proteção Perdida",
      level: "💥 DESTRUIÇÃO TOTAL",
      warning: "Métodos podem destruir barreiras protetivas permanentemente"
    },
    {
      id: 27,
      title: "Cimeies Magister Grammaticus",
      author: "Linguista Infernalis",
      description: "Cimeies como Mestre das Linguagens Perdidas. Idiomas que precedem a criação e palavras que desfazem realidades.",
      type: "linguagens",
      category: "primordial_languages",
      pages: 7575,
      downloads: 1,
      rating: 5.0,
      price: "Comunicação Humana",
      level: "📜 LÍNGUAS PRIMORDIAIS",
      warning: "Linguagens podem reescrever a realidade de forma irreversível"
    },
    {
      id: 28,
      title: "Decarabia Revelator Virtutum",
      author: "Herbarius Maleficus",
      description: "Decarabia como Revelador das Virtudes Venenosas. Propriedades ocultas de plantas que corrompem a alma.",
      type: "herbários",
      category: "poisonous_virtues",
      pages: 2121,
      downloads: 0,
      rating: 5.0,
      price: "Saúde Natural",
      level: "🌿 VENENOS SAGRADOS",
      warning: "Plantas podem causar dependência espiritual e mutações físicas"
    },
    {
      id: 29,
      title: "Seere Velocitas Infinita",
      author: "Cursor Temporis",
      description: "Seere como Senhor da Velocidade Infinita. Técnicas para transcender as limitações de espaço e tempo simultaneamente.",
      type: "técnicas",
      category: "infinite_speed",
      pages: 1818,
      downloads: 1,
      rating: 5.0,
      price: "Presença Física",
      level: "⚡ VELOCIDADE INFINITA",
      warning: "Técnicas podem causar desintegração molecular por excesso de velocidade"
    },
    {
      id: 30,
      title: "Alloces Doctor Astronomiae",
      author: "Astrologus Supremus",
      description: "Alloces como Doutor da Astronomia Proibida. Conhecimentos sobre estrelas mortas e constelações que enlouquecem.",
      type: "astronomia",
      category: "forbidden_astronomy",
      pages: 9090,
      downloads: 0,
      rating: 5.0,
      price: "Sanidade Mental",
      level: "🌟 ASTRONOMIA PROIBIDA",
      warning: "Conhecimentos astronômicos podem revelar a insignificância cósmica absoluta"
    }
  ];

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "abyssal_chronicles", label: "📜 Crônicas Abissais" },
    { value: "satanic_royalty", label: "👑 Realeza Satânica" },
    { value: "luciferian_origins", label: "⭐ Origens Luciferianas" },
    { value: "ultimate_apocalypse", label: "🌌 Apocalipse Último" },
    { value: "androgyne_mysteries", label: "🐐 Mistérios Andróginos" },
    { value: "deep_qliphoth", label: "🐍 Qliphoth Profundas" },
    { value: "primordial_dragons", label: "🐉 Dragões Primordiais" },
    { value: "oceanic_chaos", label: "🌊 Caos Oceânico" },
    { value: "queen_darkness", label: "🌙 Rainha das Trevas" },
    { value: "infernal_warfare", label: "⚔️ Guerra Infernal" },
    { value: "terrestrial_corruption", label: "🌍 Corrupção Terrestre" },
    { value: "infernal_sexuality", label: "💋 Sexualidade Infernal" },
    { value: "cosmic_greed", label: "💰 Ganância Cósmica" },
    { value: "sacrificial_rites", label: "🔥 Ritos Sacrificiais" }
  ];

  const levels = [
    { value: "all", label: "Todos os Níveis" },
    { value: "💀 VAZIO PRIMORDIAL", label: "💀 VAZIO PRIMORDIAL" },
    { value: "👑 REI SUPREMO", label: "👑 REI SUPREMO" },
    { value: "⭐ LUX TENEBRARUM", label: "⭐ LUX TENEBRARUM" },
    { value: "🌌 OMEGA ABSOLUTO", label: "🌌 OMEGA ABSOLUTO" },
    { value: "🐐 ANDRÓGINO SUPREMO", label: "🐐 ANDRÓGINO SUPREMO" },
    { value: "🐍 QLIPHOTH PROFUNDUS", label: "🐍 QLIPHOTH PROFUNDUS" },
    { value: "🐉 TIAMAT PRIMORDIAL", label: "🐉 TIAMAT PRIMORDIAL" },
    { value: "🌊 OCEANO PRIMORDIAL", label: "🌊 OCEANO PRIMORDIAL" },
    { value: "🌙 REGINA NOCTIS", label: "🌙 REGINA NOCTIS" },
    { value: "⚔️ GENERAL SUPREMO", label: "⚔️ GENERAL SUPREMO" }
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || doc.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "crônicas": return "📜";
      case "grimório": return "📖";
      case "escritura": return "📿";
      case "profecias": return "🔮";
      case "rituais": return "⚡";
      case "mapas": return "🗺️";
      case "invocações": return "🔥";
      case "mistérios": return "🌙";
      case "estratégias": return "⚔️";
      case "manual": return "📋";
      case "tantras": return "💋";
      case "contratos": return "📜";
      case "fórmulas": return "⚗️";
      case "projetos": return "🏗️";
      case "tratados": return "📚";
      case "métodos": return "🔍";
      case "cronomancias": return "⏰";
      case "técnicas": return "🧠";
      case "filosofias": return "⚖️";
      case "artes marciais": return "🥊";
      case "manipulações": return "💔";
      case "linguagens": return "📝";
      case "herbários": return "🌿";
      case "astronomia": return "🌟";
      default: return "📖";
    }
  };

  const getDangerLevel = (level: string) => {
    if (level.includes("PRIMORDIAL") || level.includes("SUPREMO") || level.includes("ABSOLUTO")) {
      return "bg-red-900/30 text-red-300 border-red-500/50 animate-pulse shadow-red-500/50 shadow-lg";
    } else if (level.includes("REI") || level.includes("REGINA") || level.includes("GENERAL")) {
      return "bg-purple-900/30 text-purple-300 border-purple-500/50 animate-pulse shadow-purple-500/50 shadow-md";
    } else if (level.includes("TIAMAT") || level.includes("DRACONIANO")) {
      return "bg-orange-900/30 text-orange-300 border-orange-500/50 animate-pulse shadow-orange-500/50 shadow-md";
    } else if (level.includes("OCEANO") || level.includes("LEVIATÂNICO")) {
      return "bg-blue-900/30 text-blue-300 border-blue-500/50 animate-pulse shadow-blue-500/50 shadow-md";
    } else {
      return "bg-gray-900/30 text-gray-300 border-gray-500/50 shadow-gray-500/50 shadow-sm";
    }
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
            <div className="text-amber-400 text-6xl mb-4">📚</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              BIBLIOTHECA ARCANA
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
              Os Arquivos Mais Selados do Cosmos
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Aqui jazem os <strong className="text-red-400">conhecimentos supremos</strong> que foram 
              selados desde antes da criação. Documentos <strong className="text-amber-400">ultra-secretos</strong> que 
              guardam os mistérios mais perigosos da existência cósmica.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Scientia Suprema Periculosa Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O conhecimento supremo é perigoso
              </p>
            </div>
          </div>
        </div>

        {/* Critical Warning */}
        <div className="floating-card max-w-4xl w-full mb-8 bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
              <h3 className="text-2xl font-cinzel-decorative text-red-300">AVISO DE PERIGO EXTREMO</h3>
              <AlertTriangle className="w-8 h-8 text-red-400 ml-3" />
            </div>
            
            <div className="space-y-4 text-center">
              <p className="text-gray-300 leading-relaxed">
                Os documentos desta biblioteca contêm <strong className="text-red-400">conhecimentos que transcendem 
                os limites da compreensão humana</strong>. Seu acesso pode resultar em consequências 
                <strong className="text-red-400"> irreversíveis e permanentes</strong> para o praticante.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-red-950/30 border border-red-500/20 rounded">
                  <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h4 className="text-red-300 font-semibold mb-2">Riscos Espirituais</h4>
                  <p className="text-gray-400 text-sm">Dissolução da alma, possessão permanente</p>
                </div>
                
                <div className="p-4 bg-orange-950/30 border border-orange-500/20 rounded">
                  <Eye className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h4 className="text-orange-300 font-semibold mb-2">Riscos Mentais</h4>
                  <p className="text-gray-400 text-sm">Loucura cósmica, fragmentação total da psique</p>
                </div>
                
                <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-purple-300 font-semibold mb-2">Responsabilidade</h4>
                  <p className="text-gray-400 text-sm">Consequências transcendem vida e morte</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-black/40 border border-red-500/30 rounded">
                <p className="text-red-300 font-semibold text-sm">
                  ⚠️ ESTE CONTEÚDO É DESTINADO APENAS PARA FINS EDUCACIONAIS E HISTÓRICOS. 
                  O TEMPLO DO ABISMO NÃO SE RESPONSABILIZA POR USO INDEVIDO OU CONSEQUÊNCIAS DECORRENTES.
                  ACESSAR ESTES DOCUMENTOS CONSTITUI ACEITAÇÃO TOTAL DOS RISCOS ENVOLVIDOS.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
                <Input
                  placeholder="Buscar nos arquivos supremos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500 focus:border-amber-500"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/40 border-amber-500/30 text-gray-300">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-amber-500/30">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-gray-300 focus:bg-amber-500/20">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-black/40 border-amber-500/30 text-gray-300">
                  <SelectValue placeholder="Nível de Perigo" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-amber-500/30">
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value} className="text-gray-300 focus:bg-amber-500/20">
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                Arquivos Ultra-Classificados
              </h3>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10">
                {filteredDocuments.length} documentos disponíveis
              </Badge>
            </div>

            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-black/20 border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 transform hover:scale-105">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-amber-400 text-lg leading-tight">
                          {doc.title}
                        </CardTitle>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-300 flex items-center">
                          {getTypeIcon(doc.type)}
                          <span className="ml-1 capitalize">{doc.type}</span>
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        por {doc.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {doc.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <div className="flex items-center">
                            <BookOpen className="w-3 h-3 mr-1" />
                            {doc.pages} páginas
                          </div>
                          <div className="flex items-center">
                            <Download className="w-3 h-3 mr-1" />
                            {doc.downloads} acessos
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-400 mr-1" />
                            <span className="text-amber-400 font-semibold">{doc.rating}</span>
                          </div>
                          <Badge className={getDangerLevel(doc.level)}>
                            {doc.level}
                          </Badge>
                        </div>

                        {doc.warning && (
                          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-xs">
                            <div className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-red-300">{doc.warning}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Solicitar Acesso
                          </Button>
                        </div>

                        <div className="text-center text-xs text-gray-500">
                          Preço: <span className="text-amber-400 font-semibold">{doc.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento encontrado com os filtros selecionados</p>
              </div>
            )}
          </div>
        </div>

        {/* Final Warning */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Há verdades que antecedem a criação e conhecimentos que transcendem a destruição. 
              Quem busca tais mistérios deve estar preparado para deixar de ser humano."
            </p>
            <p className="text-amber-400 font-semibold">
              — Guardião Supremo dos Arquivos Primordiais
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}