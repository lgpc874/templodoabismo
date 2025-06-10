import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Flame, Key, Mail, User, ArrowRight, AlertTriangle, Scroll, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RegisterMystical() {
  const [, setLocation] = useLocation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Arcanum Incongruens",
        description: "Os arcanos secretos não coincidem. Verifica tuas palavras de poder.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      toast({
        title: "Iniciação Completada",
        description: "Bem-vindo ao círculo dos iniciados. Tua jornada no Templo do Abismo começa agora.",
      });
      setLocation("/");
    } catch (error: any) {
      toast({
        title: "Iniciação Rejeitada",
        description: error.message || "As forças guardiãs não aprovaram tua entrada.",
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
    <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center py-8">
      {/* Mystical background elements */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-950/30 via-black to-red-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo da Iniciação" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Register form */}
      <div className="relative z-10 w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="text-amber-400 text-6xl mb-4">⛧</div>
          <h1 className="text-4xl font-cinzel-decorative text-amber-400 mystical-glow mb-4 floating-title">
            INITIATIO PRIMA
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
              Ritual de Iniciação
            </CardTitle>
            <CardDescription className="text-gray-400 font-crimson">
              Forja tuas credenciais para adentrar o círculo dos iniciados
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-amber-300 font-cinzel-decorative flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Nomen Mysticum
                </Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="AdeptusUmbrae"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="bg-black/60 border-amber-700/50 text-gray-300 placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20"
                />
                <p className="text-xs text-gray-500 font-crimson">
                  Escolhe um nome que te representará no Templo
                </p>
              </div>

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
                  placeholder="initiate@abyssos.com"
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
                <p className="text-xs text-gray-500 font-crimson">
                  Mínimo 8 caracteres. Que seja forte como as forças que invocas.
                </p>
              </div>

              {/* Confirm Password field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-amber-300 font-cinzel-decorative flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Confirmatio Arcani
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="bg-black/60 border-amber-700/50 text-gray-300 placeholder-gray-500 focus:border-amber-500 focus:ring-amber-500/20 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-400 hover:text-amber-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="bg-red-950/30 border border-red-700/50 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="text-red-300 text-sm font-crimson mb-2">
                      <strong>Pactum Initiationis:</strong>
                    </p>
                    <ul className="text-red-300 text-xs font-crimson space-y-1">
                      <li>• Aceitas a responsabilidade pelos conhecimentos adquiridos</li>
                      <li>• Concordas em usar a sabedoria ancestral com prudência</li>
                      <li>• Reconheces que todo poder tem suas consequências</li>
                      <li>• Prometes respeitar os mistérios sagrados do Templo</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-cinzel-decorative text-lg py-6 mystical-glow"
              >
                <Scroll className="w-5 h-5 mr-2" />
                {isLoading ? "Realizando Ritual..." : "Completar Iniciação"}
                <Flame className="w-5 h-5 ml-2" />
              </Button>
            </form>

            {/* Links */}
            <div className="text-center space-y-4">
              <div className="text-amber-400 text-xl">𖤍 ⸸ 𖤍</div>
              
              <div className="space-y-2">
                <p className="text-gray-400 text-sm font-crimson">
                  Já possuis as chaves do acesso?
                </p>
                <Link href="/login">
                  <Button variant="ghost" className="text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 font-cinzel-decorative">
                    Retornar ao Portal de Acesso
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
            "Solve et Coagula"
          </p>
          <p className="text-xs text-gray-400 font-crimson italic mt-1">
            Dissolve e coagula - destrua para reconstruir
          </p>
        </div>
      </div>
    </div>
  );
}