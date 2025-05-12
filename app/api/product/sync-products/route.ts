import { NextResponse } from 'next/server';
import { syncStripeProducts } from '@/lib/sync-products';
import { Bounce, toast } from 'react-toastify';

export async function POST() {
  try {
    const result = await syncStripeProducts();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    toast.error("Erro ao sincronizar produtos.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      transition: Bounce,
      theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
    });
    return NextResponse.json({ success: false, error: "Erro ao sincronizar produtos" }, { status: 500 });
  }
}
