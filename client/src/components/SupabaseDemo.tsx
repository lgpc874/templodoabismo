import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function SupabaseDemo() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('loading');
      const supabase = await getSupabase();
      
      // Test basic connection
      const { data, error } = await supabase.from('courses').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      setStatus('connected');
      setConnectionMessage('Supabase connection successful');
      loadCourses();
    } catch (error: any) {
      setStatus('error');
      setConnectionMessage(`Connection failed: ${error.message}`);
    }
  };

  const loadCourses = async () => {
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Failed to load courses:', error);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) return;
    
    setIsSubmitting(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      alert('User registration successful! Check your email for verification.');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateCourse = async () => {
    if (!courseTitle) return;
    
    setIsSubmitting(true);
    try {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('courses')
        .insert({
          title: courseTitle,
          description: courseDescription,
          level: 1,
          price: 0,
          is_published: true,
        })
        .select()
        .single();

      if (error) throw error;
      
      setCourseTitle('');
      setCourseDescription('');
      loadCourses();
      alert('Course created successfully!');
    } catch (error: any) {
      alert(`Failed to create course: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-black to-red-900/20 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gold mb-4">
            Templo do Abismo - Supabase Demo
          </h1>
          <p className="text-gray-300">
            Demonstração completa da integração Supabase com autenticação e banco de dados
          </p>
        </div>

        {/* Connection Status */}
        <Card className="bg-black/40 border-gold/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gold">
              <Database className="w-5 h-5" />
              Status da Conexão Supabase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              {status === 'loading' && <Loader2 className="w-4 h-4 animate-spin text-blue-400" />}
              {status === 'connected' && <CheckCircle className="w-4 h-4 text-green-400" />}
              {status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
              
              <Badge variant={status === 'connected' ? 'default' : 'destructive'}>
                {status === 'connected' ? 'Conectado' : status === 'error' ? 'Erro' : 'Conectando...'}
              </Badge>
              
              <span className="text-sm text-gray-300">{connectionMessage}</span>
            </div>
            
            <Button 
              onClick={testConnection} 
              variant="outline" 
              size="sm" 
              className="mt-3"
              disabled={status === 'loading'}
            >
              Testar Conexão
            </Button>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Authentication Demo */}
          <Card className="bg-black/40 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Demonstração de Autenticação</CardTitle>
              <CardDescription className="text-gray-400">
                Teste o registro de usuário Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  className="bg-black/20 border-gold/20"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  className="bg-black/20 border-gold/20"
                />
              </div>
              
              <Button 
                onClick={handleSignUp}
                disabled={!email || !password || isSubmitting || status !== 'connected'}
                className="w-full bg-gold/80 hover:bg-gold text-black"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Registrar Usuário
              </Button>
            </CardContent>
          </Card>

          {/* Database Operations Demo */}
          <Card className="bg-black/40 border-gold/20">
            <CardHeader>
              <CardTitle className="text-gold">Operações de Banco de Dados</CardTitle>
              <CardDescription className="text-gray-400">
                Teste a criação de cursos no Supabase
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="courseTitle" className="text-gray-300">Título do Curso</Label>
                <Input
                  id="courseTitle"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Nome do curso"
                  className="bg-black/20 border-gold/20"
                />
              </div>
              
              <div>
                <Label htmlFor="courseDescription" className="text-gray-300">Descrição</Label>
                <Textarea
                  id="courseDescription"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Descrição do curso"
                  className="bg-black/20 border-gold/20"
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleCreateCourse}
                disabled={!courseTitle || isSubmitting || status !== 'connected'}
                className="w-full bg-gold/80 hover:bg-gold text-black"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Criar Curso
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <Card className="bg-black/40 border-gold/20">
          <CardHeader>
            <CardTitle className="text-gold">Cursos Cadastrados</CardTitle>
            <CardDescription className="text-gray-400">
              Dados em tempo real do Supabase
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-gray-400 text-center py-4">
                Nenhum curso encontrado. Crie o primeiro curso acima.
              </p>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="p-3 bg-black/20 rounded border border-gold/10">
                    <h3 className="font-semibold text-gold">{course.title}</h3>
                    {course.description && (
                      <p className="text-sm text-gray-400 mt-1">{course.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs">
                        Nível {course.level}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {course.is_published ? 'Publicado' : 'Rascunho'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documentation Link */}
        <Alert className="bg-purple-900/20 border-purple-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-300">
            Para configurar seu próprio Supabase, consulte o arquivo <code>SUPABASE_SETUP.md</code> 
            na raiz do projeto para instruções completas.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}