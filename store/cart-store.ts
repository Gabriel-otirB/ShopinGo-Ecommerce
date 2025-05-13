import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartStore {
  userId: string | null;
  items: CartItem[];
  setUserId: (id: string | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      userId: null,
      items: [],
      setUserId: (id) => {
        // Update localStorage key when changing user
        const previousKey = `cart-${get().userId || "guest"}`;
        const newKey = `cart-${id || "guest"}`;

        if (previousKey !== newKey) {
          const newItems = JSON.parse(localStorage.getItem(newKey) || "[]");
          set({ items: newItems, userId: id });
        } else {
          set({ userId: id });
        }
      },
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          const updatedItems = existing
            ? state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              )
            : [...state.items, item];

          localStorage.setItem(`cart-${state.userId || "guest"}`, JSON.stringify(updatedItems));
          return { items: updatedItems };
        }),
      removeItem: (id) =>
        set((state) => {
          const updatedItems = state.items
            .map((item) =>
              item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
            .filter((item) => item.quantity > 0);

          localStorage.setItem(`cart-${state.userId || "guest"}`, JSON.stringify(updatedItems));
          return { items: updatedItems };
        }),
      clearItem: (id) =>
        set((state) => {
          const updatedItems = state.items.filter((item) => item.id !== id);
          localStorage.setItem(`cart-${state.userId || "guest"}`, JSON.stringify(updatedItems));
          return { items: updatedItems };
        }),
      clearCart: () => {
        const userId = get().userId || "guest";
        localStorage.removeItem(`cart-${userId}`);
        return set({ items: [] });
      },
    }),
    {
      name: "cart-guest", // Fallback to guest
      skipHydration: true, // Avoid conflicts during loading
    }
  )
);
