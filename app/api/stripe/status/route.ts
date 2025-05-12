import { stripe } from '@/lib/stripe';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { NextRequest, NextResponse } from 'next/server';
import { Bounce, toast } from 'react-toastify';
import Stripe from 'stripe';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });

    const paymentIntent = session.payment_intent as Stripe.PaymentIntent;
    const status = paymentIntent?.status === 'succeeded' ? 'paid' : 'canceled';
    const paymentMethod = paymentIntent?.payment_method_types[0];
    const metadata = session.metadata;

    if (metadata?.pedido_id) {
      await supabase
        .from('orders')
        .update({
          status,
          payment_method: paymentMethod,
          updated_at: new Date().toISOString(),
        })
        .eq('id', metadata.pedido_id);
    }

    return NextResponse.json({ status });
  } catch (error) {
    toast.error("Erro ao buscar sessão do stripe.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      transition: Bounce,
      theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
    });
    return NextResponse.json({ error: 'Erro ao buscar sessão' }, { status: 500 });
  }
}
