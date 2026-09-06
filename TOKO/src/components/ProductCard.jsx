import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { formatRupiah } from "../utils/format";

export default function ProductCard({
  product,
}) {
  const image =
    product.image_url ||
    product.image ||
    "";

  const category =
    product.category ||
    "Fashion";

  const isFeatured =
    product.is_featured === true ||
    product.featured === true;

  const stock =
    Number(product.stock || 0);

  return (
    <article className="product-card">

      <Link
        to={`/products/${product.id}`}
        className="product-image-wrap"
      >

        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
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
            {category}
          </p>

          <h3>
            {product.name}
          </h3>

        </div>

        <strong>
          {formatRupiah(
            product.price
          )}
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