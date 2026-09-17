import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  CalendarDays,
  Loader2,
  Package,
  RefreshCw,
} from "lucide-react";

import {
  Link,
} from "react-router-dom";

import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

import "./Orders.css";

export default function Orders() {
  const { user } = useAuth();

  const [orders, setOrders] = useState([]);
  const [period, setPeriod] =
    useState("monthly");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =========================================================
  // LOAD ORDERS USER
  // =========================================================

  const loadOrders = async () => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const {
        data,
        error: supabaseError,
      } = await supabase
        .from("orders")
        .select("*")
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (supabaseError) {
        console.error(
          "LOAD ORDERS ERROR:",
          supabaseError
        );

        setError(
          supabaseError.message ||
            "Gagal mengambil data pesanan."
        );

        return;
      }

      setOrders(
        data || []
      );
    } catch (error) {
      console.error(
        "ORDERS ERROR:",
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
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadOrders();
  }, [user?.id]);

  // =========================================================
  // REALTIME ORDER
  // =========================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const channel =
      supabase
        .channel(
          `user-orders-${user.id}`
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadOrders();
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [user?.id]);

  // =========================================================
  // FILTER PERIODE
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

          // 7 HARI TERAKHIR
          if (
            period ===
            "weekly"
          ) {
            const start =
              new Date(
                now
              );

            start.setDate(
              now.getDate() -
                6
            );

            start.setHours(
              0,
              0,
              0,
              0
            );

            return (
              orderDate >=
              start
            );
          }

          // BULAN BERJALAN
          if (
            period ===
            "monthly"
          ) {
            return (
              orderDate.getMonth() ===
                now.getMonth() &&
              orderDate.getFullYear() ===
                now.getFullYear()
            );
          }

          // TAHUN BERJALAN
          if (
            period ===
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
      period,
    ]);

  // =========================================================
  // TOTAL
  // =========================================================

  const totalAmount =
    useMemo(() => {
      return filteredOrders.reduce(
        (
          total,
          order
        ) =>
          total +
          Number(
            order.total || 0
          ),
        0
      );
    }, [
      filteredOrders,
    ]);

  // =========================================================
  // FORMAT PRICE
  // =========================================================

  const formatPrice =
    (value) => {
      return new Intl.NumberFormat(
        "id-ID",
        {
          style:
            "currency",
          currency:
            "IDR",
          maximumFractionDigits: 0,
        }
      ).format(
        Number(
          value || 0
        )
      );
    };

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate =
    (value) => {
      if (!value) {
        return "-";
      }

      return new Date(
        value
      ).toLocaleDateString(
        "id-ID",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );
    };

  // =========================================================
  // STATUS
  // =========================================================

  const statusLabel = {
    pending:
      "Menunggu Konfirmasi",

    confirmed:
      "Dikonfirmasi",

    processing:
      "Diproses",

    shipped:
      "Dikirim",

    completed:
      "Selesai",

    cancelled:
      "Dibatalkan",
  };

  // =========================================================
  // PAYMENT
  // =========================================================

  const paymentLabel = {
    unpaid:
      "Belum Dibayar",

    paid:
      "Sudah Dibayar",

    failed:
      "Gagal",

    refunded:
      "Refund",
  };

  // =========================================================
  // PERIOD
  // =========================================================

  const periodLabel = {
    weekly:
      "Mingguan",

    monthly:
      "Bulanan",

    yearly:
      "Tahunan",
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <main className="orders-page">

        <div className="orders-loading">

          <Loader2
            size={32}
            className="orders-spin"
          />

          <p>
            Memuat pesanan...
          </p>

        </div>

      </main>
    );
  }

  // =========================================================
  // VIEW
  // =========================================================

  return (
    <main className="orders-page">

      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">

          <div>

            <p className="orders-eyebrow">
              WS FASHION
            </p>

            <h1>
              Pesanan Saya
            </h1>

            <p>
              Lihat riwayat dan status
              pesanan Anda.
            </p>

          </div>

          <button
            className="orders-refresh"
            onClick={
              loadOrders
            }
            title="Refresh"
            type="button"
          >
            <RefreshCw
              size={18}
            />
          </button>

        </div>

        {/* ERROR */}

        {error && (
          <div className="orders-error">
            {error}
          </div>
        )}

        {/* FILTER */}

        <section className="orders-toolbar">

          <div className="period-filter">

            <div className="period-title">

              <CalendarDays
                size={18}
              />

              <span>
                Periode
              </span>

            </div>

            <div className="period-buttons">

              <button
                type="button"
                className={
                  period ===
                  "weekly"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPeriod(
                    "weekly"
                  )
                }
              >
                Mingguan
              </button>

              <button
                type="button"
                className={
                  period ===
                  "monthly"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPeriod(
                    "monthly"
                  )
                }
              >
                Bulanan
              </button>

              <button
                type="button"
                className={
                  period ===
                  "yearly"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPeriod(
                    "yearly"
                  )
                }
              >
                Tahunan
              </button>

            </div>

          </div>

        </section>

        {/* SUMMARY */}

        <section className="orders-summary">

          <div>

            <span>
              Periode
            </span>

            <strong>
              {
                periodLabel[
                  period
                ]
              }
            </strong>

          </div>

          <div>

            <span>
              Jumlah Pesanan
            </span>

            <strong>
              {
                filteredOrders.length
              }
            </strong>

          </div>

          <div>

            <span>
              Total Transaksi
            </span>

            <strong>
              {formatPrice(
                totalAmount
              )}
            </strong>

          </div>

        </section>

        {/* EMPTY */}

        {filteredOrders.length ===
        0 ? (
          <div className="orders-empty">

            <Package
              size={50}
            />

            <h2>
              Belum ada pesanan
            </h2>

            <p>
              Tidak ada pesanan
              pada periode{" "}
              {
                periodLabel[
                  period
                ]
              }. 
            </p>

            <Link
              to="/products"
              className="orders-shop-button"
            >
              Belanja Sekarang

              <ArrowRight
                size={17}
              />
            </Link>

          </div>
        ) : (
          <div className="orders-list">

            {filteredOrders.map(
              (order) => (
                <article
                  className="order-card"
                  key={
                    order.id
                  }
                >

                  {/* TOP */}

                  <div className="order-card-top">

                    <div>

                      <span className="order-number">
                        {
                          order.order_number ||
                          "Pesanan"
                        }
                      </span>

                      <small>
                        {formatDate(
                          order.created_at
                        )}
                      </small>

                    </div>

                    <span
                      className={`order-status status-${order.status}`}
                    >
                      {
                        statusLabel[
                          order.status
                        ] ||
                        order.status ||
                        "-"
                      }
                    </span>

                  </div>

                  {/* BOTTOM */}

                  <div className="order-card-bottom">

                    <div>

                      <span>
                        Pembayaran
                      </span>

                      <strong>
                        {
                          paymentLabel[
                            order.payment_status
                          ] ||
                          order.payment_status ||
                          "-"
                        }
                      </strong>

                    </div>

                    <div>

                      <span>
                        Total
                      </span>

                      <strong>
                        {formatPrice(
                          order.total
                        )}
                      </strong>

                    </div>

                    <Link
                      to={`/orders/${order.id}`}
                      className="order-detail-button"
                    >
                      Detail

                      <ArrowRight
                        size={16}
                      />
                    </Link>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </div>

    </main>
  );
}