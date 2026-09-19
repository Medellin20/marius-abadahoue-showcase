import { useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, type Category } from "@/data/products";

export default function Catalogue() {
  const [category, setCategory] = useState<Category>("Tous");
  const shown = category === "Tous" ? products : products.filter(product => product.category === category);
  return <div id="top" className="min-h-screen bg-[#111113] text-[#f4eee5]">
    <header className="border-b border-white/15"><div className="container flex min-h-[80px] flex-wrap items-center justify-between gap-4 py-4"><a href="/" className="font-display text-2xl uppercase tracking-wider">Patati <span className="text-[#e78d94]">Patata</span></a><a href="/" className="inline-flex items-center gap-2 text-sm text-[#d6cbc2] hover:text-[#f4c660]"><ArrowLeft className="h-4 w-4" />Retour à l’accueil</a></div></header>
    <main className="container py-14 sm:py-20">
      <nav aria-label="Fil d’Ariane" className="mb-10 flex items-center gap-3 text-sm text-[#b7aba1]"><a href="/" className="hover:text-[#f4c660]">Accueil</a><span aria-hidden="true">/</span><span aria-current="page" className="text-[#f4eee5]">Catalogue</span></nav>
      <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-[#f4c660]">La sélection Patati</p>
      <h1 className="font-display text-6xl uppercase leading-[0.9] sm:text-8xl">Tout pour<br /><span className="text-[#9b2d35]">votre entraînement.</span></h1>
      <p className="mt-7 max-w-2xl text-base leading-7 text-[#c9bfb7]">Retrouvez tous nos produits de nutrition et accessoires d’entraînement. Choisissez une catégorie pour explorer la sélection.</p>
      <p className="mt-5 max-w-2xl border-l-2 border-[#f4c660] pl-4 text-sm leading-6 text-[#c9bfb7]">Catalogue en préparation. Contactez l’équipe sur Instagram pour confirmer les prix, la disponibilité et les modalités de réservation.</p>
      <div className="mb-8 mt-12 flex flex-wrap items-center justify-between gap-5 border-b border-white/15 pb-5"><div role="group" aria-label="Filtrer les produits par catégorie" className="flex flex-wrap gap-2">{(["Tous", "Nutrition", "Training"] as Category[]).map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} className={`px-4 py-3 font-mono text-xs uppercase tracking-wider ${category === item ? "bg-[#f4eee5] font-bold text-[#171619]" : "border border-white/20 text-[#c9bfb7] hover:border-[#f4c660]"}`}>{item}</button>)}</div><p role="status" className="flex items-center gap-2 text-sm text-[#b7aba1]"><ShoppingBag className="h-4 w-4" aria-hidden="true" />{shown.length} produit{shown.length !== 1 ? "s" : ""}</p></div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{shown.map(product => <ProductCard key={product.name} product={product} />)}</div>
    </main>
    <Footer />
  </div>;
}
