import { addToCart, type CartItem } from "@/store/cart";
import type { Variante } from "@/lib/strapi";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useState, useMemo } from "react";

interface Props {
  product: {
    id: string;
    nombre: string;
    precio: number;
    descuento?: number;
    sku: string;
    imagen?: string;
    tipo: "moto" | "piloto";
    marca?: string;
    variantes?: Variante[];
    compatibilidadTexto?: string; // "Yamaha MT-09, Honda CB500F"
  };
}

export default function AddToCartButton({ product }: Props) {
  const [cantidad, setCantidad] = useState(1);
  const [selectedVariante, setSelectedVariante] = useState<Variante | null>(
    null,
  );
  const [added, setAdded] = useState(false);

  const esPiloto = product.tipo === "piloto";
  const tieneVariantes =
    esPiloto && product.variantes && product.variantes.length > 0;

  // Agrupar colores y tallas disponibles
  const colores = useMemo(() => {
    if (!product.variantes) return [];
    return [...new Set(product.variantes.map((v) => v.color))];
  }, [product.variantes]);

  const [selectedColor, setSelectedColor] = useState<string>(colores[0] ?? "");

  const tallasDisponibles = useMemo(() => {
    if (!product.variantes) return [];
    return product.variantes.filter((v) => v.color === selectedColor);
  }, [product.variantes, selectedColor]);

  // Auto-select first variante when color changes
  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const primera = product.variantes?.find((v) => v.color === color) ?? null;
    setSelectedVariante(primera);
  };

  const handleTallaChange = (talla: string) => {
    const v =
      product.variantes?.find(
        (v) => v.color === selectedColor && v.talla === talla,
      ) ?? null;
    setSelectedVariante(v);
  };

  const precioBase =
    product.descuento && product.descuento > 0
      ? Math.round(product.precio * (1 - product.descuento / 100))
      : product.precio;
  const stockDisponible = selectedVariante?.cantidad_stock ?? 999;
  const sinStock =
    tieneVariantes && selectedVariante && selectedVariante.cantidad_stock === 0;

  const handleAdd = () => {
    if (tieneVariantes && !selectedVariante) return;

    const cartKey =
      tieneVariantes && selectedVariante
        ? `${product.id}-${selectedVariante.talla}-${selectedVariante.color}`
        : product.id;

    const item: CartItem = {
      cartKey,
      id: product.id,
      nombre: product.nombre,
      sku: product.sku,
      precio: precioBase,
      cantidad,
      imagen: product.imagen,
      tipo: product.tipo,
      marca: product.marca,
    };

    if (selectedVariante) {
      item.variante = {
        talla: selectedVariante.talla,
        color: selectedVariante.color,
        cantidad_stock: selectedVariante.cantidad_stock,
      };
    }

    if (product.compatibilidadTexto) {
      item.compatibilidad = product.compatibilidadTexto;
    }

    addToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-5 mt-6">
      {/* Selector de color */}
      {tieneVariantes && colores.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {colores.map((color) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  selectedColor === color
                    ? "bg-primary/20 border-primary text-white"
                    : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/30"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector de talla */}
      {tieneVariantes && tallasDisponibles.length > 0 && (
        <div>
          <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
            Talla
          </label>
          <div className="flex flex-wrap gap-2">
            {tallasDisponibles.map((v) => (
              <button
                key={v.talla}
                onClick={() => handleTallaChange(v.talla)}
                disabled={v.cantidad_stock === 0}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                  selectedVariante?.talla === v.talla &&
                  selectedVariante?.color === v.color
                    ? "bg-primary/20 border-primary text-white"
                    : v.cantidad_stock === 0
                      ? "bg-white/5 border-white/5 text-zinc-500 cursor-not-allowed line-through"
                      : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/30"
                }`}
              >
                {v.talla}
                {v.cantidad_stock > 0 && v.cantidad_stock <= 3 && (
                  <span className="ml-1 text-orange-500 text-[10px]">
                    ({v.cantidad_stock})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Cantidad + Botón */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
          <button
            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <Minus size={18} />
          </button>
          <span className="text-lg font-medium w-6 text-center">
            {cantidad}
          </span>
          <button
            onClick={() => setCantidad(Math.min(stockDisponible, cantidad + 1))}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <Plus size={18} />
          </button>
        </div>

        <button
          onClick={handleAdd}
          disabled={sinStock || (tieneVariantes && !selectedVariante)}
          className={`flex-1 flex items-center justify-center gap-2 font-bold py-4 px-8 rounded-full transition-all active:scale-[0.98] shadow-lg ${
            added
              ? "bg-green-600 text-white"
              : sinStock || (tieneVariantes && !selectedVariante)
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                : "bg-primary hover:bg-red-700 text-white hover:scale-[1.02] shadow-primary/20"
          }`}
        >
          {added ? (
            <>
              <Check size={20} />
              Agregado
            </>
          ) : sinStock ? (
            "Agotado"
          ) : tieneVariantes && !selectedVariante ? (
            "Selecciona talla"
          ) : (
            <>
              <ShoppingCart size={20} />
              Agregar al Carrito
            </>
          )}
        </button>
      </div>
    </div>
  );
}
