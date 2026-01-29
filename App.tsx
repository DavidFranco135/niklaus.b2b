import React, { useState, useEffect } from 'react';
import { User, CNPJ, Product, CartItem, Order } from './types';
import { trayApi } from './services/mockApi';
import { db } from './services/firebase';
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  query, 
  orderBy,
  addDoc
} from 'firebase/firestore';

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
  
  const [products, setProducts] = useState<Product[]>([]);
  const [cnpjs, setCnpjs] = useState<CNPJ[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Sincronização com Firestore
  useEffect(() => {
    if (!db) return;

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(data);
    });

    const unsubCnpjs = onSnapshot(collection(db, 'cnpjs'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CNPJ));
      setCnpjs(data);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
      setUsers(data);
    });

    const qOrders = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(data);
    });

    // Restaurar sessão do usuário
    const sessionUser = sessionStorage.getItem('nk_session_user');
    if (sessionUser) {
      setUser(JSON.parse(sessionUser));
    }

    setLoading(false);

    return () => {
      unsubProducts();
      unsubCnpjs();
      unsubUsers();
      unsubOrders();
    };
  }, []);

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

    try {
      await setDoc(doc(db!, 'users', newUser.id), newUser);
      alert("Cadastro solicitado com sucesso! Entre em contato com o administrador para liberação.");
    } catch (e) {
      alert("Erro ao salvar cadastro no Firebase.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCnpj(null);
    setCurrentPage('catalog');
    sessionStorage.removeItem('nk_session_user');
  };

  const handleUpsertProduct = async (p: Product) => {
    await setDoc(doc(db!, 'products', p.id), p);
  };

  const handleUpsertCnpj = async (c: CNPJ) => {
    await setDoc(doc(db!, 'cnpjs', c.id), c);
  };

  const handleUpsertUser = async (u: User) => {
    await setDoc(doc(db!, 'users', u.id), u);
  };

  const handleOrderCreated = async (order: Order) => {
    await setDoc(doc(db!, 'orders', order.id), order);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-900 text-white font-black animate-pulse">
      CONECTANDO AO FIREBASE NIKLAUS...
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
          <p className="text-slate-400 text-sm mb-6">Status: Aguardando liberação de CNPJs</p>
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
              onOrderCreated={handleOrderCreated}
            />
          )}
          {currentPage === 'history' && <History user={user} orders={orders} cnpjs={cnpjs} />}
          {currentPage === 'news' && <News />}
          {currentPage === 'backoffice' && user.role === 'ADMIN' && (
            <Backoffice 
              cnpjs={cnpjs}
              onUpsertCnpj={handleUpsertCnpj}
              products={products}
              onUpsertProduct={handleUpsertProduct}
              users={users}
              onUpsertUser={handleUpsertUser}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
