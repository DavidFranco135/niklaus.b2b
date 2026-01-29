
import React, { useState, useEffect } from 'react';
import { CNPJ, Product, CartItem, Order, TrayCategory } from '../types';
import { trayApi } from '../services/mockApi';
import { trayService } from '../services/trayService';

interface DashboardProps {
  cnpj: CNPJ;
  products: Product[]; // Catálogo mestre do Admin
  onAddToCart: (p: Product) => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveFromCart: (id: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  cnpj, products: masterProducts, onAddToCart, cart, onUpdateQuantity, onRemoveFromCart, onClearCart, onOrderCreated
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [syncStep, setSyncStep] = useState<string>('');
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<TrayCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Lógica de filtragem Tray
  useEffect(() => {
    const syncCatalog = async () => {
      setIsLoading(true);
      // Simula a filtragem pela API da Tray baseada no Grupo
      const allowed = trayService.filterProductsByGroup(masterProducts, cnpj.trayGroupId);
      const availableCats = await trayService.getAvailableCategories(cnpj.trayGroupId);
      
      setFilteredProducts(allowed);
      setCategories(availableCats);
      setSelectedCategory('all');
      setIsLoading(false);
    };
    syncCatalog();
  }, [cnpj, masterProducts]);

  const displayProducts = filteredProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.trayCategoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleFinishOrder = async () => {
    if (cart.length === 0) return;
    setIsOrdering(true);
    const steps = ["Sincronizando Sessão Tray...", "Validando Grupo de Cliente...", "Gerando Link de Pagamento..."];
    for(let step of steps) {
      setSyncStep(step);
      await new Promise(r => setTimeout(r, 600));
    }
    try {
      const order = await trayApi.createOrder(cnpj, cart, cartTotal);
      onOrderCreated(order);
      setLastOrder(order);
      onClearCart();
    } catch (e) {
      alert("Erro na sincronização Tray.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (lastOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8">
           <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pedido Sincronizado!</h2>
        <p className="text-slate-500 mt-4 max-w-sm">O faturamento para <strong>{cnpj.name}</strong> está pronto no ambiente da Tray.</p>
        <a href={lastOrder.paymentLink} target="_blank" rel="noopener noreferrer" className="mt-10 inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all shadow-xl shadow-slate-200">
          Finalizar na Tray
        </a>
        <button onClick={() => setLastOrder(null)} className="mt-8 text-slate-400 font-bold hover:text-slate-600 text-sm">Voltar ao Catálogo</button>
      </div>
    );
  }

  return (
    <div className="flex gap-10 h-full">
      <div className="flex-1 flex flex-col h-full">
        {/* Banner de Contexto Tray */}
        <div className="mb-10 p-6 bg-white border border-slate-100 rounded-[2rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
           <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${trayService.getGroupColor(cnpj.trayGroupId)}`}>
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nível de Acesso Tray</p>
                 <h2 className="text-xl font-black text-slate-900">{trayService.getGroupLabel(cnpj.trayGroupId)}</h2>
              </div>
           </div>
           
           <div className="flex gap-3">
              <div className="relative">
                 <input 
                   type="text" 
                   value={searchTerm} 
                   onChange={e => setSearchTerm(e.target.value)} 
                   placeholder="Buscar no grupo..." 
                   className="pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:border-emerald-500 transition-all font-medium text-sm w-48 lg:w-64" 
                 />
                 <svg className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <select 
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-emerald-500"
              >
                <option value="all">Filtro Rápido</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
           </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse border border-slate-100"></div>)}
          </div>
        ) : displayProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
             </div>
             <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Nenhum produto liberado para seu grupo</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 overflow-y-auto pb-10 pr-2 scrollbar-hide">
            {displayProducts.map(product => (
              <div key={product.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all group flex flex-col hover:border-emerald-500/30">
                <div className="h-64 relative overflow-hidden bg-slate-50">
                  <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={product.name} />
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-600 shadow-sm border border-slate-100">
                    {product.category}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-slate-900 text-lg mb-6 leading-tight h-12 overflow-hidden">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Preço Especial B2B</p>
                      <p className="text-2xl font-black text-slate-900 tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</p>
                    </div>
                    <button onClick={() => onAddToCart(product)} className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-90 transition-all">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mini Carrinho */}
      <div className="w-[400px] bg-white border-l border-slate-50 hidden xl:flex flex-col shadow-2xl h-[calc(100vh-120px)] rounded-[3rem] mt-2">
        <div className="p-10 border-b border-slate-50">
           <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Seu Pedido</h2>
           <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Unidade Faturamento</p>
              <p className="text-sm font-bold text-slate-900 truncate">{cnpj.name}</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-4 scrollbar-hide">
          {cart.length === 0 ? (
            <div className="text-center py-20 opacity-20 flex flex-col items-center">
              <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              <p className="text-[10px] font-black uppercase tracking-widest">Aguardando Produtos</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="flex gap-4 items-center bg-slate-50/50 p-4 rounded-2xl group border border-transparent hover:border-slate-200 transition-all">
              <img src={item.image} className="w-12 h-12 rounded-xl object-cover" alt={item.name} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-slate-900 truncate leading-tight">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                   <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-[10px]">-</button>
                   <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                   <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-6 h-6 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-[10px]">+</button>
                </div>
              </div>
              <button onClick={() => onRemoveFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          ))}
        </div>

        <div className="p-10 bg-slate-50/50 border-t border-slate-100 space-y-6">
          <div className="flex justify-between items-end">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sincronizado</span>
             <span className="text-3xl font-black text-slate-900 tracking-tighter">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cartTotal)}</span>
          </div>
          <button 
            disabled={cart.length === 0 || isOrdering} 
            onClick={handleFinishOrder}
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-lg shadow-xl hover:bg-black disabled:bg-slate-200 transition-all flex flex-col items-center gap-1"
          >
            {isOrdering ? (
              <span className="animate-pulse text-sm uppercase tracking-widest">{syncStep}</span>
            ) : (
              <>
                <span>ENVIAR PARA TRAY</span>
                <span className="text-[9px] text-emerald-400 font-bold tracking-widest opacity-80 uppercase">Grupo: {trayService.getGroupName(cnpj.trayGroupId)}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
