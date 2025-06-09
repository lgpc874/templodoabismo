import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "wouter";
import { 
  Settings, 
  Users, 
  BookOpen, 
  Scroll, 
  Eye, 
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  Shield,
  Database,
  Moon,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SiteNavigation from "@/components/SiteNavigation";

const courseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  level: z.number().min(1).max(7),
  price_brl: z.number().min(0),
  duration_hours: z.number().min(1),
  modules: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
});

const grimoireSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  author: z.string().min(1, "Autor é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  rental_price_brl: z.number().min(0),
  purchase_price_brl: z.number().min(0),
  danger_level: z.number().min(1).max(5),
  is_published: z.boolean().default(false),
});

const blogPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  content: z.string().min(1, "Conteúdo é obrigatório"),
  excerpt: z.string().min(1, "Resumo é obrigatório"),
  category: z.string().min(1, "Categoria é obrigatória"),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Stats Query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  // Users Query
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Courses Query
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
  });

  // Grimoires Query
  const { data: grimoires, isLoading: grimoiresLoading } = useQuery({
    queryKey: ["/api/admin/grimoires"],
  });

  // Blog Posts Query
  const { data: blogPosts, isLoading: blogLoading } = useQuery({
    queryKey: ["/api/admin/blog/posts"],
  });

  // Course Form
  const courseForm = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      level: 1,
      price_brl: 0,
      duration_hours: 1,
      modules: [],
      is_published: false,
    },
  });

  // Grimoire Form
  const grimoireForm = useForm({
    resolver: zodResolver(grimoireSchema),
    defaultValues: {
      title: "",
      description: "",
      author: "",
      category: "",
      rental_price_brl: 0,
      purchase_price_brl: 0,
      danger_level: 1,
      is_published: false,
    },
  });

  // Blog Post Form
  const blogForm = useForm({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      content: "",
      excerpt: "",
      category: "",
      tags: [],
      published: false,
    },
  });

  // Mutations
  const createCourseMutation = useMutation({
    mutationFn: (data) => apiRequest("/api/admin/courses", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Curso criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      courseForm.reset();
    },
    onError: (error) => {
      toast({ title: "Erro ao criar curso", description: error.message, variant: "destructive" });
    },
  });

  const createGrimoireMutation = useMutation({
    mutationFn: (data) => apiRequest("/api/admin/grimoires", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Grimório criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/grimoires"] });
      grimoireForm.reset();
    },
    onError: (error) => {
      toast({ title: "Erro ao criar grimório", description: error.message, variant: "destructive" });
    },
  });

  const createBlogPostMutation = useMutation({
    mutationFn: (data) => apiRequest("/api/admin/blog/posts", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      toast({ title: "Post criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
      blogForm.reset();
    },
    onError: (error) => {
      toast({ title: "Erro ao criar post", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ endpoint }) => apiRequest(endpoint, { method: "DELETE" }),
    onSuccess: (_, { queryKey }) => {
      toast({ title: "Item removido com sucesso!" });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => {
      toast({ title: "Erro ao remover item", description: error.message, variant: "destructive" });
    },
  });

  const handleDeleteCourse = (id: number) => {
    deleteMutation.mutate({
      endpoint: `/api/admin/courses/${id}`,
      queryKey: ["/api/admin/courses"]
    });
  };

  const handleDeleteGrimoire = (id: number) => {
    deleteMutation.mutate({
      endpoint: `/api/admin/grimoires/${id}`,
      queryKey: ["/api/admin/grimoires"]
    });
  };

  const handleDeleteBlogPost = (id: number) => {
    deleteMutation.mutate({
      endpoint: `/api/admin/blog/posts/${id}`,
      queryKey: ["/api/admin/blog/posts"]
    });
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
          <TabsList className="grid w-full grid-cols-6 bg-black/40 border border-purple-500/30">
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
            <TabsTrigger value="grimoires" className="text-amber-400">
              <Scroll className="w-4 h-4 mr-2" />
              Grimórios
            </TabsTrigger>
            <TabsTrigger value="blog" className="text-amber-400">
              <Edit className="w-4 h-4 mr-2" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-amber-400">
              <Settings className="w-4 h-4 mr-2" />
              Config
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
                    {statsLoading ? "..." : stats?.totalUsers || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Cursos Ativos</CardTitle>
                  <BookOpen className="h-4 w-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {coursesLoading ? "..." : courses?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Grimórios</CardTitle>
                  <Scroll className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {grimoiresLoading ? "..." : grimoires?.length || 0}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">Posts Blog</CardTitle>
                  <Edit className="h-4 w-4 text-emerald-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-400">
                    {blogLoading ? "..." : blogPosts?.length || 0}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Atividade Recente</CardTitle>
                <CardDescription className="text-gray-400">
                  Últimas ações no sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Sistema iniciado com sucesso</p>
                      <p className="text-xs text-gray-500">Há 2 minutos</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-300">Painel administrativo acessado</p>
                      <p className="text-xs text-gray-500">Agora</p>
                    </div>
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
                  Administrar membros do templo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    <p className="text-gray-400 mt-2">Carregando usuários...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users?.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border border-purple-500/20 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-200">{user.username}</p>
                            <p className="text-sm text-gray-400">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
                                {user.role}
                              </Badge>
                              <Badge variant="outline" className="text-amber-400">
                                Nível {user.initiation_level}
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
                    )) || (
                      <p className="text-center text-gray-400 py-8">Nenhum usuário encontrado</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400">Criar Novo Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...courseForm}>
                    <form onSubmit={courseForm.handleSubmit((data) => createCourseMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={courseForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Título</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-black/40 border-purple-500/30 text-gray-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={courseForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Descrição</FormLabel>
                            <FormControl>
                              <Textarea {...field} className="bg-black/40 border-purple-500/30 text-gray-200" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={courseForm.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Nível (1-7)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="1" 
                                  max="7" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  className="bg-black/40 border-purple-500/30 text-gray-200" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={courseForm.control}
                          name="price_brl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Preço (R$)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="0.01" 
                                  {...field} 
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  className="bg-black/40 border-purple-500/30 text-gray-200" 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={courseForm.control}
                        name="duration_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Duração (horas)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="1" 
                                {...field} 
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="bg-black/40 border-purple-500/30 text-gray-200" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={courseForm.control}
                        name="is_published"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-500/30 p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base text-gray-300">
                                Publicar Curso
                              </FormLabel>
                              <div className="text-sm text-gray-400">
                                Tornar o curso visível para os usuários
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={createCourseMutation.isPending}
                      >
                        {createCourseMutation.isPending ? "Criando..." : "Criar Curso"}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400">Cursos Existentes</CardTitle>
                </CardHeader>
                <CardContent>
                  {coursesLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {courses?.map((course: any) => (
                        <div key={course.id} className="p-4 border border-purple-500/20 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-200">{course.title}</h4>
                              <p className="text-sm text-gray-400 mt-1">{course.description}</p>
                              <div className="flex items-center space-x-2 mt-2">
                                <Badge variant="outline">Nível {course.level}</Badge>
                                <Badge variant="outline">R$ {course.price_brl}</Badge>
                                <Badge variant={course.is_published ? "default" : "secondary"}>
                                  {course.is_published ? "Publicado" : "Rascunho"}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteCourse(course.id)}
                                disabled={deleteMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-center text-gray-400 py-8">Nenhum curso encontrado</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Configurações do Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Gerencie as configurações globais do portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Configurações Gerais</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Modo Manutenção</p>
                        <p className="text-xs text-gray-500">Desabilitar acesso público</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Registros Abertos</p>
                        <p className="text-xs text-gray-500">Permitir novos cadastros</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-300">Logs Detalhados</p>
                        <p className="text-xs text-gray-500">Ativar logging avançado</p>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-200">Backup & Segurança</h3>
                    
                    <Button variant="outline" className="w-full">
                      <Database className="w-4 h-4 mr-2" />
                      Criar Backup Manual
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Shield className="w-4 h-4 mr-2" />
                      Verificar Integridade
                    </Button>

                    <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg">
                      <h4 className="text-sm font-semibold text-red-400 mb-2">Zona Perigosa</h4>
                      <Button variant="destructive" size="sm" className="w-full">
                        Resetar Sistema
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
  );
}