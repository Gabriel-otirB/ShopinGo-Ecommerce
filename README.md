# 🛒 Shopingo
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Concluído-brightgreen)

**Shopingo** é uma plataforma web full stack de **e-commerce**, desenvolvida com foco na venda de produtos diversos. O sistema oferece controle de usuários, integração com **Supabase** e pagamentos via **Stripe**, além de um painel administrativo completo para gerenciamento de produtos e usuários.

https://github.com/user-attachments/assets/a99c7ba7-4e74-41a4-afc4-a944a300dc1c

## 🚀 Teste você mesmo!
- Acessar Loja: [Shopingo](https://shopin-go-ecommerce.vercel.app/)

## ✨ Funcionalidades Principais

- Cadastro e gerenciamento de produtos com **upload de imagens**
- Autenticação de usuários via **Supabase Auth** (incluindo login com Google)
- Carrinho de compras integrado e finalização via **Stripe Checkout**
- Painel de administração para controle de produtos e usuários
- Reviews e avaliações de produtos comprados por usuários
- Listagem e visualização de pedidos e histórico de compras
- Sistema de controle de permissões de usuários (cliente/admin)
- Upload de imagens armazenado em **Supabase Storage**

## 🛠️ Tecnologias Utilizadas

- **Next.js** – Framework React para aplicações web
- **TypeScript** – Superset do JavaScript que adiciona tipagem estática ao código
- **Tailwind CSS** – Estilização moderna e responsiva
- **Supabase** – Autenticação, banco de dados e storage
- **Stripe** – Processamento de pagamentos online
- **Shadcn UI** – Componentes de interface acessíveis e elegantes

## 🔐 Autenticação e Segurança

A aplicação utiliza **Supabase Auth** para autenticação de usuários, com suporte a autenticação social via Google e gerenciamento de sessões seguras.

## 💳 Pagamentos

Os pagamentos são processados via **Stripe**, com integração completa para checkout, controle de preços e sincronização com o banco de dados de produtos.

## 📦 Banco de Dados

O sistema utiliza **PostgreSQL** no **Supabase**, com as seguintes tabelas principais:

- **products**
- **orders**
- **orders_items**
- **profiles**
- **addresses**

E um bucket de storage público chamado:
- **product-images**

![Database](https://github.com/user-attachments/assets/060ca1c5-3a7e-4d34-b8aa-8559ee5319a7)

### Estrutura e criação do banco de dados

O esquema do banco de dados está definido no arquivo SQL localizado em:

`./db/shopingo.sql`

Esse script cria todas as tabelas necessárias para o funcionamento da aplicação, incluindo:

- Enumeração personalizada `role` para papéis de usuário (`admin`, `customer`, `manager`)
- Tabelas:
  - `addresses` — endereços de entrega
  - `profiles` — perfis de usuários vinculados à autenticação do Supabase
  - `products` — catálogo de produtos com atributos variados e integração Stripe
  - `orders` — registros de pedidos com dados do endereço e status
  - `orders_items` — itens dentro de cada pedido
  - `reviews` — avaliações feitas pelos usuários sobre os produtos comprados

#### Como aplicar o schema

Para criar as tabelas no seu banco Supabase, execute o script SQL diretamente no editor SQL do painel do Supabase ou via linha de comando, por exemplo:
```
psql -h db.supabase.co -U seu_usuario -d nome_do_banco -f ./db/shopingo.sql
```
Ou cole todo o conteúdo em **SQL Editor** do Supabase e execute.

---

## 📱 Layout e Interface

A interface foi desenvolvida com **Tailwind CSS** e **Shadcn UI**, proporcionando um visual moderno, limpo e responsivo, ideal para qualquer dispositivo.


