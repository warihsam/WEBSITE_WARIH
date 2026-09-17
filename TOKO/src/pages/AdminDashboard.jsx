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
  Eye,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatRupiah } from "../utils/format";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* =========================================================
   DEFAULT DATA
========================================================= */

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

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/* =========================================================
   HELPERS
========================================================= */

/**
 * Mengubah nilai menjadi string aman untuk input form.
 *
 * Array:
 * ["S", "M", "L"] -> "S,M,L"
 *
 * String:
 * "S,M,L" -> "S,M,L"
 *
 * null:
 * "" 
 */
function normalizeText(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .join(",");
  }

  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return "";
  }

  return String(value);
}

/**
 * Mengubah input comma-separated menjadi array.
 *
 * "S,M,L,XL"
 * ->
 * ["S", "M", "L", "XL"]
 */
function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? "").trim())
      .filter(Boolean);
  }

  if (value === null || value === undefined) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Mengubah nilai menjadi angka aman.
 */
function normalizeNumber(value, fallback = 0) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return fallback;
  }

  const number = Number(value);

  return Number.isFinite(number)
    ? number
    : fallback;
}

/**
 * Membuat slug kategori.
 */
function createSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Mendapatkan nomor order.
 */
function getOrderNumber(order) {
  return (
    order?.order_number ||
    order?.order_code ||
    order?.invoice_number ||
    order?.invoice ||
    order?.id ||
    "-"
  );
}

/**
 * Mendapatkan nama customer.
 */
function getCustomerName(order) {
  return (
    order?.customer_name ||
    order?.name ||
    order?.full_name ||
    order?.customer ||
    "-"
  );
}

/**
 * Mendapatkan nomor customer.
 */
function getCustomerPhone(order) {
  return (
    order?.customer_phone ||
    order?.phone ||
    order?.whatsapp ||
    order?.phone_number ||
    "-"
  );
}

/**
 * Mendapatkan email customer.
 */
function getCustomerEmail(order) {
  return (
    order?.customer_email ||
    order?.email ||
    "-"
  );
}

/**
 * Mendapatkan alamat customer.
 */
function getOrderAddress(order) {
  const address =
    order?.shipping_address ||
    order?.address ||
    order?.delivery_address ||
    order?.customer_address ||
    "-";

  if (typeof address === "object") {
    try {
      return Object.values(address)
        .filter(Boolean)
        .join(", ");
    } catch {
      return "-";
    }
  }

  return String(address);
}

/**
 * Mendapatkan total order.
 */
function getOrderTotal(order) {
  return normalizeNumber(
    order?.total ??
      order?.grand_total ??
      order?.total_amount ??
      order?.amount ??
      order?.subtotal ??
      0,
    0
  );
}

/**
 * Mendapatkan status order.
 */
function getOrderStatus(order) {
  return (
    order?.status ||
    order?.order_status ||
    "pending"
  );
}

/**
 * Mendapatkan status pembayaran.
 */
function getPaymentStatus(order) {
  return (
    order?.payment_status ||
    order?.payment ||
    "-"
  );
}

/**
 * Mendapatkan harga item order.
 */
function getItemPrice(item) {
  return normalizeNumber(
    item?.price ??
      item?.unit_price ??
      item?.product_price ??
      item?.products?.price ??
      0,
    0
  );
}

/**
 * Mendapatkan quantity item.
 */
function getItemQuantity(item) {
  return normalizeNumber(
    item?.quantity ??
      item?.qty ??
      0,
    0
  );
}

/**
 * Mendapatkan nama produk order.
 */
function getItemName(item) {
  return (
    item?.product_name ||
    item?.name ||
    item?.products?.name ||
    "Produk"
  );
}

/**
 * Mendapatkan gambar produk order.
 */
function getItemImage(item) {
  return (
    item?.product_image ||
    item?.image_url ||
    item?.products?.image_url ||
    ""
  );
}

/**
 * Format status.
 */
function formatStatus(status) {
  return String(status || "pending")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
}

/* =========================================================
   COMPONENT
========================================================= */

export default function AdminDashboard() {
  const { profile, logout } = useAuth();

  /* =======================================================
     STATE
  ======================================================= */

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

  /* PRODUCT */

  const [form, setForm] =
    useState({ ...emptyProduct });

  const [editing, setEditing] =
    useState(null);

  const [file, setFile] =
    useState(null);

  const [saving, setSaving] =
    useState(false);

  /* CATEGORY */

  const [categoryForm, setCategoryForm] =
    useState({ ...emptyCategory });

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [savingCategory, setSavingCategory] =
    useState(false);

  /* REPORT */

  const [orderPeriod, setOrderPeriod] =
    useState("monthly");

  const [exportingPDF, setExportingPDF] =
    useState(false);

  /* ORDER DETAIL */

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [orderItems, setOrderItems] =
    useState([]);

  const [loadingOrderDetail, setLoadingOrderDetail] =
    useState(false);

  /* =======================================================
     LOAD DATA
  ======================================================= */

  async function load() {
    setLoading(true);

    try {
      const [
        productsResult,
        ordersResult,
        categoriesResult,
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
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("orders")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("categories")
          .select(
            "id, name, slug, description, created_at"
          )
          .order("name", {
            ascending: true,
          }),
      ]);

      const {
        data: productsData,
        error: productsError,
      } = productsResult;

      const {
        data: ordersData,
        error: ordersError,
      } = ordersResult;

      const {
        data: categoriesData,
        error: categoriesError,
      } = categoriesResult;

      if (productsError) {
        console.error(
          "LOAD PRODUCTS ERROR:",
          productsError
        );

        setMessage(
          `Gagal memuat produk: ${productsError.message}`
        );
      }

      if (ordersError) {
        console.error(
          "LOAD ORDERS ERROR:",
          ordersError
        );

        setMessage(
          `Gagal memuat order: ${ordersError.message}`
        );
      }

      if (categoriesError) {
        console.error(
          "LOAD CATEGORIES ERROR:",
          categoriesError
        );

        setMessage(
          `Gagal memuat kategori: ${categoriesError.message}`
        );
      }

      setProducts(productsData || []);
      setOrders(ordersData || []);
      setCategories(categoriesData || []);
    } catch (error) {
      console.error(
        "LOAD ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal memuat data dashboard."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* =======================================================
     ESCAPE
  ======================================================= */

  useEffect(() => {
    function handleEscape(event) {
      if (event.key !== "Escape") {
        return;
      }

      setSidebarOpen(false);
      setSelectedOrder(null);
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

  /* =======================================================
     PRODUCT FORM
  ======================================================= */

  function handleProductChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function resetForm() {
    setForm({
      ...emptyProduct,
    });

    setEditing(null);
    setFile(null);
  }

  function editProduct(product) {
    setEditing(product.id);

    setForm({
      name: normalizeText(
        product.name
      ),

      category_id:
        product.category_id || "",

      price:
        product.price ?? "",

      compare_price:
        product.compare_price ?? "",

      description:
        normalizeText(
          product.description
        ),

      /*
       * Supabase:
       * ["S","M","L","XL"]
       *
       * Form:
       * "S,M,L,XL"
       */
      sizes:
        normalizeText(
          product.sizes
        ) || "S,M,L,XL",

      colors:
        normalizeText(
          product.colors
        ),

      stock:
        product.stock ?? "0",

      sku:
        normalizeText(
          product.sku
        ),

      image_url:
        normalizeText(
          product.image_url
        ),

      is_active:
        product.is_active !== false,

      is_featured:
        product.is_featured === true,
    });

    setFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =======================================================
     IMAGE UPLOAD
  ======================================================= */

  async function uploadProductImage() {
    if (!file) {
      return form.image_url || "";
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new Error(
        "Format gambar harus JPG, PNG, WEBP, atau GIF."
      );
    }

    if (file.size > MAX_IMAGE_SIZE) {
      throw new Error(
        "Ukuran gambar maksimal 5 MB."
      );
    }

    const extension =
      file.name
        .split(".")
        .pop()
        ?.toLowerCase() ||
      "jpg";

    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}.${extension}`;

    const filePath =
      `products/${fileName}`;

    const {
      error: uploadError,
    } = await supabase.storage
      .from("product-images")
      .upload(
        filePath,
        file,
        {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        }
      );

    if (uploadError) {
      console.error(
        "UPLOAD IMAGE ERROR:",
        uploadError
      );

      throw new Error(
        `Gagal upload gambar: ${uploadError.message}`
      );
    }

    const {
      data,
    } = supabase.storage
      .from("product-images")
      .getPublicUrl(
        filePath
      );

    return data?.publicUrl || "";
  }

  /* =======================================================
     SAVE PRODUCT
  ======================================================= */

  async function saveProduct(event) {
    event.preventDefault();

    /*
     * Semua nilai text dinormalisasi
     * terlebih dahulu.
     */
    const productName =
      normalizeText(
        form.name
      ).trim();

    const sizesText =
      normalizeText(
        form.sizes
      ).trim();

    const colorsText =
      normalizeText(
        form.colors
      ).trim();

    const descriptionValue =
      normalizeText(
        form.description
      ).trim();

    const skuValue =
      normalizeText(
        form.sku
      ).trim();

    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!productName) {
      setMessage(
        "Nama produk wajib diisi."
      );

      return;
    }

    if (!form.category_id) {
      setMessage(
        "Kategori produk wajib dipilih."
      );

      return;
    }

    if (
      form.price === "" ||
      Number.isNaN(
        Number(form.price)
      ) ||
      Number(form.price) < 0
    ) {
      setMessage(
        "Harga produk tidak valid."
      );

      return;
    }

    if (
      form.compare_price !== "" &&
      (
        Number.isNaN(
          Number(form.compare_price)
        ) ||
        Number(form.compare_price) < 0
      )
    ) {
      setMessage(
        "Harga coret tidak valid."
      );

      return;
    }

    if (
      form.stock !== "" &&
      (
        Number.isNaN(
          Number(form.stock)
        ) ||
        Number(form.stock) < 0
      )
    ) {
      setMessage(
        "Stok produk tidak valid."
      );

      return;
    }

    setSaving(true);

    setMessage(
      "Menyimpan produk..."
    );

    try {
      /* ===================================================
         IMAGE
      =================================================== */

      let imageUrl =
        normalizeText(
          form.image_url
        ).trim();

      if (file) {
        imageUrl =
          await uploadProductImage();
      }

      /* ===================================================
         ARRAY FIELDS
         
         PENTING:
         Kolom Supabase sizes/colors diasumsikan text[].
         
         Input:
         "S,M,L,XL"
         
         Database:
         ["S","M","L","XL"]
      =================================================== */

      const sizes =
        normalizeArray(
          sizesText
        );

      const colors =
        normalizeArray(
          colorsText
        );

      /* ===================================================
         PAYLOAD
      =================================================== */

      const payload = {
        name: productName,

        category_id:
          form.category_id,

        price:
          Number(form.price),

        compare_price:
          form.compare_price === ""
            ? null
            : Number(
                form.compare_price
              ),

        description:
          descriptionValue ||
          null,

        /*
         * PENTING:
         * Jangan kirim sizesText.
         * Kirim array.
         */
        sizes,

        /*
         * PENTING:
         * Jangan kirim colorsText.
         * Kirim array.
         */
        colors,

        stock:
          Number(form.stock) || 0,

        sku:
          skuValue || null,

        image_url:
          imageUrl || null,

        is_active:
          Boolean(
            form.is_active
          ),

        is_featured:
          Boolean(
            form.is_featured
          ),
      };

      console.log(
        "PRODUCT PAYLOAD:",
        payload
      );

      /* ===================================================
         EDIT PRODUCT
      =================================================== */

      if (editing) {
        const {
          error,
        } = await supabase
          .from("products")
          .update({
            ...payload,

            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            editing
          );

        if (error) {
          console.error(
            "SUPABASE UPDATE PRODUCT ERROR:",
            error
          );

          throw error;
        }

        setMessage(
          `Produk "${productName}" berhasil diperbarui.`
        );
      }

      /* ===================================================
         ADD PRODUCT
      =================================================== */

      else {
        const {
          error,
        } = await supabase
          .from("products")
          .insert(
            payload
          );

        if (error) {
          console.error(
            "SUPABASE INSERT PRODUCT ERROR:",
            error
          );

          throw error;
        }

        setMessage(
          `Produk "${productName}" berhasil ditambahkan.`
        );
      }

      resetForm();

      await load();
    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error
      );

      /*
       * Supabase biasanya menyediakan:
       * message
       * details
       * hint
       * code
       */
      const errorMessage =
        error?.message ||
        error?.details ||
        error?.hint ||
        "Unknown error";

      const errorCode =
        error?.code
          ? ` [${error.code}]`
          : "";

      setMessage(
        `Gagal menyimpan produk${errorCode}: ${errorMessage}`
      );
    } finally {
      setSaving(false);
    }
  }

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  async function checkProductHasOrderItem(
    productId
  ) {
    const {
      data,
      error,
    } = await supabase
      .from("order_items")
      .select("id")
      .eq(
        "product_id",
        productId
      )
      .limit(1);

    if (error) {
      console.error(
        "CHECK ORDER ITEM ERROR:",
        error
      );

      throw new Error(
        `Gagal mengecek riwayat order: ${error.message}`
      );
    }

    return (
      Array.isArray(data) &&
      data.length > 0
    );
  }

  async function deleteProduct(id) {
    const product =
      products.find(
        (item) =>
          item.id === id
      );

    if (!product) {
      setMessage(
        "Produk tidak ditemukan."
      );

      return;
    }

    try {
      setMessage(
        `Memeriksa riwayat order "${product.name}"...`
      );

      const hasOrderItem =
        await checkProductHasOrderItem(
          id
        );

      if (hasOrderItem) {
        const notification =
          `Produk "${product.name}" tidak dapat dihapus.\n\n` +
          `Produk ini sudah tercatat pada riwayat transaksi ` +
          `di tabel order_items.\n\n` +
          `Produk harus dipertahankan agar riwayat transaksi ` +
          `tetap aman.`;

        setMessage(
          `Produk "${product.name}" tidak dapat dihapus karena sudah digunakan pada order_items.`
        );

        alert(
          notification
        );

        return;
      }

      const confirmed =
        window.confirm(
          `Hapus produk "${product.name}"?\n\n` +
          `Produk ini belum digunakan pada order_items ` +
          `sehingga dapat dihapus.\n\n` +
          `Klik OK untuk menghapus.`
        );

      if (!confirmed) {
        setMessage("");
        return;
      }

      setMessage(
        `Menghapus produk "${product.name}"...`
      );

      const {
        error,
      } = await supabase
        .from("products")
        .delete()
        .eq(
          "id",
          id
        );

      if (error) {
        console.error(
          "DELETE PRODUCT ERROR:",
          error
        );

        setMessage(
          `Gagal menghapus produk: ${error.message}`
        );

        alert(
          `Produk gagal dihapus.\n\n${error.message}`
        );

        return;
      }

      if (editing === id) {
        resetForm();
      }

      setMessage(
        `Produk "${product.name}" berhasil dihapus.`
      );

      alert(
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

  /* =======================================================
     CATEGORY CRUD
  ======================================================= */

  function handleCategoryChange(
    event
  ) {
    const {
      name,
      value,
    } = event.target;

    setCategoryForm(
      (current) => ({
        ...current,
        [name]: value,
      })
    );
  }

  function resetCategoryForm() {
    setCategoryForm({
      ...emptyCategory,
    });

    setEditingCategory(null);
  }

  function editCategory(
    category
  ) {
    setEditingCategory(
      category.id
    );

    setCategoryForm({
      name:
        normalizeText(
          category.name
        ),

      slug:
        normalizeText(
          category.slug
        ),

      description:
        normalizeText(
          category.description
        ),
    });
  }

  async function saveCategory(
    event
  ) {
    event.preventDefault();

    const categoryName =
      normalizeText(
        categoryForm.name
      ).trim();

    const categorySlug =
      normalizeText(
        categoryForm.slug
      ).trim();

    const categoryDescription =
      normalizeText(
        categoryForm.description
      ).trim();

    if (!categoryName) {
      setMessage(
        "Nama kategori wajib diisi."
      );

      return;
    }

    setSavingCategory(true);

    setMessage(
      "Menyimpan kategori..."
    );

    try {
      const slug =
        categorySlug ||
        createSlug(
          categoryName
        );

      const payload = {
        name:
          categoryName,

        slug,

        description:
          categoryDescription ||
          null,
      };

      if (editingCategory) {
        const {
          error,
        } = await supabase
          .from("categories")
          .update(
            payload
          )
          .eq(
            "id",
            editingCategory
          );

        if (error) {
          throw error;
        }

        setMessage(
          `Kategori "${categoryName}" berhasil diperbarui.`
        );
      } else {
        const {
          error,
        } = await supabase
          .from("categories")
          .insert(
            payload
          );

        if (error) {
          throw error;
        }

        setMessage(
          `Kategori "${categoryName}" berhasil ditambahkan.`
        );
      }

      resetCategoryForm();

      await load();
    } catch (error) {
      console.error(
        "SAVE CATEGORY ERROR:",
        error
      );

      setMessage(
        `Gagal menyimpan kategori: ${
          error?.message ||
          "Unknown error"
        }`
      );
    } finally {
      setSavingCategory(false);
    }
  }

  async function deleteCategory(
    id
  ) {
    const category =
      categories.find(
        (item) =>
          item.id === id
      );

    if (!category) {
      return;
    }

    const productCount =
      products.filter(
        (product) =>
          product.category_id === id
      ).length;

    if (productCount > 0) {
      alert(
        `Kategori "${category.name}" tidak dapat dihapus.\n\n` +
        `Masih terdapat ${productCount} produk ` +
        `yang menggunakan kategori ini.\n\n` +
        `Pindahkan produk terlebih dahulu.`
      );

      setMessage(
        `Kategori "${category.name}" masih digunakan oleh produk.`
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

    try {
      const {
        error,
      } = await supabase
        .from("categories")
        .delete()
        .eq(
          "id",
          id
        );

      if (error) {
        throw error;
      }

      if (
        editingCategory === id
      ) {
        resetCategoryForm();
      }

      setMessage(
        `Kategori "${category.name}" berhasil dihapus.`
      );

      await load();
    } catch (error) {
      console.error(
        "DELETE CATEGORY ERROR:",
        error
      );

      setMessage(
        `Gagal menghapus kategori: ${
          error?.message ||
          "Unknown error"
        }`
      );
    }
  }

  /* =======================================================
     ORDER DETAIL
  ======================================================= */

  async function viewOrderDetail(
    order
  ) {
    setSelectedOrder(order);

    setOrderItems([]);

    setLoadingOrderDetail(
      true
    );

    setMessage("");

    try {
      const {
        data: items,
        error: itemsError,
      } = await supabase
        .from("order_items")
        .select("*")
        .eq(
          "order_id",
          order.id
        );

      if (itemsError) {
        console.error(
          "LOAD ORDER ITEMS ERROR:",
          itemsError
        );

        throw new Error(
          `Gagal memuat item order: ${itemsError.message}`
        );
      }

      const safeItems =
        items || [];

      const productIds =
        safeItems
          .map(
            (item) =>
              item.product_id
          )
          .filter(Boolean);

      let productMap = {};

      if (
        productIds.length >
        0
      ) {
        const {
          data: productData,
          error: productError,
        } = await supabase
          .from("products")
          .select(
            "id, name, image_url, price, sku"
          )
          .in(
            "id",
            productIds
          );

        if (productError) {
          console.error(
            "LOAD ORDER PRODUCTS ERROR:",
            productError
          );
        } else {
          productMap =
            Object.fromEntries(
              (
                productData ||
                []
              ).map(
                (product) => [
                  product.id,
                  product,
                ]
              )
            );
        }
      }

      const mergedItems =
        safeItems.map(
          (item) => ({
            ...item,

            products:
              productMap[
                item.product_id
              ] || null,
          })
        );

      setOrderItems(
        mergedItems
      );
    } catch (error) {
      console.error(
        "ORDER DETAIL ERROR:",
        error
      );

      setMessage(
        error instanceof Error
          ? error.message
          : "Gagal memuat detail order."
      );

      setOrderItems([]);
    } finally {
      setLoadingOrderDetail(
        false
      );
    }
  }

  function closeOrderDetail() {
    setSelectedOrder(null);
    setOrderItems([]);
  }

  /* =======================================================
     UPDATE ORDER STATUS
  ======================================================= */

  async function updateOrderStatus(
    orderId,
    status
  ) {
    try {
      const {
        error,
      } = await supabase
        .from("orders")
        .update({
          status,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          orderId
        );

      if (error) {
        throw error;
      }

      setMessage(
        "Status order berhasil diperbarui."
      );

      await load();

      if (
        selectedOrder?.id ===
        orderId
      ) {
        setSelectedOrder(
          (current) =>
            current
              ? {
                  ...current,
                  status,
                }
              : current
        );
      }
    } catch (error) {
      console.error(
        "UPDATE ORDER ERROR:",
        error
      );

      setMessage(
        `Gagal memperbarui status order: ${
          error?.message ||
          "Unknown error"
        }`
      );
    }
  }

  /* =======================================================
     DASHBOARD STATISTICS
  ======================================================= */

  const stats = useMemo(() => {
    const totalProducts =
      products.length;

    const activeProducts =
      products.filter(
        (product) =>
          product.is_active !==
          false
      ).length;

    const totalCategories =
      categories.length;

    const totalOrders =
      orders.length;

    const totalRevenue =
      orders.reduce(
        (sum, order) =>
          sum +
          getOrderTotal(order),
        0
      );

    const pendingOrders =
      orders.filter(
        (order) =>
          String(
            getOrderStatus(
              order
            )
          ).toLowerCase() ===
          "pending"
      ).length;

    return {
      totalProducts,
      activeProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      pendingOrders,
    };
  }, [
    products,
    categories,
    orders,
  ]);

  /* =======================================================
     REPORT FILTER
  ======================================================= */

  const filteredOrders =
    useMemo(() => {
      const now =
        new Date();

      return orders.filter(
        (order) => {
          if (!order.created_at) {
            return true;
          }

          const date =
            new Date(
              order.created_at
            );

          if (
            orderPeriod ===
            "all"
          ) {
            return true;
          }

          if (
            orderPeriod ===
            "daily"
          ) {
            return (
              date.getFullYear() ===
                now.getFullYear() &&
              date.getMonth() ===
                now.getMonth() &&
              date.getDate() ===
                now.getDate()
            );
          }

          if (
            orderPeriod ===
            "weekly"
          ) {
            const sevenDaysAgo =
              new Date(now);

            sevenDaysAgo.setDate(
              now.getDate() - 7
            );

            return (
              date >=
              sevenDaysAgo
            );
          }

          if (
            orderPeriod ===
            "monthly"
          ) {
            return (
              date.getFullYear() ===
                now.getFullYear() &&
              date.getMonth() ===
                now.getMonth()
            );
          }

          if (
            orderPeriod ===
            "yearly"
          ) {
            return (
              date.getFullYear() ===
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

  const filteredRevenue =
    useMemo(
      () =>
        filteredOrders.reduce(
          (sum, order) =>
            sum +
            getOrderTotal(order),
          0
        ),
      [filteredOrders]
    );

  /* =======================================================
     PDF EXPORT
  ======================================================= */

  async function exportOrdersPDF() {
    if (
      filteredOrders.length ===
      0
    ) {
      alert(
        "Tidak ada data order untuk diekspor."
      );

      return;
    }

    setExportingPDF(true);

    try {
      const doc =
        new jsPDF();

      doc.setFontSize(18);

      doc.text(
        "WS FASHION",
        14,
        18
      );

      doc.setFontSize(11);

      doc.text(
        "Laporan Order & Transaksi",
        14,
        26
      );

      doc.setFontSize(9);

      doc.text(
        `Periode: ${formatStatus(
          orderPeriod
        )}`,
        14,
        33
      );

      doc.text(
        `Tanggal export: ${new Date().toLocaleString(
          "id-ID"
        )}`,
        14,
        39
      );

      autoTable(doc, {
        startY: 46,

        head: [
          [
            "No",
            "Order",
            "Customer",
            "Tanggal",
            "Status",
            "Pembayaran",
            "Total",
          ],
        ],

        body:
          filteredOrders.map(
            (
              order,
              index
            ) => [
              index + 1,

              getOrderNumber(
                order
              ),

              getCustomerName(
                order
              ),

              order.created_at
                ? formatDate(
                    order.created_at
                  )
                : "-",

              formatStatus(
                getOrderStatus(
                  order
                )
              ),

              formatStatus(
                getPaymentStatus(
                  order
                )
              ),

              formatRupiah(
                getOrderTotal(
                  order
                )
              ),
            ]
          ),
      });

      const finalY =
        doc.lastAutoTable
          ?.finalY ||
        50;

      doc.setFontSize(11);

      doc.text(
        `Total Order: ${filteredOrders.length}`,
        14,
        finalY + 12
      );

      doc.text(
        `Total Revenue: ${formatRupiah(
          filteredRevenue
        )}`,
        14,
        finalY + 19
      );

      doc.save(
        `ws-fashion-orders-${orderPeriod}.pdf`
      );
    } catch (error) {
      console.error(
        "EXPORT PDF ERROR:",
        error
      );

      alert(
        "Gagal membuat PDF."
      );
    } finally {
      setExportingPDF(false);
    }
  }

  /* =======================================================
     NAVIGATION
  ======================================================= */

  function changeTab(
    newTab
  ) {
    setTab(newTab);

    setSidebarOpen(false);

    setMessage("");
  }

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

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={`admin-layout ${
        sidebarOpen
          ? "sidebar-open"
          : ""
      }`}
    >
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div>
            <strong>
              WS FASHION
            </strong>

            <span>
              Admin Dashboard
            </span>
          </div>

          <button
            type="button"
            className="sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
            aria-label="Tutup menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className={
              tab === "products"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab(
                "products"
              )
            }
          >
            <Package size={18} />

            <span>
              Produk
            </span>
          </button>

          <button
            type="button"
            className={
              tab === "categories"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab(
                "categories"
              )
            }
          >
            <Tags size={18} />

            <span>
              Kategori
            </span>
          </button>

          <button
            type="button"
            className={
              tab === "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab(
                "orders"
              )
            }
          >
            <ShoppingBag
              size={18}
            />

            <span>
              Order Management
            </span>
          </button>

          <button
            type="button"
            className={
              tab === "reports"
                ? "active"
                : ""
            }
            onClick={() =>
              changeTab(
                "reports"
              )
            }
          >
            <CalendarDays
              size={18}
            />

            <span>
              Laporan
            </span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            <div className="admin-avatar">
              {(
                profile?.full_name ||
                profile?.name ||
                "A"
              )
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {profile?.full_name ||
                  profile?.name ||
                  "Administrator"}
              </strong>

              <span>
                Admin
              </span>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={
              handleLogout
            }
          >
            <LogOut size={17} />

            Keluar
          </button>
        </div>
      </aside>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
          aria-label="Tutup sidebar"
        />
      )}

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-menu-button"
            onClick={() =>
              setSidebarOpen(
                true
              )
            }
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <h1>
              {tab ===
                "products" &&
                "Produk"}

              {tab ===
                "categories" &&
                "Kategori"}

              {tab ===
                "orders" &&
                "Order Management"}

              {tab ===
                "reports" &&
                "Laporan"}
            </h1>

            <p>
              Kelola toko WS Fashion
              dari satu dashboard.
            </p>
          </div>

          <button
            type="button"
            className="refresh-button"
            onClick={load}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw
              size={17}
              className={
                loading
                  ? "spin"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        {/* =================================================
            MESSAGE
        ================================================= */}

        {message && (
          <div className="admin-message">
            <span>
              {message}
            </span>

            <button
              type="button"
              onClick={() =>
                setMessage("")
              }
              aria-label="Tutup notifikasi"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="admin-stats">
          <div className="stat-card">
            <div className="stat-card-icon">
              <Package size={20} />
            </div>

            <div>
              <span>
                Total Produk
              </span>

              <strong>
                {
                  stats.totalProducts
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">
              <Tags size={20} />
            </div>

            <div>
              <span>
                Kategori
              </span>

              <strong>
                {
                  stats.totalCategories
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">
              <ShoppingBag
                size={20}
              />
            </div>

            <div>
              <span>
                Total Order
              </span>

              <strong>
                {
                  stats.totalOrders
                }
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-icon">
              <CalendarDays
                size={20}
              />
            </div>

            <div>
              <span>
                Revenue
              </span>

              <strong>
                {formatRupiah(
                  stats.totalRevenue
                )}
              </strong>
            </div>
          </div>
        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {tab === "products" && (
          <section className="admin-section">
            <div className="section-heading">
              <div>
                <h2>
                  Manajemen Produk
                </h2>

                <p>
                  Tambah, edit, dan
                  hapus produk.
                </p>
              </div>
            </div>

            <form
              className="admin-card product-form"
              onSubmit={
                saveProduct
              }
            >
              <div className="card-title">
                <div>
                  <h3>
                    {editing
                      ? "Edit Produk"
                      : "Tambah Produk"}
                  </h3>

                  <p>
                    Isi informasi
                    produk dengan
                    lengkap.
                  </p>
                </div>

                {editing && (
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={
                      resetForm
                    }
                  >
                    <X size={16} />

                    Batal Edit
                  </button>
                )}
              </div>

              <div className="form-grid">
                <label>
                  <span>
                    Nama Produk *
                  </span>

                  <input
                    type="text"
                    name="name"
                    value={
                      form.name
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="Contoh: Oversized Basic Tee"
                    required
                  />
                </label>

                <label>
                  <span>
                    Kategori *
                  </span>

                  <select
                    name="category_id"
                    value={
                      form.category_id
                    }
                    onChange={
                      handleProductChange
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

                <label>
                  <span>
                    Harga *
                  </span>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    value={
                      form.price
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="150000"
                    required
                  />
                </label>

                <label>
                  <span>
                    Harga Coret
                  </span>

                  <input
                    type="number"
                    name="compare_price"
                    min="0"
                    value={
                      form.compare_price
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="200000"
                  />
                </label>

                <label>
                  <span>
                    Stok
                  </span>

                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={
                      form.stock
                    }
                    onChange={
                      handleProductChange
                    }
                  />
                </label>

                <label>
                  <span>
                    SKU
                  </span>

                  <input
                    type="text"
                    name="sku"
                    value={
                      form.sku
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="WS-TEE-001"
                  />
                </label>

                <label>
                  <span>
                    Ukuran
                  </span>

                  <input
                    type="text"
                    name="sizes"
                    value={
                      form.sizes
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="S,M,L,XL"
                  />
                </label>

                <label>
                  <span>
                    Warna
                  </span>

                  <input
                    type="text"
                    name="colors"
                    value={
                      form.colors
                    }
                    onChange={
                      handleProductChange
                    }
                    placeholder="Black, White"
                  />
                </label>

                <label className="full-width">
                  <span>
                    Deskripsi
                  </span>

                  <textarea
                    name="description"
                    value={
                      form.description
                    }
                    onChange={
                      handleProductChange
                    }
                    rows="4"
                    placeholder="Deskripsi produk..."
                  />
                </label>

                <label className="full-width">
                  <span>
                    Gambar Produk
                  </span>

                  <div className="image-upload">
                    <input
                      id="product-image"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={(
                        event
                      ) =>
                        setFile(
                          event.target
                            .files?.[0] ||
                            null
                        )
                      }
                    />

                    <label
                      htmlFor="product-image"
                      className="image-upload-button"
                    >
                      <ImagePlus
                        size={18}
                      />

                      {file
                        ? file.name
                        : "Pilih gambar"}
                    </label>

                    <small>
                      JPG, PNG,
                      WEBP, GIF —
                      maksimal 5 MB.
                    </small>
                  </div>
                </label>

                <div className="checkbox-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={
                        form.is_active
                      }
                      onChange={
                        handleProductChange
                      }
                    />

                    <span>
                      Produk aktif
                    </span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_featured"
                      checked={
                        form.is_featured
                      }
                      onChange={
                        handleProductChange
                      }
                    />

                    <span>
                      Produk unggulan
                    </span>
                  </label>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {editing ? (
                    <Pencil
                      size={17}
                    />
                  ) : (
                    <Plus
                      size={17}
                    />
                  )}

                  {saving
                    ? "Menyimpan..."
                    : editing
                    ? "Simpan Perubahan"
                    : "Tambah Produk"}
                </button>
              </div>
            </form>

            <div className="admin-card">
              <div className="card-title">
                <div>
                  <h3>
                    Daftar Produk
                  </h3>

                  <p>
                    {products.length}{" "}
                    produk
                    terdaftar.
                  </p>
                </div>
              </div>

              {products.length ===
              0 ? (
                <div className="empty-state">
                  <Package
                    size={32}
                  />

                  <p>
                    Belum ada produk.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
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
                          Aksi
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map(
                        (product) => (
                          <tr
                            key={
                              product.id
                            }
                          >
                            <td>
                              <div className="product-table-info">
                                <div className="product-table-image">
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
                                    <Package
                                      size={
                                        20
                                      }
                                    />
                                  )}
                                </div>

                                <div>
                                  <strong>
                                    {
                                      product.name
                                    }
                                  </strong>

                                  {product.sku && (
                                    <small>
                                      SKU:{" "}
                                      {
                                        product.sku
                                      }
                                    </small>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td>
                              {product.categories?.name ||
                                categories.find(
                                  (
                                    category
                                  ) =>
                                    category.id ===
                                    product.category_id
                                )?.name ||
                                "-"}
                            </td>

                            <td>
                              {formatRupiah(
                                Number(
                                  product.price ||
                                    0
                                )
                              )}
                            </td>

                            <td>
                              <span
                                className={
                                  Number(
                                    product.stock
                                  ) <=
                                  0
                                    ? "stock-empty"
                                    : "stock-ok"
                                }
                              >
                                {
                                  product.stock
                                }
                              </span>
                            </td>

                            <td>
                              <span
                                className={
                                  product.is_active !==
                                  false
                                    ? "status-badge active"
                                    : "status-badge inactive"
                                }
                              >
                                {product.is_active !==
                                false
                                  ? "Aktif"
                                  : "Nonaktif"}
                              </span>
                            </td>

                            <td>
                              <div className="table-actions">
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
                                    size={
                                      16
                                    }
                                  />
                                </button>

                                <button
                                  type="button"
                                  className="table-action danger"
                                  onClick={() =>
                                    deleteProduct(
                                      product.id
                                    )
                                  }
                                  aria-label="Hapus produk"
                                  title="Hapus produk"
                                >
                                  <Trash2
                                    size={
                                      16
                                    }
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            CATEGORIES
        ================================================= */}

        {tab ===
          "categories" && (
          <section className="admin-section">
            <div className="section-heading">
              <div>
                <h2>
                  Manajemen Kategori
                </h2>

                <p>
                  Kelola kategori
                  produk WS Fashion.
                </p>
              </div>
            </div>

            <div className="admin-two-column">
              <form
                className="admin-card"
                onSubmit={
                  saveCategory
                }
              >
                <div className="card-title">
                  <div>
                    <h3>
                      {editingCategory
                        ? "Edit Kategori"
                        : "Tambah Kategori"}
                    </h3>
                  </div>

                  {editingCategory && (
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={
                        resetCategoryForm
                      }
                    >
                      <X size={16} />

                      Batal
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <label>
                    <span>
                      Nama Kategori *
                    </span>

                    <input
                      type="text"
                      name="name"
                      value={
                        categoryForm.name
                      }
                      onChange={
                        handleCategoryChange
                      }
                      placeholder="Contoh: Kaos"
                      required
                    />
                  </label>

                  <label>
                    <span>
                      Slug
                    </span>

                    <input
                      type="text"
                      name="slug"
                      value={
                        categoryForm.slug
                      }
                      onChange={
                        handleCategoryChange
                      }
                      placeholder="kaos"
                    />
                  </label>

                  <label className="full-width">
                    <span>
                      Deskripsi
                    </span>

                    <textarea
                      name="description"
                      value={
                        categoryForm.description
                      }
                      onChange={
                        handleCategoryChange
                      }
                      rows="4"
                      placeholder="Deskripsi kategori..."
                    />
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="primary-button"
                    disabled={
                      savingCategory
                    }
                  >
                    {editingCategory ? (
                      <Pencil
                        size={17}
                      />
                    ) : (
                      <Plus
                        size={17}
                      />
                    )}

                    {savingCategory
                      ? "Menyimpan..."
                      : editingCategory
                      ? "Simpan Perubahan"
                      : "Tambah Kategori"}
                  </button>
                </div>
              </form>

              <div className="admin-card">
                <div className="card-title">
                  <div>
                    <h3>
                      Daftar Kategori
                    </h3>

                    <p>
                      {
                        categories.length
                      }{" "}
                      kategori.
                    </p>
                  </div>
                </div>

                <div className="category-list">
                  {categories.length ===
                  0 ? (
                    <div className="empty-state">
                      <Tags
                        size={30}
                      />

                      <p>
                        Belum ada
                        kategori.
                      </p>
                    </div>
                  ) : (
                    categories.map(
                      (category) => (
                        <div
                          className="category-card"
                          key={
                            category.id
                          }
                        >
                          <div className="category-card-icon">
                            <FolderOpen
                              size={
                                22
                              }
                            />
                          </div>

                          <div className="category-card-content">
                            <strong>
                              {
                                category.name
                              }
                            </strong>

                            <span>
                              /
                              {
                                category.slug
                              }
                            </span>

                            {category.description && (
                              <small>
                                {
                                  category.description
                                }
                              </small>
                            )}
                          </div>

                          <div className="category-card-actions">
                            <button
                              type="button"
                              className="table-action"
                              onClick={() =>
                                editCategory(
                                  category
                                )
                              }
                              title="Edit kategori"
                              aria-label="Edit kategori"
                            >
                              <Pencil
                                size={
                                  16
                                }
                              />
                            </button>

                            <button
                              type="button"
                              className="table-action danger"
                              onClick={() =>
                                deleteCategory(
                                  category.id
                                )
                              }
                              title="Hapus kategori"
                              aria-label="Hapus kategori"
                            >
                              <Trash2
                                size={
                                  16
                                }
                              />
                            </button>
                          </div>
                        </div>
                      )
                    )
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            ORDERS
        ================================================= */}

        {tab ===
          "orders" && (
          <section className="admin-section">
            <div className="section-heading">
              <div>
                <h2>
                  Order Management
                </h2>

                <p>
                  Kelola pesanan dan
                  laporan transaksi.
                  Klik detail untuk
                  melihat isi order.
                </p>
              </div>
            </div>

            <div className="admin-card">
              <div className="card-title">
                <div>
                  <h3>
                    Orders
                  </h3>

                  <p>
                    {orders.length}{" "}
                    order.
                  </p>
                </div>
              </div>

              {orders.length ===
              0 ? (
                <div className="empty-state">
                  <ShoppingBag
                    size={32}
                  />

                  <p>
                    Belum ada order.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
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
                          Tanggal
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Pembayaran
                        </th>

                        <th>
                          Total
                        </th>

                        <th>
                          Detail
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {orders.map(
                        (order) => (
                          <tr
                            key={
                              order.id
                            }
                          >
                            <td>
                              <strong>
                                {
                                  getOrderNumber(
                                    order
                                  )
                                }
                              </strong>
                            </td>

                            <td>
                              <div className="customer-table-info">
                                <strong>
                                  {
                                    getCustomerName(
                                      order
                                    )
                                  }
                                </strong>

                                <small>
                                  {
                                    getCustomerPhone(
                                      order
                                    )
                                  }
                                </small>
                              </div>
                            </td>

                            <td>
                              {order.created_at
                                ? formatDate(
                                    order.created_at
                                  )
                                : "-"}
                            </td>

                            <td>
                              <select
                                className="status-select"
                                value={getOrderStatus(
                                  order
                                )}
                                onChange={(
                                  event
                                ) =>
                                  updateOrderStatus(
                                    order.id,
                                    event
                                      .target
                                      .value
                                  )
                                }
                              >
                                <option value="pending">
                                  Pending
                                </option>

                                <option value="processing">
                                  Processing
                                </option>

                                <option value="paid">
                                  Paid
                                </option>

                                <option value="shipped">
                                  Shipped
                                </option>

                                <option value="completed">
                                  Completed
                                </option>

                                <option value="cancelled">
                                  Cancelled
                                </option>
                              </select>
                            </td>

                            <td>
                              <span className="status-badge">
                                {formatStatus(
                                  getPaymentStatus(
                                    order
                                  )
                                )}
                              </span>
                            </td>

                            <td>
                              <strong>
                                {formatRupiah(
                                  getOrderTotal(
                                    order
                                  )
                                )}
                              </strong>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="table-action detail-button"
                                onClick={() =>
                                  viewOrderDetail(
                                    order
                                  )
                                }
                                title="Lihat detail order"
                                aria-label="Lihat detail order"
                              >
                                <Eye
                                  size={
                                    16
                                  }
                                />
                              </button>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            REPORT
        ================================================= */}

        {tab ===
          "reports" && (
          <section className="admin-section">
            <div className="section-heading">
              <div>
                <h2>
                  Laporan Transaksi
                </h2>

                <p>
                  Lihat ringkasan
                  transaksi berdasarkan
                  periode.
                </p>
              </div>
            </div>

            <div className="report-toolbar">
              <div className="period-buttons">
                {[
                  [
                    "daily",
                    "Hari Ini",
                  ],
                  [
                    "weekly",
                    "7 Hari",
                  ],
                  [
                    "monthly",
                    "Bulan Ini",
                  ],
                  [
                    "yearly",
                    "Tahun Ini",
                  ],
                  [
                    "all",
                    "Semua",
                  ],
                ].map(
                  ([
                    value,
                    label,
                  ]) => (
                    <button
                      type="button"
                      key={value}
                      className={
                        orderPeriod ===
                        value
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setOrderPeriod(
                          value
                        )
                      }
                    >
                      {label}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={
                  exportOrdersPDF
                }
                disabled={
                  exportingPDF
                }
              >
                <FileDown
                  size={17}
                />

                {exportingPDF
                  ? "Membuat PDF..."
                  : "Export PDF"}
              </button>
            </div>

            <div className="report-stats">
              <div className="report-card">
                <span>
                  Total Order
                </span>

                <strong>
                  {
                    filteredOrders.length
                  }
                </strong>
              </div>

              <div className="report-card">
                <span>
                  Total Revenue
                </span>

                <strong>
                  {formatRupiah(
                    filteredRevenue
                  )}
                </strong>
              </div>

              <div className="report-card">
                <span>
                  Rata-rata Order
                </span>

                <strong>
                  {formatRupiah(
                    filteredOrders.length
                      ? filteredRevenue /
                          filteredOrders.length
                      : 0
                  )}
                </strong>
              </div>
            </div>

            <div className="admin-card">
              <div className="card-title">
                <div>
                  <h3>
                    Data Transaksi
                  </h3>

                  <p>
                    Periode{" "}
                    {formatStatus(
                      orderPeriod
                    )}
                  </p>
                </div>
              </div>

              {filteredOrders.length ===
              0 ? (
                <div className="empty-state">
                  <CalendarDays
                    size={32}
                  />

                  <p>
                    Tidak ada transaksi
                    pada periode ini.
                  </p>
                </div>
              ) : (
                <div className="table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>
                          No
                        </th>

                        <th>
                          Order
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Tanggal
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.map(
                        (
                          order,
                          index
                        ) => (
                          <tr
                            key={
                              order.id
                            }
                          >
                            <td>
                              {index +
                                1}
                            </td>

                            <td>
                              {
                                getOrderNumber(
                                  order
                                )
                              }
                            </td>

                            <td>
                              {
                                getCustomerName(
                                  order
                                )
                              }
                            </td>

                            <td>
                              {order.created_at
                                ? formatDate(
                                    order.created_at
                                  )
                                : "-"}
                            </td>

                            <td>
                              <span className="status-badge">
                                {formatStatus(
                                  getOrderStatus(
                                    order
                                  )
                                )}
                              </span>
                            </td>

                            <td>
                              <strong>
                                {formatRupiah(
                                  getOrderTotal(
                                    order
                                  )
                                )}
                              </strong>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* =================================================
          ORDER DETAIL MODAL
      ================================================= */}

      {selectedOrder && (
        <div
          className="order-modal-backdrop"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeOrderDetail();
            }
          }}
        >
          <div className="order-modal">
            <div className="order-modal-header">
              <div>
                <span>
                  Detail Order
                </span>

                <h2>
                  {getOrderNumber(
                    selectedOrder
                  )}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={
                  closeOrderDetail
                }
                aria-label="Tutup detail order"
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-body">
              <div className="order-detail-grid">
                <div className="order-detail-box">
                  <span>
                    Customer
                  </span>

                  <strong>
                    {getCustomerName(
                      selectedOrder
                    )}
                  </strong>
                </div>

                <div className="order-detail-box">
                  <span>
                    WhatsApp
                  </span>

                  <strong>
                    {getCustomerPhone(
                      selectedOrder
                    )}
                  </strong>
                </div>

                <div className="order-detail-box">
                  <span>
                    Email
                  </span>

                  <strong>
                    {getCustomerEmail(
                      selectedOrder
                    )}
                  </strong>
                </div>

                <div className="order-detail-box">
                  <span>
                    Tanggal
                  </span>

                  <strong>
                    {selectedOrder.created_at
                      ? formatDate(
                          selectedOrder.created_at
                        )
                      : "-"}
                  </strong>
                </div>

                <div className="order-detail-box">
                  <span>
                    Status
                  </span>

                  <strong>
                    {formatStatus(
                      getOrderStatus(
                        selectedOrder
                      )
                    )}
                  </strong>
                </div>

                <div className="order-detail-box">
                  <span>
                    Pembayaran
                  </span>

                  <strong>
                    {formatStatus(
                      getPaymentStatus(
                        selectedOrder
                      )
                    )}
                  </strong>
                </div>
              </div>

              <div className="order-address-box">
                <span>
                  Alamat Pengiriman
                </span>

                <p>
                  {getOrderAddress(
                    selectedOrder
                  )}
                </p>
              </div>

              <div className="order-detail-section">
                <div className="order-detail-section-title">
                  <h3>
                    Produk Pesanan
                  </h3>

                  <span>
                    {
                      orderItems.length
                    }{" "}
                    item
                  </span>
                </div>

                <div className="order-items-list">
                  {loadingOrderDetail ? (
                    <div className="empty-order-items">
                      <RefreshCw
                        size={20}
                        className="spin"
                      />

                      <span>
                        Memuat detail
                        produk...
                      </span>
                    </div>
                  ) : orderItems.length ===
                    0 ? (
                    <div className="empty-order-items">
                      <Package
                        size={24}
                      />

                      <span>
                        Tidak ada
                        produk pada
                        order ini.
                      </span>
                    </div>
                  ) : (
                    orderItems.map(
                      (item) => {
                        const price =
                          getItemPrice(
                            item
                          );

                        const quantity =
                          getItemQuantity(
                            item
                          );

                        const subtotal =
                          price *
                          quantity;

                        const image =
                          getItemImage(
                            item
                          );

                        return (
                          <div
                            className="order-item-detail"
                            key={
                              item.id
                            }
                          >
                            <div className="order-item-image">
                              {image ? (
                                <img
                                  src={
                                    image
                                  }
                                  alt={getItemName(
                                    item
                                  )}
                                />
                              ) : (
                                <Package
                                  size={
                                    20
                                  }
                                />
                              )}
                            </div>

                            <div className="order-item-info">
                              <strong>
                                {getItemName(
                                  item
                                )}
                              </strong>

                              {item.products
                                ?.sku && (
                                <small>
                                  SKU:{" "}
                                  {
                                    item
                                      .products
                                      .sku
                                  }
                                </small>
                              )}

                              <span>
                                {
                                  quantity
                                }{" "}
                                ×{" "}
                                {formatRupiah(
                                  price
                                )}
                              </span>
                            </div>

                            <strong className="order-item-subtotal">
                              {formatRupiah(
                                subtotal
                              )}
                            </strong>
                          </div>
                        );
                      }
                    )
                  )}
                </div>
              </div>

              <div className="order-total-box">
                <div>
                  <span>
                    Total Pesanan
                  </span>

                  <strong>
                    {formatRupiah(
                      getOrderTotal(
                        selectedOrder
                      )
                    )}
                  </strong>
                </div>
              </div>
            </div>

            <div className="order-modal-footer">
              <button
                type="button"
                className="secondary-button"
                onClick={
                  closeOrderDetail
                }
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}