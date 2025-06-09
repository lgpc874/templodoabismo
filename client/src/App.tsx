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
import Oraculo from "@/pages/oraculo";
import Courses from "@/pages/courses";
import Grimoires from "@/pages/grimoires";
import Bibliotheca from "@/pages/bibliotheca";
import VozDaPluma from "@/pages/voz-da-pluma";
import Vip from "@/pages/vip";
import LiberProhibitus from "@/pages/liber-prohibitus";
import ComprarTkazh from "@/pages/comprar-tkazh";
import SimpleAdminLogin from "@/pages/admin/SimpleAdminLogin";
import AdminDashboard from "@/pages/admin";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/acesso" component={Login} />
      <Route path="/sobre" component={Sobre} />
      <Route path="/oraculo" component={Oraculo} />
      <Route path="/courses" component={Courses} />
      <Route path="/grimoires" component={Grimoires} />
      <Route path="/bibliotheca" component={Bibliotheca} />
      <Route path="/voz-da-pluma" component={VozDaPluma} />
      <Route path="/vip" component={Vip} />
      <Route path="/liber-prohibitus" component={LiberProhibitus} />
      <Route path="/comprar-tkazh" component={ComprarTkazh} />
      <Route path="/magus-secretum" component={SimpleAdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
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
