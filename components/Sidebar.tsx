
import React from 'react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: any) => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, userRole }) => {
  const navItems = [
    { id: 'catalog', label: 'Catálogo B2B', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
    )},
    { id: 'history', label: 'Histórico de Pedidos', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
    )},
    { id: 'news', label: 'Comunicados', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v4h4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12h10M7 16h10" /></svg>
    )},
  ];

  if (userRole === 'ADMIN') {
    navItems.push({ id: 'backoffice', label: 'Portal Admin', icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    )});
  }

  return (
    <aside className="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col">
      <div className="p-10">
        <div className="flex items-center gap-3">
           <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-black">NK</div>
           <span className="font-extrabold text-slate-900 tracking-tighter uppercase text-sm">Niklaus Portal</span>
        </div>
      </div>
      
      <nav className="flex-1 px-6 space-y-1.5 mt-2">
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Navegação Principal</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group ${
              currentPage === item.id 
                ? 'bg-emerald-50 text-emerald-700' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`${currentPage === item.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'}`}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-8 border-t border-slate-100">
        <div className="bg-slate-900 rounded-2xl p-5 text-white">
          <p className="text-xs font-bold text-emerald-400 uppercase mb-1">Dúvidas?</p>
          <p className="text-[11px] text-slate-400 leading-relaxed mb-4">Acesse nossa documentação técnica Tray B2B.</p>
          <button className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Abrir Suporte</button>
        </div>
        <p className="mt-6 text-center text-[10px] text-slate-300 font-medium tracking-widest">NK.NKS v2.5.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
