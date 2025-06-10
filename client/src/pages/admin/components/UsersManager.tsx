import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Users, Shield, Crown, Eye, Edit, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: string;
  email: string;
  username: string;
  initiation_level: number;
  magical_name: string;
  member_type: string;
  role: string;
  is_active: boolean;
  created_at: string;
  last_login: string;
  subscription_type: string;
  subscription_expires_at: string;
  courses_completed: string[];
  achievements: string[];
}

export function UsersManager() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [filterRole, setFilterRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["/api/admin/users", filterRole, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterRole !== "all") params.append("role", filterRole);
      if (searchTerm) params.append("search", searchTerm);
      return apiRequest(`/api/admin/users?${params.toString()}`);
    }
  });

  const { data: userStats } = useQuery({
    queryKey: ["/api/admin/users/stats"],
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ userId, updates }: { userId: string; updates: any }) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: "PUT",
        body: updates
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuário Atualizado",
        description: "As informações do usuário foram atualizadas"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsEditing(false);
      setSelectedUser(null);
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar usuário",
        variant: "destructive"
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return apiRequest(`/api/admin/users/${userId}`, {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      toast({
        title: "Usuário Removido",
        description: "O usuário foi removido do sistema"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover usuário",
        variant: "destructive"
      });
    }
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return apiRequest(`/api/admin/users/${userId}/toggle-status`, {
        method: "POST",
        body: { is_active: !isActive }
      });
    },
    onSuccess: () => {
      toast({
        title: "Status Alterado",
        description: "O status do usuário foi alterado"
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao alterar status",
        variant: "destructive"
      });
    }
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'moderator': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'instructor': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'premium': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getMemberTypeBadge = (memberType: string) => {
    const types = {
      'initiate': { label: 'Iniciado', level: 1 },
      'adept': { label: 'Adepto', level: 2 },
      'magus': { label: 'Magus', level: 3 },
      'master': { label: 'Mestre', level: 4 },
      'admin': { label: 'Administrador', level: 5 }
    };
    return types[memberType as keyof typeof types] || { label: memberType, level: 1 };
  };

  const filteredUsers = users?.filter((user: User) => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.magical_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-purple-300">Carregando usuários...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-cinzel text-amber-400">Gerenciar Usuários</h2>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Total de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-400">{userStats?.total || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Usuários Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">{userStats?.active || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Novos (30 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">{userStats?.new_users || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-purple-300">Assinantes Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">{userStats?.premium || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="bg-black/40 border-purple-500/30">
        <CardContent className="pt-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search" className="text-purple-300">Buscar Usuários</Label>
              <Input
                id="search"
                placeholder="Email, username ou nome mágico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-black/20 border-purple-500/30 text-purple-100"
              />
            </div>
            <div>
              <Label className="text-purple-300">Filtrar por Papel</Label>
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-40 bg-black/20 border-purple-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                  <SelectItem value="moderator">Moderadores</SelectItem>
                  <SelectItem value="instructor">Instrutores</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="user">Usuários</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <div className="grid gap-4">
        {filteredUsers.map((user: User) => (
          <Card key={user.id} className="bg-black/40 border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-medium text-purple-100">
                      {user.magical_name || user.username || user.email}
                    </h3>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {user.role === 'admin' && <Crown className="w-3 h-3 mr-1" />}
                      {user.role === 'moderator' && <Shield className="w-3 h-3 mr-1" />}
                      {user.role}
                    </Badge>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                      {getMemberTypeBadge(user.member_type).label}
                    </Badge>
                    {!user.is_active && (
                      <Badge variant="destructive">Inativo</Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-purple-400">
                    <p>Email: {user.email}</p>
                    {user.username && <p>Username: {user.username}</p>}
                    <p>Nível de Iniciação: {user.initiation_level}/5</p>
                    <p>Tipo de Assinatura: {user.subscription_type || 'free'}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-400" />
                        {user.achievements?.length || 0} conquistas
                      </span>
                      <span>
                        {user.courses_completed?.length || 0} cursos concluídos
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-purple-500 mt-2">
                    Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    {user.last_login && ` • Último acesso: ${new Date(user.last_login).toLocaleDateString('pt-BR')}`}
                  </p>
                </div>
                
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                        className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black/90 border-purple-500/30 text-purple-100">
                      <DialogHeader>
                        <DialogTitle className="text-amber-400">Detalhes do Usuário</DialogTitle>
                      </DialogHeader>
                      {selectedUser && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-purple-300">Email</Label>
                              <Input
                                value={selectedUser.email}
                                readOnly
                                className="bg-black/20 border-purple-500/30"
                              />
                            </div>
                            <div>
                              <Label className="text-purple-300">Username</Label>
                              <Input
                                value={selectedUser.username || ""}
                                readOnly
                                className="bg-black/20 border-purple-500/30"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-purple-300">Nome Mágico</Label>
                            <Input
                              value={selectedUser.magical_name || ""}
                              readOnly
                              className="bg-black/20 border-purple-500/30"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-purple-300">Papel</Label>
                              <Select
                                value={selectedUser.role}
                                onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                              >
                                <SelectTrigger className="bg-black/20 border-purple-500/30">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="user">Usuário</SelectItem>
                                  <SelectItem value="premium">Premium</SelectItem>
                                  <SelectItem value="instructor">Instrutor</SelectItem>
                                  <SelectItem value="moderator">Moderador</SelectItem>
                                  <SelectItem value="admin">Administrador</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-purple-300">Nível de Iniciação</Label>
                              <Select
                                value={selectedUser.initiation_level.toString()}
                                onValueChange={(value) => setSelectedUser({...selectedUser, initiation_level: parseInt(value)})}
                              >
                                <SelectTrigger className="bg-black/20 border-purple-500/30">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 - Iniciado</SelectItem>
                                  <SelectItem value="2">2 - Adepto</SelectItem>
                                  <SelectItem value="3">3 - Magus</SelectItem>
                                  <SelectItem value="4">4 - Mestre</SelectItem>
                                  <SelectItem value="5">5 - Hierofante</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={selectedUser.is_active}
                              onCheckedChange={(checked) => setSelectedUser({...selectedUser, is_active: checked})}
                            />
                            <Label className="text-purple-300">Usuário Ativo</Label>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => updateUserMutation.mutate({
                                userId: selectedUser.id,
                                updates: {
                                  role: selectedUser.role,
                                  initiation_level: selectedUser.initiation_level,
                                  is_active: selectedUser.is_active
                                }
                              })}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Salvar Alterações
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toggleUserStatusMutation.mutate({ 
                      userId: user.id, 
                      isActive: user.is_active 
                    })}
                    className={user.is_active 
                      ? "border-orange-500/30 text-orange-300 hover:bg-orange-500/20"
                      : "border-green-500/30 text-green-300 hover:bg-green-500/20"
                    }
                  >
                    {user.is_active ? "Desativar" : "Ativar"}
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteUserMutation.mutate(user.id)}
                    className="border-red-500/30 text-red-300 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-purple-400">
            Nenhum usuário encontrado com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
}