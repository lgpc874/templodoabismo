import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createDirectSupabaseClient } from "@/lib/supabase-direct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Flame, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!supabaseClient) {
      setError("Cliente não inicializado");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (authError) {
        console.error('Login error:', authError);
        setError(authError.message === 'Invalid login credentials' ? 
          'Credenciais inválidas' : authError.message);
        return;
      }

      if (data?.user) {
        setSuccess("Login realizado com sucesso!");
        setTimeout(() => {
          setLocation("/");
        }, 1000);
      }
    } catch (error: any) {
      console.error('Login exception:', error);
      setError("Erro interno do servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    if (!registerData.username.trim()) {
      setError("Nome de usuário é obrigatório");
      setIsLoading(false);
      return;
    }

    if (!supabaseClient) {
      setError("Cliente não inicializado");
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting registration for:', registerData.email);
      
      const { data, error: authError } = await supabaseClient.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username,
            initiation_level: 1,
            personal_seal_generated: false,
            is_admin: false
          }
        }
      });

      if (authError) {
        console.error('Registration error:', authError);
        if (authError.message.includes('already registered')) {
          setError('Este email já está registrado');
        } else {
          setError(authError.message);
        }
        return;
      }

      if (data?.user) {
        console.log('User registered successfully:', data.user.id);
        setSuccess("Conta criada com sucesso! Redirecionando...");
        
        // Clear form
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });

        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration exception:', error);
      setError(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black">
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Flame className="w-16 h-16 mx-auto text-red-500 mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-red-400 mb-2">
              Porta Accessus
            </h1>
            <p className="text-red-300">
              Ingressus in Templum Abyssos
            </p>
          </div>

          <Card className="bg-black/60 backdrop-blur-sm border-red-900/30">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/40">
                <TabsTrigger value="login" className="data-[state=active]:bg-red-800">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-red-800">
                  Registrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardHeader>
                  <CardTitle className="text-red-400">Bem-vindo de volta</CardTitle>
                  <CardDescription className="text-red-300">
                    Entre com suas credenciais para acessar o Templo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4 border-red-900/30 bg-red-950/20">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="mb-4 border-green-900/30 bg-green-950/20">
                      <AlertDescription className="text-green-300">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-red-200">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100 focus:border-red-600"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-red-200">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="bg-black/40 border-red-900/30 text-red-100 pr-10 focus:border-red-600"
                          placeholder="Sua senha"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-red-400 hover:text-red-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-red-800 hover:bg-red-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar no Templo"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="register">
                <CardHeader>
                  <CardTitle className="text-red-400">Inicie sua Jornada</CardTitle>
                  <CardDescription className="text-red-300">
                    Entre no portal de conhecimentos ancestrais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert className="mb-4 border-red-900/30 bg-red-950/20">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <AlertDescription className="text-red-300">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  {success && (
                    <Alert className="mb-4 border-green-900/30 bg-green-950/20">
                      <AlertDescription className="text-green-300">
                        {success}
                      </AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username" className="text-red-200">Nome de Usuário</Label>
                      <Input
                        id="register-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100 focus:border-red-600"
                        placeholder="Seu nome no templo"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-red-200">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100 focus:border-red-600"
                        placeholder="seu@email.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-red-200">Senha</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="bg-black/40 border-red-900/30 text-red-100 pr-10 focus:border-red-600"
                          placeholder="Mínimo 6 caracteres"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-red-400 hover:text-red-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-red-200">Confirmar Senha</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100 focus:border-red-600"
                        placeholder="Confirme sua senha"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-red-800 hover:bg-red-700 text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Iniciar Jornada"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}