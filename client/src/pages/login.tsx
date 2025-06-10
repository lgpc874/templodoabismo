import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { createDirectSupabaseClient } from "@/lib/supabase-direct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Initialize Supabase client
  useEffect(() => {
    async function initializeSupabase() {
      try {
        const client = await createDirectSupabaseClient();
        setSupabaseClient(client);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setError('Erro ao conectar com o servidor');
      }
    }

    initializeSupabase();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) {
      setError('Cliente não inicializado');
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        setLocation('/');
      }
    } catch (error: any) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">🔥</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              ACESSO AO SANCTUM
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Adentre os Portais da Sabedoria Ancestral
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Conecte-se ao <strong className="text-amber-400">Templo do Abismo</strong> e continue sua 
              <strong className="text-red-400"> jornada de autodivindade</strong>.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Initium Sapientiae"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O início da sabedoria
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="floating-card max-w-md w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-cinzel-decorative text-amber-400">
                Entrar no Templo
              </CardTitle>
              <CardDescription className="text-gray-400">
                Digite suas credenciais para acessar o portal
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-amber-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500 focus:border-amber-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-amber-300">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500 focus:border-amber-500 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold h-12 text-lg"
                >
                  {isLoading ? "Entrando..." : "Entrar no Templo"}
                </Button>
              </form>

              {/* Links Section */}
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <Link href="/esqueci-senha">
                    <Button variant="link" className="text-amber-400 hover:text-amber-300 p-0">
                      Esqueci minha senha
                    </Button>
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-500/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-black/50 px-4 text-gray-400">ou</span>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <p className="text-gray-400 text-sm">
                    Não possui uma conta?
                  </p>
                  <Link href="/cadastro">
                    <Button variant="outline" className="w-full border-amber-500/30 text-amber-300 hover:bg-amber-500/10">
                      Criar Nova Conta
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Cada retorno ao templo é uma nova oportunidade de transcendência"
            </p>
            <p className="text-amber-400 font-semibold">
              — Axioma Luciferiano
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}