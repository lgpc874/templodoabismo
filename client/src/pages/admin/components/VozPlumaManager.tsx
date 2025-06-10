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
import { Calendar, Clock, Wand2, FileText, BookOpen, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function VozPlumaManager() {
  const [customPrompt, setCustomPrompt] = useState("");
  const [frequency, setFrequency] = useState("24");
  const [autoPublish, setAutoPublish] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar configurações atuais
  const { data: settings } = useQuery({
    queryKey: ["/api/admin/voz-pluma/settings"],
  });

  // Buscar histórico de publicações
  const { data: publications } = useQuery({
    queryKey: ["/api/admin/voz-pluma/publications"],
  });

  // Buscar estatísticas
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/voz-pluma/stats"],
  });

  // Publicar poema manual
  const publishPoemMutation = useMutation({
    mutationFn: async (prompt?: string) => {
      return apiRequest("/api/admin/voz-pluma/publish-poem", {
        method: "POST",
        body: { customPrompt: prompt }
      });
    },
    onSuccess: () => {
      toast({
        title: "Poema Publicado",
        description: "O poema foi gerado e publicado com sucesso"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voz-pluma"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao publicar poema",
        variant: "destructive"
      });
    }
  });

  // Publicar artigo manual
  const publishArticleMutation = useMutation({
    mutationFn: async (prompt?: string) => {
      return apiRequest("/api/admin/voz-pluma/publish-article", {
        method: "POST",
        body: { customPrompt: prompt }
      });
    },
    onSuccess: () => {
      toast({
        title: "Artigo Publicado",
        description: "O artigo foi gerado e publicado com sucesso"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voz-pluma"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao publicar artigo",
        variant: "destructive"
      });
    }
  });

  // Atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      return apiRequest("/api/admin/voz-pluma/settings", {
        method: "PUT",
        body: newSettings
      });
    },
    onSuccess: () => {
      toast({
        title: "Configurações Salvas",
        description: "As configurações da Voz da Pluma foram atualizadas"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/voz-pluma"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive"
      });
    }
  });

  const handlePublishPoem = () => {
    publishPoemMutation.mutate(customPrompt || undefined);
    setCustomPrompt("");
  };

  const handlePublishArticle = () => {
    publishArticleMutation.mutate(customPrompt || undefined);
    setCustomPrompt("");
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate({
      frequency: parseInt(frequency),
      autoPublish,
      enabled: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Poemas Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats?.poemsPublished || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Artigos Publicados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{stats?.articlesPublished || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Próxima Publicação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-purple-300">{stats?.nextPublication || "Manual"}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={autoPublish ? "default" : "secondary"} className="bg-amber-500/20 text-amber-400">
              {autoPublish ? "Automático" : "Manual"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="publish" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/40 border-purple-500/30">
          <TabsTrigger value="publish" className="text-purple-300 data-[state=active]:text-amber-400">
            Publicar Conteúdo
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-purple-300 data-[state=active]:text-amber-400">
            Configurações
          </TabsTrigger>
          <TabsTrigger value="history" className="text-purple-300 data-[state=active]:text-amber-400">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="publish" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Publicação Manual de Poemas */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Publicar Poema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="poem-prompt" className="text-purple-300">
                    Tema do Poema (opcional)
                  </Label>
                  <Textarea
                    id="poem-prompt"
                    placeholder="Ex: A jornada da alma em busca da verdade interior..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <Button 
                  onClick={handlePublishPoem}
                  disabled={publishPoemMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  {publishPoemMutation.isPending ? "Gerando..." : "Gerar e Publicar Poema"}
                </Button>
              </CardContent>
            </Card>

            {/* Publicação Manual de Artigos */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Publicar Artigo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="article-prompt" className="text-purple-300">
                    Tema do Artigo (opcional)
                  </Label>
                  <Textarea
                    id="article-prompt"
                    placeholder="Ex: A importância da meditação no desenvolvimento espiritual..."
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <Button 
                  onClick={handlePublishArticle}
                  disabled={publishArticleMutation.isPending}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {publishArticleMutation.isPending ? "Gerando..." : "Gerar e Publicar Artigo"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações de Publicação Automática
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-purple-300">Publicação Automática</Label>
                  <p className="text-sm text-purple-400">
                    Ativar geração e publicação automática de conteúdo
                  </p>
                </div>
                <Switch
                  checked={autoPublish}
                  onCheckedChange={setAutoPublish}
                />
              </div>

              <div>
                <Label htmlFor="frequency" className="text-purple-300">
                  Frequência de Artigos (horas)
                </Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="bg-black/20 border-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="6">6 horas</SelectItem>
                    <SelectItem value="12">12 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                    <SelectItem value="48">48 horas</SelectItem>
                    <SelectItem value="168">1 semana</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-purple-400 mt-1">
                  Poemas são publicados a cada hora quando ativo
                </p>
              </div>

              <Button 
                onClick={handleSaveSettings}
                disabled={updateSettingsMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Histórico de Publicações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publications?.map((pub: any) => (
                  <div key={pub.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div>
                      <h4 className="text-purple-100 font-medium">{pub.title}</h4>
                      <p className="text-sm text-purple-400">
                        {pub.type} • {new Date(pub.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                      {pub.generated_by_ai ? "IA" : "Manual"}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-purple-400 text-center py-8">
                    Nenhuma publicação encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}