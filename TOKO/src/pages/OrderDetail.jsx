import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Package,
  Upload,
  Truck,
  Loader2,
} from "lucide-react";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import "./OrderDetail.css";


export default function OrderDetail() {
  const { id } = useParams();

  const { user } = useAuth();

  const [order, setOrder] =
    useState(null);

  const [items, setItems] =
    useState([]);

  const [tracking, setTracking] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    if (!user?.id || !id) {
      return;
    }

    loadOrder();
    loadTracking();

    const channel =
      supabase
        .channel(`order-${id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `id=eq.${id}`,
          },
          () => {
            loadOrder();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "order_tracking",
            filter: `order_id=eq.${id}`,
          },
          () => {
            loadTracking();
          }
        )
        .subscribe((status, realtimeError) => {
          console.log(
            "ORDER REALTIME:",
            status
          );

          if (
            status === "CHANNEL_ERROR" ||
            status === "TIMED_OUT"
          ) {
            console.error(
              "ORDER REALTIME ERROR:",
              realtimeError
            );
          }
        });


    return () => {
      supabase.removeChannel(
        channel
      );
    };

  }, [user?.id, id]);


  // =========================================================
  // LOAD ORDER
  // =========================================================

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "LOAD ORDER ERROR:",
          error
        );

        setError(
          error.message ||
            "Gagal mengambil pesanan."
        );

        return;
      }

      if (!data) {
        setError(
          "Pesanan tidak ditemukan."
        );

        return;
      }

      setOrder(data);


      // -------------------------------------------------------
      // ORDER ITEMS
      // -------------------------------------------------------

      const {
        data: itemData,
        error: itemError,
      } = await supabase
        .from("order_items")
        .select("*")
        .eq("order_id", id)
        .order("id", {
          ascending: true,
        });

      if (itemError) {
        console.error(
          "LOAD ORDER ITEMS ERROR:",
          itemError
        );

        setError(
          itemError.message ||
            "Gagal mengambil item pesanan."
        );

        return;
      }

      setItems(itemData || []);

    } catch (error) {
      console.error(
        "ORDER DETAIL ERROR:",
        error
      );

      setError(
        error?.message ||
          "Terjadi kesalahan."
      );

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // LOAD TRACKING
  // =========================================================

  const loadTracking = async () => {
    try {
      const {
        data,
        error,
      } = await supabase
        .from("order_tracking")
        .select("*")
        .eq("order_id", id)
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error(
          "LOAD TRACKING ERROR:",
          error
        );

        return;
      }

      setTracking(data || []);

    } catch (error) {
      console.error(
        "TRACKING ERROR:",
        error
      );
    }
  };


  // =========================================================
  // UPLOAD PAYMENT PROOF
  // =========================================================

  const handleUploadProof = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");


    // -------------------------------------------------------
    // VALIDASI
    // -------------------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Bukti pembayaran harus berupa JPG, PNG, atau WebP."
      );

      return;
    }


    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Ukuran bukti pembayaran maksimal 5 MB."
      );

      return;
    }


    try {
      setUploading(true);


      // -----------------------------------------------------
      // FILE NAME
      // -----------------------------------------------------

      const extension =
        file.name
          .split(".")
          .pop()
          ?.toLowerCase() ||
        "jpg";

      const filePath =
        `${user.id}/${id}.${extension}`;


      // -----------------------------------------------------
      // UPLOAD
      // -----------------------------------------------------

      const {
        error: uploadError,
      } = await supabase
        .storage
        .from("payment-proofs")
        .upload(
          filePath,
          file,
          {
            cacheControl: "3600",
            upsert: true,
            contentType: file.type,
          }
        );


      if (uploadError) {
        console.error(
          "PAYMENT PROOF UPLOAD ERROR:",
          uploadError
        );

        setError(
          uploadError.message ||
            "Gagal mengupload bukti pembayaran."
        );

        return;
      }


      // -----------------------------------------------------
      // SIMPAN PATH KE ORDER
      // -----------------------------------------------------

      const {
        error: updateError,
      } = await supabase
        .from("orders")
        .update({
          payment_proof_url:
            filePath,
        })
        .eq("id", id)
        .eq("user_id", user.id);


      if (updateError) {
        console.error(
          "SAVE PAYMENT PROOF ERROR:",
          updateError
        );

        setError(
          updateError.message ||
            "File berhasil diupload, tetapi gagal menyimpan data pesanan."
        );

        return;
      }


      setSuccess(
        "Bukti pembayaran berhasil diupload."
      );

      await loadOrder();

    } catch (error) {
      console.error(
        "PAYMENT PROOF ERROR:",
        error
      );

      setError(
        error?.message ||
          "Terjadi kesalahan saat upload."
      );

    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };


  // =========================================================
  // FORMAT
  // =========================================================

  const formatPrice = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(
      Number(value || 0)
    );
  };


  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(
      value
    ).toLocaleString(
      "id-ID",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };


  const statusLabel = {
    pending: "Menunggu Konfirmasi",
    confirmed: "Pesanan Dikonfirmasi",
    processing: "Sedang Diproses",
    shipped: "Pesanan Dikirim",
    completed: "Pesanan Selesai",
    cancelled: "Pesanan Dibatalkan",
  };


  const paymentLabel = {
    unpaid: "Belum Dibayar",
    paid: "Sudah Dibayar",
    failed: "Pembayaran Gagal",
    refunded: "Dana Dikembalikan",
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="order-page">

        <div className="order-loading">

          <Loader2
            size={32}
            className="order-spin"
          />

          <p>
            Memuat detail pesanan...
          </p>

        </div>

      </main>
    );
  }


  // =========================================================
  // ERROR / NOT FOUND
  // =========================================================

  if (!order) {
    return (
      <main className="order-page">

        <div className="order-empty">

          <Package size={48} />

          <h1>
            Pesanan tidak ditemukan
          </h1>

          <p>
            {error ||
              "Pesanan tersebut tidak tersedia."}
          </p>

          <Link
            to="/orders"
            className="order-primary-button"
          >
            Kembali ke Pesanan
          </Link>

        </div>

      </main>
    );
  }


  return (
    <main className="order-page">

      <div className="order-container">


        {/* =================================================
            BACK
        ================================================= */}

        <Link
          to="/orders"
          className="order-back"
        >
          <ArrowLeft size={18} />
          Pesanan Saya
        </Link>


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="order-header">

          <div>

            <p className="eyebrow">
              WS FASHION
            </p>

            <h1>
              Detail Pesanan
            </h1>

            <p>
              {order.order_number}
            </p>

          </div>


          <div className="order-status">

            <span>
              Status Pesanan
            </span>

            <strong>
              {statusLabel[
                order.status
              ] || order.status}
            </strong>

          </div>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {error && (
          <div className="order-message error">
            {error}
          </div>
        )}

        {success && (
          <div className="order-message success">
            {success}
          </div>
        )}


        <div className="order-grid">


          {/* =================================================
              LEFT
          ================================================= */}

          <div>


            {/* ===============================================
                ITEMS
            =============================================== */}

            <section className="order-card">

              <div className="order-card-title">

                <Package size={20} />

                <h2>
                  Produk
                </h2>

              </div>


              <div className="order-items">

                {items.map(
                  (item) => (
                    <div
                      className="order-item"
                      key={item.id}
                    >

                      <div className="order-item-info">

                        <strong>
                          {item.product_name}
                        </strong>

                        <div className="order-item-meta">

                          <span>
                            {formatPrice(
                              item.price
                            )}
                          </span>

                          <span>
                            × {item.quantity}
                          </span>

                          {item.selected_size && (
                            <span>
                              Size:{" "}
                              {item.selected_size}
                            </span>
                          )}

                          {item.selected_color && (
                            <span>
                              Warna:{" "}
                              {item.selected_color}
                            </span>
                          )}

                        </div>

                      </div>


                      <strong>
                        {formatPrice(
                          item.subtotal ??
                          Number(item.price || 0) *
                            Number(item.quantity || 0)
                        )}
                      </strong>

                    </div>
                  )
                )}

              </div>

            </section>


            {/* ===============================================
                TRACKING
            =============================================== */}

            <section className="order-card">

              <div className="order-card-title">

                <Truck size={20} />

                <h2>
                  Tracking Pesanan
                </h2>

              </div>


              {tracking.length === 0 ? (
                <div className="tracking-empty">

                  <Clock3 size={24} />

                  <p>
                    Tracking belum tersedia.
                  </p>

                </div>
              ) : (
                <div className="tracking-list">

                  {tracking.map(
                    (track, index) => (

                      <div
                        className="tracking-item"
                        key={track.id}
                      >

                        <div className="tracking-icon">

                          {index ===
                          tracking.length - 1 ? (
                            <CheckCircle2
                              size={20}
                            />
                          ) : (
                            <Clock3
                              size={20}
                            />
                          )}

                        </div>


                        <div className="tracking-content">

                          <strong>
                            {statusLabel[
                              track.status
                            ] ||
                              track.status}
                          </strong>

                          {track.message && (
                            <p>
                              {track.message}
                            </p>
                          )}

                          {track.location_name && (
                            <div className="tracking-location">

                              <MapPin size={14} />

                              {track.location_name}

                            </div>
                          )}

                          <small>
                            {formatDate(
                              track.created_at
                            )}
                          </small>

                        </div>

                      </div>

                    )
                  )}

                </div>
              )}

            </section>


            {/* ===============================================
                ADDRESS
            =============================================== */}

            <section className="order-card">

              <div className="order-card-title">

                <MapPin size={20} />

                <h2>
                  Alamat Pengiriman
                </h2>

              </div>

              <div className="order-address">

                <strong>
                  {order.customer_name}
                </strong>

                <span>
                  {order.customer_phone}
                </span>

                <p>
                  {order.customer_address}
                </p>

                {order.notes && (
                  <p>
                    Catatan: {order.notes}
                  </p>
                )}

              </div>

            </section>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <aside>


            {/* ===============================================
                PAYMENT
            =============================================== */}

            <section className="order-card">

              <div className="order-card-title">

                <CreditCard size={20} />

                <h2>
                  Pembayaran
                </h2>

              </div>


              <div className="payment-info">

                <div>
                  <span>
                    Metode
                  </span>

                  <strong>
                    {order.payment_method ||
                      "Belum dipilih"}
                  </strong>
                </div>


                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {paymentLabel[
                      order.payment_status
                    ] ||
                      order.payment_status}
                  </strong>
                </div>

              </div>


              {/* =============================================
                  UPLOAD
              ============================================= */}

              {order.payment_method !==
                "COD" &&
                order.payment_status !==
                  "paid" && (

                <div className="payment-upload">

                  <p>
                    Upload bukti transfer /
                    pembayaran.
                  </p>

                  <label
                    className="upload-button"
                  >

                    {uploading ? (
                      <>
                        <Loader2
                          size={18}
                          className="order-spin"
                        />

                        Mengupload...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />

                        Upload Bukti Pembayaran
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleUploadProof
                      }
                      disabled={uploading}
                      hidden
                    />

                  </label>

                  <small>
                    JPG, PNG, atau WebP.
                    Maksimal 5 MB.
                  </small>

                </div>

              )}


              {order.payment_proof_url && (
                <div className="payment-proof-status">

                  <CheckCircle2 size={18} />

                  <span>
                    Bukti pembayaran sudah
                    diupload.
                  </span>

                </div>
              )}

            </section>


            {/* ===============================================
                TOTAL
            =============================================== */}

            <section className="order-card">

              <div className="order-card-title">

                <h2>
                  Ringkasan Pembayaran
                </h2>

              </div>


              <div className="summary-row">

                <span>
                  Subtotal
                </span>

                <strong>
                  {formatPrice(
                    order.subtotal
                  )}
                </strong>

              </div>


              <div className="summary-row">

                <span>
                  Ongkir
                </span>

                <strong>
                  {formatPrice(
                    order.shipping_cost
                  )}
                </strong>

              </div>


              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  {formatPrice(
                    order.total
                  )}
                </strong>

              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>
  );
}