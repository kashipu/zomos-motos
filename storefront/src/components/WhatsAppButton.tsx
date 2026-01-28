import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  productName: string;
  sku?: string;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ productName, sku, className = "" }) => {
  const phoneNumber = "573028336170";
  const message = encodeURIComponent(
    `Hola Zomos Motos! 👋\n\nEstoy interesado en comprar el producto:\n*${productName}*${sku ? `\nSKU: ${sku}` : ""}\n\n¿Me podrían dar más información?`
  );
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-green-500 hover:scale-105 active:scale-95 ${className}`}
    >
      <MessageCircle size={20} />
      Comprar ahora por WhatsApp
    </a>
  );
};

export default WhatsAppButton;
