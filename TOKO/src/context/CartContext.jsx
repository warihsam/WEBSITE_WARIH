import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem("ws-fashion-cart") || "[]");
      return savedItems.map((item) => ({
        ...item,
        key: item.key || `${item.id}-${item.size || "default"}`,
        quantity: Number(item.quantity) || 1,
      }));
    } catch (error) {
      console.error("Gagal membaca keranjang:", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "ws-fashion-cart",
      JSON.stringify(items)
    );
  }, [items]);

  function addToCart(product, size, quantity = 1) {
    const itemKey = `${product.id}-${size || "default"}`;

    setItems((current) => {
      const existing = current.find(
        (item) => item.key === itemKey
      );

      if (existing) {
        return current.map((item) =>
          item.key === itemKey
            ? {
                ...item,
                quantity: Number(item.quantity) + Number(quantity),
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          key: itemKey,
          size,
          quantity: Number(quantity),
        },
      ];
    });
  }

  function removeFromCart(key) {
    setItems((current) =>
      current.filter((item) => item.key !== key)
    );
  }

  function updateQuantity(key, quantity) {
    const newQuantity = Number(quantity);

    if (newQuantity <= 0) {
      removeFromCart(key);
      return;
    }

    setItems((current) =>
      current.map((item) =>
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
  }

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );
  }, [items]);

  const count = useMemo(() => {
    return items.reduce(
      (sum, item) =>
        sum + Number(item.quantity || 0),
      0
    );
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        count,
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