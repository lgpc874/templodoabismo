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
  Activity,
  FileText,
  Image,
  Save,
  Eye,
  Upload,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPage, setEditingPage] = useState<any>(null);
  const [editingScripture, setEditingScripture] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [showScriptureDialog, setShowScriptureDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockStats = {
    totalUsers: 156,
    totalCourses: 24,
    totalGrimoires: 18,
    totalConsultations: 342
  };

  const mockPages = [
    { id: 1, title: "Página Inicial", slug: "home", status: "published", type: "page" },
    { id: 2, title: "Sobre Nós", slug: "about", status: "draft", type: "page" },
    { id: 3, title: "Contato", slug: "contact", status: "published", type: "page" }
  ];

  const mockCourses = [
    { id: 1, title: "Fundamentos da Gnose", description: "Curso básico de introdução", level: 1, price_brl: "9999", type: "regular", is_active: true },
    { id: 2, title: "Rituais Avançados", description: "Técnicas rituais avançadas", level: 3, price_brl: "19999", type: "premium", is_active: true },
    { id: 3, title: "Mestrado Luciferiano", description: "Curso para mestres", level: 5, price_brl: "49999", type: "master", is_active: false }
  ];

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
            <div className="text-amber-400 text-6xl mb-4">⚡</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              SANCTUM ADMINISTRATORIS
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
              Portal de Controle das Trevas Digitais
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Centro de <strong className="text-amber-400">comando absoluto</strong> para gerenciar todos os aspectos do 
              <strong className="text-red-400"> Templo do Abismo</strong> digital.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Imperium Super Omnia"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Comando sobre todas as coisas
              </p>
            </div>
          </div>
        </div>

        {/* Admin Interface */}
        <div className="floating-card max-w-7xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-amber-500/30">
                <TabsTrigger value="dashboard" className="text-amber-400">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="users" className="text-amber-400">
                  <Users className="w-4 h-4 mr-2" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger value="courses" className="text-amber-400">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Cursos
                </TabsTrigger>
                <TabsTrigger value="system" className="text-amber-400">
                  <Settings className="w-4 h-4 mr-2" />
                  Sistema
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Tab */}
              <TabsContent value="dashboard" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-black/40 border-amber-500/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Usuários</CardTitle>
                      <Users className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-400">
                        {mockStats.totalUsers}
                      </div>
                      <p className="text-xs text-gray-500">
                        Membros cadastrados
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-amber-500/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Cursos</CardTitle>
                      <BookOpen className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-400">
                        {mockStats.totalCourses}
                      </div>
                      <p className="text-xs text-gray-500">
                        Cursos ativos
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-amber-500/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Grimórios</CardTitle>
                      <Scroll className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-400">
                        {mockStats.totalGrimoires}
                      </div>
                      <p className="text-xs text-gray-500">
                        Textos disponíveis
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 border-amber-500/30">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Consultas</CardTitle>
                      <Activity className="h-4 w-4 text-amber-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-amber-400">
                        {mockStats.totalConsultations}
                      </div>
                      <p className="text-xs text-gray-500">
                        Oracle realizadas
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Users Tab */}
              <TabsContent value="users" className="space-y-6">
                <Card className="bg-black/40 border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Gerenciar Usuários</CardTitle>
                    <CardDescription className="text-gray-400">
                      Controle de membros pelo Magus do Templo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                      <p className="text-gray-400">
                        Interface de gerenciamento de usuários em desenvolvimento
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <Card className="bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-amber-400">Gerenciar Cursos</CardTitle>
                      <CardDescription className="text-gray-400">
                        Administração da Academia Luciferiana
                      </CardDescription>
                    </div>
                    <Button className="bg-amber-600 hover:bg-amber-700 text-black">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Curso
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border border-amber-500/20 rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-200">{course.title}</h4>
                            <p className="text-sm text-gray-400">{course.description}</p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant={course.is_active ? 'default' : 'secondary'}>
                                {course.is_active ? 'Ativo' : 'Inativo'}
                              </Badge>
                              <Badge variant="outline">
                                Nível {course.level}
                              </Badge>
                              <Badge variant="outline">
                                R$ {(parseInt(course.price_brl) / 100).toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* System Tab */}
              <TabsContent value="system" className="space-y-6">
                <Card className="bg-black/40 border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Configurações do Templo</CardTitle>
                    <CardDescription className="text-gray-400">
                      Configurações místicas reservadas ao Magus do Templo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-300">Status do Servidor</Label>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-green-400">Online</span>
                          </div>
                        </div>
                        <div>
                          <Label className="text-gray-300">Banco de Dados</Label>
                          <div className="flex items-center space-x-2 mt-2">
                            <Database className="w-4 h-4 text-amber-400" />
                            <span className="text-amber-400">Conectado</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-amber-500/20 pt-6">
                        <h4 className="text-lg font-semibold text-amber-300 mb-4">Controles do Magus</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" className="border-amber-500/30 text-amber-300">
                            <Database className="w-4 h-4 mr-2" />
                            Backup do Banco
                          </Button>
                          <Button variant="outline" className="border-amber-500/30 text-amber-300">
                            <Activity className="w-4 h-4 mr-2" />
                            Logs do Sistema
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "O poder verdadeiro reside no controle absoluto sobre todas as dimensões da realidade"
            </p>
            <p className="text-amber-400 font-semibold">
              — Princípio do Sanctum
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}