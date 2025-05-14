# 🛒 Shopingo
![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?logo=stripe)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css)
![Status](https://img.shields.io/badge/Status-Em%20desenvolvimento-yellow)

**Shopingo** é uma plataforma web full stack de **e-commerce**, desenvolvida com foco na venda de produtos diversos. O sistema oferece controle de usuários, integração com **Supabase** e pagamentos via **Stripe**, além de um painel administrativo completo para gerenciamento de produtos e usuários.

https://github.com/user-attachments/assets/ad4a3b5a-3f1c-4fcb-8a9a-68c435d2eb2f

## 🚀 Teste você mesmo!
- Acessar Loja: [Shopingo](https://shopingo.vercel.app/)

## ✨ Funcionalidades Principais

- Cadastro e gerenciamento de produtos com **upload de imagens**
- Autenticação de usuários via **Supabase Auth** (incluindo login com Google)
- Carrinho de compras integrado e finalização via **Stripe Checkout**
- Painel de administração para controle de produtos e usuários
- Listagem e visualização de pedidos e histórico de compras
- Sistema de controle de permissões de usuários (cliente/admin)
- Upload de imagens armazenado em **Supabase Storage**

### 🔜 Em breve:
- Avaliação e sistema de comentários nos produtos
- Migrations com Prisma ORM

## 🛠️ Tecnologias Utilizadas

- **Next.js** – Framework React para aplicações web
- **TypeScript**
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

![image](https://github.com/user-attachments/assets/72798a07-3a6b-4033-ad6f-db84c03c9c67)

## 📱 Layout e Interface

A interface foi desenvolvida com **Tailwind CSS** e **Shadcn UI**, proporcionando um visual moderno, limpo e responsivo, ideal para qualquer dispositivo.


