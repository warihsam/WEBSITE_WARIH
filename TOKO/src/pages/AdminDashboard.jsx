import { useEffect, useMemo, useState } from "react";
import { ImagePlus, LogOut, Package, Pencil, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatRupiah } from "../utils/format";

const emptyProduct = { name:"", category:"Kaos", price:"", description:"", sizes:"S,M,L,XL", stock:"0", image:"", featured:false };

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const [{ data: p }, { data: o }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending:false }),
      supabase.from("orders").select("*").order("created_at", { ascending:false }),
    ]);
    setProducts(p || []);
    setOrders(o || []);
  }

  useEffect(() => { load(); }, []);

  const revenue = useMemo(() => orders.filter(o => o.status !== "cancelled").reduce((s,o) => s + Number(o.total),0), [orders]);

  function editProduct(product) {
    setEditing(product.id);
    setForm({
      name: product.name, category: product.category, price: product.price,
      description: product.description || "", sizes: (product.sizes || []).join(","),
      stock: product.stock, image: product.image || "", featured: product.featured
    });
    setFile(null);
    window.scrollTo({ top:0, behavior:"smooth" });
  }

  function resetForm() {
    setEditing(null); setForm(emptyProduct); setFile(null);
  }

  async function uploadImage() {
    if (!file) return form.image;
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-");
    const path = `products/${Date.now()}-${safe}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert:true });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function saveProduct(e) {
    e.preventDefault();
    setSaving(true); setMessage("");
    try {
      const image = await uploadImage();
      const payload = {
        name: form.name.trim(), category: form.category.trim(),
        price: Number(form.price), description: form.description.trim(),
        sizes: form.sizes.split(",").map(s => s.trim()).filter(Boolean),
        stock: Number(form.stock), image, featured: !!form.featured
      };
      const result = editing
        ? await supabase.from("products").update(payload).eq("id", editing)
        : await supabase.from("products").insert(payload);
      if (result.error) throw result.error;
      setMessage(editing ? "Produk diperbarui." : "Produk ditambahkan.");
      resetForm();
      await load();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id) {
    if (!confirm("Hapus produk ini?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    setMessage(error ? error.message : "Produk dihapus.");
    await load();
  }

  async function updateOrderStatus(id, status) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) setMessage(error.message);
    await load();
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <div className="brand admin-brand">WS<span>FASHION</span></div>
        <p className="admin-welcome">Halo, {profile?.full_name || "Admin"}</p>
        <button className={tab==="products" ? "admin-nav active" : "admin-nav"} onClick={() => setTab("products")}><Package size={18}/> Products</button>
        <button className={tab==="orders" ? "admin-nav active" : "admin-nav"} onClick={() => setTab("orders")}><ShoppingBag size={18}/> Orders</button>
        <button className="admin-nav logout" onClick={signOut}><LogOut size={18}/> Logout</button>
      </aside>

      <section className="admin-content">
        <div className="admin-top">
          <div><p className="eyebrow">ADMIN / DASHBOARD</p><h1>Control center.</h1></div>
          <span className="admin-role">ADMIN</span>
        </div>

        <div className="stats-grid">
          <div className="stat-card"><span>Products</span><strong>{products.length}</strong></div>
          <div className="stat-card"><span>Orders</span><strong>{orders.length}</strong></div>
          <div className="stat-card"><span>Revenue</span><strong>{formatRupiah(revenue)}</strong></div>
        </div>

        {tab === "products" && (
          <>
            <div className="admin-section-heading"><h2>{editing ? "Edit Product" : "Add Product"}</h2>{editing && <button className="icon-button" onClick={resetForm}><X /></button>}</div>
            <form className="admin-form" onSubmit={saveProduct}>
              <label>Nama Produk<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required /></label>
              <label>Kategori<select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Kaos</option><option>Kemeja</option><option>Hoodie</option><option>Celana</option><option>Sweater</option></select></label>
              <label>Harga<input type="number" min="0" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required /></label>
              <label>Stok<input type="number" min="0" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} required /></label>
              <label>Ukuran <small>(pisahkan koma)</small><input value={form.sizes} onChange={e=>setForm({...form,sizes:e.target.value})} /></label>
              <label className="full">Deskripsi<textarea rows="4" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></label>
              <label className="full">URL gambar (opsional)<input value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..." /></label>
              <label className="file-input full"><ImagePlus size={18}/> Upload gambar<input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0] || null)} /></label>
              <label className="check full"><input type="checkbox" checked={form.featured} onChange={e=>setForm({...form,featured:e.target.checked})}/> Produk featured</label>
              {message && <div className="message full">{message}</div>}
              <button className="button dark" disabled={saving}>{editing ? <Pencil size={17}/> : <Plus size={17}/>} {saving ? "Menyimpan..." : editing ? "Update Product" : "Add Product"}</button>
            </form>

            <div className="admin-section-heading"><h2>Product List</h2></div>
            <div className="admin-table-wrap">
              <table className="admin-table"><thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Featured</th><th>Aksi</th></tr></thead>
              <tbody>{products.map(p => <tr key={p.id}><td><div className="table-product">{p.image ? <img src={p.image} alt="" /> : <span>WS</span>}<b>{p.name}</b></div></td><td>{p.category}</td><td>{formatRupiah(p.price)}</td><td>{p.stock}</td><td>{p.featured ? "Yes" : "-"}</td><td><button className="table-action" onClick={()=>editProduct(p)}><Pencil size={16}/></button><button className="table-action danger" onClick={()=>deleteProduct(p.id)}><Trash2 size={16}/></button></td></tr>)}</tbody></table>
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="admin-section">
            <div className="admin-section-heading"><h2>Orders</h2></div>
            <div className="admin-table-wrap">
              <table className="admin-table"><thead><tr><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>{orders.map(o => <tr key={o.id}><td><b>{o.customer_name}</b><small>{o.phone}</small></td><td>{formatRupiah(o.total)}</td><td><select value={o.status} onChange={e=>updateOrderStatus(o.id,e.target.value)}><option>pending</option><option>confirmed</option><option>processing</option><option>shipped</option><option>completed</option><option>cancelled</option></select></td><td>{formatDate(o.created_at)}</td></tr>)}</tbody></table>
              {!orders.length && <div className="empty-state">Belum ada order.</div>}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
