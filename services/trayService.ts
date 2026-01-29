
import { Product, TrayCategory, CNPJ } from '../types';

// Mapeamento de permissões: Grupo Tray -> Categorias permitidas no B2B
const TRAY_GROUP_CONFIG: Record<string, { label: string, color: string, categories: string[] }> = {
  'group_basic': { 
    label: 'Lojista B2B', 
    color: 'bg-blue-500',
    categories: ['cat_prof', 'cat_maint'] 
  },
  'group_premium': { 
    label: 'Distribuidor Ouro', 
    color: 'bg-emerald-500',
    categories: ['cat_prof', 'cat_maint', 'cat_treat', 'cat_kits'] 
  },
  'group_vip': { 
    label: 'Parceiro VIP', 
    color: 'bg-purple-600',
    categories: ['cat_prof', 'cat_maint', 'cat_treat', 'cat_kits', 'cat_exclusive'] 
  }
};

// URL Base da sua API Tray (substitua pela sua quando tiver o token)
const TRAY_API_URL = 'https://api.tray.com.br'; 

export const trayService = {
  /**
   * Sincronização de Perfil
   * Integração real: Deve chamar GET /customers/{id} ou buscar por e-mail na Tray
   */
  fetchTrayBusinessContext: async (email: string): Promise<{ cnpjIds: string[], trayRules: any }> => {
    // Para produção: usar fetch(`${TRAY_API_URL}/customers?email=${email}`, { headers: { 'Authorization': `Bearer ${token}` } })
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    
    if (email.includes('vip')) {
      return { 
        cnpjIds: ['c1', 'c2', 'c3'], 
        trayRules: { group: 'group_vip', description: 'VIP detectado na Tray' } 
      };
    }
    return { 
      cnpjIds: ['c1'], 
      trayRules: { group: 'group_basic', description: 'Perfil Lojista Padrão' } 
    };
  },

  filterProductsByGroup: (allProducts: Product[], groupId: string = 'group_basic'): Product[] => {
    const config = TRAY_GROUP_CONFIG[groupId] || TRAY_GROUP_CONFIG['group_basic'];
    return allProducts.filter(p => config.categories.includes(p.trayCategoryId));
  },

  getAvailableCategories: async (groupId: string = 'group_basic'): Promise<TrayCategory[]> => {
    const allCategories = [
      { id: 'cat_prof', name: 'Linha Profissional' },
      { id: 'cat_maint', name: 'Manutenção' },
      { id: 'cat_treat', name: 'Tratamento' },
      { id: 'cat_kits', name: 'Kits Exclusivos' },
      { id: 'cat_exclusive', name: 'Exclusivo VIP' }
    ];
    const config = TRAY_GROUP_CONFIG[groupId] || TRAY_GROUP_CONFIG['group_basic'];
    return allCategories.filter(c => config.categories.includes(c.id));
  },

  getGroupLabel: (groupId?: string) => TRAY_GROUP_CONFIG[groupId || 'group_basic']?.label || 'Padrão',
  getGroupName: (groupId?: string) => TRAY_GROUP_CONFIG[groupId || 'group_basic']?.label || 'Padrão',
  getGroupColor: (groupId?: string) => TRAY_GROUP_CONFIG[groupId || 'group_basic']?.color || 'bg-slate-500'
};
