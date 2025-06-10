import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Users, DollarSign, BookOpen, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Course {
  id: number;
  title: string;
  description: string;
  level: number;
  price_brl: number;
  duration_hours: number;
  instructor: string;
  cover_image: string;
  is_active: boolean;
  is_published: boolean;
  enrolled_count: number;
  max_students: number;
  modules: any[];
  prerequisites: string[];
  learning_objectives: string[];
  certificate_available: boolean;
  created_at: string;
}

export function CoursesManager() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("list");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: 1,
    price_brl: 0,
    duration_hours: 10,
    instructor: "",
    cover_image: "",
    is_active: true,
    is_published: false,
    max_students: 100,
    prerequisites: [] as string[],
    learning_objectives: [] as string[],
    certificate_available: false,
    modules: [] as any[]
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses, isLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
  });

  const saveCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      const url = selectedCourse 
        ? `/api/admin/courses/${selectedCourse.id}`
        : "/api/admin/courses";
      const method = selectedCourse ? "PUT" : "POST";
      
      return apiRequest(url, {
        method,
        body: courseData
      });
    },
    onSuccess: () => {
      toast({
        title: "Curso Salvo",
        description: "O curso foi salvo com sucesso"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      setIsEditing(false);
      setSelectedCourse(null);
      resetForm();
      setActiveTab("list");
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar curso",
        variant: "destructive"
      });
    }
  });

  const deleteCourseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return apiRequest(`/api/admin/courses/${courseId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Curso Deletado",
        description: "O curso foi removido com sucesso"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao deletar curso",
        variant: "destructive"
      });
    }
  });

  const generateCourseMutation = useMutation({
    mutationFn: async ({ topic, level }: { topic: string; level: number }) => {
      return apiRequest("/api/generate/course", {
        method: "POST",
        body: { topic, level }
      });
    },
    onSuccess: (data) => {
      setFormData({
        ...formData,
        title: data.title,
        description: data.description,
        modules: data.modules,
        level: data.level || formData.level
      });
      toast({
        title: "Curso Gerado",
        description: "Conteúdo do curso gerado por IA"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao gerar curso",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      level: 1,
      price_brl: 0,
      duration_hours: 10,
      instructor: "",
      cover_image: "",
      is_active: true,
      is_published: false,
      max_students: 100,
      prerequisites: [],
      learning_objectives: [],
      certificate_available: false,
      modules: []
    });
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      level: course.level,
      price_brl: course.price_brl,
      duration_hours: course.duration_hours,
      instructor: course.instructor || "",
      cover_image: course.cover_image || "",
      is_active: course.is_active,
      is_published: course.is_published,
      max_students: course.max_students || 100,
      prerequisites: course.prerequisites || [],
      learning_objectives: course.learning_objectives || [],
      certificate_available: course.certificate_available,
      modules: course.modules || []
    });
    setIsEditing(true);
    setActiveTab("editor");
  };

  const handleCreate = () => {
    setSelectedCourse(null);
    resetForm();
    setIsEditing(true);
    setActiveTab("editor");
  };

  const handleSave = () => {
    saveCourseMutation.mutate(formData);
  };

  const addModule = () => {
    setFormData({
      ...formData,
      modules: [...formData.modules, { title: "", duration: 60, type: "video", content: "" }]
    });
  };

  const updateModule = (index: number, field: string, value: any) => {
    const updatedModules = [...formData.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    setFormData({ ...formData, modules: updatedModules });
  };

  const removeModule = (index: number) => {
    const updatedModules = formData.modules.filter((_, i) => i !== index);
    setFormData({ ...formData, modules: updatedModules });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-purple-300">Carregando cursos...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-amber-400">Gerenciar Cursos</h2>
        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Novo Curso
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border-purple-500/30">
          <TabsTrigger value="list" className="text-purple-300 data-[state=active]:text-amber-400">
            Lista de Cursos
          </TabsTrigger>
          <TabsTrigger value="editor" className="text-purple-300 data-[state=active]:text-amber-400">
            Editor de Curso
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid gap-4">
            {courses?.map((course: Course) => (
              <Card key={course.id} className="bg-black/40 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-purple-100">{course.title}</h3>
                        <Badge variant={course.is_published ? "default" : "secondary"}>
                          {course.is_published ? "Publicado" : "Rascunho"}
                        </Badge>
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30">
                          Nível {course.level}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-400 mb-2">{course.description}</p>
                      <div className="flex items-center gap-4 text-xs text-purple-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          R$ {(course.price_brl / 100).toFixed(2)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration_hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {course.enrolled_count || 0}/{course.max_students || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {course.modules?.length || 0} módulos
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/courses/${course.id}`, '_blank')}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(course)}
                        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteCourseMutation.mutate(course.id)}
                        className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <div className="text-center py-12 text-purple-400">
                Nenhum curso encontrado. Crie seu primeiro curso!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          {isEditing ? (
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">
                  {selectedCourse ? "Editar Curso" : "Novo Curso"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Geração por IA */}
                <Card className="bg-purple-500/10 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-purple-300 text-lg">Gerar Curso com IA</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 items-end">
                      <div className="flex-1">
                        <Label className="text-purple-300">Tópico do Curso</Label>
                        <Input
                          placeholder="Ex: Meditação Avançada, Simbolismo Esotérico..."
                          className="bg-black/20 border-purple-500/30 text-purple-100"
                          id="ai-topic"
                        />
                      </div>
                      <div>
                        <Label className="text-purple-300">Nível</Label>
                        <Select defaultValue="1">
                          <SelectTrigger className="w-32 bg-black/20 border-purple-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Iniciante</SelectItem>
                            <SelectItem value="2">Intermediário</SelectItem>
                            <SelectItem value="3">Avançado</SelectItem>
                            <SelectItem value="4">Mestre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => {
                          const topic = (document.getElementById('ai-topic') as HTMLInputElement)?.value;
                          const level = parseInt((document.querySelector('[role="combobox"]') as HTMLElement)?.textContent || "1");
                          if (topic) {
                            generateCourseMutation.mutate({ topic, level });
                          }
                        }}
                        disabled={generateCourseMutation.isPending}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        {generateCourseMutation.isPending ? "Gerando..." : "Gerar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Informações Básicas */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-300">Título do Curso</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="Nome do curso"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Instrutor</Label>
                    <Input
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="Nome do instrutor"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-purple-300">Descrição</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="Descrição detalhada do curso"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-purple-300">Nível</Label>
                    <Select value={formData.level.toString()} onValueChange={(value) => setFormData({ ...formData, level: parseInt(value) })}>
                      <SelectTrigger className="bg-black/20 border-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Iniciante</SelectItem>
                        <SelectItem value="2">2 - Intermediário</SelectItem>
                        <SelectItem value="3">3 - Avançado</SelectItem>
                        <SelectItem value="4">4 - Mestre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-purple-300">Preço (R$)</Label>
                    <Input
                      type="number"
                      value={formData.price_brl / 100}
                      onChange={(e) => setFormData({ ...formData, price_brl: parseFloat(e.target.value) * 100 })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Duração (horas)</Label>
                    <Input
                      type="number"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: parseInt(e.target.value) })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Max. Alunos</Label>
                    <Input
                      type="number"
                      value={formData.max_students}
                      onChange={(e) => setFormData({ ...formData, max_students: parseInt(e.target.value) })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                    />
                  </div>
                </div>

                {/* Módulos do Curso */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-purple-300 text-lg">Módulos do Curso</Label>
                    <Button onClick={addModule} size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Módulo
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.modules.map((module, index) => (
                      <Card key={index} className="bg-black/20 border-purple-500/20">
                        <CardContent className="pt-4">
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Input
                              placeholder="Título do módulo"
                              value={module.title}
                              onChange={(e) => updateModule(index, 'title', e.target.value)}
                              className="bg-black/20 border-purple-500/30 text-purple-100"
                            />
                            <Input
                              type="number"
                              placeholder="Duração (min)"
                              value={module.duration}
                              onChange={(e) => updateModule(index, 'duration', parseInt(e.target.value))}
                              className="bg-black/20 border-purple-500/30 text-purple-100"
                            />
                            <div className="flex gap-2">
                              <Select value={module.type} onValueChange={(value) => updateModule(index, 'type', value)}>
                                <SelectTrigger className="bg-black/20 border-purple-500/30 flex-1">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="video">Vídeo</SelectItem>
                                  <SelectItem value="text">Texto</SelectItem>
                                  <SelectItem value="practical">Prática</SelectItem>
                                  <SelectItem value="quiz">Quiz</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeModule(index)}
                                className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Configurações */}
                <div className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <Label className="text-purple-300">Curso Ativo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                    <Label className="text-purple-300">Publicado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.certificate_available}
                      onCheckedChange={(checked) => setFormData({ ...formData, certificate_available: checked })}
                    />
                    <Label className="text-purple-300">Certificado Disponível</Label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSave}
                    disabled={saveCourseMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saveCourseMutation.isPending ? "Salvando..." : "Salvar Curso"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setActiveTab("list");
                    }}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-purple-400">
              Selecione um curso para editar ou crie um novo.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}