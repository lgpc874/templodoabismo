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
import { Search, TrendingUp, Globe, Target, BarChart3, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function SEOManager() {
  const [seoSettings, setSeoSettings] = useState({
    auto_generate_meta: true,
    default_meta_description: "",
    default_keywords: "",
    site_name: "Templo do Abismo",
    canonical_domain: "https://templodoabismo.com",
    google_analytics_id: "",
    google_search_console: "",
    sitemap_enabled: true,
    robots_txt_custom: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: seoAnalytics } = useQuery({
    queryKey: ["/api/admin/seo/analytics"],
  });

  const { data: currentSettings } = useQuery({
    queryKey: ["/api/admin/seo/settings"],
    onSuccess: (data) => {
      if (data) setSeoSettings({ ...seoSettings, ...data });
    }
  });

  const { data: pageAnalysis } = useQuery({
    queryKey: ["/api/admin/seo/page-analysis"],
  });

  const updateSEOSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return apiRequest("/api/admin/seo/settings", {
        method: "PUT",
        body: settings
      });
    },
    onSuccess: () => {
      toast({
        title: "Configurações SEO Salvas",
        description: "As configurações de SEO foram atualizadas"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações SEO",
        variant: "destructive"
      });
    }
  });

  const generateSitemapMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/admin/seo/generate-sitemap", {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Sitemap Gerado",
        description: "O sitemap foi atualizado com sucesso"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao gerar sitemap",
        variant: "destructive"
      });
    }
  });

  const optimizePageMutation = useMutation({
    mutationFn: async (pageId: number) => {
      return apiRequest(`/api/admin/seo/optimize-page/${pageId}`, {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Página Otimizada",
        description: "A página foi otimizada automaticamente"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/seo"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao otimizar página",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    updateSEOSettingsMutation.mutate(seoSettings);
  };

  const getSEOScore = (score: number) => {
    if (score >= 80) return { color: "text-green-400", label: "Excelente" };
    if (score >= 60) return { color: "text-yellow-400", label: "Bom" };
    if (score >= 40) return { color: "text-orange-400", label: "Regular" };
    return { color: "text-red-400", label: "Precisa Melhorar" };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-amber-400">Gerenciamento de SEO</h2>
        <Button
          onClick={() => generateSitemapMutation.mutate()}
          disabled={generateSitemapMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          {generateSitemapMutation.isPending ? "Gerando..." : "Atualizar Sitemap"}
        </Button>
      </div>

      {/* SEO Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Score SEO Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getSEOScore(seoAnalytics?.average_score || 0).color}`}>
              {seoAnalytics?.average_score || 0}/100
            </div>
            <p className="text-xs text-purple-500">
              {getSEOScore(seoAnalytics?.average_score || 0).label}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Páginas Indexadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {seoAnalytics?.indexed_pages || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Palavras-chave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {seoAnalytics?.tracked_keywords || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Backlinks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {seoAnalytics?.backlinks || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/40 border-purple-500/30">
          <TabsTrigger value="settings" className="text-purple-300 data-[state=active]:text-amber-400">
            Configurações
          </TabsTrigger>
          <TabsTrigger value="pages" className="text-purple-300 data-[state=active]:text-amber-400">
            Análise de Páginas
          </TabsTrigger>
          <TabsTrigger value="keywords" className="text-purple-300 data-[state=active]:text-amber-400">
            Palavras-chave
          </TabsTrigger>
          <TabsTrigger value="reports" className="text-purple-300 data-[state=active]:text-amber-400">
            Relatórios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Configurações Gerais de SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={seoSettings.auto_generate_meta}
                  onCheckedChange={(checked) => setSeoSettings({...seoSettings, auto_generate_meta: checked})}
                />
                <Label className="text-purple-300">Auto-gerar Meta Tags</Label>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Nome do Site</Label>
                  <Input
                    value={seoSettings.site_name}
                    onChange={(e) => setSeoSettings({...seoSettings, site_name: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="Templo do Abismo"
                  />
                </div>
                <div>
                  <Label className="text-purple-300">Domínio Canônico</Label>
                  <Input
                    value={seoSettings.canonical_domain}
                    onChange={(e) => setSeoSettings({...seoSettings, canonical_domain: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="https://templodoabismo.com"
                  />
                </div>
              </div>

              <div>
                <Label className="text-purple-300">Meta Descrição Padrão</Label>
                <Textarea
                  value={seoSettings.default_meta_description}
                  onChange={(e) => setSeoSettings({...seoSettings, default_meta_description: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-purple-100"
                  placeholder="Portal dedicado aos ensinamentos ancestrais e desenvolvimento espiritual..."
                  rows={3}
                />
              </div>

              <div>
                <Label className="text-purple-300">Palavras-chave Padrão</Label>
                <Textarea
                  value={seoSettings.default_keywords}
                  onChange={(e) => setSeoSettings({...seoSettings, default_keywords: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-purple-100"
                  placeholder="templo do abismo, ensinamentos ancestrais, desenvolvimento espiritual, meditação, filosofia"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Google Analytics ID</Label>
                  <Input
                    value={seoSettings.google_analytics_id}
                    onChange={(e) => setSeoSettings({...seoSettings, google_analytics_id: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div>
                  <Label className="text-purple-300">Google Search Console</Label>
                  <Input
                    value={seoSettings.google_search_console}
                    onChange={(e) => setSeoSettings({...seoSettings, google_search_console: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="Código de verificação"
                  />
                </div>
              </div>

              <div>
                <Label className="text-purple-300">Robots.txt Personalizado</Label>
                <Textarea
                  value={seoSettings.robots_txt_custom}
                  onChange={(e) => setSeoSettings({...seoSettings, robots_txt_custom: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-purple-100 font-mono"
                  placeholder="User-agent: *&#10;Allow: /&#10;Sitemap: https://templodoabismo.com/sitemap.xml"
                  rows={6}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={seoSettings.sitemap_enabled}
                  onCheckedChange={(checked) => setSeoSettings({...seoSettings, sitemap_enabled: checked})}
                />
                <Label className="text-purple-300">Gerar Sitemap Automaticamente</Label>
              </div>

              <Button 
                onClick={handleSaveSettings}
                disabled={updateSEOSettingsMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateSEOSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pages" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Análise de Páginas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pageAnalysis?.map((page: any) => (
                  <div key={page.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div className="flex-1">
                      <h4 className="text-purple-100 font-medium">{page.title}</h4>
                      <p className="text-sm text-purple-400">/{page.slug}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs">
                        <span className={`font-medium ${getSEOScore(page.seo_score).color}`}>
                          SEO: {page.seo_score}/100
                        </span>
                        <span className="text-purple-500">
                          Meta: {page.has_meta_description ? "✓" : "✗"}
                        </span>
                        <span className="text-purple-500">
                          Keywords: {page.has_keywords ? "✓" : "✗"}
                        </span>
                        <span className="text-purple-500">
                          H1: {page.has_h1 ? "✓" : "✗"}
                        </span>
                      </div>
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
                        onClick={() => optimizePageMutation.mutate(page.id)}
                        disabled={optimizePageMutation.isPending}
                        className="bg-amber-600 hover:bg-amber-700"
                      >
                        Otimizar
                      </Button>
                    </div>
                  </div>
                )) || (
                  <p className="text-purple-400 text-center py-8">
                    Nenhuma análise disponível
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Monitoramento de Palavras-chave</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Input
                    placeholder="Nova palavra-chave"
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                  <Input
                    placeholder="URL de destino"
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Adicionar
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {seoAnalytics?.keywords?.map((keyword: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/20">
                      <div>
                        <span className="text-purple-100 font-medium">{keyword.term}</span>
                        <p className="text-sm text-purple-400">Posição: {keyword.position || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                          {keyword.volume || 0} buscas/mês
                        </Badge>
                      </div>
                    </div>
                  )) || (
                    <p className="text-purple-400 text-center py-8">
                      Nenhuma palavra-chave monitorada
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Tráfego Orgânico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Este mês</span>
                    <span className="text-amber-400 font-medium">
                      {seoAnalytics?.organic_traffic?.current_month || 0} visitas
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Mês anterior</span>
                    <span className="text-purple-400">
                      {seoAnalytics?.organic_traffic?.previous_month || 0} visitas
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300">Crescimento</span>
                    <span className={`font-medium ${
                      (seoAnalytics?.organic_traffic?.growth || 0) > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {seoAnalytics?.organic_traffic?.growth || 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Problemas de SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {seoAnalytics?.issues?.map((issue: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-purple-500/20">
                      <div>
                        <span className="text-purple-100">{issue.title}</span>
                        <p className="text-sm text-purple-400">{issue.description}</p>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          issue.severity === 'high' 
                            ? 'border-red-500/30 text-red-400'
                            : issue.severity === 'medium'
                            ? 'border-yellow-500/30 text-yellow-400'
                            : 'border-blue-500/30 text-blue-400'
                        }
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                  )) || (
                    <p className="text-green-400 text-center py-4">
                      Nenhum problema detectado!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}