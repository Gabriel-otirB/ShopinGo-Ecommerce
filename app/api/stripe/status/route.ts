import { stripe } from '@/lib/stripe';
import { supabaseAdmin as supabase } from '@/lib/supabase-admin';
import { NextRequest, NextResponse } from 'next/server';
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
    console.error('Erro ao recuperar sessão do Stripe:', error);
    return NextResponse.json({ error: 'Erro ao buscar sessão' }, { status: 500 });
  }
}
