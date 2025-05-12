import { OrderProvider } from '@/components/protected-order-route';
import { notFound } from "next/navigation";

interface Props {
  params: { id: string };
}

export default function OrderPage({ params, children }: Props & { children: React.ReactNode }) {
  const orderId = params.id;

  if (!orderId) return notFound();

  return (
    <OrderProvider orderId={orderId}>
      {children}
    </OrderProvider>
  );
}
