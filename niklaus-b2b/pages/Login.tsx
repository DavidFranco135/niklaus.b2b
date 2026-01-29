import React, { useState } from 'react';

interface LoginProps {
  onLogin: (email: string, password?: string) => void;
  onRegister: (name: string, category: string, email: string, password?: string) => void;
}

export const USER_CATEGORIES = [
  'Salão de Beleza',
  'Barbearia',
  'Estética',
  'Revendedor Individual',
  'Distribuidor Regional',
  'E-commerce'
];

const Login: React.FC<LoginProps> = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [category, setCategory] = useState(USER_CATEGORIES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      onRegister(name, category, email, password);
      setIsRegister(false);
    } else {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      <div className="hidden lg:flex lg:w-3/5 bg-slate-900 relative p-20 flex-col justify-between">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl font-black">NK</div>
            <span className="text-white text-xl font-bold tracking-tighter uppercase">Niklaus B2B</span>
          </div>
          <h1 className="text-6xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
            {isRegister ? 'JUNTE-SE À' : 'NIKLAUS>NKS'} <br/>
            <span className="text-emerald-500">{isRegister ? 'REDE NK.' : 'NK.'}</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-lg leading-relaxed">
            {isRegister 
              ? 'Cadastre-se para solicitar acesso ao catálogo exclusivo e condições especiais para lojistas.' 
              : 'Portal de faturamento integrado para representantes oficiais Niklaus Professional.'}
          </p>
        </div>
        
        <div className="relative z-10 flex gap-10">
           <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Tecnologia Tray API</div>
           <div className="text-white/40 text-[10px] font-black uppercase tracking-widest">Faturamento Multi-CNPJ</div>
        </div>
      </div>

      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              {isRegister ? 'Criar Nova Conta' : 'Acesso Restrito'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isRegister ? 'Preencha os dados para iniciar seu pedido de acesso.' : 'Acesse seu painel de vendas Niklaus.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isRegister && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all shadow-sm font-bold" 
                    placeholder="Seu nome ou nome da empresa" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Tipo de Negócio</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all shadow-sm font-bold"
                    required
                  >
                    {USER_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all shadow-sm font-bold" 
                placeholder="exemplo@niklaus.com.br" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Senha</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition-all shadow-sm font-bold" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <button className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-xl transition-all shadow-xl shadow-slate-200 active:scale-95">
              {isRegister ? 'Solicitar Cadastro' : 'Acessar Catálogo'}
            </button>
            
            <div className="pt-6 text-center border-t border-slate-200">
               <button 
                 type="button" 
                 onClick={() => setIsRegister(!isRegister)} 
                 className="text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors"
               >
                 {isRegister ? 'Já tem uma conta? Faça Login' : 'Ainda não tem conta? Cadastre-se'}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;