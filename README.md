# Sykron CRM

CRM comercial da Sykron, assessoria em melhoria contínua e alta gestão que entrega soluções empresariais em processos, sistemas e automações. A interface inclui dashboard, pipeline Kanban, busca e cadastro de oportunidades com dados demonstrativos locais.

## Executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Supabase

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e preencha a URL e a chave publicável.

O esquema usa RLS e `organization_id` para isolar os dados de cada cliente. A interface continua em modo demonstração até a autenticação e os repositórios de dados serem conectados.
