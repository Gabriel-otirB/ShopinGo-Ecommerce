import { OrderProvider } from '@/components/protected-order-route';
import { notFound } from "next/navigation";
import { use } from 'react'

type Params = Promise<{ id: string }>

export default function Layout(props: {
  children: React.ReactNode
  params: Params
}) {
  const params = use(props.params)
  const id = params.id

  if (!id) {
    notFound()
  }

  return (
    <OrderProvider orderId={id}>
      {props.children}
    </OrderProvider>
  );
}
