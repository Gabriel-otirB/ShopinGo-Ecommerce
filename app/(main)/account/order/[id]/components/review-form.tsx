"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Bounce, toast } from "react-toastify";

interface ReviewFormProps {
  orderItemId: string;
  onClose: () => void;
  onSubmitSuccess: () => void;
}

const ReviewForm = ({ orderItemId, onSubmitSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    if (comment.length > 500) {
      toast.error("Comentário deve ter no máximo 500 caracteres.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
      return;
    }

    const { error } = await supabase
      .from("reviews")
      .update({
        rated: true,
        rating,
        comment,
        updated_at: new Date().toISOString(),
      })
      .eq("order_item_id", orderItemId)
      .eq("rated", false);

    if (error) {
      toast.error("Erro ao salvar avaliação.", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        transition: Bounce,
        theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
      });
      return;
    }

    toast.success("Avaliação enviada!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      transition: Bounce,
      theme: localStorage.getItem("theme") === "dark" ? "light" : "dark",
    });

    onSubmitSuccess();
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-6 h-6 cursor-pointer ${
              rating > index ? "text-yellow-400" : "text-gray-400"
            }`}
            fill={rating > index ? "currentColor" : "none"}
            onClick={() => setRating(index + 1)}
          />
        ))}
      </div>

      <Textarea
        placeholder="Deixe um comentário (opcional, até 500 caracteres)"
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, 500))}
        className="resize-none"
      />

      <Button onClick={handleSubmit} disabled={rating === 0} className="cursor-pointer">
        Enviar Avaliação
      </Button>
    </div>
  );
};

export default ReviewForm;
