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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useAuth } from '@/providers/auth-context';

const AccountPage = () => {
  const { signOut } = useAuth();

  return (
    <div className="container mx-auto px-4 p-2 md:pb-6 -mt-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Minha Conta</h1>

      <Tabs defaultValue="orders" className="w-full max-w-3xl mx-auto">
        <div className="overflow-x-auto">
          <TabsList
            className="
          flex w-max min-w-full h-full gap-2 px-2 py-1 dark:bg-neutral-950 border-2
        border-gray-300 dark:border-neutral-500 whitespace-nowrap">
            <TabsTrigger value="orders" className="cursor-pointer">Meus Pedidos</TabsTrigger>
            <TabsTrigger value="user" className="cursor-pointer">Dados do Usuário</TabsTrigger>
            <TabsTrigger value="address" className="cursor-pointer">Endereço</TabsTrigger>
            <TabsTrigger value="settings" className="cursor-pointer">Configurações</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="orders">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="pb-4">
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="user">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Dados do Usuário</h2>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" placeholder="Seu nome" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="seuemail@email.com" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Senha Atual</Label>
                <Input id="password" type="password" placeholder="********" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" type="password" placeholder="********" />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" type="tel" placeholder="(99) 99999-9999" />
              </div>
              <Button variant="default" className="w-full cursor-pointer">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Endereço</h2>
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
              <Button variant="default" className="w-full cursor-pointer">Salvar Endereço</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-2 border-gray-300 dark:border-neutral-500">
            <CardContent className="space-y-4">
              <h2 className="text-lg font-semibold text-center">Configurações</h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full cursor-pointer">
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
                    <AlertDialogCancel className="cursor-pointer">Cancelar</AlertDialogCancel>
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
