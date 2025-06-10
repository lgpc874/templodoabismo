import { useState, useEffect } from "react";
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
  X,
  PenTool,
  TrendingUp
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

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  type: 'course' | 'grimoire' | 'page';
  status: 'draft' | 'published';
  meta_description?: string;
  featured_image?: string;
  author_id?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  slug: string;
  content?: string;
  difficulty_level: number;
  price_brl: string;
  duration_hours?: number;
  requirements?: string[];
  what_you_learn?: string[];
  status: 'draft' | 'published';
  featured_image?: string;
  author_id?: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

interface Grimoire {
  id: number;
  title: string;
  content: string;
  slug: string;
  category: string;
  access_level: number;
  is_forbidden: boolean;
  author?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  excerpt?: string;
  ritual_type?: string;
  tradition?: string;
  difficulty_rating?: number;
  prerequisites?: string[];
  warnings?: string[];
  sacred_elements?: string[];
  moon_phase?: string;
  planetary_influence?: string;
  seasonal_timing?: string;
  materials_needed?: string[];
  preparation_time?: string;
  ritual_duration?: string;
  safety_notes?: string;
  historical_context?: string;
  source_attribution?: string;
  translation_notes?: string;
  commentary?: string;
  related_texts?: string[];
  tags?: string[];
}

interface SiteStats {
  totalUsers: number;
  totalCourses: number;
  totalGrimoires: number;
  totalPages: number;
  totalRevenue: string;
  totalVisits: number;
  totalArticles: number;
  totalPublications: number;
  monthlyGrowth: number;
  activeUsers: number;
  popularPages: Array<{name: string, views: number}>;
  recentActivity: Array<{action: string, timestamp: string, user: string}>;
}

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  adminEmail: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  defaultUserRole: string;
  maxFileSize: number;
  enableComments: boolean;
  enableAnalytics: boolean;
  customCSS: string;
  customJS: string;
  headerContent: string;
  footerContent: string;
  socialLinks: Record<string, string>;
}

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingGrimoire, setEditingGrimoire] = useState<Grimoire | null>(null);
  const [showPageDialog, setShowPageDialog] = useState(false);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [showGrimoireDialog, setShowGrimoireDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [oracleSettings, setOracleSettings] = useState<any>(null);
  const [showOracleTestDialog, setShowOracleTestDialog] = useState(false);
  const [testingOracle, setTestingOracle] = useState<string | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch site statistics
  const { data: stats } = useQuery<SiteStats>({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats')
  });

  // Fetch pages
  const { data: pages = [] } = useQuery<Page[]>({
    queryKey: ['/api/admin/pages'],
    queryFn: () => apiRequest('GET', '/api/admin/pages')
  });

  // Fetch courses
  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ['/api/admin/courses'],
    queryFn: () => apiRequest('GET', '/api/admin/courses')
  });

  // Fetch grimoires
  const { data: grimoires = [] } = useQuery<Grimoire[]>({
    queryKey: ['/api/admin/grimoires'],
    queryFn: () => apiRequest('GET', '/api/admin/grimoires')
  });

  // Fetch oracle settings
  const { data: oracleData } = useQuery({
    queryKey: ['/api/admin/oracle-settings'],
    queryFn: () => apiRequest('GET', '/api/admin/oracle-settings')
  });

  // Update oracle settings state when data changes
  useEffect(() => {
    if (oracleData && !oracleSettings) {
      setOracleSettings(oracleData);
    }
  }, [oracleData, oracleSettings]);

  // Page mutations
  const createPageMutation = useMutation({
    mutationFn: (data: Partial<Page>) => apiRequest('POST', '/api/admin/pages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setShowPageDialog(false);
      setEditingPage(null);
      toast({ title: "Página criada com sucesso!" });
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Page> & { id: number }) => 
      apiRequest('PUT', `/api/admin/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setShowPageDialog(false);
      setEditingPage(null);
      toast({ title: "Página atualizada com sucesso!" });
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: "Página removida com sucesso!" });
    }
  });

  // Course mutations
  const createCourseMutation = useMutation({
    mutationFn: (data: Partial<Course>) => apiRequest('POST', '/api/admin/courses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      setShowCourseDialog(false);
      setEditingCourse(null);
      toast({ title: "Curso criado com sucesso!" });
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Course> & { id: number }) => 
      apiRequest('PUT', `/api/admin/courses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      setShowCourseDialog(false);
      setEditingCourse(null);
      toast({ title: "Curso atualizado com sucesso!" });
    }
  });

  const deleteCourse = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({ title: "Curso removido com sucesso!" });
    }
  });

  // Grimoire mutations
  const createGrimoireMutation = useMutation({
    mutationFn: (data: Partial<Grimoire>) => apiRequest('POST', '/api/admin/grimoires', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
      toast({ title: "Grimório criado com sucesso!" });
    }
  });

  const updateGrimoireMutation = useMutation({
    mutationFn: ({ id, ...data }: Partial<Grimoire> & { id: number }) => 
      apiRequest('PUT', `/api/admin/grimoires/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
      toast({ title: "Grimório atualizado com sucesso!" });
    }
  });

  const deleteGrimoire = useMutation({
    mutationFn: (id: number) => apiRequest('DELETE', `/api/admin/grimoires/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
      toast({ title: "Grimório removido com sucesso!" });
    }
  });

  const handleSavePage = (formData: FormData) => {
    const pageData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as 'course' | 'grimoire' | 'page',
      status: formData.get('status') as 'draft' | 'published'
    };

    if (editingPage) {
      updatePageMutation.mutate({ ...pageData, id: editingPage.id });
    } else {
      createPageMutation.mutate(pageData);
    }
  };

  const handleSaveCourse = (formData: FormData) => {
    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      slug: formData.get('slug') as string,
      difficulty_level: parseInt(formData.get('difficulty_level') as string),
      price_brl: formData.get('price_brl') as string,
      status: formData.get('status') as 'draft' | 'published'
    };

    if (editingCourse) {
      updateCourseMutation.mutate({ ...courseData, id: editingCourse.id });
    } else {
      createCourseMutation.mutate(courseData);
    }
  };

  const handleSaveGrimoire = (formData: FormData) => {
    const grimoireData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      slug: formData.get('slug') as string,
      category: formData.get('category') as string,
      access_level: parseInt(formData.get('access_level') as string),
      is_forbidden: formData.get('is_forbidden') === 'true',
      author: formData.get('author') as string,
      status: formData.get('status') as 'draft' | 'published',
      excerpt: formData.get('excerpt') as string,
      ritual_type: formData.get('ritual_type') as string,
      tradition: formData.get('tradition') as string,
      difficulty_rating: parseInt(formData.get('difficulty_rating') as string) || 1,
      prerequisites: formData.get('prerequisites') ? (formData.get('prerequisites') as string).split(',').map(p => p.trim()) : [],
      warnings: formData.get('warnings') ? (formData.get('warnings') as string).split(',').map(w => w.trim()) : [],
      sacred_elements: formData.get('sacred_elements') ? (formData.get('sacred_elements') as string).split(',').map(e => e.trim()) : [],
      moon_phase: formData.get('moon_phase') as string,
      planetary_influence: formData.get('planetary_influence') as string,
      seasonal_timing: formData.get('seasonal_timing') as string,
      materials_needed: formData.get('materials_needed') ? (formData.get('materials_needed') as string).split(',').map(m => m.trim()) : [],
      preparation_time: formData.get('preparation_time') as string,
      ritual_duration: formData.get('ritual_duration') as string,
      safety_notes: formData.get('safety_notes') as string,
      historical_context: formData.get('historical_context') as string,
      source_attribution: formData.get('source_attribution') as string,
      translation_notes: formData.get('translation_notes') as string,
      commentary: formData.get('commentary') as string,
      related_texts: formData.get('related_texts') ? (formData.get('related_texts') as string).split(',').map(t => t.trim()) : [],
      tags: formData.get('tags') ? (formData.get('tags') as string).split(',').map(t => t.trim()) : []
    };

    if (editingGrimoire) {
      updateGrimoireMutation.mutate({ ...grimoireData, id: editingGrimoire.id });
    } else {
      createGrimoireMutation.mutate(grimoireData);
    }
  };

  // Oracle settings mutations
  const saveOracleSettingsMutation = useMutation({
    mutationFn: (settings: any) => apiRequest('PUT', '/api/admin/oracle-settings', settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/oracle-settings'] });
      toast({ title: "Configurações dos oráculos salvas com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro", 
        description: "Falha ao salvar configurações dos oráculos",
        variant: "destructive" 
      });
    }
  });

  const testOracleMutation = useMutation({
    mutationFn: ({ type, prompt }: { type: string; prompt: string }) => 
      apiRequest('POST', '/api/admin/test-oracle', { type, prompt }),
    onSuccess: (result, variables) => {
      toast({ 
        title: "Teste Concluído", 
        description: `Oráculo ${variables.type} testado com sucesso` 
      });
    },
    onError: () => {
      toast({ 
        title: "Erro no Teste", 
        description: "Falha ao testar oráculo",
        variant: "destructive" 
      });
    }
  });

  // Oracle helper functions
  const saveOracleSettings = (settings: any) => {
    saveOracleSettingsMutation.mutate(settings);
  };

  const testOracle = (type: string, prompt: string) => {
    setTestingOracle(type);
    testOracleMutation.mutate({ type, prompt });
    setTimeout(() => setTestingOracle(null), 3000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
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
      <div className="relative z-10 min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-4">
              PAINEL ADMINISTRATIVO
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-2xl">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-8 bg-black/40 border border-amber-500/20">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <BarChart3 className="w-4 h-4 mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="pages" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <FileText className="w-4 h-4 mr-1" />
                Páginas
              </TabsTrigger>
              <TabsTrigger value="courses" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <BookOpen className="w-4 h-4 mr-1" />
                Cursos
              </TabsTrigger>
              <TabsTrigger value="grimoires" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Scroll className="w-4 h-4 mr-1" />
                Grimórios
              </TabsTrigger>
              <TabsTrigger value="articles" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <PenTool className="w-4 h-4 mr-1" />
                Artigos
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Users className="w-4 h-4 mr-1" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <TrendingUp className="w-4 h-4 mr-1" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="oracles" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Eye className="w-4 h-4 mr-1" />
                Oráculos
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Settings className="w-4 h-4 mr-1" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Total Usuários</CardTitle>
                    <Users className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalUsers || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Membros cadastrados
                    </p>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Cursos</CardTitle>
                    <BookOpen className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalCourses || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Cursos ativos
                    </p>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Grimórios</CardTitle>
                    <Scroll className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalGrimoires || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Textos disponíveis
                    </p>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Páginas</CardTitle>
                    <FileText className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalPages || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Páginas publicadas
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Artigos</CardTitle>
                    <PenTool className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalArticles || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Artigos publicados
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Visitantes</CardTitle>
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      {stats?.totalVisits || 0}
                    </div>
                    <p className="text-xs text-gray-500">
                      Visitas totais
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Crescimento</CardTitle>
                    <Activity className="h-4 w-4 text-amber-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-400">
                      +{stats?.monthlyGrowth || 0}%
                    </div>
                    <p className="text-xs text-gray-500">
                      Crescimento mensal
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Dashboard Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Páginas Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats?.popularPages?.map((page, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-gray-300">{page.name}</span>
                          <span className="text-amber-400">{page.views} visualizações</span>
                        </div>
                      )) || (
                        <div className="text-gray-500">Nenhum dado disponível</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="floating-card bg-black/40 border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400">Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats?.recentActivity?.map((activity, index) => (
                        <div key={index} className="border-l-2 border-amber-500/30 pl-3">
                          <div className="text-gray-300">{activity.action}</div>
                          <div className="text-xs text-gray-500">
                            {activity.user} - {activity.timestamp}
                          </div>
                        </div>
                      )) || (
                        <div className="text-gray-500">Nenhuma atividade recente</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Pages Management Tab */}
            <TabsContent value="pages" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Páginas</h2>
                <Button 
                  onClick={() => {
                    setEditingPage(null);
                    setShowPageDialog(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Página
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {pages.map((page) => (
                  <Card key={page.id} className="floating-card bg-black/40 border-amber-500/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-amber-400">{page.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            /{page.slug} • {page.type}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                            {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPage(page);
                              setShowPageDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deletePageMutation.mutate(page.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Courses Management Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Cursos</h2>
                <Button 
                  onClick={() => {
                    setEditingCourse(null);
                    setShowCourseDialog(true);
                  }}
                  className="bg-amber-600 hover:bg-amber-700 text-black"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Curso
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {courses.map((course) => (
                  <Card key={course.id} className="floating-card bg-black/40 border-amber-500/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-amber-400">{course.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            Nível {course.difficulty_level} • R$ {course.price_brl}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingCourse(course);
                              setShowCourseDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteCourse.mutate(course.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Grimoires Management Tab */}
            <TabsContent value="grimoires" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-cinzel-decorative text-amber-300">Gerenciar Grimórios</h2>
                <Button 
                  onClick={() => {
                    setEditingGrimoire(null);
                    setShowGrimoireDialog(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Grimório
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {grimoires.map((grimoire) => (
                  <Card key={grimoire.id} className="floating-card bg-black/40 border-red-500/30">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-red-400">{grimoire.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {grimoire.category} • Nível {grimoire.access_level}
                            {grimoire.is_forbidden && " • ⚠️ PROIBIDO"}
                          </CardDescription>
                          {grimoire.author && (
                            <p className="text-sm text-gray-400 mt-1">Por: {grimoire.author}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={grimoire.status === 'published' ? 'default' : 'secondary'}>
                            {grimoire.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingGrimoire(grimoire);
                              setShowGrimoireDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteGrimoire.mutate(grimoire.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-cinzel-decorative text-amber-300">Configurações do Site</h2>
              
              <div className="floating-card p-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl text-center">
                <Settings className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <p className="text-xl text-gray-300">
                  Configurações gerais em desenvolvimento
                </p>
                <p className="text-gray-400 mt-2">
                  Em breve você poderá personalizar todas as configurações
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Page Edit Dialog */}
      <Dialog open={showPageDialog} onOpenChange={setShowPageDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {editingPage ? 'Editar Página' : 'Nova Página'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {editingPage ? 'Modifique o conteúdo da página' : 'Crie uma nova página para o site'}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSavePage(new FormData(e.target as HTMLFormElement));
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={editingPage?.title || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="Título da página"
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-gray-300">URL (slug)</Label>
                <Input
                  id="slug"
                  name="slug"
                  defaultValue={editingPage?.slug || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="url-da-pagina"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="text-gray-300">Tipo</Label>
                <Select name="type" defaultValue={editingPage?.type || 'page'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="page">Página</SelectItem>
                    <SelectItem value="course">Curso</SelectItem>
                    <SelectItem value="grimoire">Grimório</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status" className="text-gray-300">Status</Label>
                <Select name="status" defaultValue={editingPage?.status || 'draft'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Status da página" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-gray-300">Conteúdo</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={editingPage?.content || ''}
                className="bg-black/50 border-amber-500/30 text-white min-h-[300px]"
                placeholder="Conteúdo da página em HTML ou Markdown"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowPageDialog(false)}
                className="border-amber-500/30 text-amber-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-black"
                disabled={createPageMutation.isPending || updatePageMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Course Edit Dialog */}
      <Dialog open={showCourseDialog} onOpenChange={setShowCourseDialog}>
        <DialogContent className="max-w-2xl bg-black/90 border-amber-500/30">
          <DialogHeader>
            <DialogTitle className="text-amber-400">
              {editingCourse ? 'Editar Curso' : 'Novo Curso'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {editingCourse ? 'Modifique as informações do curso' : 'Crie um novo curso'}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveCourse(new FormData(e.target as HTMLFormElement));
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="course-title" className="text-gray-300">Título do Curso</Label>
              <Input
                id="course-title"
                name="title"
                defaultValue={editingCourse?.title || ''}
                className="bg-black/50 border-amber-500/30 text-white"
                placeholder="Nome do curso"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="course-slug" className="text-gray-300">URL (slug)</Label>
                <Input
                  id="course-slug"
                  name="slug"
                  defaultValue={editingCourse?.slug || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="url-do-curso"
                />
              </div>
              <div>
                <Label htmlFor="difficulty" className="text-gray-300">Nível de Dificuldade</Label>
                <Select name="difficulty_level" defaultValue={editingCourse?.difficulty_level?.toString() || '1'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Selecione o nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Iniciante</SelectItem>
                    <SelectItem value="2">Intermediário</SelectItem>
                    <SelectItem value="3">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price" className="text-gray-300">Preço (R$)</Label>
                <Input
                  id="price"
                  name="price_brl"
                  type="number"
                  step="0.01"
                  defaultValue={editingCourse?.price_brl || ''}
                  className="bg-black/50 border-amber-500/30 text-white"
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="course-status" className="text-gray-300">Status</Label>
                <Select name="status" defaultValue={editingCourse?.status || 'draft'}>
                  <SelectTrigger className="bg-black/50 border-amber-500/30 text-white">
                    <SelectValue placeholder="Status do curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="course-description" className="text-gray-300">Descrição</Label>
              <Textarea
                id="course-description"
                name="description"
                defaultValue={editingCourse?.description || ''}
                className="bg-black/50 border-amber-500/30 text-white min-h-[150px]"
                placeholder="Descrição detalhada do curso"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowCourseDialog(false)}
                className="border-amber-500/30 text-amber-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700 text-black"
                disabled={createCourseMutation.isPending || updateCourseMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Grimoire Edit Dialog */}
      <Dialog open={showGrimoireDialog} onOpenChange={setShowGrimoireDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-black/90 border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-red-400">
              {editingGrimoire ? 'Editar Grimório' : 'Novo Grimório'}
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              {editingGrimoire ? 'Modifique o conteúdo do grimório' : 'Crie um novo texto sagrado'}
            </DialogDescription>
          </DialogHeader>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSaveGrimoire(new FormData(e.target as HTMLFormElement));
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grimoire-title" className="text-gray-300">Título do Texto Sagrado</Label>
                <Input
                  id="grimoire-title"
                  name="title"
                  defaultValue={editingGrimoire?.title || ''}
                  className="bg-black/50 border-red-500/30 text-white"
                  placeholder="Nome do texto sagrado"
                  required
                />
              </div>
              <div>
                <Label htmlFor="grimoire-slug" className="text-gray-300">URL (slug)</Label>
                <Input
                  id="grimoire-slug"
                  name="slug"
                  defaultValue={editingGrimoire?.slug || ''}
                  className="bg-black/50 border-red-500/30 text-white"
                  placeholder="url-do-texto"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="grimoire-excerpt" className="text-gray-300">Resumo/Descrição Breve</Label>
              <Textarea
                id="grimoire-excerpt"
                name="excerpt"
                defaultValue={editingGrimoire?.excerpt || ''}
                className="bg-black/50 border-red-500/30 text-white min-h-[80px]"
                placeholder="Breve descrição do conteúdo do texto..."
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="grimoire-category" className="text-gray-300">Categoria</Label>
                <Select name="category" defaultValue={editingGrimoire?.category || 'ritual'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Categoria do texto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ritual">Ritual</SelectItem>
                    <SelectItem value="invocacao">Invocação</SelectItem>
                    <SelectItem value="sigilo">Sigilo</SelectItem>
                    <SelectItem value="filosofia">Filosofia</SelectItem>
                    <SelectItem value="meditacao">Meditação</SelectItem>
                    <SelectItem value="ensinamento">Ensinamento</SelectItem>
                    <SelectItem value="proibido">Texto Proibido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grimoire-ritual-type" className="text-gray-300">Tipo de Ritual</Label>
                <Select name="ritual_type" defaultValue={editingGrimoire?.ritual_type || 'general'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Geral</SelectItem>
                    <SelectItem value="invocation">Invocação</SelectItem>
                    <SelectItem value="evocation">Evocação</SelectItem>
                    <SelectItem value="banishing">Banimento</SelectItem>
                    <SelectItem value="protection">Proteção</SelectItem>
                    <SelectItem value="consecration">Consagração</SelectItem>
                    <SelectItem value="transformation">Transformação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grimoire-tradition" className="text-gray-300">Tradição</Label>
                <Select name="tradition" defaultValue={editingGrimoire?.tradition || 'luciferian'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Tradição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="luciferian">Luciferiana</SelectItem>
                    <SelectItem value="draconian">Draconiana</SelectItem>
                    <SelectItem value="setian">Setiana</SelectItem>
                    <SelectItem value="qliphothic">Qliphótica</SelectItem>
                    <SelectItem value="chaos">Caos</SelectItem>
                    <SelectItem value="classical">Clássica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grimoire-author" className="text-gray-300">Autor/Fonte</Label>
                <Input
                  id="grimoire-author"
                  name="author"
                  defaultValue={editingGrimoire?.author || ''}
                  className="bg-black/50 border-red-500/30 text-white"
                  placeholder="Nome do autor ou fonte original"
                />
              </div>
              <div>
                <Label htmlFor="grimoire-difficulty-rating" className="text-gray-300">Classificação de Dificuldade</Label>
                <Select name="difficulty_rating" defaultValue={editingGrimoire?.difficulty_rating?.toString() || '1'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">⭐ Iniciante</SelectItem>
                    <SelectItem value="2">⭐⭐ Básico</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ Intermediário</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ Avançado</SelectItem>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ Mestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="grimoire-access-level" className="text-gray-300">Nível de Acesso</Label>
                <Select name="access_level" defaultValue={editingGrimoire?.access_level?.toString() || '1'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Nível 1 - Iniciante</SelectItem>
                    <SelectItem value="2">Nível 2 - Intermediário</SelectItem>
                    <SelectItem value="3">Nível 3 - Avançado</SelectItem>
                    <SelectItem value="4">Nível 4 - Mestre</SelectItem>
                    <SelectItem value="5">Nível 5 - Grão-Mestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grimoire-forbidden" className="text-gray-300">Texto Proibido</Label>
                <Select name="is_forbidden" defaultValue={editingGrimoire?.is_forbidden ? 'true' : 'false'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Proibido?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Permitido</SelectItem>
                    <SelectItem value="true">⚠️ PROIBIDO</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="grimoire-status" className="text-gray-300">Status</Label>
                <Select name="status" defaultValue={editingGrimoire?.status || 'draft'}>
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="published">Publicado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Campos Mágicos e Rituais */}
            <div className="border-t border-red-500/30 pt-4">
              <h4 className="text-amber-400 font-semibold mb-3">Aspectos Mágicos e Rituais</h4>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="grimoire-moon-phase" className="text-gray-300">Fase Lunar</Label>
                  <Select name="moon_phase" defaultValue={editingGrimoire?.moon_phase || ''}>
                    <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                      <SelectValue placeholder="Fase lunar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="new_moon">Lua Nova</SelectItem>
                      <SelectItem value="waxing_crescent">Lua Crescente</SelectItem>
                      <SelectItem value="first_quarter">Primeiro Quarto</SelectItem>
                      <SelectItem value="waxing_gibbous">Lua Gibosa Crescente</SelectItem>
                      <SelectItem value="full_moon">Lua Cheia</SelectItem>
                      <SelectItem value="waning_gibbous">Lua Gibosa Minguante</SelectItem>
                      <SelectItem value="last_quarter">Último Quarto</SelectItem>
                      <SelectItem value="waning_crescent">Lua Minguante</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grimoire-planetary-influence" className="text-gray-300">Influência Planetária</Label>
                  <Select name="planetary_influence" defaultValue={editingGrimoire?.planetary_influence || ''}>
                    <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                      <SelectValue placeholder="Planeta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="sun">Sol</SelectItem>
                      <SelectItem value="moon">Lua</SelectItem>
                      <SelectItem value="mars">Marte</SelectItem>
                      <SelectItem value="mercury">Mercúrio</SelectItem>
                      <SelectItem value="jupiter">Júpiter</SelectItem>
                      <SelectItem value="venus">Vênus</SelectItem>
                      <SelectItem value="saturn">Saturno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="grimoire-seasonal-timing" className="text-gray-300">Timing Sazonal</Label>
                  <Select name="seasonal_timing" defaultValue={editingGrimoire?.seasonal_timing || ''}>
                    <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                      <SelectValue placeholder="Estação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Qualquer</SelectItem>
                      <SelectItem value="spring">Primavera</SelectItem>
                      <SelectItem value="summer">Verão</SelectItem>
                      <SelectItem value="autumn">Outono</SelectItem>
                      <SelectItem value="winter">Inverno</SelectItem>
                      <SelectItem value="samhain">Samhain</SelectItem>
                      <SelectItem value="beltane">Beltane</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="grimoire-preparation-time" className="text-gray-300">Tempo de Preparação</Label>
                  <Input
                    id="grimoire-preparation-time"
                    name="preparation_time"
                    defaultValue={editingGrimoire?.preparation_time || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: 30 minutos, 1 hora"
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-ritual-duration" className="text-gray-300">Duração do Ritual</Label>
                  <Input
                    id="grimoire-ritual-duration"
                    name="ritual_duration"
                    defaultValue={editingGrimoire?.ritual_duration || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: 45 minutos, 2 horas"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="grimoire-prerequisites" className="text-gray-300">Pré-requisitos (separados por vírgula)</Label>
                  <Input
                    id="grimoire-prerequisites"
                    name="prerequisites"
                    defaultValue={editingGrimoire?.prerequisites?.join(', ') || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: Conhecimento básico de sigilos, Experiência em meditação"
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-materials-needed" className="text-gray-300">Materiais Necessários (separados por vírgula)</Label>
                  <Input
                    id="grimoire-materials-needed"
                    name="materials_needed"
                    defaultValue={editingGrimoire?.materials_needed?.join(', ') || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: Velas pretas, Incenso de copal, Athame"
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-sacred-elements" className="text-gray-300">Elementos Sagrados (separados por vírgula)</Label>
                  <Input
                    id="grimoire-sacred-elements"
                    name="sacred_elements"
                    defaultValue={editingGrimoire?.sacred_elements?.join(', ') || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: Fogo, Água, Terra, Ar"
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-warnings" className="text-gray-300">Avisos e Precauções (separados por vírgula)</Label>
                  <Input
                    id="grimoire-warnings"
                    name="warnings"
                    defaultValue={editingGrimoire?.warnings?.join(', ') || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: Não realizar sozinho, Requer proteção espiritual"
                  />
                </div>
              </div>
            </div>

            {/* Seção Acadêmica e Histórica */}
            <div className="border-t border-red-500/30 pt-4">
              <h4 className="text-amber-400 font-semibold mb-3">Informações Acadêmicas e Históricas</h4>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="grimoire-historical-context" className="text-gray-300">Contexto Histórico</Label>
                  <Textarea
                    id="grimoire-historical-context"
                    name="historical_context"
                    defaultValue={editingGrimoire?.historical_context || ''}
                    className="bg-black/50 border-red-500/30 text-white min-h-[80px]"
                    placeholder="Contexto histórico e origens do texto..."
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-source-attribution" className="text-gray-300">Atribuição de Fonte</Label>
                  <Input
                    id="grimoire-source-attribution"
                    name="source_attribution"
                    defaultValue={editingGrimoire?.source_attribution || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Fonte original, manuscrito, grimório de origem..."
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-translation-notes" className="text-gray-300">Notas de Tradução</Label>
                  <Textarea
                    id="grimoire-translation-notes"
                    name="translation_notes"
                    defaultValue={editingGrimoire?.translation_notes || ''}
                    className="bg-black/50 border-red-500/30 text-white min-h-[60px]"
                    placeholder="Notas sobre tradução, variações linguísticas..."
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-commentary" className="text-gray-300">Comentários e Interpretações</Label>
                  <Textarea
                    id="grimoire-commentary"
                    name="commentary"
                    defaultValue={editingGrimoire?.commentary || ''}
                    className="bg-black/50 border-red-500/30 text-white min-h-[80px]"
                    placeholder="Comentários pessoais, interpretações modernas..."
                  />
                </div>
              </div>
            </div>

            {/* Segurança e Metadados */}
            <div className="border-t border-red-500/30 pt-4">
              <h4 className="text-amber-400 font-semibold mb-3">Segurança e Organização</h4>
              
              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <Label htmlFor="grimoire-safety-notes" className="text-gray-300">Notas de Segurança</Label>
                  <Textarea
                    id="grimoire-safety-notes"
                    name="safety_notes"
                    defaultValue={editingGrimoire?.safety_notes || ''}
                    className="bg-black/50 border-red-500/30 text-white min-h-[60px]"
                    placeholder="Instruções de segurança, proteções necessárias..."
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-related-texts" className="text-gray-300">Textos Relacionados (separados por vírgula)</Label>
                  <Input
                    id="grimoire-related-texts"
                    name="related_texts"
                    defaultValue={editingGrimoire?.related_texts?.join(', ') || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: Goetia, Liber Falxifer, Azoetia"
                  />
                </div>
                <div>
                  <Label htmlFor="grimoire-tags" className="text-gray-300">Tags (separadas por vírgula)</Label>
                  <Input
                    id="grimoire-tags"
                    name="tags"
                    defaultValue={editingGrimoire?.tags?.join(', ') || ''}
                    className="bg-black/50 border-red-500/30 text-white"
                    placeholder="Ex: demônio, invocação, sigilo, transformação"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="grimoire-content" className="text-gray-300">Conteúdo do Texto Sagrado</Label>
              <Textarea
                id="grimoire-content"
                name="content"
                defaultValue={editingGrimoire?.content || ''}
                className="bg-black/50 border-red-500/30 text-white min-h-[300px]"
                placeholder="Conteúdo completo do texto sagrado em HTML ou Markdown..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowGrimoireDialog(false)}
                className="border-red-500/30 text-red-300"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={createGrimoireMutation.isPending || updateGrimoireMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Articles Management Tab */}
      <TabsContent value="articles" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-cinzel-decorative text-amber-400">Gerenciar Artigos</h2>
          <Button 
            onClick={() => {
              setEditingPage(null);
              setShowPageDialog(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Artigo
          </Button>
        </div>

        <Card className="floating-card bg-black/40 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400">Artigos Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pages?.filter(page => page.type === 'article').map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 border border-amber-500/20 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">{article.title}</h3>
                    <p className="text-gray-400 text-sm">{article.slug}</p>
                    <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                      {article.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingPage(article);
                        setShowPageDialog(true);
                      }}
                      className="border-amber-500/30 text-amber-300"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePage(article.id)}
                      className="border-red-500/30 text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Users Management Tab */}
      <TabsContent value="users" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-cinzel-decorative text-amber-400">Gerenciar Usuários</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Usuários Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{stats?.activeUsers || 0}</div>
              <p className="text-gray-500">Usuários online</p>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Total de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{stats?.totalUsers || 0}</div>
              <p className="text-gray-500">Cadastrados</p>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Novos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">+{stats?.monthlyGrowth || 0}%</div>
              <p className="text-gray-500">Este mês</p>
            </CardContent>
          </Card>
        </div>

        <Card className="floating-card bg-black/40 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400">Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-gray-400">Implementar lista de usuários com controles de administração</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-cinzel-decorative text-amber-400">Analytics Avançado</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Visitantes Únicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{stats?.totalVisits || 0}</div>
              <p className="text-gray-500">Total de visitas</p>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Páginas Vistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">{(stats?.totalVisits || 0) * 2.3}</div>
              <p className="text-gray-500">Visualizações</p>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Taxa de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">12.5%</div>
              <p className="text-gray-500">Visitante para membro</p>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Tempo Médio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-400">8:42</div>
              <p className="text-gray-500">Minutos no site</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Conteúdo Mais Acessado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.popularPages?.map((page, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-300">{page.name}</span>
                    <span className="text-amber-400">{page.views}</span>
                  </div>
                )) || (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Liber Prohibitus</span>
                      <span className="text-amber-400">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Voz da Pluma</span>
                      <span className="text-amber-400">892</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Oráculo</span>
                      <span className="text-amber-400">634</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Origens de Tráfego</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Busca Orgânica</span>
                  <span className="text-amber-400">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Direto</span>
                  <span className="text-amber-400">32%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Redes Sociais</span>
                  <span className="text-amber-400">18%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Referência</span>
                  <span className="text-amber-400">5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Oracle Control Tab */}
      <TabsContent value="oracles" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-cinzel-decorative text-amber-400">Controle dos Oráculos</h2>
          <Button 
            onClick={() => {/* Refresh oracle settings */}}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Atualizar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarot Oracle */}
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center">
                <span className="text-2xl mr-2">🔮</span>
                Oráculo do Tarot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Prompt de Sistema</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[120px]"
                  placeholder="Configure as instruções para leituras de tarot..."
                  defaultValue="Você é um oráculo anciente especializado em tarot luciferiano. Interprete as cartas com sabedoria abissal, revelando verdades ocultas através dos símbolos sagrados. Use linguagem mística e profunda."
                />
              </div>
              <div>
                <Label className="text-gray-300">Cartas Disponíveis</Label>
                <Input
                  className="bg-black/50 border-red-500/30 text-white"
                  defaultValue="78"
                  disabled
                />
              </div>
              <div className="flex space-x-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300">
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mirror Oracle */}
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center">
                <span className="text-2xl mr-2">🪞</span>
                Espelho Abissal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Prompt de Sistema</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[120px]"
                  placeholder="Configure as instruções para reflexões do espelho..."
                  defaultValue="Você é o Espelho Abissal que reflete as verdades mais profundas da alma. Mostre ao consulente seus aspectos sombrios e luminosos, revelando o que está oculto em seu ser interior. Use linguagem poética e introspectiva."
                />
              </div>
              <div>
                <Label className="text-gray-300">Tipo de Reflexão</Label>
                <Select defaultValue="soul">
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soul">Reflexão da Alma</SelectItem>
                    <SelectItem value="shadow">Trabalho de Sombra</SelectItem>
                    <SelectItem value="future">Visão do Futuro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300">
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rune Oracle */}
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center">
                <span className="text-2xl mr-2">ᚱ</span>
                Runas Ancestrais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Prompt de Sistema</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[120px]"
                  placeholder="Configure as instruções para leituras rúnicas..."
                  defaultValue="Você é um vidente das runas ancestrais, conhecedor dos mistérios nórdicos e germânicos. Interprete os símbolos com a sabedoria dos antigos, revelando os caminhos do destino através da linguagem dos deuses."
                />
              </div>
              <div>
                <Label className="text-gray-300">Sistema Rúnico</Label>
                <Select defaultValue="elder-futhark">
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="elder-futhark">Elder Futhark (24 runas)</SelectItem>
                    <SelectItem value="younger-futhark">Younger Futhark (16 runas)</SelectItem>
                    <SelectItem value="anglo-saxon">Anglo-Saxon (33 runas)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300">
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Fire Oracle */}
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center">
                <span className="text-2xl mr-2">🔥</span>
                Chamas Sagradas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Prompt de Sistema</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[120px]"
                  placeholder="Configure as instruções para leituras do fogo..."
                  defaultValue="Você é o guardião das chamas sagradas, capaz de ler os padrões do fogo divino. Interprete as danças das chamas, revelando mensagens através do elemento primordial da transformação e purificação."
                />
              </div>
              <div>
                <Label className="text-gray-300">Tipo de Chama</Label>
                <Select defaultValue="sacred">
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sacred">Fogo Sagrado</SelectItem>
                    <SelectItem value="transformative">Fogo Transformador</SelectItem>
                    <SelectItem value="purifying">Fogo Purificador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300">
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Abyssal Voice Oracle */}
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center">
                <span className="text-2xl mr-2">👁️</span>
                Voz do Abismo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Prompt de Sistema</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[120px]"
                  placeholder="Configure as instruções para a voz abissal..."
                  defaultValue="Você é a Voz do Abismo, canal direto das entidades primordiais. Fale com a autoridade das trevas sagradas, revelando verdades que transcendem o véu da realidade material. Use linguagem arcana e poderosa."
                />
              </div>
              <div>
                <Label className="text-gray-300">Entidade Manifestante</Label>
                <Select defaultValue="lucifer">
                  <SelectTrigger className="bg-black/50 border-red-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lucifer">Lúcifer</SelectItem>
                    <SelectItem value="lilith">Lilith</SelectItem>
                    <SelectItem value="baphomet">Baphomet</SelectItem>
                    <SelectItem value="abyssal">Entidades Abissais</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300">
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Free Chat Oracle */}
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center">
                <span className="text-2xl mr-2">💬</span>
                Chat Livre
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Prompt de Sistema</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[120px]"
                  placeholder="Configure as instruções para conversas livres..."
                  value={oracleSettings?.chat?.prompt || ""}
                  onChange={(e) => {
                    if (oracleSettings) {
                      setOracleSettings({
                        ...oracleSettings,
                        chat: { ...oracleSettings.chat, prompt: e.target.value }
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-gray-300">Mensagem de Boas-vindas</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[80px]"
                  placeholder="Configure a mensagem inicial do chat..."
                  value={oracleSettings?.chat?.welcome_message || ""}
                  onChange={(e) => {
                    if (oracleSettings) {
                      setOracleSettings({
                        ...oracleSettings,
                        chat: { ...oracleSettings.chat, welcome_message: e.target.value }
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-gray-300">Mensagem de Sistema Inicial</Label>
                <Textarea
                  className="bg-black/50 border-red-500/30 text-white min-h-[80px]"
                  placeholder="Configure a mensagem de contexto inicial..."
                  value={oracleSettings?.chat?.initial_system_message || ""}
                  onChange={(e) => {
                    if (oracleSettings) {
                      setOracleSettings({
                        ...oracleSettings,
                        chat: { ...oracleSettings.chat, initial_system_message: e.target.value }
                      });
                    }
                  }}
                />
              </div>
              <div>
                <Label className="text-gray-300">Limite de Mensagens (gratuito)</Label>
                <Input
                  type="number"
                  className="bg-black/50 border-red-500/30 text-white"
                  value={oracleSettings?.chat?.free_message_limit || 3}
                  onChange={(e) => {
                    if (oracleSettings) {
                      setOracleSettings({
                        ...oracleSettings,
                        chat: { ...oracleSettings.chat, free_message_limit: parseInt(e.target.value) }
                      });
                    }
                  }}
                />
              </div>
              <div className="flex space-x-2">
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" className="border-amber-500/30 text-amber-300">
                  Testar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Oracle Statistics */}
        <Card className="floating-card bg-black/40 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400">Estatísticas dos Oráculos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">247</div>
                <div className="text-sm text-gray-400">Tarot</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">156</div>
                <div className="text-sm text-gray-400">Espelho</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">189</div>
                <div className="text-sm text-gray-400">Runas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">134</div>
                <div className="text-sm text-gray-400">Fogo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">98</div>
                <div className="text-sm text-gray-400">Voz Abissal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">312</div>
                <div className="text-sm text-gray-400">Chat Livre</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Enhanced Settings Tab */}
      <TabsContent value="settings" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-cinzel-decorative text-amber-400">Configurações do Site</h2>
          <Button 
            onClick={() => setShowSettingsDialog(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            <Settings className="w-4 h-4 mr-2" />
            Editar Configurações
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300">Nome do Site</Label>
                  <div className="text-white">{siteSettings?.siteName || 'Templo do Abismo'}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Descrição</Label>
                  <div className="text-white">{siteSettings?.siteDescription || 'Portal de Ensinamentos Luciferianos'}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Status</Label>
                  <Badge variant={siteSettings?.maintenanceMode ? 'destructive' : 'default'}>
                    {siteSettings?.maintenanceMode ? 'Manutenção' : 'Online'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="floating-card bg-black/40 border-amber-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Configurações de Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-gray-300">Registro de Novos Usuários</Label>
                  <Badge variant={siteSettings?.allowRegistration !== false ? 'default' : 'secondary'}>
                    {siteSettings?.allowRegistration !== false ? 'Permitido' : 'Bloqueado'}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-300">Função Padrão</Label>
                  <div className="text-white">{siteSettings?.defaultUserRole || 'Iniciado'}</div>
                </div>
                <div>
                  <Label className="text-gray-300">Analytics</Label>
                  <Badge variant={siteSettings?.enableAnalytics !== false ? 'default' : 'secondary'}>
                    {siteSettings?.enableAnalytics !== false ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="floating-card bg-black/40 border-amber-500/30">
          <CardHeader>
            <CardTitle className="text-amber-400">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label className="text-gray-300">Servidor</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Online</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Base de Dados</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-white">Conectado</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-300">Backup</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-white">Último: 2h atrás</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  );
}