import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function ProductCard({ product }) {
  if (!product) return null;

  const imageUrl = product.image_url;

  const categoryName =
    product.categories?.name ||
    product.category ||
    "Fashion";

  const stock = Number(product.stock ?? 0);

  const isFeatured =
    product.is_featured === true;

  return (
    <article className="product-card">

      <Link
        to={`/products/${product.id}`}
        className="product-image-wrap"
      >

        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="product-image"
            onLoad={() => {
              console.log(
                "PRODUCT IMAGE LOADED:",
                product.name,
                imageUrl
              );
            }}
            onError={(e) => {
              console.error(
                "PRODUCT IMAGE ERROR:",
                product.name,
                imageUrl
              );

              e.currentTarget.style.display =
                "none";
            }}
          />
        ) : (
          <div className="image-placeholder">
            <span>WS</span>
          </div>
        )}

        {isFeatured && (
          <span className="badge">
            Featured
          </span>
        )}

        {stock <= 0 && (
          <span className="badge out">
            Sold Out
          </span>
        )}

        <span className="product-arrow">
          <ArrowUpRight size={18} />
        </span>

      </Link>

      <div className="product-meta">

        <div>
          <p className="eyebrow">
            {categoryName}
          </p>

          <h3>
            {product.name}
          </h3>
        </div>

        <strong>
          {formatRupiah(product.price)}
        </strong>

      </div>

      <p className="stock-text">
        {stock > 0
          ? `${stock} tersedia`
          : "Stok habis"}
      </p>

    </article>
  );
}