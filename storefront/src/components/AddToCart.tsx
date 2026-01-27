import { useStore } from "@nanostores/react";
import { cartItems, addToCart, type CartItem } from "@/store/cart";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useState } from "react";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    sku?: string;
    image?: string;
  };
}

export default function AddToCartButton({ product }: Props) {
  const [quantity, setQuantity] = useState(1);

  const handleAdd = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      image: product.image,
      quantity,
    });
  };

  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 w-fit">
        <button
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <Minus size={18} />
        </button>
        <span className="text-lg font-medium w-6 text-center">{quantity}</span>
        <button
          onClick={() => setQuantity(quantity + 1)}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          <Plus size={18} />
        </button>
      </div>

      <button
        onClick={handleAdd}
        className="flex items-center justify-center gap-2 w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-950/20"
      >
        <ShoppingCart size={20} />
        Agregar al Carrito
      </button>
    </div>
  );
}
