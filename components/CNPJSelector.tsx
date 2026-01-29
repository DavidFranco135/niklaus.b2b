
import React from 'react';
import { CNPJ } from '../types';
import { trayService } from '../services/trayService';

interface CNPJSelectorProps {
  cnpjs: CNPJ[];
  onSelect: (cnpj: CNPJ) => void;
  currentSelection: CNPJ | null;
}

const CNPJSelector: React.FC<CNPJSelectorProps> = ({ cnpjs, onSelect, currentSelection }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-10 border-b border-slate-100 bg-emerald-50">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Contexto de Compra</h2>
          <p className="text-slate-600 mt-2 font-medium">O catálogo será ajustado automaticamente baseado no grupo Tray desta unidade.</p>
        </div>
        
        <div className="p-10 max-h-[60vh] overflow-y-auto space-y-4 scrollbar-hide">
          {cnpjs.map((cnpj) => (
            <button
              key={cnpj.id}
              onClick={() => onSelect(cnpj)}
              className={`w-full text-left p-8 rounded-[2rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${
                currentSelection?.id === cnpj.id 
                  ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' 
                  : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-6 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                   currentSelection?.id === cnpj.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'
                }`}>
                   <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                </div>
                <div>
                  <p className="font-extrabold text-xl text-slate-900 tracking-tight">{cnpj.name}</p>
                  <div className="flex gap-4 mt-1.5 items-center">
                    <span className="bg-white px-2.5 py-0.5 rounded-lg border border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-widest">{cnpj.number}</span>
                    <span className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                       <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                       Tray: {trayService.getGroupName(cnpj.trayGroupId)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`transition-all ${currentSelection?.id === cnpj.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                 <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
          <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Conexão Segura com a API da Tray</p>
        </div>
      </div>
    </div>
  );
};

export default CNPJSelector;
