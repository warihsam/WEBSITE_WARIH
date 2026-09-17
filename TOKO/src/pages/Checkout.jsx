import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { formatRupiah } from "../utils/format";

import "./Checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems = [],
    cartTotal = 0,
    clearCart,
  } = useCart();

  // =========================================================
  // STATE
  // =========================================================

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    notes: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [orderSuccess, setOrderSuccess] = useState(null);

  // =========================================================
  // AMBIL PROFILE USER
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.warn(
            "PROFILE USER WARNING:",
            userError
          );
          return;
        }

        if (!user || !mounted) {
          return;
        }

        const {
          data: profile,
          error: profileError,
        } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.warn(
            "PROFILE LOAD WARNING:",
            profileError
          );
          return;
        }

        if (!mounted) {
          return;
        }

        if (profile) {
          setForm((prev) => ({
            ...prev,

            name:
              prev.name ||
              profile.full_name ||
              "",

            phone:
              prev.phone ||
              profile.phone ||
              "",
          }));
        }
      } catch (err) {
        console.warn(
          "PROFILE LOAD ERROR:",
          err
        );
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // TOTAL
  // =========================================================

  const subtotal = useMemo(() => {
    return Number(cartTotal || 0);
  }, [cartTotal]);

  const shippingCost = 0;

  const total = subtotal + shippingCost;

  // =========================================================
  // PAYMENT OPTIONS
  // =========================================================

  const paymentOptions = [
    {
      id: "bank_transfer",
      title: "Transfer Bank",
      description:
        "Transfer manual ke rekening WS Fashion",
      icon: CreditCard,
    },
    {
      id: "qris",
      title: "QRIS",
      description:
        "Bayar menggunakan QRIS",
      icon: CreditCard,
    },
    {
      id: "cod",
      title: "COD",
      description:
        "Bayar ketika barang diterima",
      icon: Package,
    },
  ];

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // ORDER NUMBER
  // =========================================================

  const generateOrderNumber = () => {
    const timestamp = Date.now()
      .toString()
      .slice(-8);

    const random = Math.floor(
      100 + Math.random() * 900
    );

    return `WS-${timestamp}${random}`;
  };

  // =========================================================
  // VALIDATION FORM
  // =========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      return "Nama penerima wajib diisi.";
    }

    if (!form.phone.trim()) {
      return "Nomor WhatsApp wajib diisi.";
    }

    const phoneNumber = form.phone.replace(
      /\D/g,
      ""
    );

    if (phoneNumber.length < 10) {
      return "Nomor WhatsApp tidak valid.";
    }

    if (!form.address.trim()) {
      return "Alamat pengiriman wajib diisi.";
    }

    if (!paymentMethod) {
      return "Silakan pilih metode pembayaran.";
    }

    if (!cartItems.length) {
      return "Keranjang masih kosong.";
    }

    return "";
  };

  // =========================================================
  // CEK STOK TERBARU
  // =========================================================

  const validateStock = async () => {
    try {
      for (const item of cartItems) {
        const product =
          item.product || item;

        const productId =
          product.id;

        const quantity = Number(
          item.quantity ??
            item.qty ??
            1
        );

        if (!productId) {
          return `Produk "${
            product.name || "Produk"
          }" tidak memiliki ID produk.`;
        }

        if (quantity <= 0) {
          return `Jumlah produk "${
            product.name || "Produk"
          }" tidak valid.`;
        }

        const {
          data: currentProduct,
          error: productError,
        } = await supabase
          .from("products")
          .select(
            "id, name, stock, is_active"
          )
          .eq("id", productId)
          .maybeSingle();

        if (productError) {
          console.error(
            "STOCK CHECK ERROR:",
            productError
          );

          return `Gagal mengecek stok "${
            product.name || "Produk"
          }".`;
        }

        if (!currentProduct) {
          return `Produk "${
            product.name || "Produk"
          }" sudah tidak tersedia.`;
        }

        if (!currentProduct.is_active) {
          return `Produk "${
            currentProduct.name
          }" sudah tidak aktif.`;
        }

        const stock = Number(
          currentProduct.stock || 0
        );

        if (stock <= 0) {
          return `Stok "${
            currentProduct.name
          }" sudah habis.`;
        }

        if (quantity > stock) {
          return `Stok "${
            currentProduct.name
          }" hanya tersisa ${stock}. Jumlah di keranjang: ${quantity}.`;
        }
      }

      return "";
    } catch (err) {
      console.error(
        "VALIDATE STOCK ERROR:",
        err
      );

      return "Gagal memeriksa stok produk.";
    }
  };

  // =========================================================
  // KURANGI STOK
  // =========================================================

  const decreaseProductStock = async (
    orderItems
  ) => {
    console.log(
      "========================================"
    );

    console.log(
      "=== DECREASING PRODUCT STOCK ==="
    );

    for (const item of orderItems) {
      if (!item.product_id) {
        throw new Error(
          `Produk "${item.product_name}" tidak memiliki ID produk.`
        );
      }

      const quantity = Number(
        item.quantity || 0
      );

      if (quantity <= 0) {
        throw new Error(
          `Jumlah produk "${item.product_name}" tidak valid.`
        );
      }

      console.log(
        "MENGURANGI STOK:",
        item.product_name
      );

      console.log(
        "PRODUCT ID:",
        item.product_id
      );

      console.log(
        "QUANTITY:",
        quantity
      );

      const {
        data: remainingStock,
        error: stockError,
      } = await supabase.rpc(
        "decrease_product_stock",
        {
          p_product_id:
            item.product_id,

          p_quantity:
            quantity,
        }
      );

      if (stockError) {
        console.error(
          "STOCK UPDATE ERROR:",
          stockError
        );

        if (
          stockError.message?.includes(
            "Stok produk tidak mencukupi"
          )
        ) {
          throw new Error(
            `Stok "${item.product_name}" tidak mencukupi. Kemungkinan stok baru saja dibeli oleh pelanggan lain.`
          );
        }

        throw new Error(
          `Gagal mengurangi stok "${item.product_name}".`
        );
      }

      console.log(
        `STOK "${item.product_name}" SETELAH CHECKOUT:`,
        remainingStock
      );
    }

    console.log(
      "=== ALL PRODUCT STOCK UPDATED ==="
    );

    console.log(
      "========================================"
    );
  };

  // =========================================================
  // CHECKOUT
  // =========================================================

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (loading) {
      return;
    }

    console.log(
      "========================================"
    );

    console.log(
      "=== CHECKOUT BUTTON CLICKED ==="
    );

    console.log("FORM:", form);

    console.log(
      "PAYMENT METHOD:",
      paymentMethod
    );

    console.log(
      "CART ITEMS:",
      cartItems
    );

    console.log(
      "CART TOTAL:",
      cartTotal
    );

    console.log(
      "========================================"
    );

    setError("");

    // -------------------------------------------------------
    // VALIDASI FORM
    // -------------------------------------------------------

    const validationError =
      validateForm();

    if (validationError) {
      console.error(
        "VALIDATION ERROR:",
        validationError
      );

      setError(validationError);

      return;
    }

    try {
      setLoading(true);

      // -----------------------------------------------------
      // CEK STOK TERBARU
      // -----------------------------------------------------

      console.log(
        "=== CHECKING LATEST STOCK ==="
      );

      const stockValidationError =
        await validateStock();

      if (stockValidationError) {
        console.error(
          "STOCK VALIDATION ERROR:",
          stockValidationError
        );

        setError(
          stockValidationError
        );

        return;
      }

      console.log(
        "=== STOCK VALIDATION PASSED ==="
      );

      // -----------------------------------------------------
      // CEK USER
      // -----------------------------------------------------

      console.log(
        "=== CHECKING AUTH USER ==="
      );

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "GET USER ERROR:",
          userError
        );

        throw userError;
      }

      if (!user) {
        console.error(
          "NO AUTHENTICATED USER"
        );

        setError(
          "Silakan login terlebih dahulu sebelum melakukan checkout."
        );

        navigate("/login");

        return;
      }

      console.log(
        "AUTH USER ID:",
        user.id
      );

      // -----------------------------------------------------
      // ORDER NUMBER
      // -----------------------------------------------------

      const orderNumber =
        generateOrderNumber();

      console.log(
        "ORDER NUMBER:",
        orderNumber
      );

      // -----------------------------------------------------
      // STATUS
      // -----------------------------------------------------

      const initialStatus =
        "pending";

      const initialPaymentStatus =
        "unpaid";

      // -----------------------------------------------------
      // DATA ORDER
      // -----------------------------------------------------

      const orderPayload = {
        user_id: user.id,

        order_number:
          orderNumber,

        customer_name:
          form.name.trim(),

        customer_phone:
          form.phone.trim(),

        customer_address:
          form.address.trim(),

        notes:
          form.notes.trim() ||
          null,

        subtotal,

        shipping_cost:
          shippingCost,

        total,

        status:
          initialStatus,

        payment_status:
          initialPaymentStatus,

        payment_method:
          paymentMethod,
      };

      console.log(
        "ORDER PAYLOAD:",
        orderPayload
      );

      // -----------------------------------------------------
      // INSERT ORDER
      // -----------------------------------------------------

      console.log(
        "=== INSERTING ORDER ==="
      );

      const {
        data: createdOrder,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        console.error(
          "CREATE ORDER ERROR:",
          orderError
        );

        throw orderError;
      }

      console.log(
        "=== ORDER CREATED ==="
      );

      console.log(
        "ORDER ID:",
        createdOrder.id
      );

      // -----------------------------------------------------
      // BUILD ORDER ITEMS
      // -----------------------------------------------------

      console.log(
        "=== BUILDING ORDER ITEMS ==="
      );

      const orderItems =
        cartItems.map(
          (item, index) => {
            const product =
              item.product || item;

            const price = Number(
              item.price ??
                product.price ??
                0
            );

            const quantity =
              Number(
                item.quantity ??
                  item.qty ??
                  1
              );

            const selectedSize =
              item.selected_size ??
              item.size ??
              null;

            const selectedColor =
              item.selected_color ??
              item.color ??
              null;

            const productId =
              product.id ?? null;

            const orderItem = {
              order_id:
                createdOrder.id,

              product_id:
                productId,

              product_name:
                product.name ||
                "Produk",

              price,

              quantity,

              selected_size:
                selectedSize,

              selected_color:
                selectedColor,
            };

            console.log(
              `ORDER ITEM ${
                index + 1
              }:`,
              orderItem
            );

            return orderItem;
          }
        );

      console.log(
        "ALL ORDER ITEMS:",
        orderItems
      );

      // -----------------------------------------------------
      // PASTIKAN SEMUA PRODUK VALID
      // -----------------------------------------------------

      const invalidProduct =
        orderItems.find(
          (item) =>
            !item.product_id
        );

      if (invalidProduct) {
        throw new Error(
          `Produk "${invalidProduct.product_name}" tidak memiliki ID yang valid.`
        );
      }

      // -----------------------------------------------------
      // INSERT ORDER ITEMS
      // -----------------------------------------------------

      console.log(
        "=== INSERTING ORDER ITEMS ==="
      );

      const {
        data: insertedItems,
        error: itemsError,
      } = await supabase
        .from("order_items")
        .insert(orderItems)
        .select();

      if (itemsError) {
        console.error(
          "CREATE ORDER ITEMS ERROR:",
          itemsError
        );

        throw itemsError;
      }

      console.log(
        "=== ORDER ITEMS CREATED ==="
      );

      console.log(
        "INSERTED ITEMS:",
        insertedItems
      );

      // -----------------------------------------------------
      // KURANGI STOK
      // -----------------------------------------------------

      await decreaseProductStock(
        orderItems
      );

      // -----------------------------------------------------
      // TRACKING AWAL
      // -----------------------------------------------------

      console.log(
        "=== CREATING INITIAL TRACKING ==="
      );

      const {
        error: trackingError,
      } = await supabase
        .from("order_tracking")
        .insert({
          order_id:
            createdOrder.id,

          status:
            initialStatus,

          message:
            paymentMethod ===
            "cod"
              ? "Pesanan berhasil dibuat dan menunggu konfirmasi."
              : "Pesanan berhasil dibuat dan menunggu pembayaran.",
        });

      if (trackingError) {
        console.warn(
          "TRACKING INSERT WARNING:",
          trackingError
        );

        console.warn(
          "Tracking gagal dibuat, tetapi order tetap berhasil."
        );
      } else {
        console.log(
          "=== INITIAL TRACKING CREATED ==="
        );
      }

      // -----------------------------------------------------
      // CLEAR CART
      // -----------------------------------------------------

      console.log(
        "=== CLEARING CART ==="
      );

      try {
        if (
          typeof clearCart ===
          "function"
        ) {
          clearCart();
        }

        console.log(
          "=== CART CLEARED ==="
        );
      } catch (cartError) {
        console.warn(
          "CLEAR CART WARNING:",
          cartError
        );
      }

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

      console.log(
        "========================================"
      );

      console.log(
        "=== CHECKOUT SUCCESS ==="
      );

      console.log(
        "ORDER:",
        createdOrder
      );

      console.log(
        "========================================"
      );

      setOrderSuccess({
        id: createdOrder.id,

        orderNumber:
          createdOrder.order_number,

        paymentMethod,

        total,
      });
    } catch (err) {
      console.error(
        "========================================"
      );

      console.error(
        "=== CHECKOUT ERROR ==="
      );

      console.error(
        err
      );

      console.error(
        "MESSAGE:",
        err?.message
      );

      console.error(
        "CODE:",
        err?.code
      );

      console.error(
        "DETAILS:",
        err?.details
      );

      console.error(
        "HINT:",
        err?.hint
      );

      console.error(
        "========================================"
      );

      let message =
        err?.message ||
        "Terjadi kesalahan saat membuat pesanan.";

      // -----------------------------------------------------
      // ERROR STOK
      // -----------------------------------------------------

      if (
        message
          .toLowerCase()
          .includes("stok")
      ) {
        message =
          err?.message ||
          "Stok produk tidak mencukupi.";
      }

      // -----------------------------------------------------
      // ERROR RLS
      // -----------------------------------------------------

      if (
        err?.code === "42501"
      ) {
        message =
          "Checkout ditolak oleh Row Level Security (RLS) Supabase. Periksa policy INSERT pada tabel orders, order_items, dan order_tracking serta permission function stok.";
      }

      // -----------------------------------------------------
      // ERROR KOLOM
      // -----------------------------------------------------

      if (
        err?.code === "PGRST204"
      ) {
        message =
          "Ada kolom database yang belum tersedia. Periksa payment_method, selected_size, selected_color, atau kolom lainnya.";
      }

      // -----------------------------------------------------
      // ERROR GENERATED COLUMN
      // -----------------------------------------------------

      if (
        err?.code === "428C9"
      ) {
        message =
          'Database menolak pengisian kolom generated. Pastikan kolom "subtotal" pada order_items tidak dikirim dari Checkout.';
      }

      // -----------------------------------------------------
      // ERROR FOREIGN KEY
      // -----------------------------------------------------

      if (
        err?.code === "23503"
      ) {
        message =
          "Data produk atau order tidak sesuai dengan relasi database.";
      }

      // -----------------------------------------------------
      // ERROR CHECK CONSTRAINT
      // -----------------------------------------------------

      if (
        err?.code === "23514"
      ) {
        message =
          "Status atau payment status tidak sesuai dengan aturan database.";
      }

      // -----------------------------------------------------
      // ERROR DUPLICATE
      // -----------------------------------------------------

      if (
        err?.code === "23505"
      ) {
        message =
          "Nomor pesanan sudah digunakan. Silakan coba checkout kembali.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // SUCCESS PAGE
  // =========================================================

  if (orderSuccess) {
    return (
      <main className="checkout-page">
        <div className="checkout-success">

          <div className="success-icon">
            <CheckCircle2 size={48} />
          </div>

          <p className="eyebrow">
            ORDER BERHASIL
          </p>

          <h1>
            Pesanan berhasil dibuat.
          </h1>

          <p className="success-description">
            Terima kasih sudah berbelanja
            di WS Fashion.
          </p>

          <div className="success-order-card">

            <div>
              <span>
                Nomor Pesanan
              </span>

              <strong>
                {orderSuccess.orderNumber}
              </strong>
            </div>

            <div>
              <span>
                Total
              </span>

              <strong>
                {formatRupiah(
                  orderSuccess.total
                )}
              </strong>
            </div>

            <div>
              <span>
                Pembayaran
              </span>

              <strong>
                {orderSuccess.paymentMethod ===
                  "bank_transfer" &&
                  "Transfer Bank"}

                {orderSuccess.paymentMethod ===
                  "qris" &&
                  "QRIS"}

                {orderSuccess.paymentMethod ===
                  "cod" &&
                  "COD"}
              </strong>
            </div>

          </div>

          {orderSuccess.paymentMethod !==
            "cod" && (
            <div className="payment-instruction">

              <h3>
                Langkah selanjutnya
              </h3>

              <p>
                Silakan lakukan pembayaran
                sesuai metode yang dipilih.
                Setelah itu, upload bukti
                pembayaran pada halaman
                detail pesanan.
              </p>

            </div>
          )}

          <div className="success-actions">

            <button
              type="button"
              className="btn-primary"
              onClick={() =>
                navigate(
                  `/orders/${orderSuccess.id}`
                )
              }
            >
              <Package size={18} />

              Lihat Pesanan
            </button>

            <Link
              to="/products"
              className="btn-secondary"
            >
              Lanjut Belanja
            </Link>

          </div>

        </div>
      </main>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (!cartItems.length) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <ShoppingBag size={52} />

          <h1>
            Keranjang kosong
          </h1>

          <p>
            Tambahkan produk terlebih
            dahulu sebelum melakukan
            checkout.
          </p>

          <Link
            to="/products"
            className="btn-primary"
          >
            Belanja Sekarang
          </Link>

        </div>

      </main>
    );
  }

  // =========================================================
  // CHECKOUT PAGE
  // =========================================================

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* HEADER */}

        <div className="checkout-header">

          <Link
            to="/cart"
            className="back-link"
          >
            <ArrowLeft size={18} />

            Kembali ke Keranjang
          </Link>

          <div>

            <p className="eyebrow">
              WS FASHION
            </p>

            <h1>
              Checkout
            </h1>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="checkout-error">

            <strong>
              Checkout gagal
            </strong>

            <span>
              {error}
            </span>

          </div>
        )}

        <form
          className="checkout-layout"
          onSubmit={handleCheckout}
        >

          {/* =================================================
              LEFT
          ================================================= */}

          <div className="checkout-main">

            {/* ALAMAT */}

            <section className="checkout-section">

              <div className="section-heading">

                <div className="section-icon">
                  <MapPin size={20} />
                </div>

                <div>

                  <h2>
                    Alamat Pengiriman
                  </h2>

                  <p>
                    Masukkan data penerima
                    pesanan.
                  </p>

                </div>

              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label htmlFor="name">
                    Nama Penerima
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama lengkap"
                    autoComplete="name"
                    disabled={loading}
                  />

                </div>

                <div className="form-group">

                  <label htmlFor="phone">
                    Nomor WhatsApp
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    autoComplete="tel"
                    disabled={loading}
                  />

                </div>

              </div>

              <div className="form-group">

                <label htmlFor="address">
                  Alamat Lengkap
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Jalan, nomor rumah, desa/kelurahan, kecamatan, kota/kabupaten, provinsi, kode pos"
                  rows={5}
                  autoComplete="street-address"
                  disabled={loading}
                />

              </div>

              <div className="form-group">

                <label htmlFor="notes">
                  Catatan Pesanan
                  <span>
                    {" "}
                    (opsional)
                  </span>
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Contoh: Tolong kirim sore hari."
                  rows={3}
                  disabled={loading}
                />

              </div>

            </section>

            {/* PEMBAYARAN */}

            <section className="checkout-section">

              <div className="section-heading">

                <div className="section-icon">
                  <CreditCard size={20} />
                </div>

                <div>

                  <h2>
                    Metode Pembayaran
                  </h2>

                  <p>
                    Pilih metode pembayaran
                    yang kamu inginkan.
                  </p>

                </div>

              </div>

              <div className="payment-options">

                {paymentOptions.map(
                  (option) => {

                    const Icon =
                      option.icon;

                    const selected =
                      paymentMethod ===
                      option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        className={`payment-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() => {
                          setPaymentMethod(
                            option.id
                          );

                          setError("");
                        }}
                        disabled={loading}
                      >

                        <div className="payment-option-icon">
                          <Icon size={22} />
                        </div>

                        <div className="payment-option-content">

                          <strong>
                            {option.title}
                          </strong>

                          <span>
                            {option.description}
                          </span>

                        </div>

                        <div className="payment-radio">

                          {selected && (
                            <CheckCircle2
                              size={20}
                            />
                          )}

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

              {/* TRANSFER BANK */}

              {paymentMethod ===
                "bank_transfer" && (
                <div className="payment-info">

                  <strong>
                    Transfer Bank
                  </strong>

                  <p>
                    Setelah pesanan dibuat,
                    lakukan transfer ke
                    rekening WS Fashion.
                  </p>

                  <div className="bank-info">

                    <span>
                      Bank BCA
                    </span>

                    <strong>
                      1234567890
                    </strong>

                    <small>
                      a.n. WS Fashion
                    </small>

                  </div>

                  <p className="small-text">
                    Nomor rekening di atas
                    adalah contoh. Ganti
                    dengan rekening toko
                    kamu.
                  </p>

                </div>
              )}

              {/* QRIS */}

              {paymentMethod ===
                "qris" && (
                <div className="payment-info">

                  <strong>
                    Pembayaran QRIS
                  </strong>

                  <p>
                    Setelah pesanan dibuat,
                    buka detail pesanan
                    kemudian upload bukti
                    pembayaran QRIS.
                  </p>

                  <div className="qris-placeholder">
                    QRIS WS FASHION
                  </div>

                  <p className="small-text">
                    Ganti area ini dengan
                    gambar QRIS toko kamu.
                  </p>

                </div>
              )}

              {/* COD */}

              {paymentMethod ===
                "cod" && (
                <div className="payment-info">

                  <strong>
                    Cash on Delivery
                  </strong>

                  <p>
                    Pembayaran dilakukan
                    ketika pesanan sampai
                    di alamat kamu.
                  </p>

                </div>
              )}

            </section>

            {/* PENGIRIMAN */}

            <section className="checkout-section">

              <div className="section-heading">

                <div className="section-icon">
                  <Truck size={20} />
                </div>

                <div>

                  <h2>
                    Pengiriman
                  </h2>

                  <p>
                    Informasi pengiriman
                    pesanan.
                  </p>

                </div>

              </div>

              <div className="shipping-method">

                <div className="shipping-icon">
                  <Truck size={24} />
                </div>

                <div>

                  <strong>
                    Pengiriman Standar
                  </strong>

                  <span>
                    Ongkir sementara
                    gratis.
                  </span>

                </div>

                <strong>
                  Gratis
                </strong>

              </div>

            </section>

          </div>

          {/* =================================================
              SUMMARY
          ================================================= */}

          <aside className="checkout-sidebar">

            <section className="order-summary">

              <div className="summary-header">

                <h2>
                  Ringkasan Pesanan
                </h2>

                <span>
                  {cartItems.length} item
                </span>

              </div>

              <div className="summary-products">

                {cartItems.map(
                  (item, index) => {

                    const product =
                      item.product ||
                      item;

                    const price =
                      Number(
                        item.price ??
                          product.price ??
                          0
                      );

                    const quantity =
                      Number(
                        item.quantity ??
                          item.qty ??
                          1
                      );

                    const image =
                      product.image_url;

                    return (
                      <div
                        className="summary-product"
                        key={
                          item.key ??
                          item.id ??
                          product.id ??
                          index
                        }
                      >

                        <div className="summary-product-image">

                          {image ? (
                            <img
                              src={image}
                              alt={
                                product.name ||
                                "Produk"
                              }
                            />
                          ) : (
                            <span>
                              WS
                            </span>
                          )}

                        </div>

                        <div className="summary-product-info">

                          <strong>
                            {product.name ||
                              "Produk"}
                          </strong>

                          {(item.selected_size ||
                            item.size) && (
                            <span>
                              Size:{" "}
                              {item.selected_size ??
                                item.size}
                            </span>
                          )}

                          {(item.selected_color ||
                            item.color) && (
                            <span>
                              Warna:{" "}
                              {item.selected_color ??
                                item.color}
                            </span>
                          )}

                          <span>
                            {quantity} ×{" "}
                            {formatRupiah(
                              price
                            )}
                          </span>

                        </div>

                        <strong>
                          {formatRupiah(
                            price *
                              quantity
                          )}
                        </strong>

                      </div>
                    );
                  }
                )}

              </div>

              <div className="summary-divider" />

              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  {formatRupiah(
                    subtotal
                  )}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Ongkir
                </span>

                <strong>
                  Gratis
                </strong>

              </div>

              <div className="summary-divider" />

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  {formatRupiah(
                    total
                  )}
                </strong>

              </div>

              <button
                type="submit"
                className="checkout-submit"
                disabled={loading}
              >

                {loading ? (
                  "Memproses Pesanan..."
                ) : (
                  <>
                    <ShoppingBag
                      size={19}
                    />

                    Buat Pesanan
                  </>
                )}

              </button>

              <p className="checkout-security">
                Pesanan akan tersimpan di
                akun kamu dan dapat dilacak
                melalui halaman Pesanan Saya.
              </p>

            </section>

          </aside>

        </form>

      </div>

    </main>
  );
}