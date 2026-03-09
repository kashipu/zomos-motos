import { persistentAtom } from "@nanostores/persistent";

export interface CartItem {
  /** ID único en el carrito: para pilotos incluye variante, para motos el id del producto */
  cartKey: string;
  id: string;
  nombre: string;
  sku: string;
  precio: number;
  cantidad: number;
  imagen?: string;
  tipo: "moto" | "piloto";
  marca?: string;
  // Solo piloto
  variante?: {
    talla: string;
    color: string;
    cantidad_stock: number;
  };
  // Solo moto — texto legible: "Yamaha MT-09, Honda CB500F"
  compatibilidad?: string;
}

export const cartItems = persistentAtom<CartItem[]>("cart", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/** Precio final del item */
export function precioFinal(item: CartItem): number {
  return item.precio;
}

export function addToCart(item: CartItem) {
  const current = cartItems.get();
  const existing = current.find((i) => i.cartKey === item.cartKey);

  if (existing) {
    cartItems.set(
      current.map((i) =>
        i.cartKey === item.cartKey ? { ...i, cantidad: i.cantidad + item.cantidad } : i
      )
    );
  } else {
    cartItems.set([...current, item]);
  }
}

export function removeFromCart(cartKey: string) {
  cartItems.set(cartItems.get().filter((i) => i.cartKey !== cartKey));
}

export function updateQuantity(cartKey: string, cantidad: number) {
  if (cantidad <= 0) {
    removeFromCart(cartKey);
    return;
  }
  cartItems.set(
    cartItems.get().map((i) => (i.cartKey === cartKey ? { ...i, cantidad } : i))
  );
}

export function clearCart() {
  cartItems.set([]);
}

export function getCartTotal(): number {
  return cartItems.get().reduce((acc, item) => acc + precioFinal(item) * item.cantidad, 0);
}

export function getCartItemCount(): number {
  return cartItems.get().reduce((acc, item) => acc + item.cantidad, 0);
}
