import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, FileText, Settings, TrendingUp, DollarSign } from "lucide-react";
import { PagesManager } from "./components/PagesManager";
import { CoursesManager } from "./components/CoursesManager";
import { UsersManager } from "./components/UsersManager";
import { VozPlumaManager } from "./components/VozPlumaManager";
import { PaymentSettings } from "./components/PaymentSettings";
import { SiteSettings } from "./components/SiteSettings";
import { SEOManager } from "./components/SEOManager";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.8)_100%)]" />
        <div className="mystical-particles" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-cinzel font-bold text-amber-400 mb-2">
            Painel Administrativo
          </h1>
          <p className="text-purple-300">Gerenciamento Completo do Templo do Abismo</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Usuários Totais</CardTitle>
              <Users className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats?.totalUsers || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Cursos Ativos</CardTitle>
              <BookOpen className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats?.activeCourses || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Artigos Publicados</CardTitle>
              <FileText className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">{stats?.publishedPosts || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Receita Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-400">R$ {stats?.monthlyRevenue || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="pages" className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-black/40 border-purple-500/30">
            <TabsTrigger value="pages" className="text-purple-300 data-[state=active]:text-amber-400">
              Páginas
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-purple-300 data-[state=active]:text-amber-400">
              Cursos
            </TabsTrigger>
            <TabsTrigger value="users" className="text-purple-300 data-[state=active]:text-amber-400">
              Usuários
            </TabsTrigger>
            <TabsTrigger value="voz-pluma" className="text-purple-300 data-[state=active]:text-amber-400">
              Voz da Pluma
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-purple-300 data-[state=active]:text-amber-400">
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="seo" className="text-purple-300 data-[state=active]:text-amber-400">
              SEO
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-purple-300 data-[state=active]:text-amber-400">
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pages" className="mt-6">
            <PagesManager />
          </TabsContent>

          <TabsContent value="courses" className="mt-6">
            <CoursesManager />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UsersManager />
          </TabsContent>

          <TabsContent value="voz-pluma" className="mt-6">
            <VozPlumaManager />
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <PaymentSettings />
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <SEOManager />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SiteSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}