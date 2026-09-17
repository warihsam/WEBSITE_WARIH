import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "ws-fashion-cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed.map((item) => ({
        ...item,
        key:
          item.key ||
          `${item.id}-${item.size || "default"}-${item.color || "default"}`,
        quantity: Math.max(1, Number(item.quantity) || 1),
      }));
    } catch (error) {
      console.error("Gagal membaca keranjang:", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error("Gagal menyimpan keranjang:", error);
    }
  }, [items]);

  function addToCart(product, size = "", quantity = 1, color = "") {
    if (!product?.id) {
      console.error("Produk tidak valid:", product);
      return;
    }

    const qty = Math.max(1, Number(quantity) || 1);

    const itemKey = `${product.id}-${size || "default"}-${color || "default"}`;

    setItems((currentItems) => {
      const existing = currentItems.find(
        (item) => item.key === itemKey
      );

      if (existing) {
        return currentItems.map((item) =>
          item.key === itemKey
            ? {
                ...item,
                quantity:
                  Number(item.quantity || 0) + qty,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          ...product,
          key: itemKey,
          size: size || "",
          color: color || "",
          quantity: qty,
        },
      ];
    });
  }

  function removeFromCart(key) {
    setItems((currentItems) =>
      currentItems.filter((item) => item.key !== key)
    );
  }

  function updateQuantity(key, quantity) {
    const newQuantity = Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(key);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === key
          ? {
              ...item,
              quantity: newQuantity,
            }
          : item
      )
    );
  }

  function clearCart() {
    setItems([]);

    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.error("Gagal menghapus keranjang:", error);
    }
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const quantity = Number(item.quantity || 0);

      return sum + price * quantity;
    }, 0);
  }, [items]);

  const count = useMemo(() => {
    return items.reduce((sum, item) => {
      return sum + Number(item.quantity || 0);
    }, 0);
  }, [items]);

  /*
   * Alias untuk kompatibilitas dengan Checkout.jsx
   *
   * Checkout menggunakan:
   * cartItems
   * cartTotal
   *
   * Sedangkan halaman Cart menggunakan:
   * items
   * total
   */
  const cartItems = items;
  const cartTotal = total;

  return (
    <CartContext.Provider
      value={{
        // Data utama
        items,
        total,

        // Alias untuk Checkout
        cartItems,
        cartTotal,

        // Jumlah produk
        count,

        // Fungsi keranjang
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart harus digunakan di dalam CartProvider"
    );
  }

  return context;
}