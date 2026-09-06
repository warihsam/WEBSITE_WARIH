import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import ProductCard from "../components/ProductCard";

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

export default function Products() {
  const [params, setParams] = useSearchParams();

  const initialCategory =
    params.get("category") || "Semua";

  const [products, setProducts] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState(initialCategory);
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  // =====================================================
  // LOAD PRODUCTS + CATEGORIES
  // =====================================================

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setErrorMessage("");

      const [
        productsResult,
        categoriesResult,
      ] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("is_active", true)
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("categories")
          .select("*")
          .order("name", {
            ascending: true,
          }),
      ]);

      if (!mounted) return;

      if (productsResult.error) {
        console.error(
          "SUPABASE PRODUCTS ERROR:",
          productsResult.error
        );

        setProducts([]);
        setErrorMessage(
          productsResult.error.message ||
            "Gagal mengambil data produk."
        );

        setLoading(false);
        return;
      }

      if (categoriesResult.error) {
        console.error(
          "SUPABASE CATEGORIES ERROR:",
          categoriesResult.error
        );

        setProducts(productsResult.data || []);
        setCategoriesData([]);
        setErrorMessage(
          categoriesResult.error.message ||
            "Gagal mengambil kategori."
        );

        setLoading(false);
        return;
      }

      setProducts(productsResult.data || []);
      setCategoriesData(
        categoriesResult.data || []
      );

      setLoading(false);
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // =====================================================
  // BUAT MAP CATEGORY ID -> CATEGORY
  // =====================================================

  const categoryMap = useMemo(() => {
    const map = new Map();

    categoriesData.forEach((cat) => {
      map.set(String(cat.id), cat);
    });

    return map;
  }, [categoriesData]);

  // =====================================================
  // TAMBAHKAN INFORMASI CATEGORY KE PRODUCT
  // =====================================================

  const productsWithCategory = useMemo(() => {
    return products.map((product) => {
      const categoryData =
        categoryMap.get(
          String(product.category_id)
        );

      return {
        ...product,

        category:
          categoryData?.name ||
          product.category ||
          "",

        category_slug:
          categoryData?.slug ||
          "",
      };
    });
  }, [products, categoryMap]);

  // =====================================================
  // CATEGORY LIST
  // =====================================================

  const categories = useMemo(() => {
    return [
      "Semua",
      ...categoriesData
        .map((cat) => cat.name)
        .filter(Boolean),
    ];
  }, [categoriesData]);

  // =====================================================
  // ACTIVE CATEGORY
  // =====================================================

  const activeCategory = useMemo(() => {
    if (
      normalize(category) === "semua" ||
      !category
    ) {
      return "Semua";
    }

    const match = categories.find(
      (item) =>
        normalize(item) ===
        normalize(category)
    );

    return match || category;
  }, [category, categories]);

  // =====================================================
  // FILTER PRODUCT
  // =====================================================

  const filtered = useMemo(() => {
    const search = normalize(query);

    const selectedCategory =
      normalize(activeCategory);

    let result =
      productsWithCategory.filter(
        (product) => {
          const productCategory =
            normalize(product.category);

          const searchable = [
            product.name,
            product.category,
            product.description,
          ]
            .filter(Boolean)
            .join(" ");

          const matchesSearch =
            !search ||
            normalize(searchable).includes(
              search
            );

          const matchesCategory =
            selectedCategory === "semua" ||
            productCategory ===
              selectedCategory;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );

    // ===================================================
    // SORT
    // ===================================================

    if (sort === "low") {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      );
    } else if (sort === "high") {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(
            b.created_at || 0
          ).getTime() -
          new Date(
            a.created_at || 0
          ).getTime()
      );
    }

    return result;
  }, [
    productsWithCategory,
    query,
    activeCategory,
    sort,
  ]);

  // =====================================================
  // CHANGE CATEGORY
  // =====================================================

  function changeCategory(value) {
    setCategory(value);

    const next =
      new URLSearchParams(params);

    if (
      normalize(value) === "semua"
    ) {
      next.delete("category");
    } else {
      next.set("category", value);
    }

    setParams(next);
  }

  // =====================================================
  // SYNC URL
  // =====================================================

  useEffect(() => {
    const urlCategory =
      params.get("category") ||
      "Semua";

    setCategory(urlCategory);
  }, [params]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main className="page">

      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">
            SHOP / 05
          </p>

          <h1>
            THE COLLECTION.
          </h1>

          <p>
            Temukan essential pieces
            untuk melengkapi style kamu.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">

          <div className="filter-bar">

            {/* SEARCH */}

            <label className="search-box">
              <Search size={18} />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                placeholder="Cari produk..."
              />
            </label>

            {/* FILTER */}

            <div className="filter-group">

              <SlidersHorizontal
                size={17}
              />

              <select
                value={activeCategory}
                onChange={(e) =>
                  changeCategory(
                    e.target.value
                  )
                }
              >
                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}
              </select>

              <select
                value={sort}
                onChange={(e) =>
                  setSort(
                    e.target.value
                  )
                }
              >
                <option value="newest">
                  Terbaru
                </option>

                <option value="low">
                  Harga terendah
                </option>

                <option value="high">
                  Harga tertinggi
                </option>
              </select>

            </div>
          </div>

          {/* ERROR */}

          {errorMessage ? (
            <div className="empty-state large">
              <p>
                Produk gagal dimuat.
              </p>

              <small>
                {errorMessage}
              </small>
            </div>

          ) : loading ? (

            <div className="page-loader">
              Memuat produk...
            </div>

          ) : filtered.length ? (

            <div className="product-grid">

              {filtered.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                )
              )}

            </div>

          ) : (

            <div className="empty-state large">

              <p>
                Produk tidak ditemukan.
              </p>

              <small>
                Tidak ada produk dalam
                kategori{" "}
                <strong>
                  {activeCategory}
                </strong>
                .
              </small>

            </div>
          )}

        </div>
      </section>

    </main>
  );
}