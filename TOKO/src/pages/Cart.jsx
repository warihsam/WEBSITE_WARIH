import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../utils/format";

export default function Cart() {
  const { items, total, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <main className="page">
        <div className="container empty-cart">
          <p className="eyebrow">CART / 06</p>
          <h1>Your bag is empty.</h1>
          <p>Belum ada produk di keranjang.</p>
          <Link to="/products" className="button dark">Shop Collection <ArrowRight size={17} /></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container cart-page">
        <div className="page-title-row"><div><p className="eyebrow">CART / 06</p><h1>Your Bag.</h1></div><span>{items.length} produk</span></div>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <article className="cart-item" key={item.key}>
                <div className="cart-thumb">{item.image_url ? <img src={item.image_url} alt={item.name} /> : "WS"}</div>
                <div className="cart-main">
                  <div><p className="eyebrow">{item.size}</p><h3>{item.name}</h3></div>
                  <strong>{formatRupiah(item.price * item.quantity)}</strong>
                  <div className="cart-controls">
                    <div className="quantity">
                      <button onClick={() => updateQuantity(item.key, item.quantity - 1)}><Minus size={15} /></button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus size={15} /></button>
                    </div>
                    <button className="remove" onClick={() => removeFromCart(item.key)}><Trash2 size={16} /> Hapus</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <aside className="summary">
            <p className="eyebrow">SUMMARY</p>
            <div><span>Subtotal</span><strong>{formatRupiah(total)}</strong></div>
            <div><span>Shipping</span><span>Dihitung via WhatsApp</span></div>
            <hr />
            <div className="summary-total"><span>Total</span><strong>{formatRupiah(total)}</strong></div>
            <button className="button dark wide" onClick={() => navigate("/checkout")}>Checkout <ArrowRight size={17} /></button>
          </aside>
        </div>
      </div>
    </main>
  );
}
