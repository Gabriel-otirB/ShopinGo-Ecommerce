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
import ProductList from './components/product-list';
import UserList from './components/user-list';
import { Bounce, Flip, toast } from 'react-toastify';
import { Product } from '@/types/product';


interface Profile {
  id: string;
  email: string;
  role: "admin" | "customer";
  user_id: string;
}

const Admin = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, role, user_id");
      if (error) {
        toast.error("Erro ao buscar perfis.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          transition: Bounce,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        })
        return;
      };
      setProfiles(data);
    };
    fetchProfiles();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true);
    if (error) {
      toast.error("Erro ao buscar produtos.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      })
      return
    }
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [syncResult]);

  const handleSync = async () => {
    setLoading(true);
    setSyncResult(null);

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const token = session?.access_token;

    try {
      const res = await fetch("/api/product", {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Produtos adicionados: ${data.result.added}`);
        toast.success(`Sincronização concluída! ${data.result.added} produtos adicionados.`, {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Flip,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
        await fetchProducts();
      } else {
        setSyncResult("Erro ao sincronizar produtos.");
        toast.error("Erro ao sincronizar produtos.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          transition: Bounce,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
      }
    } catch {
      setSyncResult("Erro ao sincronizar produtos.");
      toast.error("Erro ao sincronizar produtos.", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
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
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardHeader>
              <CardTitle>Gerenciar Produtos</CardTitle>
              <CardDescription>Adicione, edite ou remova produtos do catálogo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 -mt-2">
              <div className="flex justify-between">
                <Button onClick={handleSync} disabled={loading} className="cursor-pointer">
                  {loading ? "Sincronizando..." : "Sincronizar com Painel Stripe"}
                </Button>
              </div>
              <div className="mt-4">
                <Input
                  placeholder="Buscar por nome do produto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-2 border-gray-300 dark:border-neutral-500"
                />
              </div>
              <ProductList
                products={products}
                search={search}
                onReload={fetchProducts}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardHeader>
              <CardTitle>Gerenciar Usuários</CardTitle>
              <CardDescription>Visualize usuários e altere privilégios de administrador.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 -mt-2">
              <Input
                placeholder="Buscar por email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border-2 border-gray-300 dark:border-neutral-500"
              />
              <UserList profiles={profiles} search={search} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
