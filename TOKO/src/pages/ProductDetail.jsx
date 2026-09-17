import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { supabase } from "../lib/supabase";
import { formatRupiah } from "../utils/format";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProduct() {
      setLoading(true);
      setMessage("");

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq("id", id)
        .single();

      if (!mounted) return;

      if (error) {
        console.error(
          "LOAD PRODUCT ERROR:",
          error
        );

        setProduct(null);
        setMessage(
          "Produk tidak ditemukan."
        );
        setLoading(false);
        return;
      }

      setProduct(data);

      if (
        Array.isArray(data?.sizes) &&
        data.sizes.length > 0
      ) {
        setSize(data.sizes[0]);
      } else {
        setSize("");
      }

      setLoading(false);
    }

    loadProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page-loader">
        Memuat produk...
      </div>
    );
  }

  if (!product) {
    return (
      <main className="page">
        <div className="container">
          <Link
            to="/products"
            className="back-link"
          >
            <ArrowLeft size={17} />
            Kembali ke produk
          </Link>

          <div className="empty-state">
            {message || "Produk tidak ditemukan."}
          </div>
        </div>
      </main>
    );
  }

  const image =
    product.image_url || "";

  const category =
    product.categories?.name ||
    product.category ||
    "Fashion";

  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : [];

  const colors = Array.isArray(product.colors)
    ? product.colors
    : [];

  const stock = Number(product.stock || 0);

  function handleAdd() {
    if (stock <= 0) {
      setMessage("Stok produk habis.");
      return;
    }

    if (sizes.length > 0 && !size) {
      setMessage(
        "Pilih ukuran terlebih dahulu."
      );
      return;
    }

    addToCart(
      product,
      size,
      quantity
    );

    setMessage(
      "Produk ditambahkan ke keranjang."
    );
  }

  return (
    <main className="page">
      <div className="container detail-page">
        <Link
          to="/products"
          className="back-link"
        >
          <ArrowLeft size={17} />
          Kembali ke produk
        </Link>

        <div className="detail-grid">

          {/* IMAGE */}
          <div className="detail-image">
            {image ? (
              <img
                src={image}
                alt={
                  product.name ||
                  "Produk WS Fashion"
                }
                onError={(e) => {
                  e.currentTarget.style.display =
                    "none";

                  e.currentTarget.parentElement
                    ?.querySelector(
                      ".image-placeholder"
                    )
                    ?.classList.remove(
                      "hidden"
                    );
                }}
              />
            ) : null}

            {!image && (
              <div className="image-placeholder big">
                WS
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="detail-info">

            <p className="eyebrow">
              {category}
            </p>

            <h1>
              {product.name}
            </h1>

            <div className="detail-price">
              {formatRupiah(product.price)}
            </div>

            {product.compare_price &&
              Number(product.compare_price) >
                Number(product.price) && (
                <div className="compare-price">
                  {formatRupiah(
                    product.compare_price
                  )}
                </div>
              )}

            <p className="detail-description">
              {product.description ||
                "Produk fashion pilihan dari WS Fashion."}
            </p>

            {/* COLORS */}
            {colors.length > 0 && (
              <div className="option-block">
                <div className="option-title">
                  <span>Warna</span>
                </div>

                <div className="color-list">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="color-option"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* SIZE */}
            {sizes.length > 0 && (
              <div className="option-block">
                <div className="option-title">
                  <span>Size</span>
                  <b>{size}</b>
                </div>

                <div className="size-list">
                  {sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        size === item
                          ? "size active"
                          : "size"
                      }
                      onClick={() =>
                        setSize(item)
                      }
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY */}
            <div className="option-block">
              <div className="option-title">
                <span>Quantity</span>
                <b>{quantity}</b>
              </div>

              <div className="quantity">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>

                <span>
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        stock,
                        q + 1
                      )
                    )
                  }
                  disabled={
                    quantity >= stock
                  }
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* STOCK */}
            <p className="stock-text">
              {stock > 0
                ? `${stock} item tersedia`
                : "Stok habis"}
            </p>

            {/* ADD TO CART */}
            <button
              type="button"
              className="button dark wide"
              disabled={stock <= 0}
              onClick={handleAdd}
            >
              <ShoppingBag size={18} />
              {stock > 0
                ? "Add to Cart"
                : "Sold Out"}
            </button>

            {/* MESSAGE */}
            {message && (
              <p className="success-message">
                {message}

                {message.includes(
                  "ditambahkan"
                ) && (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() =>
                        navigate("/cart")
                      }
                    >
                      Lihat keranjang
                    </button>
                  </>
                )}
              </p>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}