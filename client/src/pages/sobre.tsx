import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, Scroll, Eye, Crown } from "lucide-react";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-red-950/20 to-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                <Flame className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
              Sobre o Templo
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Um portal dedicado aos ensinamentos ancestrais e à exploração dos mistérios ocultos
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-red-400">Nossa Missão</h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  O Templo do Abismo é um santuário digital dedicado à preservação e transmissão 
                  dos conhecimentos esotéricos ancestrais. Nossa missão é criar uma ponte entre 
                  a sabedoria antiga e os buscadores contemporâneos.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Aqui, exploramos os mistérios da existência através de práticas milenares, 
                  estudos profundos e experiências transformadoras que conduzem à verdadeira 
                  iluminação interior.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-red-950/20 border-red-800/30">
                  <CardHeader>
                    <Scroll className="w-8 h-8 text-red-400 mb-2" />
                    <CardTitle className="text-white">Grimórios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      Textos sagrados e conhecimentos preservados através dos séculos
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-950/20 border-red-800/30">
                  <CardHeader>
                    <Eye className="w-8 h-8 text-red-400 mb-2" />
                    <CardTitle className="text-white">Oráculos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      Consultas divinas para orientação e revelações místicas
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-950/20 border-red-800/30">
                  <CardHeader>
                    <Crown className="w-8 h-8 text-red-400 mb-2" />
                    <CardTitle className="text-white">Iniciação</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      Caminhos estruturados de desenvolvimento espiritual
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-red-950/20 border-red-800/30">
                  <CardHeader>
                    <Flame className="w-8 h-8 text-red-400 mb-2" />
                    <CardTitle className="text-white">Prática</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm">
                      Exercícios e rituais para despertar o poder interior
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Philosophy Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-8 text-red-400">Nossa Filosofia</h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  "O verdadeiro conhecimento não está na luz cegante do dia, mas nas profundezas 
                  silenciosas da noite, onde os mistérios se revelam àqueles que têm coragem 
                  de olhar para o abismo interior."
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Acreditamos que cada indivíduo carrega dentro de si o potencial para 
                  transcender as limitações mundanas e acessar estados superiores de consciência. 
                  Através do estudo disciplinado e da prática dedicada, revelamos os segredos 
                  que conectam o microcosmo pessoal ao macrocosmo universal.
                </p>
              </div>
            </div>

            {/* Principles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-gradient-to-b from-red-950/40 to-black border-red-800/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-red-400 text-xl">Conhecimento</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300">
                    A busca incessante pela verdade através dos textos sagrados 
                    e da experiência direta
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-red-950/40 to-black border-red-800/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-red-400 text-xl">Transformação</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300">
                    A metamorfose interior que ocorre através da disciplina 
                    e da aplicação dos ensinamentos
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-b from-red-950/40 to-black border-red-800/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-red-400 text-xl">Transcendência</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-300">
                    O objetivo final de elevar a consciência além 
                    dos limites da existência ordinária
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}