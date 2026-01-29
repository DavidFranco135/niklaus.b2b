
import React from 'react';
import { User, CNPJ } from '../types';

interface NavbarProps {
  user: User;
  selectedCnpj: CNPJ;
  onSwitchCnpj: () => void;
  onLogout: () => void;
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ user, selectedCnpj, onSwitchCnpj, onLogout, cartCount }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-100">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Loja Ativa</p>
            <p className="text-sm font-bold text-slate-800">{selectedCnpj.name}</p>
          </div>
        </div>
        <button 
          onClick={onSwitchCnpj}
          className="text-xs text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-1.5 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          Alternar Unidade
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{user.role}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-xl shadow-slate-200">
            {user.name.charAt(0)}
          </div>
        </div>

        <div className="w-px h-8 bg-slate-100"></div>

        <button 
          onClick={onLogout}
          className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          title="Sair do Portal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
