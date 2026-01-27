import { useStore } from "@nanostores/react";
import { cartItems, removeFromCart, clearCart } from "@/store/cart";
import { X, Trash2, MessageCircle, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartDrawer() {
  const items = useStore(cartItems);
  const [isOpen, setIsOpen] = useState(false);

  // Listen for custom event to open drawer
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-cart", handleOpen);
    return () => window.removeEventListener("open-cart", handleOpen);
  }, []);

  if (!isOpen) return null;

  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${import.meta.env.PUBLIC_STRAPI_URL}/api/checkout/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cart: items,
          utms: {} // Add UTM tracking here if needed
        }),
      });

      const { redirect_url } = await response.json();
      window.location.href = redirect_url;
    } catch (e) {
      console.error("Checkout failed:", e);
      alert("Hubo un error al iniciar el checkout por WhatsApp.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold font-outfit">Tu Carrito</h2>
          <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="bg-slate-800/50 p-6 rounded-full mb-4">
                <ShoppingCart size={48} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium">Tu carrito está vacío</p>
              <button 
                onClick={() => setIsOpen(false)}
                className="mt-4 text-orange-500 font-semibold hover:underline"
              >
                Seguir comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="h-20 w-20 bg-slate-800 rounded-lg flex-shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-600">
                      <ShoppingCart size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {item.quantity} x ${new Intl.NumberFormat('es-CO').format(item.price)}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-slate-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total</span>
              <span>${new Intl.NumberFormat('es-CO').format(total)}</span>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-xl shadow-green-950/20"
            >
              <MessageCircle size={24} />
              Finalizar por WhatsApp
            </button>
            
            <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              Seguro y confiable
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
