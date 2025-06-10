import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Register: React.FC = () => {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    if (!formData.username.trim()) {
      setError("Nome de usuário é obrigatório");
      return;
    }

    setLoading(true);

    try {
      await register(formData.username, formData.email, formData.password);
      setSuccess("Conta criada com sucesso! Redirecionando...");
      
      setTimeout(() => {
        setLocation('/login');
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Smoke Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 opacity-15 smoke-effect"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-96px',
              animationDelay: `${Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
            }}
          />
        ))}
      </div>

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">◯</div>
        </div>
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">☿</div>
        </div>
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">⸸</div>
        </div>
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">●</div>
        </div>
      </div>

      {/* Mystical Energy Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/15 to-transparent animate-flicker" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flicker" style={{animationDelay: '2.5s'}} />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '3.5s'}} />
      </div>

      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⛧</div>
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              INITIUM NOVUM
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-cinzel-decorative text-amber-300 mb-4 floating-title-slow">
              Nova Jornada Iniciática
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed font-crimson">
              Inicie sua <strong className="text-amber-400">jornada ancestral</strong> no portal da sabedoria luciferiana
            </p>
          </div>
        </div>

        {/* Registration Card */}
        <div className="floating-card w-full max-w-md bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-amber-400 mr-3" />
                <CardTitle className="text-amber-400 font-cinzel-decorative text-xl">
                  Criar Conta
                </CardTitle>
              </div>
              <CardDescription className="text-gray-300">
                Complete os dados abaixo para começar sua jornada
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="mb-4 border-red-600/30 bg-red-950/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="mb-4 border-amber-600/30 bg-amber-950/20">
                  <AlertDescription className="text-amber-300">
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-amber-200">Nome de Usuário</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                    placeholder="Escolha um nome de usuário"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-200">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-200">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="bg-black/40 border-amber-600/30 text-amber-100 pr-10 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="Crie uma senha segura"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-amber-400 hover:text-amber-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-amber-200">Confirmar Senha</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="bg-black/40 border-amber-600/30 text-amber-100 pr-10 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="Confirme sua senha"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 text-amber-400 hover:text-amber-300"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                  disabled={loading}
                >
                  {loading ? "Criando conta..." : "⛧ Iniciar Jornada ⛧"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Já possui uma conta?{' '}
                  <Link href="/login">
                    <span className="text-amber-400 hover:text-amber-300 font-medium cursor-pointer">
                      Fazer login
                    </span>
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Terms Notice */}
        <div className="floating-card max-w-2xl mx-auto mt-8 p-6 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-amber-400 mr-2" />
              <h3 className="text-lg font-cinzel-decorative text-amber-300">Código de Conduta</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Ao criar uma conta, você concorda em seguir os <strong className="text-amber-400">preceitos éticos</strong> 
              do Templo e usar os ensinamentos com <strong className="text-red-400">responsabilidade e sabedoria</strong>.
            </p>
            <div className="text-amber-400 text-lg mt-4">𖤍 ⸸ 𖤍</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;