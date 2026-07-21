# Sykron CRM

CRM comercial da Sykron, assessoria em melhoria continua e alta gestao que entrega solucoes empresariais em processos, sistemas e automacoes.

A interface inclui modulos navegaveis para visao geral, funil de vendas, contatos, empresas, tarefas e solucoes. O cadastro rapido de oportunidades funciona com dados demonstrativos locais.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave publicavel.

O esquema usa RLS e `organization_id` para isolar os dados de cada cliente. A interface continua em modo demonstracao ate a autenticacao e os repositorios de dados serem conectados.
