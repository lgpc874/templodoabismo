import { Switch, Route } from "wouter";
import React, { lazy } from "react";
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
      <Route path="/courses" component={lazy(() => import("./pages/courses"))} />
      <Route path="/grimoires" component={lazy(() => import("./pages/grimoires"))} />
      <Route path="/bibliotheca" component={lazy(() => import("./pages/bibliotheca"))} />
      <Route path="/voz-da-pluma" component={lazy(() => import("./pages/voz-da-pluma"))} />
      <Route path="/vip" component={lazy(() => import("./pages/vip"))} />
      <Route path="/liber-prohibitus" component={lazy(() => import("./pages/liber-prohibitus"))} />
      <Route path="/comprar-tkazh" component={lazy(() => import("./pages/comprar-tkazh"))} />
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
