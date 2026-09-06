import { useEffect, useState } from "react";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { formatRupiah } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      setProduct(data);
      if (data?.sizes?.length) setSize(data.sizes[0]);
    });
  }, [id]);

  if (!product) return <div className="page-loader">Memuat produk...</div>;

  function handleAdd() {
    if (!size) return setMessage("Pilih ukuran terlebih dahulu.");
    addToCart(product, size, quantity);
    setMessage("Produk ditambahkan ke keranjang.");
  }

  return (
    <main className="page">
      <div className="container detail-page">
        <Link to="/products" className="back-link"><ArrowLeft size={17} /> Kembali ke produk</Link>
        <div className="detail-grid">
          <div className="detail-image">
            {product.image || product.image_url ? <img src={product.image || product.image_url} alt={product.name} /> : <div className="image-placeholder big">WS</div>}
          </div>
          <div className="detail-info">
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <div className="detail-price">{formatRupiah(product.price)}</div>
            <p className="detail-description">{product.description}</p>

            <div className="option-block">
              <div className="option-title"><span>Size</span><b>{size}</b></div>
              <div className="size-list">
                {(product.sizes || []).map(s => (
                  <button key={s} className={size === s ? "size active" : "size"} onClick={() => setSize(s)}>{s}</button>
                ))}
              </div>
            </div>

            <div className="option-block">
              <div className="option-title"><span>Quantity</span><b>{quantity}</b></div>
              <div className="quantity">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}><Plus size={16} /></button>
              </div>
            </div>

            <p className="stock-text">{product.stock > 0 ? `${product.stock} item tersedia` : "Stok habis"}</p>
            <button className="button dark wide" disabled={!product.stock} onClick={handleAdd}>
              <ShoppingBag size={18} /> Add to Cart
            </button>
            {message && <p className="success-message">{message} <button onClick={() => navigate("/cart")}>Lihat keranjang</button></p>}
          </div>
        </div>
      </div>
    </main>
  );
}
