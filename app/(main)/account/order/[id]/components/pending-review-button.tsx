import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import ReviewForm from './review-form';
import { useEffect, useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { supabase } from '@/lib/supabase-client';

interface PendingReviewButtonProps {
  orderItemId: string;
}

const PendingReviewButton = ({ orderItemId }: PendingReviewButtonProps) => {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);
  const { profile, loading } = useProfile();

  useEffect(() => {
    const checkPending = async () => {
      if (!profile || loading) return;

      const { data, error } = await supabase
        .from("reviews")
        .select("id")
        .eq("order_item_id", orderItemId)
        .eq("profile_id", profile.id)
        .eq("rated", false);

      if (error) {
        console.error("Erro ao verificar review pendente", error);
        return;
      }

      setPending(data.length > 0);
    };

    checkPending();
  }, [orderItemId, profile, loading]);

  if (!pending) return null;

  return (
    <>
      <Button
        className="h-6 mt-1 cursor-pointer rounded"
        onClick={() => setOpen(true)}
      >
        Avaliar
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Avaliar Produto</AlertDialogTitle>
            <AlertDialogDescription>
              Deixe sua opinião sobre este produto.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="mt-4">
            <ReviewForm
              orderItemId={orderItemId}
              onClose={() => setOpen(false)}
              onSubmitSuccess={() => {
                setPending(false);
                setOpen(false);
              }}
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <AlertDialogCancel onClick={() => setOpen(false)} className='cursor-pointer'>
              Agora não
            </AlertDialogCancel>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PendingReviewButton;
