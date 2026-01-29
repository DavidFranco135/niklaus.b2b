import React, { useState, useEffect } from 'react';
import { User, CNPJ, Product, CartItem, Order } from './types';
import { INITIAL_MOCK_PRODUCTS, INITIAL_MOCK_CNPJS, INITIAL_MOCK_USERS, trayApi } from './services/mockApi';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import News from './pages/News';
import Backoffice from './pages/Backoffice';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import CNPJSelector from './components/CNPJSelector';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCnpj, setSelectedCnpj] = useState<CNPJ | null>(null);
  const [currentPage, setCurrentPage] = useState<'catalog' | 'history' | 'news' | 'backoffice'>('catalog');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCnpjModalOpen, setIsCnpjModalOpen] = useState(false);
  
  // Estado local que substitui o Firestore
  const [products, setProducts] = useState<Product[]>([]);
  const [cnpjs, setCnpjs] = useState<CNPJ[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Inicialização do Sistema (Lógica Mock)
  useEffect(() => {
    const initData = () => {
      // Carregar do localStorage ou usar Mocks iniciais
      const storedProducts = localStorage.getItem('nk_products');
      const storedCnpjs = localStorage.getItem('nk_cnpjs');
      const storedUsers = localStorage.getItem('nk_users');
      const storedOrders = localStorage.getItem('nk_orders');
      const sessionUser = sessionStorage.getItem('nk_session_user');

      setProducts(storedProducts ? JSON.parse(storedProducts) : INITIAL_MOCK_PRODUCTS);
      setCnpjs(storedCnpjs ? JSON.parse(storedCnpjs) : INITIAL_MOCK_CNPJS);
      setUsers(storedUsers ? JSON.parse(storedUsers) : INITIAL_MOCK_USERS);
      setOrders(storedOrders ? JSON.parse(storedOrders) : []);

      if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }
      
      setLoading(false);
    };

    initData();
  }, []);

  // Persistência Local para simular "Banco de Dados"
  useEffect(() => { if (products.length) localStorage.setItem('nk_products', JSON.stringify(products)); }, [products]);
  useEffect(() => { if (cnpjs.length) localStorage.setItem('nk_cnpjs', JSON.stringify(cnpjs)); }, [cnpjs]);
  useEffect(() => { if (users.length) localStorage.setItem('nk_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { if (orders.length) localStorage.setItem('nk_orders', JSON.stringify(orders)); }, [orders]);

  const handleLogin = async (email: string, password?: string) => {
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('nk_session_user', JSON.stringify(foundUser));
      setIsCnpjModalOpen(true);
    } else {
      alert("Erro ao acessar: E-mail ou senha inválidos.");
    }
  };

  const handleRegister = async (name: string, category: string, email: string, password?: string) => {
    if (users.some(u => u.email === email)) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      category,
      email,
      password: password || '123',
      role: 'REPRESENTATIVE',
      cnpjs: []
    };

    setUsers(prev => [...prev, newUser]);
    alert("Cadastro solicitado com sucesso! Entre em contato com o administrador para liberação.");
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCnpj(null);
    setCurrentPage('catalog');
    sessionStorage.removeItem('nk_session_user');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black animate-pulse">
      CARREGANDO PORTAL NIKLAUS...
    </div>
  );

  if (!user) return <Login onLogin={handleLogin} onRegister={handleRegister} />;

  const allowedCnpjs = cnpjs.filter(c => user.role === 'ADMIN' || user.cnpjs.includes(c.id));

  if (user.role !== 'ADMIN' && allowedCnpjs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
          <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">Acesso em Análise</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-4">Olá, <strong>{user.name}</strong>!</p>
          <p className="text-slate-400 text-sm mb-6">Categoria: {user.category || 'Não definida'}</p>
          <p className="text-slate-500 font-medium leading-relaxed mb-8">Seu cadastro foi recebido. Entre em contato com o suporte para liberar suas unidades.</p>
          <button onClick={handleLogout} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all">Sair do Portal</button>
        </div>
      </div>
    );
  }

  if (!selectedCnpj || isCnpjModalOpen) {
    return (
      <CNPJSelector 
        cnpjs={allowedCnpjs} 
        onSelect={(c) => { setSelectedCnpj(c); setIsCnpjModalOpen(false); setCart([]); }} 
        currentSelection={selectedCnpj}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} userRole={user.role} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar user={user} selectedCnpj={selectedCnpj} onSwitchCnpj={() => setIsCnpjModalOpen(true)} onLogout={handleLogout} cartCount={cart.length} />
        <main className="flex-1 overflow-y-auto p-6 md:p-10 animate-fade-in">
          {currentPage === 'catalog' && (
            <Dashboard 
              cnpj={selectedCnpj} 
              products={products}
              cart={cart}
              onAddToCart={(p) => setCart(prev => {
                const ex = prev.find(i => i.id === p.id);
                return ex ? prev.map(i => i.id === p.id ? {...i, quantity: i.quantity + 1} : i) : [...prev, {...p, quantity: 1}];
              })} 
              onUpdateQuantity={(id, delta) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + delta)} : i))}
              onRemoveFromCart={(id) => setCart(prev => prev.filter(i => i.id !== id))}
              onClearCart={() => setCart([])}
              onOrderCreated={(order) => setOrders(prev => [order, ...prev])}
            />
          )}
          {currentPage === 'history' && <History user={user} orders={orders} cnpjs={cnpjs} />}
          {currentPage === 'news' && <News />}
          {currentPage === 'backoffice' && user.role === 'ADMIN' && (
            <Backoffice 
              cnpjs={cnpjs}
              onUpsertCnpj={(c) => setCnpjs(prev => prev.some(x => x.id === c.id) ? prev.map(x => x.id === c.id ? c : x) : [...prev, c])}
              products={products}
              onUpsertProduct={(p) => setProducts(prev => prev.some(x => x.id === p.id) ? prev.map(x => x.id === p.id ? p : x) : [...prev, p])}
              users={users}
              onUpsertUser={(u) => setUsers(prev => prev.some(x => x.id === u.id) ? prev.map(x => x.id === u.id ? u : x) : [...prev, u])}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;