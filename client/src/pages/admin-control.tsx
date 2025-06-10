import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Users, 
  FileText, 
  BookOpen, 
  Settings, 
  Upload, 
  Download,
  Save,
  TestTube,
  Wand2,
  Gem,
  Flame,
  Eye,
  Scroll,
  MessageCircle,
  Shield,
  Zap,
  Star,
  Moon,
  Sun,
  Database,
  Server,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Wifi,
  Globe,
  Lock,
  Key,
  UserCheck,
  Calendar,
  TrendingUp,
  PieChart,
  DollarSign,
  CreditCard,

  ArrowUp,
  ArrowDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Layers,
  Package,
  Cloud,
  CloudRain,
  Sparkles,
  Feather
} from 'lucide-react';

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

interface OracleSettings {
  id: number;
  oracle_type: string;
  display_name: string;
  ai_prompt: string;
  initial_message: string;
  welcome_text: string;
  is_enabled: boolean;
  requires_premium: boolean;
  max_daily_consultations: number;
  consultation_cooldown_minutes: number;
  custom_instructions: string;
  ai_temperature: number;
  response_style: string;
  mystical_elements: string[];
  ritual_components: string[];
  sacred_timing: string;
  energy_alignment: string;
  spiritual_guidance: string;
  divination_method: string;
  interpretation_style: string;
  entity_invocation: string;
  created_at: string;
  updated_at: string;
}

export default function AdminControl() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedGrimoire, setSelectedGrimoire] = useState<Grimoire | null>(null);
  const [testingOracle, setTestingOracle] = useState<string | null>(null);
  const [oracleSettings, setOracleSettings] = useState<OracleSettings[]>([]);
  const [selectedOracle, setSelectedOracle] = useState<OracleSettings | null>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
  });

  const { data: pages } = useQuery({
    queryKey: ['/api/admin/pages'],
  });

  const { data: courses } = useQuery({
    queryKey: ['/api/admin/courses'],
  });

  const { data: grimoires } = useQuery({
    queryKey: ['/api/admin/grimoires'],
  });

  const { data: users } = useQuery({
    queryKey: ['/api/admin/users'],
  });

  const { data: oracleSettingsData } = useQuery({
    queryKey: ['/api/admin/oracle-settings'],
    select: (data) => data || []
  });

  const { data: siteSettings } = useQuery({
    queryKey: ['/api/admin/site-settings'],
  });

  // Mutations
  const savePageMutation = useMutation({
    mutationFn: async (page: Partial<Page>) => {
      if (page.id) {
        return await apiRequest('PUT', `/api/admin/pages/${page.id}`, page);
      } else {
        return await apiRequest('POST', '/api/admin/pages', page);
      }
    },
    onSuccess: () => {
      toast({ title: 'Página salva com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      setSelectedPage(null);
    },
  });

  const saveCourseMutation = useMutation({
    mutationFn: async (course: Partial<Course>) => {
      if (course.id) {
        return await apiRequest('PUT', `/api/admin/courses/${course.id}`, course);
      } else {
        return await apiRequest('POST', '/api/admin/courses', course);
      }
    },
    onSuccess: () => {
      toast({ title: 'Curso salvo com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      setSelectedCourse(null);
    },
  });

  const saveGrimoireMutation = useMutation({
    mutationFn: async (grimoire: Partial<Grimoire>) => {
      if (grimoire.id) {
        return await apiRequest('PUT', `/api/admin/grimoires/${grimoire.id}`, grimoire);
      } else {
        return await apiRequest('POST', '/api/admin/grimoires', grimoire);
      }
    },
    onSuccess: () => {
      toast({ title: 'Grimório salvo com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/grimoires'] });
      setSelectedGrimoire(null);
    },
  });

  const saveOracleSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<OracleSettings>) => {
      return await apiRequest('PUT', `/api/admin/oracle-settings/${settings.oracle_type}`, settings);
    },
    onSuccess: () => {
      toast({ title: 'Configurações do oráculo salvas com sucesso!' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/oracle-settings'] });
    },
  });

  const testOracleMutation = useMutation({
    mutationFn: async ({ type, prompt }: { type: string; prompt: string }) => {
      return await apiRequest('POST', '/api/admin/test-oracle', { type, prompt });
    },
    onSuccess: (response) => {
      toast({ 
        title: 'Teste do oráculo bem-sucedido!', 
        description: `Resposta: ${response.result.substring(0, 100)}...` 
      });
    },
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

  const handleSavePage = (formData: FormData) => {
    const pageData = {
      title: formData.get('title') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      type: formData.get('type') as 'course' | 'grimoire' | 'page',
      status: formData.get('status') as 'draft' | 'published',
      meta_description: formData.get('meta_description') as string,
      featured_image: formData.get('featured_image') as string,
    };
    
    if (selectedPage) {
      (pageData as any).id = selectedPage.id;
    }
    
    savePageMutation.mutate(pageData);
  };

  const handleSaveCourse = (formData: FormData) => {
    const courseData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      slug: formData.get('slug') as string,
      content: formData.get('content') as string,
      difficulty_level: parseInt(formData.get('difficulty_level') as string),
      price_brl: formData.get('price_brl') as string,
      duration_hours: parseInt(formData.get('duration_hours') as string),
      status: formData.get('status') as 'draft' | 'published',
    };
    
    if (selectedCourse) {
      (courseData as any).id = selectedCourse.id;
    }
    
    saveCourseMutation.mutate(courseData);
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
    };
    
    if (selectedGrimoire) {
      (grimoireData as any).id = selectedGrimoire.id;
    }
    
    saveGrimoireMutation.mutate(grimoireData);
  };

  useEffect(() => {
    if (oracleSettingsData) {
      setOracleSettings(oracleSettingsData as OracleSettings[]);
    }
  }, [oracleSettingsData]);

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
              <TabsTrigger value="oracles" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Gem className="w-4 h-4 mr-1" />
                Oráculos
              </TabsTrigger>
              <TabsTrigger value="users" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Users className="w-4 h-4 mr-1" />
                Usuários
              </TabsTrigger>
              <TabsTrigger value="voz-pluma" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Feather className="w-4 h-4 mr-1" />
                Voz da Pluma
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-300">
                <Settings className="w-4 h-4 mr-1" />
                Configurações
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black/40 border border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-300">Total de Usuários</CardTitle>
                    <Users className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{(stats as any)?.totalUsers || 0}</div>
                    <p className="text-xs text-gray-400">+{(stats as any)?.monthlyGrowth || 0}% este mês</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-300">Cursos Ativos</CardTitle>
                    <BookOpen className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{(stats as any)?.totalCourses || 0}</div>
                    <p className="text-xs text-gray-400">Disponíveis na plataforma</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-300">Grimórios</CardTitle>
                    <Scroll className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{(stats as any)?.totalGrimoires || 0}</div>
                    <p className="text-xs text-gray-400">Textos sagrados catalogados</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border border-amber-500/20">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-amber-300">Receita Total</CardTitle>
                    <DollarSign className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">R$ {(stats as any)?.totalRevenue || '0,00'}</div>
                    <p className="text-xs text-gray-400">Este mês</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/40 border border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-amber-300">Páginas Populares</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(stats as any)?.popularPages?.map((page: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white text-sm">{page.name}</span>
                          <Badge variant="secondary" className="bg-amber-600/20 text-amber-300">
                            {page.views} visualizações
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border border-amber-500/20">
                  <CardHeader>
                    <CardTitle className="text-amber-300">Atividade Recente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(stats as any)?.recentActivity?.map((activity: any, index: number) => (
                        <div key={index} className="flex flex-col space-y-1">
                          <span className="text-white text-sm">{activity.action}</span>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>{activity.user}</span>
                            <span>{activity.timestamp}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Oracles Tab */}
            <TabsContent value="oracles" className="space-y-6">
              <Card className="bg-black/40 border border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-amber-300 flex items-center">
                    <Gem className="w-5 h-5 mr-2" />
                    Controle dos Sistemas Oraculares
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {oracleSettings.map((oracle) => (
                      <Card key={oracle.oracle_type} className="bg-black/20 border border-amber-500/10">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-amber-400 flex items-center">
                              {oracle.oracle_type === 'tarot' && <Wand2 className="w-4 h-4 mr-2" />}
                              {oracle.oracle_type === 'mirror' && <Eye className="w-4 h-4 mr-2" />}
                              {oracle.oracle_type === 'runes' && <Shield className="w-4 h-4 mr-2" />}
                              {oracle.oracle_type === 'fire' && <Flame className="w-4 h-4 mr-2" />}
                              {oracle.oracle_type === 'voice' && <MessageCircle className="w-4 h-4 mr-2" />}
                              {oracle.oracle_type === 'chat' && <MessageCircle className="w-4 h-4 mr-2" />}
                              {oracle.display_name}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={oracle.is_enabled}
                                onCheckedChange={(checked) => {
                                  const updatedOracle = { ...oracle, is_enabled: checked };
                                  saveOracleSettings(updatedOracle);
                                }}
                              />
                              <span className="text-sm text-gray-400">
                                {oracle.is_enabled ? 'Ativo' : 'Inativo'}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-300">Prompt de IA Personalizado</Label>
                                <Textarea
                                  className="bg-black/40 border-amber-500/20 text-white mt-1"
                                  rows={4}
                                  value={oracle.ai_prompt}
                                  onChange={(e) => {
                                    const updatedOracle = { ...oracle, ai_prompt: e.target.value };
                                    setOracleSettings(prev => 
                                      prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                    );
                                  }}
                                  placeholder="Instruções específicas para a IA..."
                                />
                              </div>
                              
                              <div>
                                <Label className="text-gray-300">Mensagem de Boas-vindas</Label>
                                <Textarea
                                  className="bg-black/40 border-amber-500/20 text-white mt-1"
                                  rows={3}
                                  value={oracle.welcome_text}
                                  onChange={(e) => {
                                    const updatedOracle = { ...oracle, welcome_text: e.target.value };
                                    setOracleSettings(prev => 
                                      prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                    );
                                  }}
                                  placeholder="Texto inicial para o usuário..."
                                />
                              </div>

                              <div>
                                <Label className="text-gray-300">Mensagem Inicial do Chat</Label>
                                <Textarea
                                  className="bg-black/40 border-amber-500/20 text-white mt-1"
                                  rows={3}
                                  value={oracle.initial_message}
                                  onChange={(e) => {
                                    const updatedOracle = { ...oracle, initial_message: e.target.value };
                                    setOracleSettings(prev => 
                                      prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                    );
                                  }}
                                  placeholder="Primeira mensagem que aparece no chat..."
                                />
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label className="text-gray-300">Instruções Customizadas</Label>
                                <Textarea
                                  className="bg-black/40 border-amber-500/20 text-white mt-1"
                                  rows={4}
                                  value={oracle.custom_instructions}
                                  onChange={(e) => {
                                    const updatedOracle = { ...oracle, custom_instructions: e.target.value };
                                    setOracleSettings(prev => 
                                      prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                    );
                                  }}
                                  placeholder="Instruções específicas do ritual..."
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-300">Temperatura da IA</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    className="bg-black/40 border-amber-500/20 text-white mt-1"
                                    value={oracle.ai_temperature}
                                    onChange={(e) => {
                                      const updatedOracle = { ...oracle, ai_temperature: parseFloat(e.target.value) };
                                      setOracleSettings(prev => 
                                        prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                      );
                                    }}
                                  />
                                </div>

                                <div>
                                  <Label className="text-gray-300">Máx. Consultas/Dia</Label>
                                  <Input
                                    type="number"
                                    className="bg-black/40 border-amber-500/20 text-white mt-1"
                                    value={oracle.max_daily_consultations}
                                    onChange={(e) => {
                                      const updatedOracle = { ...oracle, max_daily_consultations: parseInt(e.target.value) };
                                      setOracleSettings(prev => 
                                        prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                      );
                                    }}
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-gray-300">Requer Premium</Label>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Switch 
                                    checked={oracle.requires_premium}
                                    onCheckedChange={(checked) => {
                                      const updatedOracle = { ...oracle, requires_premium: checked };
                                      setOracleSettings(prev => 
                                        prev.map(o => o.oracle_type === oracle.oracle_type ? updatedOracle : o)
                                      );
                                    }}
                                  />
                                  <span className="text-sm text-gray-400">
                                    {oracle.requires_premium ? 'Sim' : 'Não'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator className="bg-amber-500/20" />

                          <div className="flex justify-between">
                            <Button
                              onClick={() => saveOracleSettings(oracle)}
                              disabled={saveOracleSettingsMutation.isPending}
                              className="bg-amber-600 hover:bg-amber-700 text-black"
                            >
                              <Save className="w-4 h-4 mr-2" />
                              Salvar Configurações
                            </Button>

                            <Button
                              onClick={() => testOracle(oracle.oracle_type, oracle.ai_prompt)}
                              disabled={testingOracle === oracle.oracle_type}
                              variant="outline"
                              className="border-amber-500/20 text-amber-300 hover:bg-amber-600/20"
                            >
                              <TestTube className="w-4 h-4 mr-2" />
                              {testingOracle === oracle.oracle_type ? 'Testando...' : 'Testar Oráculo'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="bg-black/40 border border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-amber-300">Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label className="text-gray-300">Status</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-white">Online</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Uptime</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-white">99.9%</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-gray-300">Uso de Memória</Label>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-white">78%</span>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
}