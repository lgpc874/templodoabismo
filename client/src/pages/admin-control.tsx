import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Settings, 
  Users, 
  BookOpen, 
  Scroll, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Shield,
  Database,
  Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SiteNavigation from "@/components/SiteNavigation";

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries básicas que funcionam
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    retry: false,
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
    retry: false,
  });

  const { data: grimoires = [], isLoading: grimoiresLoading } = useQuery({
    queryKey: ["/api/admin/grimoires"],
    retry: false,
  });

  const { data: blogPosts = [], isLoading: blogLoading } = useQuery({
    queryKey: ["/api/admin/blog/posts"],
    retry: false,
  });

  // Stats básicas calculadas localmente
  const stats = {
    totalUsers: Array.isArray(users) ? users.length : 0,
    totalCourses: Array.isArray(courses) ? courses.length : 0,
    totalGrimoires: Array.isArray(grimoires) ? grimoires.length : 0,
    totalBlogPosts: Array.isArray(blogPosts) ? blogPosts.length : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-amber-400 mb-4">
            ⚡ SANCTUM ADMINISTRATORIS ⚡
          </h1>
          <p className="text-xl text-gray-300">
            Portal de controle das trevas digitais
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black/40 border border-purple-500/30">
            <TabsTrigger value="dashboard" className="text-amber-400">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="text-amber-400">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="content" className="text-amber-400">
              <BookOpen className="w-4 h-4 mr-2" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="apis" className="text-amber-400">
              <Settings className="w-4 h-4 mr-2" />
              APIs
            </TabsTrigger>
            <TabsTrigger value="susurri" className="text-amber-400">
              <Scroll className="w-4 h-4 mr-2" />
              Susurri
            </TabsTrigger>
            <TabsTrigger value="system" className="text-amber-400">
              <Settings className="w-4 h-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-amber-400">
              <Activity className="w-4 h-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Total Usuários</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {stats.totalUsers}
                  </div>
                  <p className="text-xs text-gray-500">
                    Membros cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Cursos</CardTitle>
                  <BookOpen className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {stats.totalCourses}
                  </div>
                  <p className="text-xs text-gray-500">
                    Academia Luciferiana
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Grimórios</CardTitle>
                  <Scroll className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {stats.totalGrimoires}
                  </div>
                  <p className="text-xs text-gray-500">
                    Bibliotheca Abyssos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Posts Blog</CardTitle>
                  <Edit className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {stats.totalBlogPosts}
                  </div>
                  <p className="text-xs text-gray-500">
                    Gnosis Abyssos
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Status do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitoramento em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Portal Online</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Ativo
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">Banco de Dados</span>
                    </div>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      Conectado
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-300">IA Templo</span>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      Operacional
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Gerenciar Usuários</CardTitle>
                <CardDescription className="text-gray-400">
                  {stats.totalUsers} membros cadastrados no templo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando usuários...</p>
                  </div>
                ) : Array.isArray(users) && users.length > 0 ? (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {users.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-200">{user.username || 'Sem nome'}</p>
                            <p className="text-sm text-gray-400">{user.email || 'Sem email'}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                {user.role || 'user'}
                              </Badge>
                              <Badge variant="outline" className="text-amber-400">
                                Nível {user.initiation_level || 0}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-400 py-8">Nenhum usuário encontrado</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400">Cursos Ativos</CardTitle>
                  <CardDescription className="text-gray-400">
                    {stats.totalCourses} cursos na Academia Luciferiana
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {coursesLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                    </div>
                  ) : Array.isArray(courses) && courses.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {courses.map((course: any) => (
                        <div key={course.id} className="p-3 border border-purple-500/20 rounded">
                          <h4 className="font-semibold text-gray-200 text-sm">{course.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">Nível {course.level}</Badge>
                            <Badge variant="outline" className="text-xs">R$ {course.price_brl}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-4">Nenhum curso encontrado</p>
                  )}
                  
                  <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Curso
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400">Grimórios</CardTitle>
                  <CardDescription className="text-gray-400">
                    {stats.totalGrimoires} manuscritos na Bibliotheca
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {grimoiresLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                    </div>
                  ) : Array.isArray(grimoires) && grimoires.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {grimoires.map((grimoire: any) => (
                        <div key={grimoire.id} className="p-3 border border-purple-500/20 rounded">
                          <h4 className="font-semibold text-gray-200 text-sm">{grimoire.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline" className="text-xs">Perigo {grimoire.danger_level}</Badge>
                            <Badge variant="outline" className="text-xs">R$ {grimoire.rental_price_brl}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400 py-4">Nenhum grimório encontrado</p>
                  )}
                  
                  <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Grimório
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Configurações do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Controles administrativos do portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Operações</h3>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Database className="w-4 h-4 mr-2" />
                      Backup Banco de Dados
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Verificar Segurança
                    </Button>
                    
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações Gerais
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Status</h3>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Registros Abertos</span>
                        <Badge variant="outline" className="text-green-400">Ativo</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Modo Manutenção</span>
                        <Badge variant="outline" className="text-gray-400">Inativo</Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">Logs Detalhados</span>
                        <Badge variant="outline" className="text-blue-400">Ativo</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-purple-500/30 pt-6">
                  <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Zona Perigosa</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Operações que podem afetar o funcionamento do portal
                    </p>
                    <Button variant="destructive" size="sm">
                      Resetar Sistema
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* APIs Tab */}
          <TabsContent value="apis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pagamentos */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    APIs de Pagamento
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configurações dos gateways de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">PayPal</h4>
                        <p className="text-xs text-gray-500">Pagamentos internacionais</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Configurar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Mercado Pago</h4>
                        <p className="text-xs text-gray-500">Gateway brasileiro</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Configurar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">InfinitePay</h4>
                        <p className="text-xs text-gray-500">PIX e cartões</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Configurar
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">PagSeguro</h4>
                        <p className="text-xs text-gray-500">Plataforma completa</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Configurar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inteligência Artificial */}
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    APIs de Inteligência Artificial
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configurações de IA para geração de conteúdo místico
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-purple-500/20 rounded">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">OpenAI ChatGPT</h4>
                        <p className="text-xs text-gray-500">Geração de Susurri Abyssos e interpretações</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        <Button size="sm" variant="outline" className="text-xs">
                          Configurar
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-4 border border-amber-500/30 rounded bg-amber-500/10">
                    <h5 className="text-sm font-medium text-amber-400 mb-2">Configuração Necessária</h5>
                    <p className="text-xs text-gray-400 mb-3">
                      Configure as APIs para ativar funcionalidades automáticas como geração de conteúdo místico e processamento de pagamentos.
                    </p>
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      Iniciar Configuração
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Susurri Abyssos Tab */}
          <TabsContent value="susurri" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center">
                  <Scroll className="w-5 h-5 mr-2" />
                  Susurri Abyssos
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Gerenciamento das frases místicas do portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-300">Frases Ativas</h3>
                    <p className="text-sm text-gray-500">Gerencie as mensagens que aparecem no portal</p>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Frase
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between p-4 border border-purple-500/20 rounded">
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-2">
                        "A sabedoria verdadeira emerge das profundezas do abismo, onde a luz comum não ousa penetrar."
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Categoria: Sabedoria</span>
                        <span>Autor: Templo do Abismo</span>
                        <span>Ordem: 1</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-start justify-between p-4 border border-purple-500/20 rounded">
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-2">
                        "No silêncio da escuridão encontra-se o sussurro eterno que guia os buscadores corajosos."
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Categoria: Trevas</span>
                        <span>Autor: Mestre Abyssal</span>
                        <span>Ordem: 2</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 border border-amber-500/30 rounded bg-amber-500/10">
                  <h5 className="text-sm font-medium text-amber-400 mb-2">Geração Automática com IA</h5>
                  <p className="text-xs text-gray-400 mb-3">
                    Configure a API do ChatGPT para gerar automaticamente novas frases místicas baseadas nos temas do Templo do Abismo.
                  </p>
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                      Gerar com IA
                    </Button>
                    <Button size="sm" variant="outline">
                      Configurar Prompts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Logs do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Atividades recentes no portal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <div className="flex items-start space-x-4 p-3 border border-purple-500/20 rounded">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Sistema iniciado com sucesso</p>
                      <p className="text-xs text-gray-500">Há 5 minutos</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 border border-purple-500/20 rounded">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Painel administrativo acessado</p>
                      <p className="text-xs text-gray-500">Agora</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-3 border border-purple-500/20 rounded">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Banco de dados conectado</p>
                      <p className="text-xs text-gray-500">Há 10 minutos</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}