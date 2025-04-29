import { Shirt, MonitorSmartphone, Sparkles, Sofa, Crown, SprayCan, Dumbbell, Footprints } from "lucide-react";

export const categories = [
  {
    id: 1,
    name: "Roupas",
    icon: <Shirt className="text-blue-500" />,
  },
  {
    id: 2,
    name: "Tecnologia",
    icon: <MonitorSmartphone className="text-green-500" />,
  },
  {
    id: 3,
    name: "Beleza",
    icon: <Sparkles className="text-pink-500" />,
  },
  {
    id: 4,
    name: "Móveis",
    icon: <Sofa className="text-yellow-600" />,
  },
  {
    id: 5,
    name: "Chapéus",
    icon: <Crown className="text-purple-500" />,
  },
  {
    id: 6,
    name: "Calçados",
    icon: <Footprints className="text-red-500" />,
  },
  {
    id: 7,
    name: "Perfumes",
    icon: <SprayCan className="text-indigo-500" />,
  },
  {
    id: 8,
    name: "Esportes",
    icon: <Dumbbell className="text-orange-500" />,
  },
];

export const offers = [
  {
    id: 1,
    title: "Promoção de Roupas: Até 50% OFF!",
    description: "Renove seu guarda-roupa com 50% de desconto nas melhores roupas!",
    image: "/category/roupa.png",
    link: "/products"
  },
  {
    id: 2,
    title: "Desconto Especial em Tecnologia - 30% OFF!",
    description: "Aproveite 30% de desconto em smartphones e acessórios tecnológicos!",
    image: "/category/tecnologia.png",
    link: "/products"
  },
  {
    id: 3,
    title: "Beleza Radiante: Promoção de 40% em Cosméticos!",
    description: "Cuide-se com 40% de desconto em produtos de beleza selecionados!",
    image: "/category/beleza.png",
    link: "/products"
  },
  {
    id: 4,
    title: "Móveis com Desconto: 25% OFF em Sofás e Cadeiras!",
    description: "Renove sua casa com móveis de qualidade, com 25% de desconto!",
    image: "/category/moveis.png",
    link: "/products"
  },
  {
    id: 5,
    title: "Chapéus Estilosos: 15% OFF em Toda a Linha!",
    description: "Fique na moda com até 15% de desconto em chapéus e acessórios!",
    image: "/category/chapeu.png",
    link: "/products"
  },
  {
    id: 6,
    title: "Desconto em Calçados: Até 40% OFF!",
    description: "Não perca a chance de comprar calçados incríveis com até 40% de desconto!",
    image: "/category/calcado.png",
    link: "/products"
  },
];

export const faqItems = [
  {
    question: "Como funciona a política de devolução?",
    answer:
      "Você pode devolver qualquer produto em até 7 dias após o recebimento. Basta acessar sua conta, localizar o pedido e seguir as instruções de devolução. O produto deve estar em perfeitas condições e na embalagem original.",
  },
  {
    question: "Quais são as opções de pagamento disponíveis?",
    answer:
      "Aceitamos cartões de crédito, débito, Pix, boleto bancário e carteiras digitais como Google Pay e Apple Pay. Todos os pagamentos são processados com segurança.",
  },
  {
    question: "Quanto tempo leva para o pedido chegar?",
    answer:
      "O prazo de entrega varia conforme sua localização e o tipo de frete escolhido. Em geral, os pedidos são entregues entre 3 a 10 dias úteis. Você pode acompanhar tudo pelo painel de pedidos.",
  }
];

export const paymentMethods = [
  {
    id: 1,
    name: "Cartão de crédito VISA",
    image: "/payments/visa.png",
  },
  {
    id: 2,
    name: "Cartão de crédito MASTERCARD",
    image: "/payments/mastercard.png",
  },
]