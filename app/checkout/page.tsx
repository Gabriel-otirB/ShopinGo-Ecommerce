"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { checkoutAction } from "./checkout-action";
import Image from "next/image";
import { formatCurrency } from "@/lib/helper";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import Link from 'next/link';
import ScrollTop from '@/components/scroll-top';
import { ShoppingCart } from 'lucide-react';

export default function CheckoutPage() {
  const { items, clearItem, addItem, removeItem } = useCartStore();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <ScrollTop />
      <div className="flex flex-col">
        <div className="flex-grow container mx-auto px-4 pb-4">
          {items.length === 0 ? (
            <div className="text-center py-10">
              <ShoppingCart className="mx-auto mb-4 text-gray-700 dark:text-gray-200" size={48} />
              <h1 className="text-3xl font-bold mb-4 ">Seu carrinho de compras está vazio.</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Parece que você ainda não adicionou nenhum item. Que tal explorar nossos produtos?</p>
              <Link
                href="/products"
                className="
                font-medium inline-block bg-black text-white dark:bg-black hover:dark:bg-black/90
                text-lg py-2 px-6 rounded-full hover:bg-black/90 transition-colors duration-200"
              >
                Comece a comprar
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-8 text-center">Carrinho De Compras</h1>
              <Card className="max-w-md mx-auto mb-8">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-center">Resumo do pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {items.map((item) => (
                      <li key={item.id} className="flex flex-col gap-2 border-b pb-2">
                        <div className="flex justify-between items-center">
                          <Link
                            key={item.id}
                            href={`/products/${item.id}`}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center w-full">
                              <Image
                                src={item.imageUrl || ""}
                                alt={item.name}
                                width={64}
                                height={64}
                                className="rounded object-contain w-16 h-16"
                              />
                              <span className="flex-1 font-medium px-3 text-sm overflow-hidden line-clamp-3 break-words">
                                {item.name}
                              </span>
                            </div>
                          </Link>
                          <span className="font-semibold whitespace-nowrap text-sm">
                            {formatCurrency((item.price * item.quantity) / 100)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex align-center gap-2">
                            <Button
                              variant="outline"
                              disabled={item.quantity === 1}
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="cursor-pointer"
                            >
                              –
                            </Button>

                            <span className="text-lg font-semibold">{item.quantity}</span>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addItem({ ...item, quantity: 1 })}
                              className='cursor-pointer'
                            >
                              +
                            </Button>
                          </div>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="cursor-pointer" variant="destructive" size="sm">
                                Remover
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover item</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Deseja realmente remover <strong>{item.name}</strong> do carrinho?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => clearItem(item.id)} className="cursor-pointer">
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 pt-2 text-lg font-semibold">
                    Total: {formatCurrency(total / 100)}
                  </div>
                </CardContent>
              </Card>
              <form action={checkoutAction} className="max-w-md mx-auto">
                <input type="hidden" name="items" value={JSON.stringify(items)} />
                <Button
                  type="submit"
                  variant="default"
                  className="mt-2 w-full px-6 py-3 bg-black text-white"
                >
                  Finalizar Compra
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
