import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  Package,
  ArrowRight,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import { supabase } from "../lib/supabase";

import { useAuth } from "../context/AuthContext";


export default function Orders() {
  const {
    user,
  } = useAuth();

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [user?.id]);


  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const {
        data,
        error,
      } = await supabase
        .from("orders")
        .select(`
          id,
          order_number,
          customer_name,
          subtotal,
          shipping_cost,
          total,
          status,
          payment_status,
          payment_method,
          created_at
        `)
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "LOAD ORDERS ERROR:",
          error
        );

        setError(
          error.message ||
            "Gagal mengambil pesanan."
        );

        return;
      }

      setOrders(data || []);

    } catch (error) {
      console.error(
        "ORDERS ERROR:",
        error
      );

      setError(
        error?.message ||
          "Terjadi kesalahan saat mengambil pesanan."
      );

    } finally {
      setLoading(false);
    }
  };


  const formatPrice = (value) => {
    return new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(Number(value || 0));
  };


  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  };


  const getStatusLabel = (status) => {
    const labels = {
      pending: "Menunggu Konfirmasi",
      confirmed: "Dikonfirmasi",
      processing: "Diproses",
      shipped: "Dikirim",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    };

    return (
      labels[status] ||
      status ||
      "Menunggu"
    );
  };


  if (loading) {
    return (
      <main className="page-section">
        <div className="container">
          <div
            style={{
              minHeight: "400px",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Loader2
              size={32}
              className="spin"
            />
          </div>
        </div>
      </main>
    );
  }


  return (
    <main className="page-section">

      <div className="container">


        {/* HEADER */}

        <div
          style={{
            marginBottom: "32px",
          }}
        >
          <p className="eyebrow">
            WS FASHION
          </p>

          <h1>
            Pesanan Saya
          </h1>

          <p>
            Lihat riwayat dan status
            pesanan kamu.
          </p>
        </div>


        {/* ERROR */}

        {error && (
          <div className="auth-message auth-error">
            {error}
          </div>
        )}


        {/* EMPTY */}

        {!error &&
          orders.length === 0 && (
            <div
              style={{
                minHeight: "350px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                gap: "16px",
              }}
            >
              <ShoppingBag size={48} />

              <h2>
                Belum ada pesanan
              </h2>

              <p>
                Kamu belum melakukan
                pembelian.
              </p>

              <Link
                to="/products"
                className="auth-submit"
                style={{
                  textDecoration: "none",
                  display: "inline-flex",
                  width: "auto",
                }}
              >
                Mulai Belanja
              </Link>
            </div>
          )}


        {/* ORDERS */}

        {orders.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >

            {orders.map((order) => (

              <div
                key={order.id}
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: "18px",
                  padding: "20px",
                  background: "#fff",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >

                  <div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "6px",
                      }}
                    >
                      <Package size={20} />

                      <strong>
                        {order.order_number}
                      </strong>
                    </div>

                    <small>
                      {formatDate(
                        order.created_at
                      )}
                    </small>

                  </div>


                  <span
                    style={{
                      padding: "7px 12px",
                      borderRadius: "999px",
                      background: "#f3f3f3",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    {getStatusLabel(
                      order.status
                    )}
                  </span>

                </div>


                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                  }}
                >

                  <div>

                    <small>
                      Total Pesanan
                    </small>

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        marginTop: "4px",
                      }}
                    >
                      {formatPrice(
                        order.total
                      )}
                    </div>

                  </div>


                  <Link
                    to={`/orders/${order.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      borderRadius: "999px",
                      background: "#111",
                      color: "#fff",
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Detail Pesanan

                    <ArrowRight
                      size={16}
                    />
                  </Link>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

    </main>
  );
}