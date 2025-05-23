"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Loading from '@/components/loading';
import { Bounce, toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import PendingReviewButton from './components/pending-review-button';

// Functions for new styling and status labeling
const getBadgeColor = (status: string) => {
  switch (status) {
    case 'undefined': return 'bg-yellow-100 dark\:bg-yellow-900 text-yellow-800 dark\:text-yellow-50';
    case 'paid': return 'bg-green-100 dark\:bg-green-900 text-green-800 dark\:text-green-50';
    case 'shipped': return 'bg-blue-100 dark\:bg-blue-900 text-blue-800 dark\:text-blue-50';
    case 'delivered': return 'bg-emerald-100 dark\:bg-emerald-900 text-emerald-800 dark\:text-emerald-50';
    case 'canceled': return 'bg-red-100 dark\:bg-red-900 text-red-800 dark\:text-red-50';
    default: return '';
  }
};

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

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image_url: string;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  updated_at: string;
  total_price: number;
  payment_method: string;
  shipping_price: number | null;
  address_street: string;
  address_number: string;
  address_complement: string;
  address_neighborhood: string;
  address_city: string;
  address_state: string;
  address_zipcode: string;
}

const OrderDetail = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (orderError || !orderData) {
        toast.error("Erro ao buscar pedido.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          transition: Bounce,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
        return;
      }

      const { data: itemsData, error: itemsError } = await supabase
        .from("orders_items")
        .select("*")
        .eq("order_id", id);

      if (itemsError || !itemsData) {
        toast.error("Erro ao buscar itens.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          transition: Bounce,
          theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
        });
        return;
      }

      const enrichedItems: OrderItem[] = await Promise.all(
        itemsData.map(async (item) => {
          const { data: product, error: productError } = await supabase
            .from("products")
            .select("name, image_url")
            .eq("stripe_product_id", item.product_id)
            .single();

          if (productError || !product) {
            toast.error("Erro ao buscar produto.", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: true,
              transition: Bounce,
              theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
            });
            return {
              ...item,
              product_name: "Produto não encontrado",
              product_image_url: "",
            };
          }

          return {
            ...item,
            product_name: product.name,
            product_image_url: product.image_url[0],
          };
        })
      );

      setOrder(orderData);
      setItems(enrichedItems);
      setLoading(false);
    };

    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!id) return;

    const { error } = await supabase
      .from("orders")
      .update({
        status: "canceled",
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (!error && order) {
      // Update only the local order state
      setOrder({
        ...order,
        status: "canceled",
        updated_at: new Date().toISOString()
      });
    } else {
      toast.error("Erro ao cancelar pedido.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
    }
  };

  if (loading || !order) return <Loading />;

  return (
    <div className="container mx-auto pb-2 md:pb-4 md:pt-2 md:px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center">
          <Link href="/account" className="flex items-center">
            <Button className="bg-black hover:bg-black/90 text-white cursor-pointer" variant="default">
              <ChevronLeftIcon className="mr-1" />
              Voltar
            </Button>
          </Link>
        </div>

        <div className="flex items-center">
          <h1 className="flex-1 mx-auto text-2xl font-bold text-center">Detalhes do Pedido</h1>
        </div>

        <Card className="border-2 border-gray-300 dark:border-neutral-500">
          <CardHeader>
            <CardTitle className="text-base flex justify-between items-center">
              <span>Pedido #{String(order.id).padStart(6, "0")}</span>
              <Badge className={`${getBadgeColor(order.status)} text-sm px-4 py-0.5`}>
                {getStatusLabel(order.status)}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Realizado em {new Date(order.created_at).toLocaleDateString()}
              {(order.status === "delivered" || order.status === "shipped" || order.status === "canceled") && (
                <>
                  <br />
                  {order.status === "delivered" ? "Entregue em" : order.status === "shipped" ? "Enviado em" : "Cancelado em"}:{" "}
                  {new Date(order.updated_at).toLocaleDateString()}
                </>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h2 className="font-semibold text-base mb-2">Produtos</h2>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col gap-1 text-sm w-full mb-4">
                    <div className="flex items-start gap-3 w-full">
                      {item.product_image_url && (
                        <Link href={`/products/${item.product_id}`} className="block w-20 h-20 relative shrink-0 overflow-hidden rounded">
                          <Image
                            src={item.product_image_url}
                            alt={item.product_name}
                            fill
                            className="object-cover"
                          />
                        </Link>
                      )}

                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between">
                          <Link href={`/products/${item.product_id}`}>
                            <strong>{item.product_name}</strong>
                          </Link>
                          <span className='pl-4'>{formatCurrency(item.price / 100)}</span>
                        </div>

                        <div className='flex justify-between'>
                          <div className="text-xs text-gray-500">Quantidade: {item.quantity}</div>
                          {order.status === 'delivered' && (
                            <div className="flex justify-end">
                              <PendingReviewButton orderItemId={item.id} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>

              <Separator className="my-3" />
              <div className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">Frete</span>
                <span className="font-medium">
                  {(order.shipping_price === 0 || order.shipping_price === null)
                    ? "Grátis"
                    : formatCurrency(order.shipping_price / 100)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-sm mt-1">
                <span>Total</span>
                <span>{formatCurrency(order.total_price / 100)}</span>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-base mb-2">Endereço de Entrega</h2>
              <div className="text-sm space-y-0.5 text-gray-700 dark:text-gray-300 leading-tight">
                <p>{order.address_street}, {order.address_number} - {order.address_neighborhood}</p>
                {order.address_complement && (
                  <p>Complemento: {order.address_complement}</p>
                )}
                <p>{order.address_city} - {order.address_state}</p>
                <p>CEP: {order.address_zipcode}</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-base mb-2">Forma de Pagamento</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {order.payment_method === "card" ? "Cartão de Crédito" : "Pix"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between gap-8">
          {order.status !== "delivered" && order.status !== "canceled" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="cursor-pointer">
                  Cancelar Pedido
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Deseja cancelar o pedido?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Essa ação não pode ser desfeita. Seu pedido será cancelado.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">Voltar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                    onClick={handleCancelOrder}
                  >
                    Confirmar Cancelamento
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <a target='_blank' href='https://rastreamento.correios.com.br/app/index.php'>
            <Button className="bg-black hover:bg-black/90 text-white dark:bg-white dark:text-black dark:hover:bg-white/90 cursor-pointer">
              {order.status === "delivered" ? "Detalhes da Entrega" : "Acompanhar Pedido"}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
