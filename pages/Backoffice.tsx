import React, { useState } from 'react';
import { CNPJ, Product, User } from '../types';
import { trayService } from '../services/trayService';
import { USER_CATEGORIES } from './Login';
import { INITIAL_MOCK_PRODUCTS, INITIAL_MOCK_CNPJS, INITIAL_MOCK_USERS } from '../services/mockApi';

interface BackofficeProps {
  cnpjs: CNPJ[];
  onUpsertCnpj: (c: CNPJ) => void;
  products: Product[];
  onUpsertProduct: (p: Product) => void;
  users: User[];
  onUpsertUser: (u: User) => void;
}

const UserModal: React.FC<{
  user: User | null;
  allCnpjs: CNPJ[];
  onClose: () => void;
  onSave: (u: User) => void;
}> = ({ user, allCnpjs, onClose, onSave }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [formData, setFormData] = useState<User>(user || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    email: '',
    password: '',
    category: USER_CATEGORIES[0],
    role: 'REPRESENTATIVE',
    cnpjs: []
  });

  const handleTraySync = async () => {
    if (!formData.email) {
      alert("Insira o e-mail para consultar a Tray.");
      return;
    }
    setIsSyncing(true);
    setSyncMessage('Consultando API da Tray...');
    
    try {
      const trayData = await trayService.fetchTrayBusinessContext(formData.email);
      setFormData(prev => ({
        ...prev,
        cnpjs: trayData.cnpjIds
      }));
      setSyncMessage(`Sucesso! ${trayData.trayRules.description}`);
    } catch (e) {
      setSyncMessage('Erro ao sincronizar com Tray.');
    } finally {
      setTimeout(() => {
        setIsSyncing(false);
        setSyncMessage('');
      }, 2000);
    }
  };

  const toggleCnpj = (id: string) => {
    setFormData(prev => ({
      ...prev,
      cnpjs: prev.cnpjs.includes(id) 
        ? prev.cnpjs.filter(i => i !== id) 
        : [...prev.cnpjs, id]
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Gerenciar Representante</h2>
            <p className="text-slate-500 font-medium text-sm">Controle de acesso e categoria de negócio.</p>
          </div>
          <button 
            disabled={isSyncing}
            onClick={handleTraySync}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-tighter transition-all ${
              isSyncing ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <svg className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            {isSyncing ? 'Sincronizando...' : 'Consultar Tray'}
          </button>
        </div>

        {syncMessage && (
          <div className="mb-6 p-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
             {syncMessage}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome Completo</label>
              <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">E-mail de Login</label>
              <input className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all font-bold" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} disabled={!!user} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">Categoria do Negócio (Gerenciável)</label>
            <select 
              className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all font-bold" 
              value={formData.category} 
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {USER_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-8">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center justify-between">
              CNPJs Autorizados
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-black">{formData.cnpjs.length} Vínculos</span>
            </h3>
            <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2 scrollbar-hide">
              {allCnpjs.map(c => (
                <label key={c.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.cnpjs.includes(c.id) ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.cnpjs.includes(c.id) ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{c.number}</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={formData.cnpjs.includes(c.id)} onChange={() => toggleCnpj(c.id)} className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer" />
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4 mt-10">
          <button onClick={onClose} className="font-bold text-slate-400 px-6">Cancelar</button>
          <button onClick={() => onSave(formData)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl">Salvar Representante</button>
        </div>
      </div>
    </div>
  );
};

const CNPJModal: React.FC<{
  cnpj: CNPJ | null;
  onClose: () => void;
  onSave: (c: CNPJ) => void;
}> = ({ cnpj, onClose, onSave }) => {
  const [formData, setFormData] = useState<CNPJ>(cnpj || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    razao_social: '',
    number: '',
    cpf_responsavel: '',
    distributor: '',
    email_contato: '',
    telefone: '',
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    trayGroupId: 'group_basic'
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
          <div>
            <h2 className="text-2xl font-black tracking-tight">Gerenciar Unidade B2B</h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Dados Sincronizados Tray</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10 max-h-[75vh] overflow-y-auto scrollbar-hide">
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-[10px] font-black">01</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Identificação Fiscal</h3>
            </div>
            <div className="space-y-4">
              <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 transition-all font-bold text-sm" value={formData.trayGroupId} onChange={e => setFormData({...formData, trayGroupId: e.target.value})}>
                <option value="group_basic">Lojista B2B (Básico)</option>
                <option value="group_premium">Distribuidor Ouro (Premium)</option>
                <option value="group_vip">Parceiro VIP (Exclusivo)</option>
              </select>
              <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nome Fantasia" />
              <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.razao_social} onChange={e => setFormData({...formData, razao_social: e.target.value})} placeholder="Razão Social" />
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} placeholder="CNPJ" />
                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.cpf_responsavel} onChange={e => setFormData({...formData, cpf_responsavel: e.target.value})} placeholder="CPF Responsável" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <span className="w-6 h-6 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-[10px] font-black">02</span>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Endereço de Faturamento</h3>
            </div>
            <div className="space-y-4">
              <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} placeholder="CEP" />
              <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.logradouro} onChange={e => setFormData({...formData, logradouro: e.target.value})} placeholder="Logradouro" />
              <div className="grid grid-cols-3 gap-4">
                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.numero} onChange={e => setFormData({...formData, numero: e.target.value})} placeholder="Nº" />
                <input className="col-span-2 w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.bairro} onChange={e => setFormData({...formData, bairro: e.target.value})} placeholder="Bairro" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <input className="col-span-3 w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm" value={formData.cidade} onChange={e => setFormData({...formData, cidade: e.target.value})} placeholder="Cidade" />
                <input className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 font-bold text-sm uppercase" value={formData.estado} onChange={e => setFormData({...formData, estado: e.target.value})} maxLength={2} placeholder="UF" />
              </div>
            </div>
          </section>
        </div>

        <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 font-bold text-slate-400">Cancelar</button>
          <button onClick={() => onSave(formData)} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg">Salvar Unidade</button>
        </div>
      </div>
    </div>
  );
};

const ProductModal: React.FC<{
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
}> = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState<Product>(product || {
    id: Math.random().toString(36).substr(2, 9),
    name: '',
    price: 0,
    stock: 0,
    category: 'Geral',
    trayCategoryId: 'cat_prof',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=400',
    active: true
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-xl rounded-[3rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-black mb-6">Configurar SKU</h2>
        <div className="space-y-4">
          <input className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="Nome do Produto" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="Preço" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
            <select className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" value={formData.trayCategoryId} onChange={e => setFormData({...formData, trayCategoryId: e.target.value})}>
              <option value="cat_prof">Profissional</option>
              <option value="cat_maint">Manutenção</option>
              <option value="cat_treat">Tratamento</option>
              <option value="cat_kits">Kits</option>
              <option value="cat_exclusive">VIP</option>
            </select>
          </div>
          <input className="w-full p-4 bg-slate-50 rounded-2xl border font-bold" placeholder="URL da Imagem" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
        </div>
        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} className="font-bold text-slate-400">Cancelar</button>
          <button onClick={() => onSave(formData)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-black">Salvar SKU</button>
        </div>
      </div>
    </div>
  );
};

const Backoffice: React.FC<BackofficeProps> = ({ cnpjs, onUpsertCnpj, products, onUpsertProduct, users, onUpsertUser }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'cnpjs' | 'catalog'>('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isCnpjModalOpen, setIsCnpjModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const pendingUsers = users.filter(u => u.role === 'REPRESENTATIVE' && u.cnpjs.length === 0);
  const activeUsers = users.filter(u => u.role === 'REPRESENTATIVE' && u.cnpjs.length > 0);

  const handleSeedDatabase = async () => {
    if (!confirm("Isso irá importar os dados de teste iniciais para o seu Firebase. Deseja continuar?")) return;
    setIsSeeding(true);
    try {
      for (const p of INITIAL_MOCK_PRODUCTS) await onUpsertProduct(p);
      for (const c of INITIAL_MOCK_CNPJS) await onUpsertCnpj(c);
      for (const u of INITIAL_MOCK_USERS) await onUpsertUser(u);
      alert("Banco de dados populado com sucesso!");
    } catch (e) {
      alert("Erro ao popular banco.");
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {isUserModalOpen && <UserModal user={selectedItem} allCnpjs={cnpjs} onClose={() => { setIsUserModalOpen(false); setSelectedItem(null); }} onSave={u => { onUpsertUser(u); setIsUserModalOpen(false); setSelectedItem(null); }} />}
      {isProductModalOpen && <ProductModal product={selectedItem} onClose={() => { setIsProductModalOpen(false); setSelectedItem(null); }} onSave={p => { onUpsertProduct(p); setIsProductModalOpen(false); setSelectedItem(null); }} />}
      {isCnpjModalOpen && <CNPJModal cnpj={selectedItem} onClose={() => { setIsCnpjModalOpen(false); setSelectedItem(null); }} onSave={c => { onUpsertCnpj(c); setIsCnpjModalOpen(false); setSelectedItem(null); }} />}

      <header className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Gestão Master</h1>
          <p className="text-slate-500 font-medium">Controle total sobre representantes, unidades e catálogo.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
             <button onClick={() => setActiveTab('users')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Vendedores</button>
             <button onClick={() => setActiveTab('cnpjs')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'cnpjs' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Unidades</button>
             <button onClick={() => setActiveTab('catalog')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'catalog' ? 'bg-slate-900 text-white' : 'text-slate-400'}`}>Catálogo</button>
          </div>
          {products.length === 0 && (
            <button 
              onClick={handleSeedDatabase} 
              disabled={isSeeding}
              className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 underline"
            >
              {isSeeding ? 'Importando...' : 'Importar Dados de Teste'}
            </button>
          )}
        </div>
      </header>

      {activeTab === 'users' && (
        <div className="space-y-10 animate-fade-in">
          {pendingUsers.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
                <h2 className="text-lg font-black text-slate-900 uppercase tracking-widest">Solicitações de Cadastro</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingUsers.map(u => (
                  <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border-2 border-amber-100 shadow-lg shadow-amber-500/5 flex items-center justify-between group">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-1 rounded-md">Pendente</span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{u.category || 'Geral'}</span>
                      </div>
                      <h3 className="font-black text-slate-900">{u.name}</h3>
                      <p className="text-xs text-slate-400 font-bold">{u.email}</p>
                    </div>
                    <button 
                      onClick={() => { setSelectedItem(u); setIsUserModalOpen(true); }} 
                      className="bg-slate-900 text-white px-5 py-3 rounded-xl text-xs font-black hover:bg-black transition-all"
                    >
                      Autorizar
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border mb-6">
              <h2 className="text-xl font-black">Vendedores Ativos</h2>
              <button onClick={() => { setSelectedItem(null); setIsUserModalOpen(true); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-2 active:scale-95 transition-all">Novo Representante</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeUsers.map(u => (
                <div key={u.id} className="bg-white p-8 rounded-[2.5rem] border flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-black text-slate-900">{u.name}</h3>
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">{u.category || 'Geral'}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-bold">{u.email}</p>
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {u.cnpjs.map(cid => (
                        <span key={cid} className="bg-slate-50 text-[9px] font-black uppercase p-1.5 border rounded-lg text-slate-500">
                          {cnpjs.find(c => c.id === cid)?.name || cid}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button onClick={() => { setSelectedItem(u); setIsUserModalOpen(true); }} className="p-3 bg-slate-50 text-slate-400 group-hover:text-emerald-600 rounded-xl transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'cnpjs' && (
        <div className="space-y-6 animate-fade-in">
           <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border">
              <h2 className="text-xl font-black">Unidades Cadastradas</h2>
              <button onClick={() => { setSelectedItem(null); setIsCnpjModalOpen(true); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black">Adicionar Unidade</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cnpjs.map(c => (
                <div key={c.id} className="bg-white p-8 rounded-[2.5rem] border flex items-center justify-between group hover:border-emerald-500/30">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div>
                         <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
                           {c.name}
                         </h3>
                         <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{c.number}</p>
                         <p className="text-[9px] font-black text-emerald-600 uppercase mt-1">Grupo: {c.trayGroupId}</p>
                      </div>
                   </div>
                   <button onClick={() => { setSelectedItem(c); setIsCnpjModalOpen(true); }} className="p-3 bg-slate-50 text-slate-400 group-hover:text-emerald-600 rounded-xl transition-all">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'catalog' && (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border">
            <h2 className="text-xl font-black">Produtos no Catálogo</h2>
            <button onClick={() => { setSelectedItem(null); setIsProductModalOpen(true); }} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black">Criar Novo SKU</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-[2rem] border overflow-hidden group hover:shadow-xl transition-all">
                <img src={p.image} className="w-full h-40 object-cover" alt={p.name} />
                <div className="p-6">
                  <h4 className="font-black text-sm text-slate-900 truncate">{p.name}</h4>
                  <p className="text-emerald-600 font-black text-lg mt-2">R$ {p.price.toFixed(2)}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">Grupo: {p.trayCategoryId}</span>
                    <button onClick={() => { setSelectedItem(p); setIsProductModalOpen(true); }} className="p-2 bg-slate-50 rounded-lg hover:bg-emerald-50"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Backoffice;
