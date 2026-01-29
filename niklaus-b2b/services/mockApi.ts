
import { Product, CNPJ, User, Order, CartItem, NewsPost } from '../types';

export const INITIAL_MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Shampoo Niklaus Pro 1L', price: 89.90, stock: 150, category: 'Profissional', trayCategoryId: 'cat_prof', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=400', active: true },
  { id: '2', name: 'Máscara Revitalizante 500g', price: 75.00, stock: 80, category: 'Tratamento', trayCategoryId: 'cat_treat', image: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=400', active: true },
  { id: '3', name: 'Kit Salão Master Premium', price: 450.00, stock: 45, category: 'Kits', trayCategoryId: 'cat_kits', image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=400', active: true },
  { id: '4', name: 'Sérum Ativador VIP', price: 890.00, stock: 10, category: 'Exclusivo', trayCategoryId: 'cat_exclusive', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400', active: true },
];

export const INITIAL_MOCK_CNPJS: CNPJ[] = [
  { id: 'c1', name: 'MATRIZ NIKLAUS', number: '12.345.678/0001-90', distributor: 'Distribuidora Norte', trayGroupId: 'group_basic' },
  { id: 'c2', name: 'UNIDADE SUL', number: '98.765.432/0001-21', distributor: 'Distribuidora Sul', trayGroupId: 'group_premium' },
  { id: 'c3', name: 'FRANQUIA VIP CENTRO', number: '11.222.333/0001-44', distributor: 'Logística Direta', trayGroupId: 'group_vip' },
];

export const INITIAL_MOCK_USERS: User[] = [
  { 
    id: 'u-master', 
    email: 'davidbhmg147@gmail.com', 
    name: 'David Admin', 
    role: 'ADMIN', 
    password: '135227',
    cnpjs: ['c1', 'c2', 'c3'] 
  },
  { 
    id: 'u1', 
    email: 'admin@niklaus.com.br', 
    name: 'Administrador Geral', 
    role: 'ADMIN', 
    password: 'admin',
    cnpjs: ['c1', 'c2', 'c3'] 
  },
  { 
    id: 'u2', 
    email: 'vendedor@test.com', 
    name: 'João Representante', 
    role: 'REPRESENTATIVE', 
    password: '123',
    cnpjs: ['c1'] 
  }
];

export const trayApi = {
  createOrder: async (cnpj: CNPJ, items: CartItem[], total: number): Promise<Order> => {
    const newOrder: Order = {
      id: `NKS-${Math.floor(Math.random() * 900000) + 100000}`,
      cnpjId: cnpj.id,
      cnpjNumber: cnpj.number,
      date: new Date().toISOString(),
      total,
      status: 'PENDING' as const,
      paymentLink: `https://checkout.tray.com.br/pay/${Math.random().toString(36).substring(7)}`,
      items
    };
    return new Promise<Order>(resolve => setTimeout(() => resolve(newOrder), 1500));
  }
};

export const b2bService = {
  getNews: async (): Promise<NewsPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      {
        id: '1',
        title: 'Lançamento: Linha Niklaus Pro 2025',
        content: 'Conheça a nova tecnologia de reconstrução capilar que está revolucionando os salões parceiros em todo o país.',
        date: new Date().toISOString(),
        imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=800'
      },
      {
        id: '2',
        title: 'Aviso Logístico: Feriado Nacional',
        content: 'Informamos que pedidos realizados entre os dias 15 e 17 terão prazo de entrega estendido em 48h.',
        date: new Date().toISOString(),
      }
    ];
  }
};
