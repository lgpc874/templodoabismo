
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/home";
import Sobre from "@/pages/sobre";
import Oraculo from "@/pages/oraculo";
import Grimoires from "@/pages/grimoires";
import Courses from "@/pages/courses";
import VozDaPluma from "@/pages/voz-da-pluma";
import Bibliotheca from "@/pages/bibliotheca";
import LiberProhibitus from "@/pages/liber-prohibitus";
import MagusSecretum from "@/pages/magus-secretum";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/oraculo" component={Oraculo} />
      <Route path="/grimorios" component={Grimoires} />
      <Route path="/cursos" component={Courses} />
      <Route path="/voz-da-pluma" component={VozDaPluma} />
      <Route path="/bibliotheca" component={Bibliotheca} />
      <Route path="/liber-prohibitus" component={LiberProhibitus} />
      <Route path="/magus-secretum" component={MagusSecretum} />
      <Route path="/login" component={Login} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div 
            className="min-h-screen bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('https://i.postimg.cc/qqX1Q7zn/Textura-envelhecida-e-marcada-pelo-tempo.png')"
            }}
          >
            <div className="min-h-screen bg-black/70">
              <Toaster />
              <Router />
            </div>
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
