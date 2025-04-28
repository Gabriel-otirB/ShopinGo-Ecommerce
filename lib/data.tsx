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