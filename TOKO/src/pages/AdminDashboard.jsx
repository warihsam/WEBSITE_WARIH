import { useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  LogOut,
  Package,
  Pencil,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatRupiah } from "../utils/format";

const emptyProduct = {
  name: "",
  category_id: "",
  price: "",
  compare_price: "",
  description: "",
  sizes: "S,M,L,XL",
  colors: "",
  stock: "0",
  sku: "",
  image_url: "",
  is_active: true,
  is_featured: false,
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function AdminDashboard() {
  const { profile, signOut } = useAuth();

  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState(emptyProduct);
  const [editing, setEditing] = useState(null);

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  // =========================================================
  // LOAD DATA
  // =========================================================

  async function load() {
    const [
      { data: productsData, error: productsError },
      { data: ordersData, error: ordersError },
      { data: categoriesData, error: categoriesError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .order("created_at", { ascending: false }),

      supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("categories")
        .select("id, name, slug")
        .order("name", { ascending: true }),
    ]);

    if (productsError) {
      console.error("LOAD PRODUCTS ERROR:", productsError);
      setMessage(`Gagal memuat produk: ${productsError.message}`);
    }

    if (ordersError) {
      console.error("LOAD ORDERS ERROR:", ordersError);
      setMessage(`Gagal memuat order: ${ordersError.message}`);
    }

    if (categoriesError) {
      console.error("LOAD CATEGORIES ERROR:", categoriesError);
      setMessage(`Gagal memuat kategori: ${categoriesError.message}`);
    }

    setProducts(productsData || []);
    setOrders(ordersData || []);
    setCategories(categoriesData || []);
  }

  useEffect(() => {
    load();
  }, []);

  // =========================================================
  // REVENUE
  // =========================================================

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.status !== "cancelled")
        .reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        ),
    [orders]
  );

  // =========================================================
  // FORM HANDLER
  // =========================================================

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // =========================================================
  // EDIT PRODUCT
  // =========================================================

  function editProduct(product) {
    setEditing(product.id);

    setForm({
      name: product.name || "",
      category_id: product.category_id || "",
      price: product.price ?? "",
      compare_price: product.compare_price ?? "",
      description: product.description || "",

      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(",")
        : "",

      colors: Array.isArray(product.colors)
        ? product.colors.join(",")
        : "",

      stock: product.stock ?? 0,
      sku: product.sku || "",
      image_url: product.image_url || "",

      is_active:
        product.is_active === undefined
          ? true
          : !!product.is_active,

      is_featured: !!product.is_featured,
    });

    setFile(null);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // RESET
  // =========================================================

  function resetForm() {
    setEditing(null);
    setForm({ ...emptyProduct });
    setFile(null);
    setMessage("");
  }

  // =========================================================
  // VALIDATE IMAGE
  // =========================================================

  function validateImage(selectedFile) {
    if (!selectedFile) {
      throw new Error("File gambar tidak ditemukan.");
    }

    if (!ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      throw new Error(
        "Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF."
      );
    }

    if (selectedFile.size > MAX_IMAGE_SIZE) {
      throw new Error(
        "Ukuran gambar maksimal 5 MB."
      );
    }
  }

  // =========================================================
  // UPLOAD IMAGE
  // =========================================================

  async function uploadImage() {
    // Tidak memilih gambar baru
    if (!file) {
      return form.image_url?.trim() || "";
    }

    validateImage(file);

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const uniqueId =
      typeof crypto !== "undefined" &&
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const path = `products/${Date.now()}-${uniqueId}.${extension}`;

    console.log("UPLOAD START:", {
      bucket: "product-images",
      path,
      type: file.type,
      size: file.size,
    });

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error(
        "UPLOAD ERROR DETAIL:",
        uploadError
      );

      throw new Error(
        `Upload gambar gagal: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(path);

    const publicUrl = data?.publicUrl;

    if (!publicUrl) {
      throw new Error(
        "URL gambar gagal dibuat."
      );
    }

    console.log("IMAGE URL:", publicUrl);

    return publicUrl;
  }

  // =========================================================
  // CREATE SLUG
  // =========================================================

  function createSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // =========================================================
  // SAVE PRODUCT
  // =========================================================

  async function saveProduct(e) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setMessage("");

    try {
      if (!form.name.trim()) {
        throw new Error(
          "Nama produk wajib diisi."
        );
      }

      if (!form.category_id) {
        throw new Error(
          "Kategori produk wajib dipilih."
        );
      }

      if (
        form.price === "" ||
        Number(form.price) < 0
      ) {
        throw new Error(
          "Harga produk tidak valid."
        );
      }

      if (
        form.stock === "" ||
        Number(form.stock) < 0
      ) {
        throw new Error(
          "Stok produk tidak valid."
        );
      }

      // Upload gambar
      const imageUrl = await uploadImage();

      const payload = {
        name: form.name.trim(),

        category_id: form.category_id,

        slug: createSlug(form.name),

        description:
          form.description.trim() || null,

        price: Number(form.price),

        compare_price:
          form.compare_price === ""
            ? null
            : Number(form.compare_price),

        stock: Number(form.stock),

        sku:
          form.sku.trim() || null,

        image_url:
          imageUrl || null,

        is_active: !!form.is_active,

        is_featured: !!form.is_featured,

        sizes: form.sizes
          .split(",")
          .map((size) => size.trim())
          .filter(Boolean),

        colors: form.colors
          .split(",")
          .map((color) => color.trim())
          .filter(Boolean),

        updated_at: new Date().toISOString(),
      };

      console.log(
        "PRODUCT PAYLOAD:",
        payload
      );

      let result;

      if (editing) {
        result = await supabase
          .from("products")
          .update(payload)
          .eq("id", editing);
      } else {
        result = await supabase
          .from("products")
          .insert(payload);
      }

      if (result.error) {
        console.error(
          "PRODUCT SAVE ERROR:",
          result.error
        );

        throw new Error(
          `Gagal menyimpan produk: ${result.error.message}`
        );
      }

      setMessage(
        editing
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan."
      );

      resetForm();

      await load();
    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan saat menyimpan produk."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // FILE CHANGE
  // =========================================================

  function handleFileChange(e) {
    const selectedFile =
      e.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    try {
      validateImage(selectedFile);

      setFile(selectedFile);

      setMessage(
        `Gambar dipilih: ${selectedFile.name}`
      );
    } catch (error) {
      setFile(null);

      e.target.value = "";

      setMessage(error.message);
    }
  }

  // =========================================================
  // DELETE PRODUCT
  // =========================================================

  async function deleteProduct(id) {
    if (!confirm("Hapus produk ini?")) {
      return;
    }

    setMessage("");

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setMessage(
        `Gagal menghapus produk: ${error.message}`
      );

      return;
    }

    setMessage(
      "Produk berhasil dihapus."
    );

    await load();
  }

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  async function updateOrderStatus(
    id,
    status
  ) {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error(
        "UPDATE ORDER ERROR:",
        error
      );

      setMessage(
        `Gagal memperbarui order: ${error.message}`
      );

      return;
    }

    setMessage(
      "Status order berhasil diperbarui."
    );

    await load();
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="admin-page">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        <div className="brand admin-brand">
          WS<span>FASHION</span>
        </div>

        <p className="admin-welcome">
          Halo,{" "}
          {profile?.full_name || "Admin"}
        </p>

        <button
          className={
            tab === "products"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            setTab("products")
          }
        >
          <Package size={18} />
          Products
        </button>

        <button
          className={
            tab === "orders"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            setTab("orders")
          }
        >
          <ShoppingBag size={18} />
          Orders
        </button>

        <button
          className="admin-nav logout"
          onClick={signOut}
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* CONTENT */}
      <section className="admin-content">

        {/* TOP */}
        <div className="admin-top">

          <div>
            <p className="eyebrow">
              ADMIN / DASHBOARD
            </p>

            <h1>
              Control center.
            </h1>
          </div>

          <span className="admin-role">
            ADMIN
          </span>

        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <span>Products</span>
            <strong>
              {products.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Orders</span>
            <strong>
              {orders.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>Revenue</span>
            <strong>
              {formatRupiah(revenue)}
            </strong>
          </div>

        </div>

        {/* ================================================= */}
        {/* PRODUCTS */}
        {/* ================================================= */}

        {tab === "products" && (
          <>

            <div className="admin-section-heading">

              <h2>
                {editing
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              {editing && (
                <button
                  type="button"
                  className="icon-button"
                  onClick={resetForm}
                >
                  <X />
                </button>
              )}

            </div>

            {/* FORM */}
            <form
              className="admin-form"
              onSubmit={saveProduct}
            >

              {/* NAME */}
              <label>
                Nama Produk

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    updateForm(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Contoh: Oversized Basic Tee Black"
                  required
                />
              </label>

              {/* CATEGORY */}
              <label>
                Kategori

                <select
                  value={form.category_id}
                  onChange={(e) =>
                    updateForm(
                      "category_id",
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Pilih kategori
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    )
                  )}

                </select>
              </label>

              {/* PRICE */}
              <label>
                Harga

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    updateForm(
                      "price",
                      e.target.value
                    )
                  }
                  placeholder="129000"
                  required
                />
              </label>

              {/* COMPARE PRICE */}
              <label>
                Harga Coret
                <small>
                  (opsional)
                </small>

                <input
                  type="number"
                  min="0"
                  value={
                    form.compare_price
                  }
                  onChange={(e) =>
                    updateForm(
                      "compare_price",
                      e.target.value
                    )
                  }
                  placeholder="159000"
                />
              </label>

              {/* STOCK */}
              <label>
                Stok

                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) =>
                    updateForm(
                      "stock",
                      e.target.value
                    )
                  }
                  required
                />
              </label>

              {/* SKU */}
              <label>
                SKU
                <small>
                  (opsional)
                </small>

                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) =>
                    updateForm(
                      "sku",
                      e.target.value
                    )
                  }
                  placeholder="WS-TEE-BLK-001"
                />
              </label>

              {/* SIZES */}
              <label>
                Ukuran
                <small>
                  (pisahkan koma)
                </small>

                <input
                  value={form.sizes}
                  onChange={(e) =>
                    updateForm(
                      "sizes",
                      e.target.value
                    )
                  }
                  placeholder="S,M,L,XL"
                />
              </label>

              {/* COLORS */}
              <label>
                Warna
                <small>
                  (pisahkan koma)
                </small>

                <input
                  value={form.colors}
                  onChange={(e) =>
                    updateForm(
                      "colors",
                      e.target.value
                    )
                  }
                  placeholder="Black,White,Grey"
                />
              </label>

              {/* DESCRIPTION */}
              <label className="full">
                Deskripsi

                <textarea
                  rows="4"
                  value={form.description}
                  onChange={(e) =>
                    updateForm(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Deskripsi produk..."
                />
              </label>

              {/* IMAGE URL */}
              <label className="full">
                URL gambar
                <small>
                  (opsional jika upload gambar)
                </small>

                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) =>
                    updateForm(
                      "image_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </label>

              {/* UPLOAD */}
              <label className="file-input full">

                <ImagePlus size={18} />

                {file
                  ? file.name
                  : "Upload gambar"}

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={
                    handleFileChange
                  }
                />

              </label>

              <small className="full">
                JPG, PNG, WEBP, atau GIF.
                Maksimal 5 MB.
              </small>

              {/* ACTIVE */}
              <label className="check full">

                <input
                  type="checkbox"
                  checked={
                    form.is_active
                  }
                  onChange={(e) =>
                    updateForm(
                      "is_active",
                      e.target.checked
                    )
                  }
                />

                Produk aktif

              </label>

              {/* FEATURED */}
              <label className="check full">

                <input
                  type="checkbox"
                  checked={
                    form.is_featured
                  }
                  onChange={(e) =>
                    updateForm(
                      "is_featured",
                      e.target.checked
                    )
                  }
                />

                Produk featured

              </label>

              {/* MESSAGE */}
              {message && (
                <div
                  className="message full"
                  role="alert"
                >
                  {message}
                </div>
              )}

              {/* SUBMIT */}
              <button
                className="button dark"
                disabled={saving}
                type="submit"
              >

                {editing ? (
                  <Pencil size={17} />
                ) : (
                  <Plus size={17} />
                )}

                {saving
                  ? "Menyimpan..."
                  : editing
                  ? "Update Product"
                  : "Add Product"}

              </button>

            </form>

            {/* PRODUCT LIST */}
            <div className="admin-section-heading">
              <h2>
                Product List
              </h2>
            </div>

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Produk</th>
                    <th>Kategori</th>
                    <th>Harga</th>
                    <th>Stok</th>
                    <th>Status</th>
                    <th>Featured</th>
                    <th>Aksi</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product) => (
                      <tr
                        key={product.id}
                      >

                        <td>
                          <div className="table-product">

                            {product.image_url ? (
                              <img
                                src={
                                  product.image_url
                                }
                                alt={
                                  product.name
                                }
                              />
                            ) : (
                              <span>
                                WS
                              </span>
                            )}

                            <b>
                              {
                                product.name
                              }
                            </b>

                          </div>
                        </td>

                        <td>
                          {product.categories
                            ?.name ||
                            "—"}
                        </td>

                        <td>
                          {formatRupiah(
                            product.price
                          )}
                        </td>

                        <td>
                          {product.stock}
                        </td>

                        <td>
                          {product.is_active
                            ? "Active"
                            : "Inactive"}
                        </td>

                        <td>
                          {product.is_featured
                            ? "Yes"
                            : "-"}
                        </td>

                        <td>

                          <button
                            className="table-action"
                            onClick={() =>
                              editProduct(
                                product
                              )
                            }
                            type="button"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil
                              size={16}
                            />
                          </button>

                          <button
                            className="table-action danger"
                            onClick={() =>
                              deleteProduct(
                                product.id
                              )
                            }
                            type="button"
                            aria-label={`Hapus ${product.name}`}
                          >
                            <Trash2
                              size={16}
                            />
                          </button>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

              {!products.length && (
                <div className="empty-state">
                  Belum ada produk.
                </div>
              )}

            </div>

          </>
        )}

        {/* ================================================= */}
        {/* ORDERS */}
        {/* ================================================= */}

        {tab === "orders" && (
          <div className="admin-section">

            <div className="admin-section-heading">
              <h2>
                Orders
              </h2>
            </div>

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>

                <tbody>

                  {orders.map(
                    (order) => (
                      <tr
                        key={order.id}
                      >

                        <td>
                          <b>
                            {
                              order.customer_name
                            }
                          </b>

                          <small>
                            {
                              order.phone
                            }
                          </small>
                        </td>

                        <td>
                          {formatRupiah(
                            order.total
                          )}
                        </td>

                        <td>

                          <select
                            value={
                              order.status
                            }
                            onChange={(e) =>
                              updateOrderStatus(
                                order.id,
                                e.target.value
                              )
                            }
                          >

                            <option value="pending">
                              pending
                            </option>

                            <option value="confirmed">
                              confirmed
                            </option>

                            <option value="processing">
                              processing
                            </option>

                            <option value="shipped">
                              shipped
                            </option>

                            <option value="completed">
                              completed
                            </option>

                            <option value="cancelled">
                              cancelled
                            </option>

                          </select>

                        </td>

                        <td>
                          {formatDate(
                            order.created_at
                          )}
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

              {!orders.length && (
                <div className="empty-state">
                  Belum ada order.
                </div>
              )}

            </div>

          </div>
        )}

      </section>
    </main>
  );
}