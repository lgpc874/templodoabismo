import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Flame, Key, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function LoginMystical() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      toast({
        title: "Ave, Iniciado",
        description: "O portal se abre para ti. Bem-vindo ao Templo.",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Acesso Negado",
        description: error.message || "As forças guardias rejeitaram tua entrada.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center">
      {/* Mystical background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-950/30 via-black to-amber-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo do Acesso" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="text-amber-400 text-6xl mb-4">⛧</div>
          <h1 className="text-4xl font-cinzel-decorative text-amber-400 mystical-glow mb-4 floating-title">
            INGRESSUS TEMPLI
          </h1>
          <div className="flex justify-center items-center space-x-6 text-amber-500 text-2xl mb-6">
            <span>☿</span>
            <span>⚹</span>
            <span>𖤍</span>
            <span>⚹</span>
            <span>☿</span>
          </div>
        </div>

        <div className="floating-card bg-black/40 backdrop-blur-lg border border-amber-500/30 rounded-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-cinzel-decorative text-amber-300 floating-title-slow">
              Portal de Acesso
            </CardTitle>
            <CardDescription className="text-gray-400 font-crimson">
              Revela tuas credenciais para adentrar os mistérios sagrados
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-300 font-cinzel-decorative flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Sigillum Electronicum
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="teu-sigil@abyssos.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="bg-black/60 border-amber-700/50 text-gray-300 placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20"
                />
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-amber-300 font-cinzel-decorative flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Arcanum Secretum
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="bg-black/60 border-amber-700/50 text-gray-300 placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-950/30 border border-red-700/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-crimson">
                      <strong>Advertentia:</strong> O acesso aos mistérios é reservado aos iniciados. 
                      Apenas aqueles com credenciais válidas podem transpor este umbral.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white font-cinzel-decorative text-lg py-6 mystical-glow"
              >
                <Flame className="w-5 h-5 mr-2" />
                {isLoading ? "Invocando..." : "Adentrar o Templo"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {/* Links */}
            <div className="text-center space-y-4">
              <div className="text-amber-400 text-xl">𖤍 ⸸ 𖤍</div>
              
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-crimson">
                  Ainda não possuis as chaves do acesso?
                </p>
                <Link href="/register">
                  <Button variant="ghost" className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 font-cinzel-decorative">
                    Iniciar Jornada de Iniciação
                  </Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-amber-700/30">
                <Link href="/">
                  <Button variant="ghost" className="text-gray-400 hover:text-gray-300 hover:bg-gray-800/20 text-sm">
                    ← Retornar ao Sanctuarium
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Footer mystical text */}
        <div className="text-center mt-8">
          <p className="text-sm font-cinzel-decorative text-amber-300 opacity-70">
            "Audentes Fortuna Iuvat"
          </p>
          <p className="text-xs text-gray-400 font-crimson italic mt-1">
            A fortuna favorece os audazes
          </p>
        </div>
      </div>
    </div>
  );
}