import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Shield, Zap, Database, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function SiteSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    site_title: "Templo do Abismo",
    site_description: "Portal de ensinamentos ancestrais",
    contact_email: "contato@templodoabismo.com",
    support_email: "suporte@templodoabismo.com",
    site_language: "pt-BR",
    timezone: "America/Sao_Paulo",
    maintenance_mode: false,
    registration_enabled: true,
    newsletter_enabled: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    ambient_mood_default: "abyssal",
    seal_rotation_speed: "slow",
    mystical_particles_enabled: true,
    background_animation: "floating",
    font_primary: "Cinzel",
    color_scheme: "dark",
    custom_css: ""
  });

  const [securitySettings, setSecuritySettings] = useState({
    max_login_attempts: 5,
    session_timeout: 3600,
    require_email_verification: true,
    password_min_length: 8,
    enable_2fa: false,
    rate_limiting_enabled: true,
    cors_origins: "https://templodoabismo.com"
  });

  const [contentSettings, setContentSettings] = useState({
    daily_quote_enabled: true,
    daily_poem_enabled: true,
    oracle_max_consultations: 5,
    grimoire_rental_days: 21,
    course_enrollment_enabled: true,
    comments_enabled: false,
    content_moderation: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: currentSettings } = useQuery({
    queryKey: ["/api/admin/site-settings"]
  });

  // Update settings when data changes
  useEffect(() => {
    if (currentSettings) {
      if (currentSettings.general) setGeneralSettings({ ...generalSettings, ...currentSettings.general });
      if (currentSettings.appearance) setAppearanceSettings({ ...appearanceSettings, ...currentSettings.appearance });
      if (currentSettings.security) setSecuritySettings({ ...securitySettings, ...currentSettings.security });
      if (currentSettings.content) setContentSettings({ ...contentSettings, ...currentSettings.content });
    }
  }, [currentSettings]);

  const { data: systemInfo } = useQuery({
    queryKey: ["/api/admin/system-info"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return apiRequest("/api/admin/site-settings", {
        method: "PUT",
        body: settings
      });
    },
    onSuccess: () => {
      toast({
        title: "Configurações Salvas",
        description: "As configurações do site foram atualizadas"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive"
      });
    }
  });

  const backupDatabaseMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/admin/backup-database", {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Backup Criado",
        description: "Backup do banco de dados criado com sucesso"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar backup",
        variant: "destructive"
      });
    }
  });

  const clearCacheMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/admin/clear-cache", {
        method: "POST"
      });
    },
    onSuccess: () => {
      toast({
        title: "Cache Limpo",
        description: "Cache do templo foi limpo pelo Magus"
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao limpar cache",
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    const allSettings = {
      general: generalSettings,
      appearance: appearanceSettings,
      security: securitySettings,
      content: contentSettings
    };
    updateSettingsMutation.mutate(allSettings);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-amber-400">Configurações do Site</h2>
        <div className="flex gap-2">
          <Button
            onClick={() => clearCacheMutation.mutate()}
            disabled={clearCacheMutation.isPending}
            variant="outline"
            className="border-purple-500/30 text-purple-300"
          >
            <Zap className="w-4 h-4 mr-2" />
            Limpar Cache
          </Button>
          <Button
            onClick={() => backupDatabaseMutation.mutate()}
            disabled={backupDatabaseMutation.isPending}
            variant="outline"
            className="border-blue-500/30 text-blue-300"
          >
            <Database className="w-4 h-4 mr-2" />
            Backup DB
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Status do Templo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-green-400">
              {systemInfo?.status || "Online"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-blue-400">
              {systemInfo?.uptime || "0d 0h"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Uso de Memória</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-amber-400">
              {systemInfo?.memory_usage || "0%"}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Espaço em Disco</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-purple-400">
              {systemInfo?.disk_usage || "0%"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/40 border-purple-500/30">
          <TabsTrigger value="general" className="text-purple-300 data-[state=active]:text-amber-400">
            Geral
          </TabsTrigger>
          <TabsTrigger value="appearance" className="text-purple-300 data-[state=active]:text-amber-400">
            Aparência
          </TabsTrigger>
          <TabsTrigger value="security" className="text-purple-300 data-[state=active]:text-amber-400">
            Segurança
          </TabsTrigger>
          <TabsTrigger value="content" className="text-purple-300 data-[state=active]:text-amber-400">
            Conteúdo
          </TabsTrigger>
          <TabsTrigger value="system" className="text-purple-300 data-[state=active]:text-amber-400">
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Título do Site</Label>
                  <Input
                    value={generalSettings.site_title}
                    onChange={(e) => setGeneralSettings({...generalSettings, site_title: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div>
                  <Label className="text-purple-300">Idioma</Label>
                  <Select 
                    value={generalSettings.site_language} 
                    onValueChange={(value) => setGeneralSettings({...generalSettings, site_language: value})}
                  >
                    <SelectTrigger className="bg-black/20 border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-purple-300">Descrição do Site</Label>
                <Textarea
                  value={generalSettings.site_description}
                  onChange={(e) => setGeneralSettings({...generalSettings, site_description: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-purple-100"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Email de Contato</Label>
                  <Input
                    value={generalSettings.contact_email}
                    onChange={(e) => setGeneralSettings({...generalSettings, contact_email: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div>
                  <Label className="text-purple-300">Email de Suporte</Label>
                  <Input
                    value={generalSettings.support_email}
                    onChange={(e) => setGeneralSettings({...generalSettings, support_email: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={generalSettings.maintenance_mode}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, maintenance_mode: checked})}
                  />
                  <Label className="text-purple-300">Modo de Manutenção</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={generalSettings.registration_enabled}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, registration_enabled: checked})}
                  />
                  <Label className="text-purple-300">Permitir Novos Registros</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={generalSettings.newsletter_enabled}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, newsletter_enabled: checked})}
                  />
                  <Label className="text-purple-300">Newsletter Ativa</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Configurações de Aparência</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Ambiente Padrão</Label>
                  <Select 
                    value={appearanceSettings.ambient_mood_default} 
                    onValueChange={(value) => setAppearanceSettings({...appearanceSettings, ambient_mood_default: value})}
                  >
                    <SelectTrigger className="bg-black/20 border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abyssal">Abissal</SelectItem>
                      <SelectItem value="infernal">Infernal</SelectItem>
                      <SelectItem value="lunar">Lunar</SelectItem>
                      <SelectItem value="stellar">Estelar</SelectItem>
                      <SelectItem value="divine">Divino</SelectItem>
                      <SelectItem value="void">Vazio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-purple-300">Velocidade do Selo</Label>
                  <Select 
                    value={appearanceSettings.seal_rotation_speed} 
                    onValueChange={(value) => setAppearanceSettings({...appearanceSettings, seal_rotation_speed: value})}
                  >
                    <SelectTrigger className="bg-black/20 border-purple-500/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">Lenta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="fast">Rápida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={appearanceSettings.mystical_particles_enabled}
                    onCheckedChange={(checked) => setAppearanceSettings({...appearanceSettings, mystical_particles_enabled: checked})}
                  />
                  <Label className="text-purple-300">Partículas Místicas</Label>
                </div>
              </div>

              <div>
                <Label className="text-purple-300">CSS Personalizado</Label>
                <Textarea
                  value={appearanceSettings.custom_css}
                  onChange={(e) => setAppearanceSettings({...appearanceSettings, custom_css: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-purple-100 font-mono"
                  placeholder="/* CSS personalizado */"
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Tentativas de Login</Label>
                  <Input
                    type="number"
                    value={securitySettings.max_login_attempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, max_login_attempts: parseInt(e.target.value)})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div>
                  <Label className="text-purple-300">Timeout de Sessão (segundos)</Label>
                  <Input
                    type="number"
                    value={securitySettings.session_timeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, session_timeout: parseInt(e.target.value)})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>

              <div>
                <Label className="text-purple-300">Origens CORS Permitidas</Label>
                <Input
                  value={securitySettings.cors_origins}
                  onChange={(e) => setSecuritySettings({...securitySettings, cors_origins: e.target.value})}
                  className="bg-black/20 border-purple-500/30 text-purple-100"
                  placeholder="https://templodoabismo.com,https://app.templodoabismo.com"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={securitySettings.require_email_verification}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, require_email_verification: checked})}
                  />
                  <Label className="text-purple-300">Verificação de Email Obrigatória</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={securitySettings.enable_2fa}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, enable_2fa: checked})}
                  />
                  <Label className="text-purple-300">Autenticação de Dois Fatores</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={securitySettings.rate_limiting_enabled}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, rate_limiting_enabled: checked})}
                  />
                  <Label className="text-purple-300">Limitação de Taxa</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Configurações de Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label className="text-purple-300">Max. Consultas Oráculo/Dia</Label>
                  <Input
                    type="number"
                    value={contentSettings.oracle_max_consultations}
                    onChange={(e) => setContentSettings({...contentSettings, oracle_max_consultations: parseInt(e.target.value)})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
                <div>
                  <Label className="text-purple-300">Dias de Aluguel Grimório</Label>
                  <Input
                    type="number"
                    value={contentSettings.grimoire_rental_days}
                    onChange={(e) => setContentSettings({...contentSettings, grimoire_rental_days: parseInt(e.target.value)})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={contentSettings.daily_quote_enabled}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, daily_quote_enabled: checked})}
                  />
                  <Label className="text-purple-300">Citações Diárias</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={contentSettings.daily_poem_enabled}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, daily_poem_enabled: checked})}
                  />
                  <Label className="text-purple-300">Poemas Diários</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={contentSettings.course_enrollment_enabled}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, course_enrollment_enabled: checked})}
                  />
                  <Label className="text-purple-300">Inscrições em Cursos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={contentSettings.comments_enabled}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, comments_enabled: checked})}
                  />
                  <Label className="text-purple-300">Comentários</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={contentSettings.content_moderation}
                    onCheckedChange={(checked) => setContentSettings({...contentSettings, content_moderation: checked})}
                  />
                  <Label className="text-purple-300">Moderação de Conteúdo</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Informações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-300">Versão Node.js</span>
                  <span className="text-purple-100">{systemInfo?.node_version || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Versão do Sistema</span>
                  <span className="text-purple-100">{systemInfo?.app_version || "1.0.0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Banco de Dados</span>
                  <span className="text-purple-100">{systemInfo?.database_type || "Supabase"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Ambiente</span>
                  <span className="text-purple-100">{systemInfo?.environment || "production"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Ações do Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => clearCacheMutation.mutate()}
                  disabled={clearCacheMutation.isPending}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Limpar Cache do Sistema
                </Button>
                <Button
                  onClick={() => backupDatabaseMutation.mutate()}
                  disabled={backupDatabaseMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Criar Backup do Banco
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-amber-500/30 text-amber-300"
                >
                  Verificar Atualizações
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 text-red-300"
                >
                  Reiniciar Aplicação
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          disabled={updateSettingsMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Todas as Configurações"}
        </Button>
      </div>
    </div>
  );
}