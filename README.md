
# 🚀 Niklaus B2B | Portal de Vendas Premium (NKS)

![Niklaus B2B](https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=1200)

O **Niklaus B2B** é um portal de faturamento corporativo desenhado para representantes e lojistas. O sistema foca em eliminar o re-cadastro manual em checkouts externos através da sincronização automática de dados com a Tray API.

## 💎 Funcionalidades de Elite

- **📦 Múltiplos CNPJs**: Troque de unidade de faturamento instantaneamente sem perder o carrinho.
- **🔌 Tray Sync Express**: Injeção automática de dados (CPF do Responsável, Razão Social, CEP e Endereço) no checkout.
- **🛡️ Portal Administrativo**: Gestão completa de catálogo (preço, estoque, imagens) e unidades B2B.
- **📰 News Feed**: Comunicados logísticos e novos lançamentos integrados.
- **💾 LocalStorage Database**: As edições feitas no portal Admin são salvas no navegador para persistência imediata.

## 🛠️ Stack Tecnológica

- **React 19**
- **TypeScript**
- **Tailwind CSS** (Layout Moderno & Responsivo)
- **Vite** (Ambiente de desenvolvimento ultrarápido)

## 🚀 Como Rodar Localmente

Para clonar e testar o projeto no seu computador:

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/niklaus-b2b-portal.git
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o projeto:**
   ```bash
   npm run dev
   ```

## ⚙️ Regras para o Auto-Fill Tray

Para que o cliente **não precise preencher nada** na Tray, os seguintes campos devem estar completos no portal Admin:
- **Dados de Identificação**: Nome completo do responsável e CPF.
- **Dados da Empresa**: Razão Social e CNPJ.
- **Endereço**: CEP, Logradouro, Número, Bairro, Cidade e UF.

---
Desenvolvido por **Niklaus Professional Team**.
