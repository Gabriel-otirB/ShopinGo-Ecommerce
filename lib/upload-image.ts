import { supabase } from './supabase-client';
import { v4 as uuidv4 } from "uuid";

export const uploadImageToStorage = async (file: File): Promise<string | null> => {
  const fileName = `${uuidv4()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("products-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Erro ao fazer upload da imagem:", error.message);
    return null;
  }

  const { data: publicUrl } = supabase.storage
    .from("products-images")
    .getPublicUrl(data.path);

  return publicUrl.publicUrl;
};
