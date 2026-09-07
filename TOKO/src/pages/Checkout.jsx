import { useState } from "react";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../utils/format";

const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "";

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (!items.length && !done) return <NavigateToCart />;

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.name || !form.phone || !form.address) {
      return setError("Semua data checkout wajib diisi.");
    }

    if (!waNumber || waNumber.includes("X")) {
      return setError(
        "Nomor WhatsApp toko belum diatur di VITE_WHATSAPP_NUMBER."
      );
    }

    setLoading(true);

    // GENERATE ORDER ID DI BROWSER
    const orderId = crypto.randomUUID();

    // GENERATE ORDER NUMBER
    const orderNumber =
      "WS-" +
      crypto
        .randomUUID()
        .replace(/-/g, "")
        .substring(0, 10)
        .toUpperCase();

    // CREATE ORDER
    // Tidak memakai .select() agar tidak terkena SELECT RLS
    const { error: orderError } = await supabase
      .from("orders")
      .insert({
        id: orderId,
        order_number: orderNumber,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: form.address,
        subtotal: total,
        shipping_cost: 0,
        total: total,
        status: "pending",
        payment_status: "unpaid",
      });

    if (orderError) {
      console.error("ORDER ERROR:", orderError);

      setLoading(false);

      return setError(
        `Gagal membuat pesanan: ${orderError.message}`
      );
    }

    // CREATE ORDER ITEMS
    const rows = items.map((item) => ({
  order_id: orderId,
  product_id: item.productId,
  product_name: item.name,
  price: item.price,
  quantity: item.quantity,
}));

const { error: itemError } = await supabase
  .from("order_items")
  .insert(rows);

    if (itemError) {
      console.error("ORDER ITEM ERROR:", itemError);

      setLoading(false);

      return setError(
        `Pesanan berhasil dibuat, tetapi item pesanan gagal disimpan: ${itemError.message}`
      );
    }

    const lines = items
      .map(
        (item, i) =>
          `${i + 1}. ${item.name} | Size ${item.size} | Qty ${
            item.quantity
          } | ${formatRupiah(item.price * item.quantity)}`
      )
      .join("\n");

    const text = [
      "Halo WS FASHION",
      "",
      "Saya ingin melakukan pemesanan:",
      "",
      lines,
      "",
      `Total: ${formatRupiah(total)}`,
      "",
      `Nama: ${form.name}`,
      `No. HP: ${form.phone}`,
      `Alamat: ${form.address}`,
      "",
      `Order ID: ${orderId}`,
      `Order Number: ${orderNumber}`,
    ].join("\n");

    clearCart();
    setDone(true);
    setLoading(false);

    window.open(
      `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  if (done) {
    return (
      <main className="page">
        <div className="container success-page">
          <CheckCircle2 size={52} />
          <p className="eyebrow">ORDER CREATED</p>
          <h1>Pesanan berhasil dibuat.</h1>
          <p>
            Ringkasan pesanan sudah disiapkan dan WhatsApp dibuka untuk
            melanjutkan konfirmasi.
          </p>
          <Link to="/products" className="button dark">
            Kembali Belanja
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container checkout-page">
        <Link to="/cart" className="back-link">
          <ArrowLeft size={17} />
          Kembali ke keranjang
        </Link>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={submit}>
            <p className="eyebrow">CHECKOUT / 07</p>
            <h1>Complete Your Order.</h1>

            <label>
              Nama lengkap
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Nomor WhatsApp
              <input
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
                placeholder="08xxxxxxxxxx"
              />
            </label>

            <label>
              Alamat lengkap
              <textarea
                rows="5"
                value={form.address}
                onChange={(e) =>
                  setForm({
                    ...form,
                    address: e.target.value,
                  })
                }
              />
            </label>

            {error && <div className="error-box">{error}</div>}

            <button
              className="button dark wide"
              disabled={loading}
              type="submit"
            >
              <MessageCircle size={18} />
              {loading ? "Memproses..." : "Pesan via WhatsApp"}
            </button>
          </form>

          <aside className="summary">
            <p className="eyebrow">YOUR ORDER</p>

            {items.map((item) => (
              <div className="mini-line" key={item.key}>
                <span>
                  {item.name} × {item.quantity} ({item.size})
                </span>
                <strong>
                  {formatRupiah(item.price * item.quantity)}
                </strong>
              </div>
            ))}

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatRupiah(total)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function NavigateToCart() {
  const navigate = useNavigate();

  navigate("/cart", {
    replace: true,
  });

  return null;
}