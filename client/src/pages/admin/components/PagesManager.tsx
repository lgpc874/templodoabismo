import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
  meta_description: string;
  meta_keywords: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  page_type: string;
  seo_title: string;
}

export function PagesManager() {
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    meta_description: "",
    meta_keywords: "",
    seo_title: "",
    is_published: false,
    page_type: "page"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar páginas
  const { data: pages, isLoading } = useQuery({
    queryKey: ["/api/admin/pages"],
  });

  // Criar/Atualizar página
  const savePageMutation = useMutation({
    mutationFn: async (pageData: any) => {
      const url = selectedPage 
        ? `/api/admin/pages/${selectedPage.id}`
        : "/api/admin/pages";
      const method = selectedPage ? "PUT" : "POST";
      
      return apiRequest(url, {
        method,
        body: pageData
      });
    },
    onSuccess: () => {
      toast({
        title: "Página Salva",
        description: "A página foi salva com sucesso"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
      setIsEditing(false);
      setSelectedPage(null);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar página",
        variant: "destructive"
      });
    }
  });

  // Deletar página
  const deletePageMutation = useMutation({
    mutationFn: async (pageId: number) => {
      return apiRequest(`/api/admin/pages/${pageId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Página Deletada",
        description: "A página foi removida com sucesso"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao deletar página",
        variant: "destructive"
      });
    }
  });

  // Publicar/Despublicar página
  const togglePublishMutation = useMutation({
    mutationFn: async ({ pageId, isPublished }: { pageId: number; isPublished: boolean }) => {
      return apiRequest(`/api/admin/pages/${pageId}/publish`, {
        method: "POST",
        body: { is_published: !isPublished }
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Atualizado",
        description: "O status de publicação foi alterado"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pages"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao alterar status",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      content: "",
      meta_description: "",
      meta_keywords: "",
      seo_title: "",
      is_published: false,
      page_type: "page"
    });
  };

  const handleEdit = (page: Page) => {
    setSelectedPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || "",
      meta_keywords: page.meta_keywords || "",
      seo_title: page.seo_title || "",
      is_published: page.is_published,
      page_type: page.page_type || "page"
    });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setSelectedPage(null);
    resetForm();
    setIsEditing(true);
  };

  const handleSave = () => {
    // Auto-gerar slug se não fornecido
    if (!formData.slug && formData.title) {
      formData.slug = formData.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }

    // Auto-gerar SEO title se não fornecido
    if (!formData.seo_title) {
      formData.seo_title = `${formData.title} | Templo do Abismo`;
    }

    // Auto-gerar meta description se não fornecida
    if (!formData.meta_description && formData.content) {
      const text = formData.content.replace(/<[^>]*>/g, '').substring(0, 150);
      formData.meta_description = text + (text.length >= 150 ? "..." : "");
    }

    savePageMutation.mutate(formData);
  };

  const generateSlugFromTitle = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    setFormData({ ...formData, slug });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-purple-300">Carregando páginas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-amber-400">Gerenciar Páginas</h2>
        <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          Nova Página
        </Button>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-black/40 border-purple-500/30">
          <TabsTrigger value="list" className="text-purple-300 data-[state=active]:text-amber-400">
            Lista de Páginas
          </TabsTrigger>
          <TabsTrigger value="editor" className="text-purple-300 data-[state=active]:text-amber-400">
            Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid gap-4">
            {pages?.map((page: Page) => (
              <Card key={page.id} className="bg-black/40 border-purple-500/30">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-medium text-purple-100">{page.title}</h3>
                        <Badge variant={page.is_published ? "default" : "secondary"}>
                          {page.is_published ? "Publicada" : "Rascunho"}
                        </Badge>
                        <Badge variant="outline" className="text-purple-400 border-purple-500/30">
                          {page.page_type}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-400">/{page.slug}</p>
                      <p className="text-xs text-purple-500 mt-1">
                        Criada em {new Date(page.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => togglePublishMutation.mutate({ 
                          pageId: page.id, 
                          isPublished: page.is_published 
                        })}
                        className="border-amber-500/30 text-amber-300 hover:bg-amber-500/20"
                      >
                        <Globe className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(page)}
                        className="border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deletePageMutation.mutate(page.id)}
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
                Nenhuma página encontrada. Crie sua primeira página!
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="editor" className="mt-6">
          {isEditing ? (
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">
                  {selectedPage ? "Editar Página" : "Nova Página"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-purple-300">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ ...formData, title: e.target.value });
                        if (!selectedPage) generateSlugFromTitle(e.target.value);
                      }}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="Título da página"
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug" className="text-purple-300">URL (Slug)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="url-da-pagina"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="content" className="text-purple-300">Conteúdo</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-purple-100 min-h-64"
                    placeholder="Conteúdo da página em HTML..."
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="seo-title" className="text-purple-300">Título SEO</Label>
                    <Input
                      id="seo-title"
                      value={formData.seo_title}
                      onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="Título para SEO"
                    />
                  </div>
                  <div>
                    <Label htmlFor="meta-keywords" className="text-purple-300">Palavras-chave</Label>
                    <Input
                      id="meta-keywords"
                      value={formData.meta_keywords}
                      onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="palavra1, palavra2, palavra3"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="meta-description" className="text-purple-300">Meta Descrição</Label>
                  <Textarea
                    id="meta-description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="Descrição da página para motores de busca"
                    rows={3}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                  <Label htmlFor="is-published" className="text-purple-300">
                    Publicar página
                  </Label>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={handleSave}
                    disabled={savePageMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {savePageMutation.isPending ? "Salvando..." : "Salvar Página"}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12 text-purple-400">
              Selecione uma página para editar ou crie uma nova.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}