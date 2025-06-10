import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function AdminTest() {
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testEndpoint = async (endpoint: string) => {
    setLoading(true);
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      if (response.ok) {
        setTestData({ endpoint, data, status: 'success' });
        toast({ title: `Sucesso: ${endpoint}`, description: 'Dados carregados' });
      } else {
        setTestData({ endpoint, data, status: 'error' });
        toast({ title: `Erro: ${endpoint}`, description: data.error || 'Falha na requisição', variant: 'destructive' });
      }
    } catch (error) {
      setTestData({ endpoint, error: error.message, status: 'error' });
      toast({ title: `Erro: ${endpoint}`, description: error.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-500 mb-8 text-center">
          Teste do Painel Administrativo
        </h1>

        <div className="grid gap-4 mb-8">
          <Button 
            onClick={() => testEndpoint('/api/admin/stats/test')}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Testar Stats API
          </Button>
          
          <Button 
            onClick={() => testEndpoint('/api/admin/pages/test')}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Testar Pages API
          </Button>
          
          <Button 
            onClick={() => testEndpoint('/api/admin/courses/test')}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Testar Courses API
          </Button>
        </div>

        {testData && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-amber-500">
                Resultado: {testData.endpoint}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded ${testData.status === 'success' ? 'bg-green-900/20' : 'bg-red-900/20'}`}>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(testData.data || testData.error, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}