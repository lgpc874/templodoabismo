import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createDirectSupabaseClient } from "@/lib/supabase-direct";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Shield, 
  Users, 
  BookOpen, 
  ScrollText, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Image,
  Globe,
  Palette,
  Database,
  Mail,
  MessageSquare,
  CreditCard,
  Bell,
  Lock,
  Upload,
  Download,
  RefreshCw,
  Save,
  AlertTriangle
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalGrimoires: number;
  totalPages: number;
  totalConsultations: number;
  totalRevenue: number;
  activeUsers: number;
  pendingContent: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  member_type: string;
  created_at: string;
  initiation_level: number;
  is_active: boolean;
  last_login: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  status: string;
  level: number;
  created_at: string;
  price: number;
  category: string;
  is_featured: boolean;
}

interface Grimoire {
  id: number;
  title: string;
  description: string;
  status: string;
  access_level: string;
  created_at: string;
  price: number;
  is_featured: boolean;
}

interface SitePage {
  id: number;
  title: string;
  slug: string;
  content: string;
  status: string;
  is_published: boolean;
  created_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  featured_image: string;
  created_at: string;
  author: string;
}

interface SiteSettings {
  id: number;
  key: string;
  value: string;
  description: string;
  type: string;
}

export default function AdminPanel() {
  const [, setLocation] = useLocation();
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data states
  const [stats, setStats] = useState<AdminStats>({ 
    totalUsers: 0, totalCourses: 0, totalGrimoires: 0, totalPages: 0,
    totalConsultations: 0, totalRevenue: 0, activeUsers: 0, pendingContent: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grimoires, setGrimoires] = useState<Grimoire[]>([]);
  const [pages, setPages] = useState<SitePage[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([]);
  
  // UI states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSettings, setEditingSettings] = useState<{[key: string]: string}>({});
  
  // Form states
  const [newCourse, setNewCourse] = useState({
    title: '', description: '', level: 1, price: 0, category: '', status: 'draft'
  });
  const [newGrimoire, setNewGrimoire] = useState({
    title: '', description: '', access_level: 'basic', price: 0, status: 'draft'
  });
  const [newPage, setNewPage] = useState({
    title: '', slug: '', content: '', status: 'draft'
  });
  const [newBlogPost, setNewBlogPost] = useState({
    title: '', content: '', excerpt: '', status: 'draft', featured_image: ''
  });
  
  const { toast } = useToast();

  // Initialize Supabase and check auth
  useEffect(() => {
    async function initializeAdmin() {
      try {
        const client = await createDirectSupabaseClient();
        setSupabaseClient(client);

        // Check if user is authenticated
        const { data: { user } } = await client.auth.getUser();
        
        if (!user) {
          setLocation('/admin-login');
          return;
        }

        // Verify admin role
        const { data: userData, error } = await client
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single();

        if (error || !userData || userData.role !== 'admin') {
          toast({
            title: "Acesso Negado",
            description: "Você não tem permissão para acessar este painel.",
            variant: "destructive",
          });
          setLocation('/admin-login');
          return;
        }

        setCurrentUser(userData);
        await loadData(client);
      } catch (error) {
        console.error('Erro ao inicializar admin:', error);
        setLocation('/admin-login');
      } finally {
        setLoading(false);
      }
    }

    initializeAdmin();
  }, []);

  const loadData = async (client: any) => {
    try {
      // Load stats
      const [usersResult, coursesResult, grimoiresResult, pagesResult] = await Promise.all([
        client.from('users').select('id', { count: 'exact' }),
        client.from('educational_courses').select('id', { count: 'exact' }),
        client.from('sacred_grimoires').select('id', { count: 'exact' }),
        client.from('site_pages').select('id', { count: 'exact' })
      ]);

      // Load additional stats
      const [consultationsResult, revenueResult] = await Promise.all([
        client.from('oracle_consultations').select('id', { count: 'exact' }),
        client.from('tkazh_transactions').select('amount')
      ]);

      const totalRevenue = revenueResult.data?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;
      
      setStats({
        totalUsers: usersResult.count || 0,
        totalCourses: coursesResult.count || 0,
        totalGrimoires: grimoiresResult.count || 0,
        totalPages: pagesResult.count || 0,
        totalConsultations: consultationsResult.count || 0,
        totalRevenue,
        activeUsers: Math.floor((usersResult.count || 0) * 0.3), // Estimate
        pendingContent: 0
      });

      // Load users
      const { data: usersData } = await client
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setUsers(usersData || []);

      // Load courses
      const { data: coursesData } = await client
        .from('educational_courses')
        .select('*')
        .order('created_at', { ascending: false });
      setCourses(coursesData || []);

      // Load grimoires
      const { data: grimoiresData } = await client
        .from('sacred_grimoires')
        .select('*')
        .order('created_at', { ascending: false });
      setGrimoires(grimoiresData || []);

    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados do painel.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    if (supabaseClient) {
      await supabaseClient.auth.signOut();
    }
    setLocation('/admin-login');
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabaseClient
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Role do usuário atualizada com sucesso.",
      });

      // Reload users
      await loadData(supabaseClient);
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar role do usuário.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-white text-xl">Carregando painel administrativo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-xl font-bold text-white">Painel Administrativo</h1>
                <p className="text-sm text-gray-300">Bem-vindo, {currentUser?.username || currentUser?.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-lg">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="w-4 h-4 mr-2" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-600">
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="grimoires" className="data-[state=active]:bg-purple-600">
              <ScrollText className="w-4 h-4 mr-2" />
              Grimórios
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-600">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total de Cursos</CardTitle>
                  <BookOpen className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalCourses}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total de Grimórios</CardTitle>
                  <ScrollText className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalGrimoires}</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total de Páginas</CardTitle>
                  <Eye className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stats.totalPages}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Gerenciar Usuários</CardTitle>
                <CardDescription className="text-gray-300">
                  Lista de todos os usuários registrados no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/10">
                      <div className="flex-1">
                        <div className="font-medium text-white">{user.username || user.email}</div>
                        <div className="text-sm text-gray-400">{user.email}</div>
                        <div className="text-xs text-gray-500">
                          Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'admin' ? 'bg-red-500/20 text-red-400' :
                          user.role === 'moderator' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {user.role}
                        </span>
                        <Select
                          value={user.role}
                          onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                        >
                          <SelectTrigger className="w-32 bg-black/20 border-purple-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Gerenciar Cursos</CardTitle>
                <CardDescription className="text-gray-300">
                  Lista de todos os cursos educacionais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/10">
                      <div className="flex-1">
                        <div className="font-medium text-white">{course.title}</div>
                        <div className="text-sm text-gray-400">{course.description}</div>
                        <div className="text-xs text-gray-500">
                          Nível: {course.level} | Status: {course.status}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-500/30">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grimoires Tab */}
          <TabsContent value="grimoires" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Gerenciar Grimórios</CardTitle>
                <CardDescription className="text-gray-300">
                  Lista de todos os grimórios sagrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grimoires.map((grimoire) => (
                    <div key={grimoire.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/10">
                      <div className="flex-1">
                        <div className="font-medium text-white">{grimoire.title}</div>
                        <div className="text-sm text-gray-400">{grimoire.description}</div>
                        <div className="text-xs text-gray-500">
                          Acesso: {grimoire.access_level} | Status: {grimoire.status}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-500/30">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500/30 text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-lg border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Configurações do Sistema</CardTitle>
                <CardDescription className="text-gray-300">
                  Configurações gerais da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-yellow-500/50 bg-yellow-500/10">
                    <Settings className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-400">
                      Configurações avançadas serão implementadas em breve.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}