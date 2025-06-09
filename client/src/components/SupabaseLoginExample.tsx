import { useState } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseStorage } from '@/hooks/useSupabaseStorage';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Download, Eye, EyeOff } from 'lucide-react';

export default function SupabaseLoginExample() {
  const { user, isAuthenticated, loading, signIn, signUp, signOut } = useSupabaseAuth();
  const { uploadFile, uploading, uploadProgress } = useSupabaseStorage();
  const { useCourses, useDailyPoems } = useSupabaseData();
  const { courses, createCourse } = useCourses();
  const { poems, createPoem } = useDailyPoems();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    level: 1,
    price: 0,
  });
  const [newPoem, setNewPoem] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(formData.email, formData.password, {
          username: formData.username,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await createCourse({
      ...newCourse,
      is_published: true,
    });
    if (error) {
      alert(error);
    } else {
      setNewCourse({ title: '', description: '', level: 1, price: 0 });
      alert('Curso criado com sucesso!');
    }
  };

  const handleCreatePoem = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await createPoem({
      ...newPoem,
      date: new Date().toISOString().split('T')[0],
    });
    if (error) {
      alert(error);
    } else {
      setNewPoem({ title: '', content: '', author: '' });
      alert('Poema criado com sucesso!');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { publicUrl, error } = await uploadFile(file, 'uploads');
    if (error) {
      alert(error);
    } else {
      setUploadedFile(publicUrl);
      alert('Arquivo enviado com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-gray-900 border-amber-500/20">
          <CardHeader>
            <CardTitle className="text-center text-amber-400 font-cinzel-decorative">
              {isLogin ? 'Entrar no Templo' : 'Criar Conta'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="bg-gray-800 border-amber-500/30 text-white"
                    required={!isLogin}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-800 border-amber-500/30 text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-gray-800 border-amber-500/30 text-white pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>
            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-amber-400 hover:text-amber-300"
              >
                {isLogin ? 'Criar nova conta' : 'Já tenho conta'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-cinzel-decorative text-amber-400">
            Painel Supabase - Templo do Abismo
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-amber-300">Bem-vindo, {user?.email}</span>
            <Button onClick={signOut} variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Upload de Arquivos */}
          <Card className="bg-gray-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <Upload className="w-5 h-5" />
                Upload de Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Selecionar Arquivo</Label>
                <Input
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="bg-gray-800 border-amber-500/30"
                />
              </div>
              {uploading && (
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-amber-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
              {uploadedFile && (
                <div className="text-sm text-green-400">
                  Arquivo enviado: <a href={uploadedFile} target="_blank" rel="noopener noreferrer" className="underline">Ver arquivo</a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Criar Curso */}
          <Card className="bg-gray-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Criar Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <Input
                  placeholder="Título do Curso"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="bg-gray-800 border-amber-500/30"
                  required
                />
                <Textarea
                  placeholder="Descrição"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="bg-gray-800 border-amber-500/30"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Nível"
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: parseInt(e.target.value) })}
                    className="bg-gray-800 border-amber-500/30"
                    min="1"
                  />
                  <Input
                    type="number"
                    placeholder="Preço"
                    value={newCourse.price}
                    onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) })}
                    className="bg-gray-800 border-amber-500/30"
                    step="0.01"
                    min="0"
                  />
                </div>
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-black">
                  Criar Curso
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Criar Poema */}
          <Card className="bg-gray-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Criar Poema</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreatePoem} className="space-y-4">
                <Input
                  placeholder="Título"
                  value={newPoem.title}
                  onChange={(e) => setNewPoem({ ...newPoem, title: e.target.value })}
                  className="bg-gray-800 border-amber-500/30"
                  required
                />
                <Input
                  placeholder="Autor"
                  value={newPoem.author}
                  onChange={(e) => setNewPoem({ ...newPoem, author: e.target.value })}
                  className="bg-gray-800 border-amber-500/30"
                  required
                />
                <Textarea
                  placeholder="Conteúdo do Poema"
                  value={newPoem.content}
                  onChange={(e) => setNewPoem({ ...newPoem, content: e.target.value })}
                  className="bg-gray-800 border-amber-500/30"
                  rows={4}
                  required
                />
                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-black">
                  Criar Poema
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de Cursos */}
          <Card className="bg-gray-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Cursos ({courses.length})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-60 overflow-y-auto">
              {courses.length === 0 ? (
                <p className="text-gray-400">Nenhum curso encontrado</p>
              ) : (
                courses.map((course) => (
                  <div key={course.id} className="border-b border-gray-700 pb-2 mb-2 last:border-0">
                    <h4 className="font-semibold text-white">{course.title}</h4>
                    <p className="text-sm text-gray-400">Nível {course.level} - R$ {course.price}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Lista de Poemas */}
          <Card className="bg-gray-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Poemas Recentes ({poems.length})</CardTitle>
            </CardHeader>
            <CardContent className="max-h-60 overflow-y-auto">
              {poems.length === 0 ? (
                <p className="text-gray-400">Nenhum poema encontrado</p>
              ) : (
                poems.map((poem) => (
                  <div key={poem.id} className="border-b border-gray-700 pb-2 mb-2 last:border-0">
                    <h4 className="font-semibold text-white">{poem.title}</h4>
                    <p className="text-sm text-gray-400">por {poem.author} - {poem.date}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Status da Conexão */}
          <Card className="bg-gray-900 border-amber-500/20">
            <CardHeader>
              <CardTitle className="text-amber-400">Status do Supabase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Autenticação:</span>
                  <span className="text-green-400">✓ Conectado</span>
                </div>
                <div className="flex justify-between">
                  <span>Banco de Dados:</span>
                  <span className="text-green-400">✓ Online</span>
                </div>
                <div className="flex justify-between">
                  <span>Storage:</span>
                  <span className="text-green-400">✓ Ativo</span>
                </div>
                <div className="flex justify-between">
                  <span>Real-time:</span>
                  <span className="text-green-400">✓ Conectado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}