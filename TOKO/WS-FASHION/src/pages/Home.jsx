import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function load() {
      const [{ data: products }, { data: cats }] = await Promise.all([
        supabase
  .from("products")
  .select("*")
  .eq("is_featured", true)
  .order("created_at", { ascending: false })
  .limit(4),
        supabase.from("categories").select("*").order("name"),
      ]);
      setFeatured(products || []);
      setCategories(cats || []);
    }
    load();
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">WS FASHION / 01</p>
            <h1>STYLE<br /><em>YOUR DAY.</em></h1>
            <p className="hero-description">
              Koleksi fashion modern yang sederhana, nyaman, dan mudah dipadukan untuk setiap hari.
            </p>
            <Link className="button dark" to="/products">Shop Collection <ArrowRight size={18} /></Link>
          </motion.div>
          <motion.div className="hero-visual" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="hero-placeholder">
              <span>WS</span>
              <small>FASHION<br />COLLECTION</small>
            </div>
          </motion.div>
        </div>
        <div className="container hero-bottom">
          <span>NEW SEASON / EVERYDAY ESSENTIALS</span>
          <ArrowDownRight />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">02 / CATEGORIES</p><h2>Find Your Style.</h2></div>
            <Link to="/products" className="text-link">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="category-grid">
            {(categories.length ? categories : [
              { name: "Kaos", slug: "kaos" }, { name: "Kemeja", slug: "kemeja" },
              { name: "Hoodie", slug: "hoodie" }, { name: "Celana", slug: "celana" }
            ]).map((cat, i) => (
              <Link key={cat.slug} to={`/products?category=${encodeURIComponent(cat.name)}`} className="category-card">
                <span>0{i + 1}</span><h3>{cat.name}</h3><ArrowUpRight size={20} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section light">
        <div className="container">
          <div className="section-heading">
            <div><p className="eyebrow">03 / FEATURED</p><h2>Selected Pieces.</h2></div>
            <Link to="/products" className="text-link">Shop all <ArrowRight size={16} /></Link>
          </div>
          <div className="product-grid">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
          {!featured.length && <p className="empty-state">Belum ada produk featured. Tambahkan melalui Admin.</p>}
        </div>
      </section>

      <section className="statement">
        <div className="container statement-inner">
          <p className="eyebrow">04 / THE BRAND</p>
          <h2>Simple pieces.<br /><em>Strong identity.</em></h2>
          <Link to="/about" className="button light-button">Discover WS Fashion</Link>
        </div>
      </section>
    </main>
  );
}
