"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import ReviewForm from "./review-form";
import { useProfile } from "@/hooks/use-profile";

interface PendingReviewCheckProps {
  orderId: string;
}

interface PendingItem {
  id: string;
  product_name: string;
}

const PendingReviewCheck = ({ orderId }: PendingReviewCheckProps) => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null);
  const [open, setOpen] = useState(false);
  const { profile, loading } = useProfile();

  useEffect(() => {
    const fetchPendingItems = async () => {
      if (!profile || loading) return;

      const { data: orderItems, error: itemsError } = await supabase
        .from("orders_items")
        .select("id, product_id")
        .eq("order_id", orderId);

      if (itemsError) {
        console.error("Erro ao buscar order_items", itemsError);
        return;
      }

      const pendingItemsPromises = orderItems.map(async (item) => {
        const { data: reviews, error: reviewsError } = await supabase
          .from("reviews")
          .select("id")
          .eq("order_item_id", item.id)
          .eq("profile_id", profile.id)
          .eq("rated", false);

        if (reviewsError) {
          console.error("Erro ao buscar reviews", reviewsError);
          return null;
        }

        if (reviews.length > 0) {
          const { data: productData, error: productError } = await supabase
            .from("products")
            .select("name")
            .eq("stripe_product_id", item.product_id)
            .single();

          if (productError) {
            console.error("Erro ao buscar nome do produto", productError);
            return null;
          }

          return {
            id: item.id,
            product_name: productData.name,
          };
        }

        return null;
      });

      const pendingResults = await Promise.all(pendingItemsPromises);
      const filteredPending = pendingResults.filter((item) => item !== null) as PendingItem[];
      setPendingItems(filteredPending);
    };

    fetchPendingItems();
  }, [orderId, profile, loading]);

  return (
    <div className="space-y-4">
      {pendingItems.map((item) => (
        <div key={item.id} className="flex items-center justify-end">
          <Button
            className="h-6 mt-1 cursor-pointer rounded"
            onClick={() => {
              setSelectedItem(item);
              setOpen(true);
            }}
          >
            Avaliar
          </Button>
        </div>
      ))}

      {selectedItem && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Avaliar {selectedItem.product_name}</AlertDialogTitle>
              <AlertDialogDescription>
                Deixe sua opinião sobre este produto.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="mt-4">
              <ReviewForm
                orderItemId={selectedItem.id}
                onClose={() => {
                  setOpen(false);
                  setSelectedItem(null);
                }}
                onSubmitSuccess={() => {
                  setPendingItems((prev) =>
                    prev.filter((item) => item.id !== selectedItem.id)
                  );
                  setOpen(false);
                  setSelectedItem(null);
                }}
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <AlertDialogCancel
                onClick={() => {
                  setOpen(false);
                  setSelectedItem(null);
                }}
                className="cursor-pointer"
              >
                Agora não
              </AlertDialogCancel>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default PendingReviewCheck;
