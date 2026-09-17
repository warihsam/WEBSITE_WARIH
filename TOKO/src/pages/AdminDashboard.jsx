import { useEffect, useMemo, useState } from "react";

import {
  CalendarDays,
  FileDown,
  ImagePlus,
  LogOut,
  Menu,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  ShoppingBag,
  Trash2,
  X,
  FolderOpen,
  Tags,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatRupiah } from "../utils/format";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// =========================================================
// PRODUCT DEFAULT
// =========================================================

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

// =========================================================
// CATEGORY DEFAULT
// =========================================================

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
};

// =========================================================
// IMAGE CONFIG
// =========================================================

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function AdminDashboard() {
  // =========================================================
  // AUTH
  // =========================================================

  const { profile, logout } = useAuth();

  // =========================================================
  // MAIN STATE
  // =========================================================

  const [tab, setTab] = useState("products");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // =========================================================
  // PRODUCT STATE
  // =========================================================

  const [form, setForm] =
    useState({
      ...emptyProduct,
    });

  const [editing, setEditing] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  // =========================================================
  // CATEGORY STATE
  // =========================================================

  const [categoryForm, setCategoryForm] =
    useState({
      ...emptyCategory,
    });

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [savingCategory, setSavingCategory] =
    useState(false);

  // =========================================================
  // ORDER REPORT
  // =========================================================

  const [orderPeriod, setOrderPeriod] =
    useState("monthly");

  const [exportingPDF, setExportingPDF] =
    useState(false);

  // =========================================================
  // LOAD ALL DATA
  // =========================================================

  async function load() {
    setLoading(true);

    try {
      const [
        {
          data: productsData,
          error: productsError,
        },
        {
          data: ordersData,
          error: ordersError,
        },
        {
          data: categoriesData,
          error: categoriesError,
        },
      ] = await Promise.all([
        // PRODUCTS
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
          .order("created_at", {
            ascending: false,
          }),

        // ORDERS
        supabase
          .from("orders")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        // CATEGORIES
        supabase
          .from("categories")
          .select(
            "id, name, slug, description, created_at"
          )
          .order("name", {
            ascending: true,
          }),
      ]);

      // =======================================================
      // PRODUCT ERROR
      // =======================================================

      if (productsError) {
        console.error(
          "LOAD PRODUCTS ERROR:",
          productsError
        );

        setMessage(
          `Gagal memuat produk: ${productsError.message}`
        );
      }

      // =======================================================
      // ORDER ERROR
      // =======================================================

      if (ordersError) {
        console.error(
          "LOAD ORDERS ERROR:",
          ordersError
        );

        setMessage(
          `Gagal memuat order: ${ordersError.message}`
        );
      }

      // =======================================================
      // CATEGORY ERROR
      // =======================================================

      if (categoriesError) {
        console.error(
          "LOAD CATEGORIES ERROR:",
          categoriesError
        );

        setMessage(
          `Gagal memuat kategori: ${categoriesError.message}`
        );
      }

      setProducts(
        productsData || []
      );

      setOrders(
        ordersData || []
      );

      setCategories(
        categoriesData || []
      );
    } catch (error) {
      console.error(
        "LOAD ERROR:",
        error
      );

      setMessage(
        "Gagal memuat data dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // =========================================================
  // ESCAPE SIDEBAR
  // =========================================================

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setSidebarOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // =========================================================
  // SIDEBAR
  // =========================================================

  function handleTabChange(nextTab) {
    setTab(nextTab);
    setSidebarOpen(false);
  }

  // =========================================================
  // PRODUCT FORM
  // =========================================================

  function updateForm(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // =========================================================
  // CATEGORY FORM
  // =========================================================

  function updateCategoryForm(
    field,
    value
  ) {
    setCategoryForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // =========================================================
  // SLUG
  // =========================================================

  function createSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );
  }

  // =========================================================
  // CATEGORY EDIT
  // =========================================================

  function editCategory(category) {
    setEditingCategory(
      category.id
    );

    setCategoryForm({
      name:
        category.name || "",

      slug:
        category.slug || "",

      description:
        category.description || "",
    });

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // RESET CATEGORY
  // =========================================================

  function resetCategoryForm() {
    setEditingCategory(null);

    setCategoryForm({
      ...emptyCategory,
    });
  }

  // =========================================================
  // SAVE CATEGORY
  // =========================================================

  async function saveCategory(event) {
    event.preventDefault();

    if (savingCategory) {
      return;
    }

    setSavingCategory(true);
    setMessage("");

    try {
      const name =
        categoryForm.name.trim();

      if (!name) {
        throw new Error(
          "Nama kategori wajib diisi."
        );
      }

      const slug =
        categoryForm.slug.trim()
          ? createSlug(
              categoryForm.slug
            )
          : createSlug(name);

      if (!slug) {
        throw new Error(
          "Slug kategori tidak valid."
        );
      }

      const payload = {
        name,
        slug,
        description:
          categoryForm.description.trim() ||
          null,
      };

      let result;

      if (editingCategory) {
        result =
          await supabase
            .from("categories")
            .update(payload)
            .eq(
              "id",
              editingCategory
            );
      } else {
        result =
          await supabase
            .from("categories")
            .insert(payload);
      }

      if (result.error) {
        if (
          result.error.code ===
          "23505"
        ) {
          throw new Error(
            "Nama atau slug kategori sudah digunakan."
          );
        }

        throw new Error(
          `Gagal menyimpan kategori: ${result.error.message}`
        );
      }

      setMessage(
        editingCategory
          ? "Kategori berhasil diperbarui."
          : "Kategori berhasil ditambahkan."
      );

      resetCategoryForm();

      await load();
    } catch (error) {
      console.error(
        "SAVE CATEGORY ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan kategori."
      );
    } finally {
      setSavingCategory(false);
    }
  }

  // =========================================================
  // DELETE CATEGORY
  // =========================================================

  async function deleteCategory(
    category
  ) {
    const usedByProducts =
      products.filter(
        (product) =>
          product.category_id ===
          category.id
      );

    if (
      usedByProducts.length > 0
    ) {
      alert(
        `Kategori "${category.name}" masih digunakan oleh ${usedByProducts.length} produk. Ubah kategori produk terlebih dahulu sebelum menghapus kategori ini.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Hapus kategori "${category.name}"?`
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    const { error } =
      await supabase
        .from("categories")
        .delete()
        .eq(
          "id",
          category.id
        );

    if (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      setMessage(
        `Gagal menghapus kategori: ${error.message}`
      );

      return;
    }

    if (
      editingCategory ===
      category.id
    ) {
      resetCategoryForm();
    }

    setMessage(
      "Kategori berhasil dihapus."
    );

    await load();
  }

  // =========================================================
  // PRODUCT EDIT
  // =========================================================

  function editProduct(product) {
    setEditing(product.id);

    setForm({
      name:
        product.name || "",

      category_id:
        product.category_id || "",

      price:
        product.price ?? "",

      compare_price:
        product.compare_price ?? "",

      description:
        product.description || "",

      sizes:
        Array.isArray(
          product.sizes
        )
          ? product.sizes.join(",")
          : "",

      colors:
        Array.isArray(
          product.colors
        )
          ? product.colors.join(",")
          : "",

      stock:
        product.stock ?? 0,

      sku:
        product.sku || "",

      image_url:
        product.image_url || "",

      is_active:
        product.is_active ===
        undefined
          ? true
          : !!product.is_active,

      is_featured:
        !!product.is_featured,
    });

    setFile(null);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================================
  // RESET PRODUCT FORM
  // =========================================================

  function resetForm() {
    setEditing(null);

    setForm({
      ...emptyProduct,
    });

    setFile(null);
  }

  // =========================================================
  // IMAGE VALIDATION
  // =========================================================

  function validateImage(
    selectedFile
  ) {
    if (!selectedFile) {
      throw new Error(
        "File gambar tidak ditemukan."
      );
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        selectedFile.type
      )
    ) {
      throw new Error(
        "Format gambar tidak didukung. Gunakan JPG, PNG, WEBP, atau GIF."
      );
    }

    if (
      selectedFile.size >
      MAX_IMAGE_SIZE
    ) {
      throw new Error(
        "Ukuran gambar maksimal 5 MB."
      );
    }
  }

  // =========================================================
  // FILE CHANGE
  // =========================================================

  function handleFileChange(e) {
    const selectedFile =
      e.target.files?.[0] ||
      null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    try {
      validateImage(
        selectedFile
      );

      setFile(
        selectedFile
      );

      setMessage(
        `Gambar dipilih: ${selectedFile.name}`
      );
    } catch (error) {
      setFile(null);

      e.target.value = "";

      setMessage(
        error.message
      );
    }
  }

  // =========================================================
  // UPLOAD IMAGE
  // =========================================================

  async function uploadImage() {
    if (!file) {
      return (
        form.image_url?.trim() ||
        ""
      );
    }

    validateImage(file);

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const uniqueId =
      typeof crypto !==
        "undefined" &&
      typeof crypto.randomUUID ===
        "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()
            .toString(36)
            .slice(2)}`;

    const path =
      `products/${Date.now()}-${uniqueId}.${extension}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("product-images")
        .upload(
          path,
          file,
          {
            cacheControl:
              "3600",

            upsert: false,

            contentType:
              file.type,
          }
        );

    if (uploadError) {
      throw new Error(
        `Upload gambar gagal: ${uploadError.message}`
      );
    }

    const { data } =
      supabase.storage
        .from(
          "product-images"
        )
        .getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error(
        "URL gambar gagal dibuat."
      );
    }

    return data.publicUrl;
  }

  // =========================================================
  // SAVE PRODUCT
  // =========================================================

  async function saveProduct(
    event
  ) {
    event.preventDefault();

    if (saving) {
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      if (
        !form.name.trim()
      ) {
        throw new Error(
          "Nama produk wajib diisi."
        );
      }

      if (
        !form.category_id
      ) {
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

      const imageUrl =
        await uploadImage();

      const payload = {
        name:
          form.name.trim(),

        category_id:
          form.category_id,

        slug:
          createSlug(
            form.name
          ),

        description:
          form.description.trim() ||
          null,

        price:
          Number(form.price),

        compare_price:
          form.compare_price ===
          ""
            ? null
            : Number(
                form.compare_price
              ),

        stock:
          Number(form.stock),

        sku:
          form.sku.trim() ||
          null,

        image_url:
          imageUrl || null,

        is_active:
          !!form.is_active,

        is_featured:
          !!form.is_featured,

        sizes:
          form.sizes
            .split(",")
            .map((size) =>
              size.trim()
            )
            .filter(Boolean),

        colors:
          form.colors
            .split(",")
            .map((color) =>
              color.trim()
            )
            .filter(Boolean),

        updated_at:
          new Date().toISOString(),
      };

      let result;

      if (editing) {
        result =
          await supabase
            .from("products")
            .update(payload)
            .eq(
              "id",
              editing
            );
      } else {
        result =
          await supabase
            .from("products")
            .insert(
              payload
            );
      }

      if (result.error) {
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
          : "Gagal menyimpan produk."
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================================================
  // DELETE PRODUCT
  // HANYA BOLEH JIKA STOK = 0
  // =========================================================

  async function deleteProduct(id) {
    const product =
      products.find(
        (item) =>
          item.id === id
      );

    // Produk tidak ditemukan
    if (!product) {
      setMessage(
        "Produk tidak ditemukan."
      );

      return;
    }

    // =======================================================
    // CEK STOK
    // =======================================================

    const stock =
      Number(
        product.stock || 0
      );

    // =======================================================
    // STOK MASIH ADA
    // =======================================================

    if (stock > 0) {
      setMessage(
        `Produk "${product.name}" tidak dapat dihapus karena stok masih tersedia (${stock} pcs). Habiskan stok terlebih dahulu.`
      );

      return;
    }

    // =======================================================
    // STOK SUDAH 0
    // =======================================================

    const confirmed =
      window.confirm(
        `Hapus produk "${product.name}"?\n\nStok produk sudah 0, sehingga produk dapat dihapus.`
      );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const { error } =
        await supabase
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

      // Jika sedang edit produk tersebut
      if (editing === id) {
        resetForm();
      }

      setMessage(
        `Produk "${product.name}" berhasil dihapus.`
      );

      await load();
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal menghapus produk."
      );
    }
  }

  // =========================================================
  // ORDER STATUS
  // =========================================================

  async function updateOrderStatus(
    id,
    status
  ) {
    const { error } =
      await supabase
        .from("orders")
        .update({
          status,
        })
        .eq(
          "id",
          id
        );

    if (error) {
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
  // REVENUE
  // =========================================================

  const revenue =
    useMemo(() => {
      return orders
        .filter(
          (order) =>
            order.status !==
            "cancelled"
        )
        .reduce(
          (
            sum,
            order
          ) =>
            sum +
            Number(
              order.total || 0
            ),
          0
        );
    }, [orders]);

  // =========================================================
  // FILTER REPORT
  // =========================================================

  const filteredOrders =
    useMemo(() => {
      const now =
        new Date();

      return orders.filter(
        (order) => {
          const orderDate =
            new Date(
              order.created_at
            );

          if (
            Number.isNaN(
              orderDate.getTime()
            )
          ) {
            return false;
          }

          // WEEKLY
          if (
            orderPeriod ===
            "weekly"
          ) {
            const startDate =
              new Date(
                now
              );

            startDate.setDate(
              now.getDate() -
                6
            );

            startDate.setHours(
              0,
              0,
              0,
              0
            );

            return (
              orderDate >=
              startDate
            );
          }

          // MONTHLY
          if (
            orderPeriod ===
            "monthly"
          ) {
            return (
              orderDate.getMonth() ===
                now.getMonth() &&
              orderDate.getFullYear() ===
                now.getFullYear()
            );
          }

          // YEARLY
          if (
            orderPeriod ===
            "yearly"
          ) {
            return (
              orderDate.getFullYear() ===
              now.getFullYear()
            );
          }

          return true;
        }
      );
    }, [
      orders,
      orderPeriod,
    ]);

  // =========================================================
  // FILTERED REVENUE
  // =========================================================

  const filteredRevenue =
    useMemo(() => {
      return filteredOrders
        .filter(
          (order) =>
            order.status !==
            "cancelled"
        )
        .reduce(
          (
            sum,
            order
          ) =>
            sum +
            Number(
              order.total || 0
            ),
          0
        );
    }, [filteredOrders]);

  // =========================================================
  // ORDER COUNTS
  // =========================================================

  const completedOrders =
    filteredOrders.filter(
      (order) =>
        order.status ===
        "completed"
    ).length;

  const pendingOrders =
    filteredOrders.filter(
      (order) =>
        order.status ===
        "pending"
    ).length;

  const cancelledOrders =
    filteredOrders.filter(
      (order) =>
        order.status ===
        "cancelled"
    ).length;

  // =========================================================
  // EXPORT PDF
  // =========================================================

  async function exportOrdersPDF() {
    if (
      filteredOrders.length ===
      0
    ) {
      alert(
        "Tidak ada pesanan pada periode yang dipilih."
      );

      return;
    }

    try {
      setExportingPDF(true);

      const doc =
        new jsPDF(
          "landscape"
        );

      const periodLabels = {
        weekly:
          "Mingguan",

        monthly:
          "Bulanan",

        yearly:
          "Tahunan",
      };

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(22);

      doc.text(
        "WS FASHION",
        14,
        18
      );

      doc.setFont(
        "helvetica",
        "normal"
      );

      doc.setFontSize(11);

      doc.text(
        "Laporan Pesanan Admin",
        14,
        26
      );

      doc.setFontSize(9);

      doc.text(
        `Periode: ${
          periodLabels[
            orderPeriod
          ]
        }`,
        14,
        34
      );

      doc.text(
        `Dicetak: ${new Date().toLocaleString(
          "id-ID"
        )}`,
        14,
        40
      );

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(10);

      doc.text(
        `Jumlah Pesanan: ${filteredOrders.length}`,
        14,
        50
      );

      doc.text(
        `Selesai: ${completedOrders}`,
        85,
        50
      );

      doc.text(
        `Pending: ${pendingOrders}`,
        140,
        50
      );

      doc.text(
        `Dibatalkan: ${cancelledOrders}`,
        195,
        50
      );

      doc.text(
        `Omzet: ${formatRupiah(
          filteredRevenue
        )}`,
        14,
        58
      );

      const tableData =
        filteredOrders.map(
          (
            order,
            index
          ) => [
            index + 1,

            order.order_number ||
              "-",

            order.customer_name ||
              "-",

            order.customer_phone ||
              order.phone ||
              "-",

            formatDate(
              order.created_at
            ),

            order.status ||
              "-",

            order.payment_status ||
              "-",

            formatRupiah(
              order.total
            ),
          ]
        );

      autoTable(doc, {
        startY: 66,

        head: [
          [
            "No",
            "No. Pesanan",
            "Customer",
            "Telepon",
            "Tanggal",
            "Status",
            "Pembayaran",
            "Total",
          ],
        ],

        body:
          tableData,

        theme:
          "grid",

        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
      });

      const finalY =
        doc.lastAutoTable
          .finalY + 12;

      doc.setFont(
        "helvetica",
        "bold"
      );

      doc.setFontSize(10);

      doc.text(
        `TOTAL OMZET: ${formatRupiah(
          filteredRevenue
        )}`,
        14,
        finalY
      );

      const date =
        new Date()
          .toISOString()
          .slice(
            0,
            10
          );

      doc.save(
        `WS-Fashion-Laporan-${orderPeriod}-${date}.pdf`
      );
    } catch (error) {
      console.error(
        "PDF ERROR:",
        error
      );

      alert(
        "Gagal membuat PDF."
      );
    } finally {
      setExportingPDF(false);
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );
    }
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <main className="admin-page">

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="admin-mobile-header">

        <div className="brand">
          WS<span>FASHION</span>
        </div>

        <button
          type="button"
          className="admin-mobile-menu"
          onClick={() =>
            setSidebarOpen(true)
          }
          aria-label="Buka menu admin"
        >
          <Menu size={22} />
        </button>

      </header>

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >

        <button
          type="button"
          className="admin-sidebar-close"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Tutup menu"
        >
          <X size={22} />
        </button>

        <div className="brand admin-brand">
          WS<span>FASHION</span>
        </div>

        <p className="admin-welcome">
          Halo,{" "}
          {profile?.full_name ||
            "Admin"}
        </p>

        {/* PRODUCTS */}

        <button
          type="button"
          className={
            tab === "products"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            handleTabChange(
              "products"
            )
          }
        >
          <Package size={18} />
          Products
        </button>

        {/* CATEGORIES */}

        <button
          type="button"
          className={
            tab === "categories"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            handleTabChange(
              "categories"
            )
          }
        >
          <Tags size={18} />
          Categories
        </button>

        {/* ORDERS */}

        <button
          type="button"
          className={
            tab === "orders"
              ? "admin-nav active"
              : "admin-nav"
          }
          onClick={() =>
            handleTabChange(
              "orders"
            )
          }
        >
          <ShoppingBag
            size={18}
          />
          Orders
        </button>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-nav logout"
          onClick={
            handleLogout
          }
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {/* =====================================================
          OVERLAY
      ====================================================== */}

      <div
        className={`admin-sidebar-overlay ${
          sidebarOpen
            ? "open"
            : ""
        }`}
        onClick={() =>
          setSidebarOpen(false)
        }
      />

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <section className="admin-content">

        {/* ===================================================
            TOP
        ==================================================== */}

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

        {/* ===================================================
            STATS
        ==================================================== */}

        <div className="stats-grid">

          <div className="stat-card">
            <span>
              Products
            </span>

            <strong>
              {products.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Categories
            </span>

            <strong>
              {categories.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </div>

          <div className="stat-card">
            <span>
              Revenue
            </span>

            <strong>
              {formatRupiah(
                revenue
              )}
            </strong>
          </div>

        </div>

        {/* =================================================
            PRODUCTS
        ================================================== */}

        {tab === "products" && (
          <>

            {/* PRODUCT HEADER */}

            <div className="admin-section-heading">

              <div>

                <p className="eyebrow">
                  PRODUCT MANAGEMENT
                </p>

                <h2>
                  {editing
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

              </div>

              {editing && (
                <button
                  type="button"
                  className="icon-button"
                  onClick={
                    resetForm
                  }
                  aria-label="Batal edit"
                >
                  <X />
                </button>
              )}

            </div>

            {/* PRODUCT FORM */}

            <form
              className="admin-form"
              onSubmit={
                saveProduct
              }
            >

              {/* NAME */}

              <label>
                Nama Produk

                <input
                  type="text"
                  value={
                    form.name
                  }
                  onChange={(e) =>
                    updateForm(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Oversized Basic Tee Black"
                  required
                />
              </label>

              {/* CATEGORY */}

              <label>
                Kategori

                <select
                  value={
                    form.category_id
                  }
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
                        key={
                          category.id
                        }
                        value={
                          category.id
                        }
                      >
                        {
                          category.name
                        }
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
                  value={
                    form.price
                  }
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
                  value={
                    form.stock
                  }
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

                <input
                  type="text"
                  value={
                    form.sku
                  }
                  onChange={(e) =>
                    updateForm(
                      "sku",
                      e.target.value
                    )
                  }
                  placeholder="WS-TEE-001"
                />
              </label>

              {/* SIZE */}

              <label>
                Ukuran

                <input
                  value={
                    form.sizes
                  }
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

                <input
                  value={
                    form.colors
                  }
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
                  value={
                    form.description
                  }
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
                URL Gambar

                <input
                  type="url"
                  value={
                    form.image_url
                  }
                  onChange={(e) =>
                    updateForm(
                      "image_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />

              </label>

              {/* FILE */}

              <label className="file-input full">

                <ImagePlus
                  size={18}
                />

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
                type="submit"
                className="button dark"
                disabled={
                  saving
                }
              >

                {saving ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="admin-spin"
                    />

                    Menyimpan...
                  </>
                ) : editing ? (
                  <>
                    <Pencil
                      size={17}
                    />

                    Update Product
                  </>
                ) : (
                  <>
                    <Plus
                      size={17}
                    />

                    Add Product
                  </>
                )}

              </button>

            </form>

            {/* =================================================
                PRODUCT LIST
            ================================================== */}

            <div className="admin-section-heading">

              <div>

                <p className="eyebrow">
                  INVENTORY
                </p>

                <h2>
                  Product List
                </h2>

              </div>

              <button
                type="button"
                className="icon-button"
                onClick={
                  load
                }
                disabled={
                  loading
                }
                aria-label="Refresh produk"
                title="Refresh produk"
              >
                <RefreshCw
                  className={
                    loading
                      ? "admin-spin"
                      : ""
                  }
                />
              </button>

            </div>

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Produk
                    </th>

                    <th>
                      Kategori
                    </th>

                    <th>
                      Harga
                    </th>

                    <th>
                      Stok
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Featured
                    </th>

                    <th>
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map(
                    (product) => {

                      const productStock =
                        Number(
                          product.stock ||
                            0
                        );

                      const canDelete =
                        productStock ===
                        0;

                      return (
                        <tr
                          key={
                            product.id
                          }
                        >

                          {/* PRODUCT */}

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

                          {/* CATEGORY */}

                          <td>
                            {
                              product
                                .categories
                                ?.name ||
                              "—"
                            }
                          </td>

                          {/* PRICE */}

                          <td>
                            {formatRupiah(
                              product.price
                            )}
                          </td>

                          {/* STOCK */}

                          <td>

                            <strong>
                              {
                                productStock
                              }
                            </strong>

                          </td>

                          {/* STATUS */}

                          <td>
                            {product.is_active
                              ? "Active"
                              : "Inactive"}
                          </td>

                          {/* FEATURED */}

                          <td>
                            {product.is_featured
                              ? "Yes"
                              : "-"}
                          </td>

                          {/* ACTION */}

                          <td>

                            {/* EDIT */}

                            <button
                              type="button"
                              className="table-action"
                              onClick={() =>
                                editProduct(
                                  product
                                )
                              }
                              aria-label="Edit produk"
                              title="Edit produk"
                            >
                              <Pencil
                                size={16}
                              />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              className={
                                canDelete
                                  ? "table-action danger"
                                  : "table-action danger disabled"
                              }
                              onClick={() =>
                                deleteProduct(
                                  product.id
                                )
                              }
                              aria-label={
                                canDelete
                                  ? "Hapus produk"
                                  : "Produk tidak dapat dihapus karena stok masih ada"
                              }
                              title={
                                canDelete
                                  ? "Hapus produk"
                                  : `Tidak dapat dihapus — stok masih ${productStock} pcs`
                              }
                              disabled={
                                !canDelete
                              }
                            >
                              <Trash2
                                size={16}
                              />
                            </button>

                          </td>

                        </tr>
                      );
                    }
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

        {/* =================================================
            CATEGORIES
        ================================================== */}

        {tab === "categories" && (
          <>

            {/* CATEGORY HEADER */}

            <div className="admin-section-heading">

              <div>

                <p className="eyebrow">
                  CATEGORY MANAGEMENT
                </p>

                <h2>
                  {editingCategory
                    ? "Edit Category"
                    : "Add Category"}
                </h2>

              </div>

              {editingCategory && (
                <button
                  type="button"
                  className="icon-button"
                  onClick={
                    resetCategoryForm
                  }
                  aria-label="Batal edit kategori"
                >
                  <X />
                </button>
              )}

            </div>

            {/* CATEGORY FORM */}

            <form
              className="admin-form"
              onSubmit={
                saveCategory
              }
            >

              <label>
                Nama Kategori

                <input
                  type="text"
                  value={
                    categoryForm.name
                  }
                  onChange={(e) =>
                    updateCategoryForm(
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Contoh: Hoodie"
                  required
                />

              </label>

              <label>
                Slug

                <input
                  type="text"
                  value={
                    categoryForm.slug
                  }
                  onChange={(e) =>
                    updateCategoryForm(
                      "slug",
                      e.target.value
                    )
                  }
                  placeholder="hoodie"
                />

                <small>
                  Kosongkan untuk membuat slug otomatis.
                </small>

              </label>

              <label className="full">
                Deskripsi

                <textarea
                  rows="4"
                  value={
                    categoryForm.description
                  }
                  onChange={(e) =>
                    updateCategoryForm(
                      "description",
                      e.target.value
                    )
                  }
                  placeholder="Deskripsi kategori..."
                />

              </label>

              {message && (
                <div
                  className="message full"
                  role="alert"
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                className="button dark"
                disabled={
                  savingCategory
                }
              >

                {savingCategory ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="admin-spin"
                    />

                    Menyimpan...
                  </>
                ) : editingCategory ? (
                  <>
                    <Pencil
                      size={17}
                    />

                    Update Category
                  </>
                ) : (
                  <>
                    <Plus
                      size={17}
                    />

                    Add Category
                  </>
                )}

              </button>

            </form>

            {/* CATEGORY LIST */}

            <div className="admin-section-heading">

              <div>

                <p className="eyebrow">
                  DATABASE
                </p>

                <h2>
                  Category List
                </h2>

              </div>

              <span className="admin-role">
                {categories.length} CATEGORY
              </span>

            </div>

            <div className="category-grid">

              {categories.map(
                (category) => {

                  const productCount =
                    products.filter(
                      (product) =>
                        product.category_id ===
                        category.id
                    ).length;

                  return (
                    <div
                      className="category-card"
                      key={
                        category.id
                      }
                    >

                      {/* CATEGORY ICON */}

                      <div className="category-card-icon">

                        <FolderOpen
                          size={24}
                        />

                      </div>

                      {/* CONTENT */}

                      <div className="category-card-content">

                        <h3>
                          {
                            category.name
                          }
                        </h3>

                        <span>
                          /{category.slug}
                        </span>

                        <p>
                          {
                            category.description ||
                            "Tidak ada deskripsi."
                          }
                        </p>

                        <small>
                          {productCount}{" "}
                          produk
                        </small>

                      </div>

                      {/* ACTIONS */}

                      <div className="category-card-actions">

                        {/* EDIT */}

                        <button
                          type="button"
                          className="table-action"
                          onClick={() =>
                            editCategory(
                              category
                            )
                          }
                          aria-label="Edit kategori"
                          title="Edit kategori"
                        >
                          <Pencil
                            size={16}
                          />
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="table-action danger"
                          onClick={() =>
                            deleteCategory(
                              category
                            )
                          }
                          aria-label="Hapus kategori"
                          title="Hapus kategori"
                        >
                          <Trash2
                            size={16}
                          />
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

            {!categories.length && (
              <div className="empty-state">
                Belum ada kategori.
              </div>
            )}

          </>
        )}

        {/* =================================================
            ORDERS
        ================================================== */}

        {tab === "orders" && (
          <div className="admin-section">

            {/* ORDER HEADER */}

            <div className="admin-section-heading">

              <div>

                <p className="eyebrow">
                  ORDER MANAGEMENT
                </p>

                <h2>
                  Orders
                </h2>

                <p className="admin-report-subtitle">
                  Kelola pesanan dan laporan transaksi.
                </p>

              </div>

              <button
                className="button dark"
                type="button"
                onClick={
                  exportOrdersPDF
                }
                disabled={
                  exportingPDF ||
                  filteredOrders.length ===
                    0
                }
              >

                {exportingPDF ? (
                  <>
                    <RefreshCw
                      size={17}
                      className="admin-spin"
                    />

                    Membuat PDF...
                  </>
                ) : (
                  <>
                    <FileDown
                      size={17}
                    />

                    Export PDF
                  </>
                )}

              </button>

            </div>

            {/* REPORT FILTER */}

            <div className="order-report-toolbar">

              <div className="order-period">

                <div className="order-period-label">

                  <CalendarDays
                    size={18}
                  />

                  <strong>
                    Periode Laporan
                  </strong>

                </div>

                <div className="order-period-buttons">

                  <button
                    type="button"
                    className={
                      orderPeriod ===
                      "weekly"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setOrderPeriod(
                        "weekly"
                      )
                    }
                  >
                    Mingguan
                  </button>

                  <button
                    type="button"
                    className={
                      orderPeriod ===
                      "monthly"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setOrderPeriod(
                        "monthly"
                      )
                    }
                  >
                    Bulanan
                  </button>

                  <button
                    type="button"
                    className={
                      orderPeriod ===
                      "yearly"
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setOrderPeriod(
                        "yearly"
                      )
                    }
                  >
                    Tahunan
                  </button>

                </div>

              </div>

            </div>

            {/* REPORT STATS */}

            <div className="order-report-stats">

              <div className="order-report-card">

                <span>
                  Total Pesanan
                </span>

                <strong>
                  {
                    filteredOrders.length
                  }
                </strong>

              </div>

              <div className="order-report-card">

                <span>
                  Selesai
                </span>

                <strong>
                  {
                    completedOrders
                  }
                </strong>

              </div>

              <div className="order-report-card">

                <span>
                  Pending
                </span>

                <strong>
                  {
                    pendingOrders
                  }
                </strong>

              </div>

              <div className="order-report-card">

                <span>
                  Omzet
                </span>

                <strong>
                  {formatRupiah(
                    filteredRevenue
                  )}
                </strong>

              </div>

            </div>

            {/* ORDER TABLE */}

            <div className="admin-table-wrap">

              <table className="admin-table">

                <thead>

                  <tr>

                    <th>
                      Order
                    </th>

                    <th>
                      Customer
                    </th>

                    <th>
                      Total
                    </th>

                    <th>
                      Pembayaran
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Date
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredOrders.map(
                    (order) => (
                      <tr
                        key={
                          order.id
                        }
                      >

                        <td>

                          <b>
                            {
                              order.order_number ||
                              "—"
                            }
                          </b>

                        </td>

                        <td>

                          <b>
                            {
                              order.customer_name ||
                              "—"
                            }
                          </b>

                          <small>
                            {
                              order.customer_phone ||
                              order.phone ||
                              "—"
                            }
                          </small>

                        </td>

                        <td>
                          {formatRupiah(
                            order.total
                          )}
                        </td>

                        <td>
                          {
                            order.payment_status ||
                            "unpaid"
                          }
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

              {!filteredOrders.length && (
                <div className="empty-state">
                  Tidak ada pesanan pada periode ini.
                </div>
              )}

            </div>

          </div>
        )}

      </section>

    </main>
  );
}