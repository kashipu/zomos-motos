import { useStore } from "@nanostores/react";
import { cartItems, removeFromCart, updateQuantity, clearCart, precioFinal, type CartItem } from "@/store/cart";
import { X, Trash2, MessageCircle, ShoppingCart, ArrowRight, ArrowLeft, Minus, Plus, User, Phone, Mail, IdCard, MapPin, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const fmt = (n: number) => new Intl.NumberFormat("es-CO").format(n);

export default function CartDrawer() {
  const items = useStore(cartItems);
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cart", handleOpen);
    return () => window.removeEventListener("open-cart", handleOpen);
  }, []);

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + precioFinal(item) * item.cantidad, 0);

  return (
    <div className="fixed inset-0 z-[110] flex justify-end font-display">
      <div
        className="absolute inset-0 bg-background-dark/80 backdrop-blur-md transition-opacity"
        onClick={() => { setIsOpen(false); setShowCheckout(false); }}
      />

      <div className="relative w-full max-w-md h-full bg-[#0a0505] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-500 overflow-x-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            {showCheckout ? (
              <button onClick={() => setShowCheckout(false)} className="text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </button>
            ) : (
              <ShoppingCart className="text-primary" size={22} />
            )}
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-white">
              {showCheckout ? "Datos del Pedido" : <>Tu <span className="text-primary">Pedido</span></>}
            </h2>
          </div>
          <button
            onClick={() => { setIsOpen(false); setShowCheckout(false); }}
            className="size-10 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {showCheckout ? (
          <CheckoutForm items={items} total={total} />
        ) : (
          <>
            {/* Body - Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="size-20 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 border border-white/5">
                    <ShoppingCart size={36} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-lg font-medium">El garaje está vacío</p>
                    <p className="text-zinc-500 text-sm mt-1">Añade algunas piezas para empezar.</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-white/5 hover:bg-primary hover:text-white text-zinc-400 px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all border border-white/10"
                  >
                    Seguir explorando
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CartItemCard key={item.cartKey} item={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-background-dark/50 backdrop-blur-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 uppercase font-black tracking-widest text-xs">
                    Total
                  </span>
                  <span className="text-2xl font-black text-white tracking-tighter">
                    ${fmt(total)}
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-primary hover:bg-red-700 text-white font-black uppercase italic tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(242,13,13,0.3)] group"
                >
                  <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
                  Finalizar Pedido
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  const precio = precioFinal(item);

  return (
    <div className="flex gap-3 group bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all">
      {/* Imagen */}
      <div className="h-20 w-20 bg-zinc-900 rounded-lg shrink-0 overflow-hidden border border-white/10">
        {item.imagen ? (
          <img
            src={item.imagen}
            alt={item.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-zinc-600">
            <ShoppingCart size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h3 className="font-bold text-white text-sm leading-tight line-clamp-2">
            {item.nombre}
          </h3>

          {/* Moto: primera compatibilidad */}
          {item.tipo === "moto" && item.compatibilidad && (
            <p className="text-primary/70 text-[10px] font-bold mt-0.5 truncate">
              {item.compatibilidad.split(", ")[0]}
            </p>
          )}

          {/* Piloto: talla + color */}
          {item.tipo === "piloto" && item.variante && (
            <p className="text-zinc-400 text-[10px] font-bold mt-0.5">
              {item.variante.talla} · {item.variante.color}
            </p>
          )}
        </div>

        {/* Cantidad y Precio */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-zinc-800/50 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => updateQuantity(item.cartKey, item.cantidad - 1)}
              className="p-1 text-zinc-500 hover:text-white transition-colors rounded"
            >
              <Minus size={12} />
            </button>
            <span className="text-white font-bold text-xs min-w-6 text-center">
              {item.cantidad}
            </span>
            <button
              onClick={() => updateQuantity(item.cartKey, item.cantidad + 1)}
              className="p-1 text-zinc-500 hover:text-white transition-colors rounded"
            >
              <Plus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-black text-white tracking-tighter">
              ${fmt(precio * item.cantidad)}
            </span>
            <button
              onClick={() => removeFromCart(item.cartKey)}
              className="p-1.5 text-zinc-500 hover:text-red-500 transition-colors hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CheckoutFormProps {
  items: CartItem[];
  total: number;
}

function CheckoutForm({ items, total }: CheckoutFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    cedula: "",
    direccion: "",
    autorizacion: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nombre.trim()) e.nombre = "Requerido";
    if (!form.telefono.trim()) e.telefono = "Requerido";
    if (!form.cedula.trim()) e.cedula = "Requerido";
    if (!form.direccion.trim()) e.direccion = "Requerido";
    if (!form.autorizacion) e.autorizacion = "Debes autorizar el tratamiento de datos";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.PUBLIC_STRAPI_URL}/api/checkout/whatsapp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cart: items,
            customer: form,
            utms: {},
          }),
        }
      );
      const { redirect_url } = await response.json();
      clearCart();
      window.location.href = redirect_url;
    } catch {
      alert("Hubo un error al procesar tu pedido. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full bg-white/5 border ${errors[field] ? "border-red-500/50" : "border-white/10"} rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-primary/50 transition-colors`;

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Resumen rápido */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
              {items.length} {items.length === 1 ? "producto" : "productos"}
            </span>
            <span className="text-white font-black text-lg tracking-tighter">
              ${fmt(total)}
            </span>
          </div>
        </div>

        {/* Campos */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <User size={14} className="text-zinc-500" />
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nombre completo *</label>
            </div>
            <input
              type="text"
              placeholder="Tu nombre completo"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className={inputClass("nombre")}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Phone size={14} className="text-zinc-500" />
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Teléfono *</label>
            </div>
            <input
              type="tel"
              placeholder="300 123 4567"
              value={form.telefono}
              onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              className={inputClass("telefono")}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Mail size={14} className="text-zinc-500" />
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Correo</label>
            </div>
            <input
              type="email"
              placeholder="tu@correo.com"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              className={inputClass("correo")}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <IdCard size={14} className="text-zinc-500" />
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Cédula *</label>
            </div>
            <input
              type="text"
              placeholder="1234567890"
              value={form.cedula}
              onChange={(e) => setForm({ ...form, cedula: e.target.value })}
              className={inputClass("cedula")}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <MapPin size={14} className="text-zinc-500" />
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Dirección de envío *</label>
            </div>
            <textarea
              placeholder="Cra 10 #20-30, Bogotá"
              value={form.direccion}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              rows={2}
              className={inputClass("direccion") + " resize-none"}
            />
          </div>

          {/* Autorización */}
          <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${form.autorizacion ? "bg-primary/5 border-primary/30" : errors.autorizacion ? "bg-red-500/5 border-red-500/30" : "bg-white/5 border-white/10"}`}>
            <input
              type="checkbox"
              checked={form.autorizacion}
              onChange={(e) => setForm({ ...form, autorizacion: e.target.checked })}
              className="mt-0.5 accent-primary"
            />
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-primary" />
                <span className="text-xs font-bold text-zinc-300">Autorización de datos</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">
                Autorizo el tratamiento de mis datos personales para el procesamiento de este pedido.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="p-6 border-t border-white/5 bg-background-dark/50 backdrop-blur-lg">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-primary hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-black uppercase italic tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(242,13,13,0.3)] group"
        >
          {loading ? (
            "Procesando..."
          ) : (
            <>
              <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
              Ir a WhatsApp
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
