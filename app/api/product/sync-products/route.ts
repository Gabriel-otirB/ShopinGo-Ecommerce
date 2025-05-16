import { NextResponse } from 'next/server';
import { syncStripeProducts } from '@/lib/sync-products';

export async function GET() {
  try {
    const result = await syncStripeProducts();
    return NextResponse.json({ success: true, result });
  } catch {
    console.error("Erro ao sincronizar produtos.");
    return NextResponse.json({ success: false, error: "Erro ao sincronizar produtos" }, { status: 500 });
  }
}
