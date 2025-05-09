"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { useAuth } from "@/providers/auth-context";
import ProductList from './components/product-list';
import UserList from './components/user-list';

interface Profile {
  id: string;
  email: string;
  role: "admin" | "customer";
  user_id: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  active: boolean;
  image_url: string[];
  stripe_product_id: string;
}

const Admin = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  // Buscar perfis de usuário
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

  // Buscar produtos
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return;
    }

    setProducts(data);
  };

  // Buscar produtos na primeira carga e após sync
  useEffect(() => {
    fetchProducts();
  }, [syncResult]);

  // Sincronizar produtos com Stripe
  const handleSync = async () => {
    setLoading(true);
    setSyncResult(null);

    try {
      const res = await fetch("/api/sync-products", { method: "POST" });
      const data = await res.json();

      if (data.success) {
        setSyncResult(`Produtos adicionados: ${data.result.added}`);
        await fetchProducts();
      } else {
        setSyncResult("Erro ao sincronizar produtos.");
      }
    } catch (error) {
      console.error(error);
      setSyncResult("Erro ao sincronizar produtos.");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="flex justify-between">
                <Button
                  onClick={handleSync}
                  disabled={loading}
                  className="cursor-pointer"
                >
                  {loading ? "Sincronizando..." : "Sincronizar com Painel Stripe"}
                </Button>
              </div>

              {/* Campo de busca */}
              <div className="mt-4">
                <Input
                  placeholder="Buscar por nome do produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* Lista de produtos */}
              <ProductList products={products} search={search} />
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
              {/* Lista de usuários */}
              <UserList profiles={profiles} search={search} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
