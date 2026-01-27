import { persistentAtom } from "@nanostores/persistent";

export interface CartItem {
  id: string;
  name: string;
  sku?: string;
  price: number;
  quantity: number;
  image?: string;
}

export const cartItems = persistentAtom<CartItem[]>("cart", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addToCart(item: CartItem) {
  const currentItems = cartItems.get();
  const existingItem = currentItems.find((i) => i.id === item.id);

  if (existingItem) {
    cartItems.set(
      currentItems.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
      )
    );
  } else {
    cartItems.set([...currentItems, item]);
  }
}

export function removeFromCart(id: string) {
  cartItems.set(cartItems.get().filter((i) => i.id !== id));
}

export function clearCart() {
  cartItems.set([]);
}
