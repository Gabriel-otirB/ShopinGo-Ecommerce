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
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearItem: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      addItem: (item) => {
        const existing = get().items.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (id) => {
        set({
          items: get()
            .items.map((item) =>
              item.id === id && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        });
      },

      clearItem: (id) =>
        set({
          items: get().items.filter((item) => item.id !== id),
        }),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart",
      onRehydrateStorage: () => (state) => {
        state?.setState({ isHydrated: true });
      },
    }
  )
);
