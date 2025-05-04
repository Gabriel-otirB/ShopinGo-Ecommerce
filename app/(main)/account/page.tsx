'use client';

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const AccountPage = () => {
  return (
    <div className="container mx-auto px-4 pb-2">
      <h1 className="text-2xl font-bold mb-6 text-center">Minha Conta</h1>

      <Tabs defaultValue="orders" className="w-full max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-6 h-full dark:bg-neutral-950 border-2 border-gray-300 dark:border-neutral-500">
          <TabsTrigger value="orders" className='cursor-pointer'>Meus Pedidos</TabsTrigger>
          <TabsTrigger value="settings" className='cursor-pointer'>Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className='border-2 border-gray-300 dark:border-neutral-500'>
            <CardContent className="py-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-center">Últimos Pedidos</h2>
                <div className="border rounded p-4 hover:bg-neutral-100 hover:dark:bg-neutral-900 cursor-pointer duration-300">
                  <Link href="/account/order/12345">
                    <p className="font-medium">Pedido #12345</p>
                    <p><span className='font-medium'>Status:</span> <span className="text-green-600 font-semibold">Enviado</span></p>
                    <p><span className='font-medium'>Data:</span> 01/05/2025</p>
                    <p><span className='font-medium'>Total:</span> R$ 189,90</p>
                  </Link>
                </div>
                <div className="border rounded p-4">
                  <p className="font-medium">Pedido #12344</p>
                  <p><span className='font-medium'>Status:</span> <span className="text-yellow-600 font-semibold">Processando</span></p>
                  <p><span className='font-medium'>Data:</span> 28/04/2025</p>
                  <p><span className='font-medium'>Total:</span> R$ 79,90</p>
                </div>
                <div className="border rounded p-4">
                  <p className="font-medium">Pedido #12343</p>
                  <p><span className='font-medium'>Status:</span> <span className="text-red-600 font-semibold">Cancelado</span></p>
                  <p><span className='font-medium'>Data:</span> 25/04/2025</p>
                  <p><span className='font-medium'>Total:</span> R$ 97,09</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className='border-2 border-gray-300 dark:border-neutral-500'>
            <CardContent className="py-6 space-y-6">
              <h2 className="text-lg font-semibold text-center">Atualizar Informações</h2>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" placeholder="Seu nome" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="seuemail@email.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Nova Senha</Label>
                  <Input id="password" type="password" placeholder="********" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-medium">Endereço</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="cep">CEP</Label>
                      <Input id="cep" placeholder="00000-000" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" placeholder="Ex: São Paulo" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="state">Estado (UF)</Label>
                      <Input id="state" placeholder="Ex: SP" maxLength={2} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input id="street" placeholder="Nome da rua" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="number">Número</Label>
                      <Input id="number" placeholder="123" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" placeholder="Nome do bairro" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" placeholder="Apto, bloco, etc." />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" type="tel" placeholder="(99) 99999-9999" />
                </div>

                <Button className='flex justify-center items-center cursor-pointer mx-auto'>Salvar Alterações</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountPage;
