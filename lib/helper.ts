export const formatCurrency = (value: number | null) => {
  return value?.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}
