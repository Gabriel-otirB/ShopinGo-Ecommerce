"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-context";

interface Profile {
  id: string;
  email: string;
  role: "admin" | "customer";
  user_id: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, user_id");

      if (error) {
        console.error("Erro ao buscar perfis:", error);
        return;
      }

      setProfiles(data);
    };

    fetchProfiles();
  }, []);

  const handleRoleToggle = async (profile: Profile) => {
    const newRole = profile.role === "admin" ? "customer" : "admin";

    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", profile.id);

    if (error) {
      console.error("Erro ao atualizar papel:", error);
      return;
    }

    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profile.id ? { ...p, role: newRole } : p
      )
    );
  };

  const filteredProfiles = profiles
  .filter((profile) => profile.email.toLowerCase().includes(search.toLowerCase()))
  .sort((a, b) => {
    if (a.user_id === user?.id) return -1;
    if (b.user_id === user?.id) return 1;
    return 0;
  });


  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Painel Administrativo</h1>

      <Tabs defaultValue="products" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full h-full grid-cols-2 dark:bg-neutral-950 border-2 border-gray-300 dark:border-neutral-500">
          <TabsTrigger value="products" className="cursor-pointer">Produtos</TabsTrigger>
          <TabsTrigger value="users" className="cursor-pointer">Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Produtos</CardTitle>
              <CardDescription>Adicione, edite ou remova produtos do catálogo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="cursor-pointer">+ Adicionar Produto</Button>
              <div className="space-y-2">
                <div className="flex items-center justify-between border rounded p-2">
                  <span>Tênis Esportivo</span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" className="cursor-pointer">Editar</Button>
                    <Button variant="destructive" size="sm" className="cursor-pointer">Remover</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Visualize usuários e altere privilégios de administrador.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Buscar por email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {filteredProfiles.map((profile) => (
                <div
                  key={profile.id}
                  className="border rounded p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{
                      profile.user_id === user?.id && (
                        <span className="text-blue-600 hover:text-blue-400 mr-1">(Eu)</span>
                      )}{profile.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.role === "admin" ? "Administrador" : "Usuário comum"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`admin-switch-${profile.id}`}>Administrador</Label>
                    <Switch
                      id={`admin-switch-${profile.id}`}
                      checked={profile.role === "admin"}
                      onCheckedChange={() => handleRoleToggle(profile)}
                      disabled={profile.user_id === user?.id}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
