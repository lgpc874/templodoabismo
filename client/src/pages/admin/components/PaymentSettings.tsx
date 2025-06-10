import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, Settings, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function PaymentSettings() {
  const [showSecrets, setShowSecrets] = useState(false);
  const [paypalSettings, setPaypalSettings] = useState({
    enabled: false,
    sandbox_mode: true,
    client_id: "",
    client_secret: "",
    webhook_url: ""
  });
  const [infinitepaySettings, setInfinitepaySettings] = useState({
    enabled: false,
    api_key: "",
    webhook_secret: "",
    environment: "sandbox"
  });
  const [pixSettings, setPixSettings] = useState({
    enabled: false,
    bank_account: "",
    pix_key: "",
    auto_confirm: false
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: paymentStats } = useQuery({
    queryKey: ["/api/admin/payments/stats"],
  });

  const { data: currentSettings } = useQuery({
    queryKey: ["/api/admin/payments/settings"],
    onSuccess: (data) => {
      if (data.paypal) setPaypalSettings(data.paypal);
      if (data.infinitepay) setInfinitepaySettings(data.infinitepay);
      if (data.pix) setPixSettings(data.pix);
    }
  });

  const { data: recentTransactions } = useQuery({
    queryKey: ["/api/admin/payments/recent"],
  });

  const updatePaymentSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return apiRequest("/api/admin/payments/settings", {
        method: "PUT",
        body: settings
      });
    },
    onSuccess: () => {
      toast({
        title: "Configurações Salvas",
        description: "As configurações de pagamento foram atualizadas"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao salvar configurações",
        variant: "destructive"
      });
    }
  });

  const testPaymentConnectionMutation = useMutation({
    mutationFn: async (provider: string) => {
      return apiRequest(`/api/admin/payments/test/${provider}`, {
        method: "POST"
      });
    },
    onSuccess: (data, provider) => {
      toast({
        title: "Conexão Testada",
        description: `${provider} conectado com sucesso`
      });
    },
    onError: (error, provider) => {
      toast({
        title: "Erro de Conexão",
        description: `Falha ao conectar com ${provider}`,
        variant: "destructive"
      });
    }
  });

  const handleSaveSettings = () => {
    const allSettings = {
      paypal: paypalSettings,
      infinitepay: infinitepaySettings,
      pix: pixSettings
    };
    updatePaymentSettingsMutation.mutate(allSettings);
  };

  const getStatusBadge = (enabled: boolean) => {
    return enabled ? (
      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>
    ) : (
      <Badge variant="outline" className="border-gray-500/30 text-gray-400">Inativo</Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-amber-400">Configurações de Pagamento</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSecrets(!showSecrets)}
            className="border-purple-500/30 text-purple-300"
          >
            {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSecrets ? "Ocultar" : "Mostrar"} Chaves
          </Button>
        </div>
      </div>

      {/* Estatísticas de Pagamento */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Receita Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCurrency(paymentStats?.total_revenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Este Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">
              {formatCurrency(paymentStats?.monthly_revenue || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {paymentStats?.total_transactions || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Taxa de Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {paymentStats?.success_rate || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="providers" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/40 border-purple-500/30">
          <TabsTrigger value="providers" className="text-purple-300 data-[state=active]:text-amber-400">
            Provedores
          </TabsTrigger>
          <TabsTrigger value="transactions" className="text-purple-300 data-[state=active]:text-amber-400">
            Transações
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-purple-300 data-[state=active]:text-amber-400">
            Análises
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="mt-6">
          <div className="space-y-6">
            {/* PayPal */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    PayPal
                  </div>
                  {getStatusBadge(paypalSettings.enabled)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={paypalSettings.enabled}
                    onCheckedChange={(checked) => setPaypalSettings({...paypalSettings, enabled: checked})}
                  />
                  <Label className="text-purple-300">Habilitar PayPal</Label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-300">Client ID</Label>
                    <Input
                      type={showSecrets ? "text" : "password"}
                      value={paypalSettings.client_id}
                      onChange={(e) => setPaypalSettings({...paypalSettings, client_id: e.target.value})}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Client Secret</Label>
                    <Input
                      type={showSecrets ? "text" : "password"}
                      value={paypalSettings.client_secret}
                      onChange={(e) => setPaypalSettings({...paypalSettings, client_secret: e.target.value})}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="PayPal Client Secret"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-purple-300">Webhook URL</Label>
                  <Input
                    value={paypalSettings.webhook_url}
                    onChange={(e) => setPaypalSettings({...paypalSettings, webhook_url: e.target.value})}
                    className="bg-black/20 border-purple-500/30 text-purple-100"
                    placeholder="https://templodoabismo.com/api/webhooks/paypal"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={paypalSettings.sandbox_mode}
                    onCheckedChange={(checked) => setPaypalSettings({...paypalSettings, sandbox_mode: checked})}
                  />
                  <Label className="text-purple-300">Modo Sandbox (Teste)</Label>
                </div>

                <Button
                  onClick={() => testPaymentConnectionMutation.mutate("paypal")}
                  disabled={testPaymentConnectionMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            {/* InfinitePay */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    InfinitePay
                  </div>
                  {getStatusBadge(infinitepaySettings.enabled)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={infinitepaySettings.enabled}
                    onCheckedChange={(checked) => setInfinitepaySettings({...infinitepaySettings, enabled: checked})}
                  />
                  <Label className="text-purple-300">Habilitar InfinitePay</Label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-300">API Key</Label>
                    <Input
                      type={showSecrets ? "text" : "password"}
                      value={infinitepaySettings.api_key}
                      onChange={(e) => setInfinitepaySettings({...infinitepaySettings, api_key: e.target.value})}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="InfinitePay API Key"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Webhook Secret</Label>
                    <Input
                      type={showSecrets ? "text" : "password"}
                      value={infinitepaySettings.webhook_secret}
                      onChange={(e) => setInfinitepaySettings({...infinitepaySettings, webhook_secret: e.target.value})}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="Webhook Secret"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => testPaymentConnectionMutation.mutate("infinitepay")}
                  disabled={testPaymentConnectionMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Testar Conexão
                </Button>
              </CardContent>
            </Card>

            {/* PIX */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    PIX
                  </div>
                  {getStatusBadge(pixSettings.enabled)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={pixSettings.enabled}
                    onCheckedChange={(checked) => setPixSettings({...pixSettings, enabled: checked})}
                  />
                  <Label className="text-purple-300">Habilitar PIX</Label>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-purple-300">Chave PIX</Label>
                    <Input
                      value={pixSettings.pix_key}
                      onChange={(e) => setPixSettings({...pixSettings, pix_key: e.target.value})}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="contato@templodoabismo.com"
                    />
                  </div>
                  <div>
                    <Label className="text-purple-300">Conta Bancária</Label>
                    <Input
                      value={pixSettings.bank_account}
                      onChange={(e) => setPixSettings({...pixSettings, bank_account: e.target.value})}
                      className="bg-black/20 border-purple-500/30 text-purple-100"
                      placeholder="Banco - Agência - Conta"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={pixSettings.auto_confirm}
                    onCheckedChange={(checked) => setPixSettings({...pixSettings, auto_confirm: checked})}
                  />
                  <Label className="text-purple-300">Confirmação Automática</Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button 
                onClick={handleSaveSettings}
                disabled={updatePaymentSettingsMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updatePaymentSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card className="bg-black/40 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-amber-400">Transações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions?.map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-purple-500/20">
                    <div>
                      <h4 className="text-purple-100 font-medium">
                        {formatCurrency(transaction.amount_brl)}
                      </h4>
                      <p className="text-sm text-purple-400">
                        {transaction.payment_method} • {transaction.item_type}
                      </p>
                      <p className="text-xs text-purple-500">
                        {new Date(transaction.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'default' : 'outline'}
                      className={
                        transaction.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                )) || (
                  <p className="text-purple-400 text-center py-8">
                    Nenhuma transação encontrada
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Receita por Método</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentStats?.by_method?.map((method: any) => (
                    <div key={method.name} className="flex justify-between items-center">
                      <span className="text-purple-300">{method.name}</span>
                      <div className="text-right">
                        <div className="text-amber-400 font-medium">
                          {formatCurrency(method.amount)}
                        </div>
                        <div className="text-xs text-purple-500">
                          {method.percentage}%
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-purple-400 text-center py-4">
                      Dados insuficientes
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-amber-400">Receita por Produto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentStats?.by_product?.map((product: any) => (
                    <div key={product.type} className="flex justify-between items-center">
                      <span className="text-purple-300">{product.type}</span>
                      <div className="text-right">
                        <div className="text-amber-400 font-medium">
                          {formatCurrency(product.amount)}
                        </div>
                        <div className="text-xs text-purple-500">
                          {product.count} vendas
                        </div>
                      </div>
                    </div>
                  )) || (
                    <p className="text-purple-400 text-center py-4">
                      Dados insuficientes
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