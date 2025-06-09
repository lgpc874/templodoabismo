import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Users, 
  BookOpen, 
  Scroll, 
  Activity, 
  Database,
  Sparkles,
  Shield,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw
} from "lucide-react";
import AIContentGenerator from "./admin/components/AIContentGenerator";

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalGrimoires: 0,
    todayConsultations: 0
  });
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id !== 1) {
      window.location.href = '/';
      return;
    }
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleContentGenerated = (content: any, type: string) => {
    console.log(`Generated ${type}:`, content);
    // Here you would typically save the content to the database
    // and refresh the relevant data
  };

  if (user?.id !== 1) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-titles text-red-400 mb-2">Acesso Negado</h1>
          <p className="text-gray-400">Apenas administradores podem acessar esta área</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-950/10 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-titles text-red-400 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">
            Controle total sobre o Templo do Abismo
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black/50 border border-red-800/30">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="content">Conteúdo</TabsTrigger>
            <TabsTrigger value="ai-generator">IA Gerador</TabsTrigger>
            <TabsTrigger value="oracles">Oráculos</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="abyssal-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Total de Usuários
                  </CardTitle>
                  <Users className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                  <p className="text-xs text-gray-400">
                    Iniciados no templo
                  </p>
                </CardContent>
              </Card>

              <Card className="abyssal-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Cursos Ativos
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalCourses}</div>
                  <p className="text-xs text-gray-400">
                    Caminhos de conhecimento
                  </p>
                </CardContent>
              </Card>

              <Card className="abyssal-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Grimórios
                  </CardTitle>
                  <Scroll className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalGrimoires}</div>
                  <p className="text-xs text-gray-400">
                    Textos sagrados
                  </p>
                </CardContent>
              </Card>

              <Card className="abyssal-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    Consultas Hoje
                  </CardTitle>
                  <Activity className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.todayConsultations}</div>
                  <p className="text-xs text-gray-400">
                    Oráculos consultados
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="abyssal-card">
              <CardHeader>
                <CardTitle className="text-red-400">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Novo usuário registrado</p>
                      <p className="text-gray-400 text-xs">há 5 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Consulta ao Tarot Infernal realizada</p>
                      <p className="text-gray-400 text-xs">há 12 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-white text-sm">Novo poema místico gerado</p>
                      <p className="text-gray-400 text-xs">há 1 hora</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="abyssal-card">
              <CardHeader>
                <CardTitle className="text-red-400">Gerenciamento de Usuários</CardTitle>
                <CardDescription className="text-gray-400">
                  Administre os iniciados do templo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Input 
                      placeholder="Buscar usuários..." 
                      className="max-w-sm bg-black/50 border-red-800/50"
                    />
                    <Button className="bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </div>
                  
                  <div className="border border-red-800/30 rounded-lg p-4">
                    <div className="grid grid-cols-4 gap-4 font-semibold text-gray-300 mb-4">
                      <div>Nome</div>
                      <div>Email</div>
                      <div>Nível</div>
                      <div>Ações</div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-red-800/20">
                        <div className="text-white">admin</div>
                        <div className="text-gray-400">admin@templo.com</div>
                        <div>
                          <Badge variant="destructive">Administrador</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-red-800/50">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-800/50">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-red-800/20">
                        <div className="text-white">testuser</div>
                        <div className="text-gray-400">test@test.com</div>
                        <div>
                          <Badge variant="secondary">Iniciante</Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-red-800/50">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-800/50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-800/50 hover:bg-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="abyssal-card">
                <CardHeader>
                  <CardTitle className="text-red-400">Cursos</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerenciar caminhos de conhecimento
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Novo Curso
                    </Button>
                    <div className="space-y-2">
                      <div className="p-3 border border-red-800/30 rounded-lg">
                        <h4 className="text-white font-semibold">Filosofia Luciferiana</h4>
                        <p className="text-gray-400 text-sm">7 módulos • Nível 1</p>
                      </div>
                      <div className="p-3 border border-red-800/30 rounded-lg">
                        <h4 className="text-white font-semibold">Meditação Abissal</h4>
                        <p className="text-gray-400 text-sm">5 módulos • Nível 2</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="abyssal-card">
                <CardHeader>
                  <CardTitle className="text-red-400">Grimórios</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerenciar textos sagrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Novo Grimório
                    </Button>
                    <div className="space-y-2">
                      <div className="p-3 border border-red-800/30 rounded-lg">
                        <h4 className="text-white font-semibold">Liber Umbra</h4>
                        <p className="text-gray-400 text-sm">12 capítulos • Completo</p>
                      </div>
                      <div className="p-3 border border-red-800/30 rounded-lg">
                        <h4 className="text-white font-semibold">Codex Ignis</h4>
                        <p className="text-gray-400 text-sm">8 capítulos • Em progresso</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-generator" className="space-y-6">
            <AIContentGenerator onContentGenerated={handleContentGenerated} />
            
            <Card className="abyssal-card">
              <CardHeader>
                <CardTitle className="text-red-400">Status da IA</CardTitle>
                <CardDescription className="text-gray-400">
                  Configuração e status dos serviços de IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border border-red-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white">OpenAI API</h4>
                      <p className="text-gray-400 text-sm">Serviço de geração de conteúdo</p>
                    </div>
                    <Badge variant="destructive">Quota Excedida</Badge>
                  </div>
                  
                  <div className="p-4 bg-red-950/20 border border-red-800/30 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">Aviso sobre Quota da API</h4>
                    <p className="text-gray-300 text-sm">
                      A quota da OpenAI API foi excedida. Para reativar os recursos de IA:
                    </p>
                    <ul className="text-gray-400 text-sm mt-2 ml-4 list-disc">
                      <li>Verifique sua conta OpenAI</li>
                      <li>Adicione créditos ou atualize seu plano</li>
                      <li>Aguarde a renovação mensal da quota</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oracles" className="space-y-6">
            <Card className="abyssal-card">
              <CardHeader>
                <CardTitle className="text-red-400">Configuração dos Oráculos</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerenciar os cinco tipos de consulta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Tarot Infernal", cost: 10, active: true },
                    { name: "Espelho Negro", cost: 15, active: true },
                    { name: "Runas Abissais", cost: 12, active: true },
                    { name: "Divinação com Fogo", cost: 20, active: true },
                    { name: "Voz Abissal", cost: 25, active: true }
                  ].map((oracle, index) => (
                    <div key={index} className="p-4 border border-red-800/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-semibold">{oracle.name}</h4>
                        <Badge variant={oracle.active ? "default" : "secondary"}>
                          {oracle.active ? "Ativo" : "Inativo"}
                        </Badge>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Custo: {oracle.cost} T'KAZH
                      </p>
                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" className="border-red-800/50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-800/50">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="abyssal-card">
              <CardHeader>
                <CardTitle className="text-red-400">Configurações Gerais</CardTitle>
                <CardDescription className="text-gray-400">
                  Configurações globais do templo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-white">Nome do Site</Label>
                    <Input 
                      defaultValue="Templo do Abismo" 
                      className="bg-black/50 border-red-800/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">Descrição</Label>
                    <Textarea 
                      defaultValue="Portal místico de ensinamentos luciferiano-ancestrais"
                      className="bg-black/50 border-red-800/50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-white">T'KAZH Inicial para Novos Usuários</Label>
                    <Input 
                      type="number"
                      defaultValue="100" 
                      className="bg-black/50 border-red-800/50"
                    />
                  </div>
                  
                  <Button className="bg-red-600 hover:bg-red-700">
                    Salvar Configurações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}