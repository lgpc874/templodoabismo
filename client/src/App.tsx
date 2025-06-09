import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Sobre from "@/pages/sobre";
import Oraculo from "@/pages/oraculo-mystical";
import Courses from "@/pages/courses-mystical";
import Grimoires from "@/pages/grimoires-mystical";
import Bibliotheca from "@/pages/bibliotheca-mystical";
import VozDaPluma from "@/pages/voz-da-pluma-mystical";
import LiberProhibitus from "@/pages/liber-prohibitus-mystical";
import Blog from "@/pages/blog";

import AdminControl from "@/pages/admin-control";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/acesso" component={Login} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/oraculo" component={Oraculo} />
      <Route path="/courses" component={Courses} />
      <Route path="/cursos" component={Courses} />
      <Route path="/grimoires" component={Grimoires} />
      <Route path="/grimorios" component={Grimoires} />
      <Route path="/bibliotheca" component={Bibliotheca} />
      <Route path="/voz-da-pluma" component={VozDaPluma} />
      <Route path="/blog" component={Blog} />
      <Route path="/gnosis" component={Blog} />
      <Route path="/liber-prohibitus" component={LiberProhibitus} />

      <Route path="/sanctum-administratoris" component={AdminControl} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Router />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
