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
import { ChevronLeftIcon, MoveLeft } from 'lucide-react';
import Link from 'next/link';

const OrderDetail = () => {
  const order = {
    id: "ORD-789456",
    status: "Em trânsito",
    createdAt: "02/05/2025",
    total: 25990,
    paymentMethod: "Cartão de Crédito",
    address: {
      cep: "01001-000",
      rua: "Rua das Flores",
      numero: "123",
      complemento: "Apto 45B",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
    },
    items: [
      {
        id: "1",
        name: "Tênis Esportivo MaxRun",
        quantity: 1,
        price: 15990,
      },
      {
        id: "2",
        name: "Meias de Compressão (par)",
        quantity: 2,
        price: 5000,
      },
    ],
  };

  return (
    <div className="container mx-auto pb-2 md:pb-4 md:pt-2 px-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <span className="flex items-center font-medium m-0">
          <Link href="/account" className='flex items-center'>
            <ChevronLeftIcon />
            <span className="hover:underline">Voltar</span>
          </Link>
        </span>
        <div className='flex items-center'>
          <h1 className="flex-1 mx-auto text-xl font-bold text-center">Detalhes do Pedido</h1>
        </div>

        <Card className='border-2 border-gray-300 dark:border-neutral-500'>
          <CardHeader>
            <CardTitle className="text-base flex justify-between items-center">
              <span>Pedido #{order.id}</span>
              <Badge
                variant="outline"
                className={
                  order.status === "Entregue"
                    ? "text-green-600 border-green-600"
                    : order.status === "Em trânsito"
                      ? "text-yellow-600 border-yellow-600"
                      : "text-red-600 border-red-600"
                }
              >
                {order.status}
              </Badge>
            </CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              Realizado em {order.createdAt}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <h2 className="font-semibold text-base mb-2">Produtos</h2>
              <div className="space-y-1.5">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="truncate">{item.name} x{item.quantity}</span>
                    <span className="ml-4 shrink-0">
                      {formatCurrency(item.price * item.quantity / 100)}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-medium text-sm">
                <span>Total</span>
                <span>{formatCurrency(order.total / 100)}</span>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-base mb-2">Endereço de Entrega</h2>
              <div className="text-sm space-y-0.5 text-gray-700 dark:text-gray-300 leading-tight">
                <p>{order.address.rua}, {order.address.numero} - {order.address.bairro}</p>
                <p>Complemento: {order.address.complemento}</p>
                <p>{order.address.cidade} - {order.address.estado}</p>
                <p>CEP: {order.address.cep}</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold text-base mb-2">Forma de Pagamento</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {order.paymentMethod}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between gap-8">
          <Button variant={"destructive"} className='cursor-pointer'>Cancelar Pedido</Button>
          <Button className='bg-black hover:bg-black text-white cursor-pointer'>Acompanhar Pedido</Button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
