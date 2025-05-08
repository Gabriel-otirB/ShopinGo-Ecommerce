import { NextResponse } from 'next/server';
import { syncStripeProducts } from '@/lib/sync-products';

export async function POST() {
  try {
    const result = await syncStripeProducts();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Erro ao sincronizar produtos" }, { status: 500 });
  }
}
