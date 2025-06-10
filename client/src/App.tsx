import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Sobre from "@/pages/sobre";
import Oraculo from "@/pages/oraculo-supabase";
import Oracle from "@/pages/oracle";
import CourseDetail from "@/pages/course-detail";
import Profile from "@/pages/profile";
import StudentProfile from "@/pages/student-profile";
import GrimoiresOld from "@/pages/grimoires-mystical";
import Grimoires from "@/pages/grimoires-new";
import Bibliotheca from "@/pages/bibliotheca";
import VozDaPluma from "@/pages/voz-da-pluma";
import LiberProhibitus from "@/pages/liber-prohibitus-mystical";
import Blog from "@/pages/blog-new";


import AdminControl from "@/pages/admin-control";
import Register from "@/pages/register";
import AdminPanel from "@/pages/admin";
import OracleTest from "@/pages/oracle-test";
import SetupAdmin from "@/pages/setup-admin";

function Router() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/acesso" component={Login} />
          <Route path="/sobre" component={Sobre} />
          <Route path="/oraculo" component={Oracle} />

          <Route path="/curso/:slug" component={CourseDetail} />
          <Route path="/profile" component={Profile} />
          <Route path="/perfil" component={StudentProfile} />
          <Route path="/estudante" component={StudentProfile} />
          <Route path="/grimoires" component={Grimoires} />
          <Route path="/grimorios" component={Grimoires} />
          <Route path="/bibliotheca" component={Bibliotheca} />
          <Route path="/voz-da-pluma" component={VozDaPluma} />
          <Route path="/blog" component={Blog} />
          <Route path="/gnosis" component={Blog} />
          <Route path="/liber-prohibitus" component={LiberProhibitus} />
          <Route path="/oracle-test" component={OracleTest} />
          <Route path="/setup-admin" component={SetupAdmin} />
          <Route path="/admin" component={AdminPanel} />
          <Route path="/sanctum-administratoris" component={AdminControl} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
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
