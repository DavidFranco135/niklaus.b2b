
import React, { useState } from 'react';
import { User, Order, CNPJ } from '../types';

interface HistoryProps {
  user: User;
  orders: Order[];
  cnpjs: CNPJ[];
}

const History: React.FC<HistoryProps> = ({ user, orders, cnpjs }) => {
  const [filterCnpj, setFilterCnpj] = useState<string>('all');

  // user.cnpjs contains IDs as strings
  const userCnpjIds = user.cnpjs;
  const userOrders = orders.filter(o => userCnpjIds.includes(o.cnpjId));

  const filteredOrders = filterCnpj === 'all' 
    ? userOrders 
    : userOrders.filter(o => o.cnpjId === filterCnpj);

  // Get full CNPJ objects that the user is allowed to access
  const allowedUserCnpjs = cnpjs.filter(c => userCnpjIds.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Histórico de Pedidos</h1>
          <p className="text-gray-500 font-medium">Acompanhe todos os pedidos realizados no portal.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-black text-gray-400 uppercase tracking-widest">Filtrar:</label>
          <select 
            value={filterCnpj}
            onChange={(e) => setFilterCnpj(e.target.value)}
            className="bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-green-500/5 transition-all appearance-none"
          >
            <option value="all">Todos os CNPJs</option>
            {allowedUserCnpjs.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/50">
        {filteredOrders.length === 0 ? (
          <div className="p-20 text-center">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
             </div>
             <h3 className="text-xl font-black text-gray-800 tracking-tight">Nenhum pedido encontrado</h3>
             <p className="text-gray-500 mt-2 font-medium">Inicie suas compras no catálogo para visualizar os registros aqui.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="px-8 py-5">Pedido ID</th>
                  <th className="px-8 py-5">CNPJ Destino</th>
                  <th className="px-8 py-5">Data</th>
                  <th className="px-8 py-5">Total</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-6 font-mono text-sm font-bold text-green-700">{order.id}</td>
                    <td className="px-8 py-6">
                       <p className="text-sm font-bold text-gray-900 leading-tight">
                         {cnpjs.find(c => c.id === order.cnpjId)?.name || 'Unidade B2B'}
                       </p>
                       <p className="text-xs text-gray-400 mt-0.5">{order.cnpjNumber}</p>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-600 font-bold">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                    <td className="px-8 py-6 font-black text-gray-900 text-lg">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">Aguardando</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <a 
                        href={order.paymentLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-gray-200 hover:bg-black transition-all inline-flex items-center gap-2"
                      >
                        Pagar Agora
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
