export const products = [
  { name: "Whey Force 80", category: "Nutrition" as const, detail: "Récupération musculaire · 1 kg", price: "29 000 FCFA", tag: "Best-seller", tone: "from-[#a71e2c] via-[#641722] to-[#27121b]", letter: "W" },
  { name: "Pre-Workout Rouge", category: "Nutrition" as const, detail: "Énergie & focus · 300 g", price: "18 500 FCFA", tag: "Intensité", tone: "from-[#42202a] via-[#28151d] to-[#121217]", letter: "P" },
  { name: "Bandes Champion", category: "Training" as const, detail: "Résistance progressive · x3", price: "12 000 FCFA", tag: "Essentiel", tone: "from-[#a73b2c] via-[#4c1f27] to-[#171216]", letter: "B" },
  { name: "Shaker Patati", category: "Training" as const, detail: "Acier mat · 750 ml", price: "9 500 FCFA", tag: "Nouveau", tone: "from-[#3e4241] via-[#1c2221] to-[#121313]", letter: "S" },
];
export type Product = (typeof products)[number];
export type Category = "Tous" | Product["category"];
