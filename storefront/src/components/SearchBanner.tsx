import React, { useState } from 'react';
import { Search } from 'lucide-react';

const SearchBanner = () => {
  const [filters, setFilters] = useState({
    brand: '',
    model: '',
    reference: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (filters.brand) params.append('brand', filters.brand);
    if (filters.model) params.append('model', filters.model);
    if (filters.reference) params.append('reference', filters.reference);
    
    window.location.href = `/productos?${params.toString()}`;
  };

  return (
    <div className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 rounded-3xl border border-slate-800 shadow-2xl mb-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,theme(colors.orange.500/10),transparent)]"></div>
      
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-8 font-outfit">
          Encuentra el accesorio perfecto para tu moto
        </h2>
        
        <form onSubmit={handleSearch} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Marca</label>
            <input 
              type="text" 
              placeholder="Ej: Yamaha, Honda..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              value={filters.brand}
              onChange={(e) => setFilters({...filters, brand: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Modelo</label>
            <input 
              type="text" 
              placeholder="Ej: MT-03, R1..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              value={filters.model}
              onChange={(e) => setFilters({...filters, model: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Referencia</label>
            <input 
              type="text" 
              placeholder="Ej: 2024, V2..." 
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
              value={filters.reference}
              onChange={(e) => setFilters({...filters, reference: e.target.value})}
            />
          </div>
          <div className="flex flex-col justify-end">
            <button 
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2.5 px-6 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-orange-900/20"
            >
              <Search size={18} className="group-hover:scale-110 transition-transform" />
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchBanner;
