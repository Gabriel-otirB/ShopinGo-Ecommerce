'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';
import AddressForm from './components/address-form';
import UserProfileForm from './components/profile-form';
import { useEffect, useState } from "react";
import { supabase } from '@/lib/supabase-client';
import { formatCurrency } from '@/lib/helper';
import { Badge } from "@/components/ui/badge";
import { Bounce, toast } from 'react-toastify';

interface Order {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  total_price: number;
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'undefined': return 'Processando';
    case 'paid': return 'Pago';
    case 'shipped': return 'Enviado';
    case 'delivered': return 'Entregue';
    case 'canceled': return 'Cancelado';
    default: return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'undefined': return 'text-yellow-600 dark:text-yellow-400';
    case 'paid': return 'text-green-600 dark:text-green-400';
    case 'shipped': return 'text-blue-600 dark:text-blue-400';
    case 'delivered': return 'text-emerald-600 dark:text-emerald-400';
    case 'canceled': return 'text-red-600 dark:text-red-400';
    default: return '';
  }
};

const getBadgeColor = (status: string) => {
  switch (status) {
    case 'undefined': return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-50';
    case 'paid': return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-50';
    case 'shipped': return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-50';
    case 'delivered': return 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-50';
    case 'canceled': return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-50';
    default: return '';
  }
};

const AccountPage = () => {
  const { signOut, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAllOrders, setShowAllOrders] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (profileError || !profileData) {
        toast.error("Erro ao buscar perfil.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          transition: Bounce,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
        return;
      }

      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("id, status, created_at, updated_at, total_price")
        .eq("profile_id", profileData.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        toast.error("Erro ao buscar pedidos.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          transition: Bounce,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
      } else {
        setOrders(ordersData || []);
      }
    };

    fetchOrders();
  }, [user]);

  const displayedOrders = showAllOrders ? orders : orders.slice(0, 2);

  return (
    <div className="container mx-auto px-4 p-2 md:pb-6 -mt-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Minha Conta</h1>

      <Tabs defaultValue="orders" className="w-full max-w-3xl mx-auto">
        <div className="overflow-x-auto">
          <TabsList className="flex w-max min-w-full h-full gap-2 px-2 py-1 dark:bg-neutral-950 border-2 border-gray-300 dark:border-neutral-500 whitespace-nowrap">
            <TabsTrigger value="orders" className="cursor-pointer">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="user" className="cursor-pointer">Dados do Usuário</TabsTrigger>
            <TabsTrigger value="address" className="cursor-pointer">Endereço</TabsTrigger>
            <TabsTrigger value="settings" className="cursor-pointer">Configurações</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="orders">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="pb-4">
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold text-center">Últimos Pedidos</h2>
                {orders.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center">Nenhum pedido encontrado.</p>
                ) : (
                  <>
                    {displayedOrders.map((order) => (
                      <Link href={`/account/order/${order.id}`} key={order.id}>
                        <div className="relative border-2 rounded p-4 hover:bg-neutral-100 hover:dark:bg-neutral-900 cursor-pointer duration-300 space-y-1">
                          <p className="font-medium">
                            Pedido #{String(order.id).padStart(8, "0")}
                          </p>

                          <p className="font-medium">
                            Status: <span className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</span>
                          </p>

                          <p>
                            <span className="font-medium">Data:</span>{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>

                          {(order.status === 'shipped' || order.status === 'delivered') && (
                            <p>
                              <span className="font-medium">
                                {order.status === 'shipped' ? 'Enviado em:' : 'Entregue em:'}
                              </span>{" "}
                              {new Date(order.updated_at).toLocaleDateString()}
                            </p>
                          )}

                          <p>
                            <span className="font-medium">Total:</span>{" "}
                            {formatCurrency(order.total_price / 100)}
                          </p>

                          <div className="absolute top-2 right-2">
                            <Badge className={`${getBadgeColor(order.status)} text-sm px-4 py-0.5`}>
                              {getStatusLabel(order.status)}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    ))}

                    {orders.length > 2 && (
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          onClick={() => setShowAllOrders(prev => !prev)}
                          className="text-sm cursor-pointer"
                        >
                          {showAllOrders ? "Ver menos" : "Ver mais"}
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Dados do Usuário</h2>
              <UserProfileForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Endereço</h2>
              <AddressForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Configurações</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    onClick={async () => {
                      await signOut();
                      window.location.href = '/';
                    }}
                    variant="destructive"
                    className="w-full cursor-pointer">
                    Sair da Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja sair?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você será desconectado imediatamente e precisará fazer login novamente para acessar sua conta.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                      onClick={signOut}
                    >
                      Sair
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
