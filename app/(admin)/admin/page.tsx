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

const Admin = () => {
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
              <div className="border rounded p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">joao@email.com</p>
                  <p className="text-sm text-muted-foreground">Usuário comum</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="admin-switch">Administrador</Label>
                  <Switch id="admin-switch" className="cursor-pointer" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
