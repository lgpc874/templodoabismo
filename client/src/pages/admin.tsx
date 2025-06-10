import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  FileText, 
  BookOpen, 
  Settings, 
  BarChart3, 
  PlusCircle, 
  Edit, 
  Trash2, 
  Send,
  Upload,
  Eye
} from 'lucide-react';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingPage, setEditingPage] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [voxSettings, setVoxSettings] = useState({
    interval: 3600,
    auto_enabled: true,
    custom_prompt: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: stats } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: () => apiRequest('GET', '/api/admin/stats')
  });

  const { data: pages } = useQuery({
    queryKey: ['/api/admin/pages'],
    queryFn: () => apiRequest('GET', '/api/admin/pages')
  });

  const { data: courses } = useQuery({
    queryKey: ['/api/admin/courses'],
    queryFn: () => apiRequest('GET', '/api/admin/courses')
  });

  const { data: voxSettingsData } = useQuery({
    queryKey: ['/api/admin/voz-pluma/settings'],
    queryFn: () => apiRequest('/api/admin/voz-pluma/settings')
  });

  // Mutations
  const createPageMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/pages', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: 'Página criada com sucesso!' });
      setEditingPage(null);
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest(`/api/admin/pages/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: 'Página atualizada com sucesso!' });
      setEditingPage(null);
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/pages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({ title: 'Página excluída com sucesso!' });
    }
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/admin/courses', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({ title: 'Curso criado com sucesso!' });
      setEditingCourse(null);
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, data }: any) => apiRequest(`/api/admin/courses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({ title: 'Curso atualizado com sucesso!' });
      setEditingCourse(null);
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/courses'] });
      toast({ title: 'Curso excluído com sucesso!' });
    }
  });

  const publishVoxMutation = useMutation({
    mutationFn: (prompt?: string) => apiRequest('/api/admin/voz-pluma/publish-now', { custom_prompt: prompt }),
    onSuccess: () => {
      toast({ title: 'Conteúdo da Voz da Pluma publicado!' });
    }
  });

  const updateVoxSettingsMutation = useMutation({
    mutationFn: (settings: any) => apiRequest('/api/admin/voz-pluma/settings', settings),
    onSuccess: () => {
      toast({ title: 'Configurações da Voz da Pluma atualizadas!' });
    }
  });

  // Load Vox settings
  useEffect(() => {
    if (voxSettingsData) {
      setVoxSettings({
        interval: voxSettingsData.voz_pluma_interval || 3600,
        auto_enabled: voxSettingsData.voz_pluma_auto || true,
        custom_prompt: voxSettingsData.voz_pluma_prompt || ''
      });
    }
  }, [voxSettingsData]);

  const handlePageSubmit = (formData: FormData) => {
    const data = {
      title: formData.get('title'),
      content: formData.get('content'),
      status: formData.get('status'),
      featured_image: formData.get('featured_image')
    };

    if (editingPage?.id) {
      updatePageMutation.mutate({ id: editingPage.id, data });
    } else {
      createPageMutation.mutate(data);
    }
  };

  const handleCourseSubmit = (formData: FormData) => {
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      long_description: formData.get('long_description'),
      price: parseFloat(formData.get('price') as string) || 0,
      level: formData.get('level'),
      duration_hours: parseInt(formData.get('duration_hours') as string) || 0,
      status: formData.get('status'),
      featured_image: formData.get('featured_image')
    };

    if (editingCourse?.id) {
      updateCourseMutation.mutate({ id: editingCourse.id, data });
    } else {
      createCourseMutation.mutate(data);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">
            Sistema completo de gerenciamento do Templo do Abismo
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Páginas
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="voz-pluma" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Voz da Pluma
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{stats?.totalUsers || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Páginas Publicadas</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">{stats?.totalPages || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">{stats?.totalCourses || 0}</div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Consultas Oráculos</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{stats?.totalConsultations || 0}</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pages Tab */}
          <TabsContent value="pages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciamento de Páginas</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingPage({})}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Nova Página
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle>
                      {editingPage?.id ? 'Editar Página' : 'Nova Página'}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handlePageSubmit(new FormData(e.target as HTMLFormElement));
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título</Label>
                      <Input
                        id="title"
                        name="title"
                        defaultValue={editingPage?.title || ''}
                        required
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div>
                      <Label htmlFor="content">Conteúdo</Label>
                      <Textarea
                        id="content"
                        name="content"
                        rows={10}
                        defaultValue={editingPage?.content || ''}
                        required
                        className="bg-gray-800 border-gray-700"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select name="status" defaultValue={editingPage?.status || 'draft'}>
                          <SelectTrigger className="bg-gray-800 border-gray-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Rascunho</SelectItem>
                            <SelectItem value="published">Publicado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="featured_image">Imagem Destacada (URL)</Label>
                        <Input
                          id="featured_image"
                          name="featured_image"
                          defaultValue={editingPage?.featured_image || ''}
                          className="bg-gray-800 border-gray-700"
                        />
                      </div>
                    </div>
                    <Button type="submit" disabled={createPageMutation.isPending || updatePageMutation.isPending}>
                      {editingPage?.id ? 'Atualizar' : 'Criar'} Página
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="bg-gray-900/50 border-gray-800">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pages?.map((page: any) => (
                      <TableRow key={page.id}>
                        <TableCell>{page.title}</TableCell>
                        <TableCell>
                          <Badge variant={page.status === 'published' ? 'default' : 'secondary'}>
                            {page.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(page.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPage(page)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deletePageMutation.mutate(page.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Voz da Pluma Tab */}
          <TabsContent value="voz-pluma" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle>Configurações da Voz da Pluma</CardTitle>
                <CardDescription>
                  Sistema automático de publicação de conteúdo místico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={voxSettings.auto_enabled}
                    onCheckedChange={(checked) => 
                      setVoxSettings(prev => ({ ...prev, auto_enabled: checked }))
                    }
                  />
                  <Label>Publicação automática ativada</Label>
                </div>

                <div>
                  <Label>Intervalo de publicação (segundos)</Label>
                  <Input
                    type="number"
                    value={voxSettings.interval}
                    onChange={(e) => 
                      setVoxSettings(prev => ({ ...prev, interval: parseInt(e.target.value) }))
                    }
                    className="bg-gray-800 border-gray-700"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    {Math.round(voxSettings.interval / 3600)} horas entre publicações
                  </p>
                </div>

                <div>
                  <Label>Prompt personalizado (opcional)</Label>
                  <Textarea
                    value={voxSettings.custom_prompt}
                    onChange={(e) => 
                      setVoxSettings(prev => ({ ...prev, custom_prompt: e.target.value }))
                    }
                    placeholder="Instruções específicas para a IA..."
                    className="bg-gray-800 border-gray-700"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={() => updateVoxSettingsMutation.mutate(voxSettings)}
                    disabled={updateVoxSettingsMutation.isPending}
                  >
                    Salvar Configurações
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => publishVoxMutation.mutate(voxSettings.custom_prompt)}
                    disabled={publishVoxMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Publicar Agora
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