"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  ContactRound,
  LayoutDashboard,
  ListTodo,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";

type Deal = {
  id: number;
  company: string;
  title: string;
  value: number;
  stage: string;
  temperature: string;
  bucket: string;
  nextContact: string;
  history: string;
  person: string;
  initials: string;
  color: string;
  due: string;
  tag: string;
  historyTimeline: string;
  interactions?: Interaction[];
};

type Interaction = {
  id: string;
  date: string;
  type: string;
  detail: string;
  pain?: string;
  objection?: string;
  solution?: string;
  next?: string;
  returnDate?: string;
  status?: string;
  temperature?: string;
  owner?: string;
  link?: string;
};

type Company = {
  name: string;
  segment: string;
  size: string;
  pain: string;
  fit: string;
  owner: string;
  value: number;
};

type Contact = {
  name: string;
  company: string;
  role: string;
  phone: string;
  email: string;
  status: string;
  next: string;
};

type Task = {
  time: string;
  title: string;
  company: string;
  type: string;
  priority: string;
  done?: boolean;
};

type Solution = {
  name: string;
  category: string;
  description: string;
  price: string;
  leads: number;
};

type Prospect = {
  company: string;
  segment: string;
  size: string;
  whatsapp: string;
  site: string;
  contactHint: string;
  ease: string;
  source: string;
  pain: string;
  status: string;
  temperature: string;
  channel: string;
  nextAction: string;
  message: string;
  historyTimeline?: string;
  lastInteraction?: string;
  nextReturn?: string;
  potential?: number;
  interactions?: Interaction[];
};

type EntityKind = "prospect" | "deal" | "contact" | "company" | "task" | "solution";
type EditorState = { kind: EntityKind; key: string; mode: "view" | "edit" };
type Draft = Record<string, string>;
type EditorField = { name: string; label: string; type?: "text" | "number" | "select" | "textarea"; options?: string[] };

const stages = ["Lead novo", "Primeiro contato", "Diagnostico realizado", "Proposta enviada", "Em negociacao", "Fechado", "Perdido", "Pos-venda / relacionamento"];
const stageAliases: Record<string, string> = {
  "Novos leads": "Lead novo",
  Diagnostico: "Diagnostico realizado",
  Proposta: "Proposta enviada",
  Negociacao: "Em negociacao",
};
const normalizeStage = (stage: string) => stageAliases[stage] || stage;
const salesTemperatures = ["Super quente", "Quente", "Morno", "Frio", "Bolsao"];
const returnPeriodByTemperature: Record<string, string> = {
  "Super quente": "Hoje",
  Quente: "3 dias",
  Morno: "7 dias",
  Frio: "15 dias",
  Bolsao: "30 dias",
};

const initialDeals: Deal[] = [
  { id: 1, company: "Isabela Rocha Estetica", title: "Controle simples de agenda e retornos", value: 1800, stage: "Novos leads", temperature: "Super quente", bucket: "Hoje", nextContact: "Hoje - enviar primeira mensagem", history: "Lead facil. WhatsApp publico. Primeira abordagem deve focar em agenda, retornos e controle de avaliacoes.", person: "Jefferson", initials: "IR", color: "#00b9f2", due: "Hoje", tag: "Agenda", historyTimeline: "22/07/2026 - Pesquisa inicial - WhatsApp publico identificado - Objecao ainda nao mapeada - Proximo: enviar abordagem curta.\n22/07/2026 - Hipotese de dor - Agenda e retornos podem estar soltos no WhatsApp - Proximo: oferecer diagnostico simples." },
  { id: 2, company: "Caninos Pet Shop", title: "Mini CRM de banho, tosa e pacotes", value: 2400, stage: "Diagnostico", temperature: "Quente", bucket: "3 dias", nextContact: "Em 3 dias - confirmar interesse", history: "Negocio recorrente com banho, tosa, hotel e taxi dog. Proposta inicial: planilha/CRM simples de clientes recorrentes.", person: "Jefferson", initials: "CP", color: "#e9784d", due: "3 dias", tag: "Follow-up", historyTimeline: "22/07/2026 - Diagnostico preliminar - Servicos recorrentes identificados - Objecao provavel: medo de ferramenta complicada - Proximo: mostrar modelo visual simples.\n22/07/2026 - Ideia de oferta - Controle de pacotes, agenda e lembretes - Proximo: validar rotina atual." },
  { id: 3, company: "Fino Faro Pet Shop", title: "Controle de delivery e recompra", value: 2200, stage: "Diagnostico", temperature: "Morno", bucket: "7 dias", nextContact: "Em 7 dias - enviar exemplo visual", history: "Tem delivery e WhatsApp. Dor provavel: pedidos, agendamentos e recompra de produtos sem acompanhamento.", person: "Jefferson", initials: "FF", color: "#198f78", due: "7 dias", tag: "Automacao", historyTimeline: "22/07/2026 - Pesquisa inicial - Delivery e atendimento por WhatsApp identificados - Proximo: abordar com controle de pedidos e recompra.\n22/07/2026 - Aprendizado da conta - Oferta deve ser pequena e operacional - Proximo: perguntar como controlam pedidos hoje." },
  { id: 4, company: "CampoClin", title: "Indicadores de agenda e conversao", value: 3500, stage: "Proposta", temperature: "Frio", bucket: "15 dias", nextContact: "Em 15 dias - retomar com diagnostico", history: "Clinica com varias especialidades e agenda por WhatsApp. Pode exigir decisao mais formal, mas a dor e clara.", person: "Jefferson", initials: "CC", color: "#bd6db5", due: "15 dias", tag: "Indicadores", historyTimeline: "22/07/2026 - Pesquisa inicial - Varias especialidades e agenda por WhatsApp - Objecao provavel: decisao mais formal - Proximo: identificar gestor responsavel.\n22/07/2026 - Possivel proposta - Indicadores de agenda, conversao e salas - Proximo: abordagem consultiva sem pressao." },
  { id: 5, company: "Vet Center Sorocaba", title: "Controle de retornos e servicos recorrentes", value: 3200, stage: "Proposta", temperature: "Bolsao", bucket: "30 dias", nextContact: "Em 30 dias - nutrir com caso de uso", history: "Clinica veterinaria 24h com muitos pontos de contato. Comecar pequeno: lembretes e retornos.", person: "Jefferson", initials: "VC", color: "#d59823", due: "30 dias", tag: "Retencao", historyTimeline: "22/07/2026 - Pesquisa inicial - Atendimento 24h e servicos recorrentes - Proximo: nutrir com exemplo de lembretes.\n22/07/2026 - Hipotese de dor - Retornos, vacinas, banho e exames podem precisar de controle - Proximo: aguardar momento melhor." },
  { id: 6, company: "L.A English Idiomas & Musica", title: "Funil de aulas demonstrativas", value: 2100, stage: "Negociacao", temperature: "Super quente", bucket: "Hoje", nextContact: "Hoje - pedir responsavel comercial", history: "Escola local com aula demonstrativa. Boa entrada para organizar interessados, follow-up e rematriculas.", person: "Jefferson", initials: "LA", color: "#3c7dd9", due: "Hoje", tag: "Funil", historyTimeline: "22/07/2026 - Pesquisa inicial - Aula demonstrativa e varios cursos - Proximo: pedir responsavel comercial.\n22/07/2026 - Oferta sugerida - Funil de interessados, follow-up e rematriculas - Proximo: enviar exemplo de controle." },
];

const companies: Company[] = [
  { name: "Clinica Aurora", segment: "Saude", size: "35 colaboradores", pain: "Indicadores dispersos e baixa visibilidade da agenda", fit: "Alto", owner: "Marina", value: 8900 },
  { name: "Vertice Imoveis", segment: "Servicos", size: "18 colaboradores", pain: "Gestao comercial em planilhas desconectadas", fit: "Alto", owner: "Rafael", value: 12400 },
  { name: "Almeida Contabil", segment: "Contabilidade", size: "52 colaboradores", pain: "Falta de BI financeiro para alta gestao", fit: "Muito alto", owner: "Jefferson", value: 15600 },
  { name: "Norte Solar", segment: "Energia", size: "41 colaboradores", pain: "Operacao comercial sem integracao entre etapas", fit: "Muito alto", owner: "Jefferson", value: 18900 },
];

const contacts: Contact[] = [
  { name: "Ana Ribeiro", company: "Clinica Aurora", role: "Diretora administrativa", phone: "(11) 98820-1010", email: "ana@aurora.com", status: "Lead quente", next: "Enviar escopo do dashboard" },
  { name: "Carlos Mendes", company: "Vertice Imoveis", role: "Socio diretor", phone: "(11) 97771-2288", email: "carlos@vertice.com", status: "Diagnostico", next: "Mapear fluxo comercial" },
  { name: "Patricia Almeida", company: "Almeida Contabil", role: "CEO", phone: "(11) 95510-4242", email: "patricia@almeida.com", status: "Proposta", next: "Apresentar BI financeiro" },
  { name: "Lucas Torres", company: "Norte Solar", role: "Gerente comercial", phone: "(11) 94482-8311", email: "lucas@nortesolar.com", status: "Negociacao", next: "Definir cronograma" },
];

const tasks: Task[] = [
  { time: "10:30", title: "Reuniao de diagnostico", company: "Vertice Imoveis", type: "Reuniao", priority: "Alta" },
  { time: "14:00", title: "Apresentar proposta comercial", company: "Almeida Contabil", type: "Proposta", priority: "Alta" },
  { time: "16:30", title: "Follow-up da negociacao", company: "Norte Solar", type: "Ligacao", priority: "Media" },
  { time: "Amanha", title: "Montar roteiro de descoberta", company: "Clinica Aurora", type: "Planejamento", priority: "Media", done: true },
];

const solutions: Solution[] = [
  { name: "Diagnostico empresarial", category: "Alta gestao", description: "Levantamento de dores, gargalos, riscos e oportunidades de melhoria.", price: "A partir de R$ 1.500", leads: 4 },
  { name: "Mapeamento de processos", category: "Processos", description: "Desenho do fluxo atual, padronizacao e plano de evolucao operacional.", price: "A partir de R$ 2.800", leads: 3 },
  { name: "Automacao de rotinas", category: "Automacao", description: "Eliminacao de tarefas repetitivas em propostas, controles e follow-ups.", price: "A partir de R$ 3.500", leads: 5 },
  { name: "Sistema sob medida", category: "Sistemas", description: "Aplicacoes internas para controlar operacoes que planilhas ja nao sustentam.", price: "Projeto fechado", leads: 2 },
  { name: "BI e dashboards", category: "Inteligencia", description: "Indicadores executivos para decisao rapida, confiavel e visual.", price: "A partir de R$ 4.500", leads: 6 },
  { name: "Integracoes entre sistemas", category: "Tecnologia", description: "Conexao entre ferramentas para reduzir retrabalho e inconsistencias.", price: "Projeto fechado", leads: 3 },
];

const prospects: Prospect[] = [
  {
    company: "Isabela Rocha Estetica",
    segment: "Clinica de estetica",
    size: "Negocio local com agenda por WhatsApp",
    whatsapp: "(15) 99672-2491",
    site: "https://esteticasorocaba.com.br/contato/",
    contactHint: "Chamar pelo WhatsApp pedindo para falar com responsavel pela agenda/atendimento.",
    ease: "Muito facil - dor simples de explicar: agenda, retorno e no-show.",
    source: "Site oficial - WhatsApp publico",
    pain: "Agenda, retornos de avaliacao e acompanhamento de pacientes podem se perder no WhatsApp sem controle de follow-up.",
    status: "1o contato",
    temperature: "Super quente",
    channel: "WhatsApp",
    nextAction: "Oferecer diagnostico gratuito de agenda e retornos",
    message: "Oi, tudo bem? Vi que voces trabalham com agendamentos e avaliacoes por WhatsApp. Eu sou da Sykron, aqui de Sorocaba, e ajudo pequenos negocios a organizar agenda, retornos e follow-ups sem complicar. Posso te mandar uma ideia simples de melhoria para reduzir esquecimentos e aumentar retorno de clientes?",
  },
  {
    company: "Caninos Pet Shop",
    segment: "Pet shop, banho, tosa e hotel",
    size: "26 anos, agendamento por WhatsApp",
    whatsapp: "(15) 98800-0892",
    site: "https://petshopcaninos.com.br/",
    contactHint: "WhatsApp direto para agendamento; abordar como melhoria de rotina, nao como sistema grande.",
    ease: "Muito facil - servico recorrente, agenda e taxi dog.",
    source: "Site oficial - WhatsApp publico",
    pain: "Banho, tosa, hotel, creche e taxi dog exigem agenda organizada, lembretes e retorno recorrente dos tutores.",
    status: "1o contato",
    temperature: "Quente",
    channel: "WhatsApp",
    nextAction: "Oferecer planilha/mini CRM de agenda e retorno",
    message: "Oi, tudo bem? Vi que a Caninos tem banho e tosa, creche, hotel e taxi dog. Esse tipo de rotina costuma depender muito de agenda e lembrete no WhatsApp. A Sykron pode montar um controle simples para retornos, pacotes e lembretes de clientes. Posso te mostrar um modelo bem rapido?",
  },
  {
    company: "Fino Faro Pet Shop",
    segment: "Pet shop, banho, tosa e delivery",
    size: "Loja local com delivery e WhatsApp",
    whatsapp: "(15) 99611-1325",
    site: "https://finofarosorocaba.com.br/",
    contactHint: "Contato direto no WhatsApp/celular; oferta inicial deve ser pequena e pratica.",
    ease: "Muito facil - delivery + banho e tosa geram controle manual.",
    source: "Site oficial - WhatsApp publico",
    pain: "Pedidos por delivery, agendamentos de banho e tosa e recompra de produtos podem virar lista manual sem acompanhamento.",
    status: "1o contato",
    temperature: "Quente",
    channel: "WhatsApp",
    nextAction: "Oferecer controle de delivery, agendamentos e recompra",
    message: "Oi, tudo bem? Vi que voces trabalham com pet shop, banho e tosa e delivery. A Sykron ajuda negocios locais a organizar pedidos, agendamentos e retornos de clientes em um controle simples. Posso te mandar uma sugestao bem pratica para facilitar a rotina do WhatsApp?",
  },
  {
    company: "Belle Petit Pet Salon",
    segment: "Banho e tosa premium",
    size: "Salao pet local com agendamento por WhatsApp",
    whatsapp: "(15) 99818-9097",
    site: "https://bellepetit.com.br/",
    contactHint: "Chamar oferecendo organizacao de agenda e pacotes recorrentes.",
    ease: "Muito facil - decisao provavelmente com dono/gestor local.",
    source: "Site oficial - WhatsApp publico",
    pain: "Atendimento por horario, pacotes recorrentes e orcamentos personalizados podem precisar de lembretes e controle de clientes.",
    status: "1o contato",
    temperature: "Quente",
    channel: "WhatsApp",
    nextAction: "Enviar ideia de agenda + lembrete automatico",
    message: "Oi, tudo bem? Vi que o agendamento da Belle Petit e feito pelo WhatsApp e que voces trabalham com atendimento premium. A Sykron pode ajudar com um controle simples de agenda, retorno e pacotes recorrentes, sem sistema complicado. Posso te mostrar uma ideia?",
  },
  {
    company: "CampoClin",
    segment: "Clinica de especialidades",
    size: "8 especialidades e mais de 1 mil consultas por ano",
    whatsapp: "(15) 99618-1557",
    site: "https://campoclin.com.br/",
    contactHint: "WhatsApp responde pacientes; propor melhoria de agenda e conversao.",
    ease: "Facil - dor clara, mas clinica pode ter decisao um pouco mais formal.",
    source: "Site oficial - WhatsApp publico",
    pain: "Consultas com hora marcada, retorno por WhatsApp, locacao de salas e profissionais diferentes exigem organizacao de agenda e indicadores.",
    status: "1o contato",
    temperature: "Morno",
    channel: "WhatsApp",
    nextAction: "Oferecer diagnostico de agenda, salas e conversao",
    message: "Oi, tudo bem? Vi que a CampoClin trabalha com varias especialidades, agenda por WhatsApp e locacao de salas. A Sykron pode ajudar a organizar agenda, retornos e indicadores simples de atendimento. Posso te mandar uma sugestao de melhoria sem compromisso?",
  },
  {
    company: "Vet Center Sorocaba",
    segment: "Clinica veterinaria 24h",
    size: "Atendimento 24h com banho, tosa, exames e farmacia",
    whatsapp: "(15) 3233-1083",
    site: "https://www.vetcentersorocaba.com.br/",
    contactHint: "WhatsApp publico; abordagem deve focar em lembretes, retornos e organizacao.",
    ease: "Facil - muitos servicos recorrentes e urgencias.",
    source: "Site oficial - WhatsApp publico",
    pain: "Consultas, banho e tosa, farmacia, exames e retornos criam varios pontos de contato que podem ser organizados em um fluxo simples.",
    status: "1o contato",
    temperature: "Morno",
    channel: "WhatsApp",
    nextAction: "Propor controle de retornos, vacinas e servicos recorrentes",
    message: "Oi, tudo bem? Vi que a Vet Center tem atendimento 24h e varios servicos para pets. A Sykron pode ajudar com um controle simples de retornos, lembretes e acompanhamento de clientes pelo WhatsApp. Posso te mandar uma ideia pratica?",
  },
  {
    company: "Vetlab Sorocaba",
    segment: "Laboratorio veterinario",
    size: "Mais de 20 anos, exames e resultados digitais",
    whatsapp: "(15) 99727-2218",
    site: "https://vetlabsorocaba.com.br/",
    contactHint: "Chamar com proposta de organizar pedidos, retornos de exame e parceiros.",
    ease: "Facil - rotina de exames tem status, prazos e resultado.",
    source: "Site oficial - WhatsApp publico",
    pain: "Agendamentos de exames, resultados por WhatsApp/e-mail e parcerias com veterinarios podem ganhar controle de status e prazos.",
    status: "1o contato",
    temperature: "Morno",
    channel: "WhatsApp",
    nextAction: "Oferecer quadro simples de status dos exames e retornos",
    message: "Oi, tudo bem? Vi que a Vetlab agenda exames e entrega resultados digitais. A Sykron pode ajudar com um controle simples de status, prazos e retornos para melhorar a visibilidade da rotina. Posso te mostrar uma sugestao rapida?",
  },
  {
    company: "L.A English Idiomas & Musica",
    segment: "Escola de idiomas e musica",
    size: "Escola local com aula demonstrativa",
    whatsapp: "(15) 99117-5760",
    site: "https://www.laenglish.com.br/",
    contactHint: "Chamar sobre controle de leads de aula demonstrativa e rematricula.",
    ease: "Facil - venda recorrente, leads de aulas e follow-up.",
    source: "Site oficial - WhatsApp publico",
    pain: "Aulas demonstrativas, novos alunos, rematriculas e acompanhamento de interessados precisam de funil simples para nao perder contatos.",
    status: "1o contato",
    temperature: "Super quente",
    channel: "WhatsApp",
    nextAction: "Oferecer funil simples para interessados e rematriculas",
    message: "Oi, tudo bem? Vi que voces trabalham com aulas demonstrativas e varios cursos. A Sykron pode montar um controle simples para interessados, follow-ups e rematriculas, ajudando a nao perder contatos do WhatsApp. Posso te mandar um exemplo?",
  },
  {
    company: "FACOP Sorocaba",
    segment: "Clinica odontologica e cursos",
    size: "Recepcao e comercial com WhatsApp publico",
    whatsapp: "(15) 99164-0202",
    site: "https://facopsorocaba.com.br/agendamento/",
    contactHint: "Comecar pela recepcao; pedir responsavel por agenda/comercial.",
    ease: "Media facil - tem varios WhatsApps e rotina clara de triagem.",
    source: "Site oficial - WhatsApp publico",
    pain: "Triagem de pacientes, agenda de avaliacao, cursos e contatos comerciais podem precisar de follow-up organizado.",
    status: "Pesquisa",
    temperature: "Frio",
    channel: "WhatsApp",
    nextAction: "Validar responsavel por agenda e comercial",
    message: "Oi, tudo bem? Vi que a FACOP tem triagem, agendamento e canais comerciais por WhatsApp. A Sykron pode ajudar a organizar os contatos, retornos e indicadores de atendimento em um controle simples. Quem seria a pessoa ideal para eu apresentar essa ideia?",
  },
  {
    company: "RPM Entregas Rapidas",
    segment: "Entregas rapidas e armazenagem",
    size: "Base em Sorocaba, frota propria e galpao",
    whatsapp: "(15) 98102-6224",
    site: "https://rpmentregas.com.br/",
    contactHint: "WhatsApp publico; propor controle simples de pedidos e ocorrencias.",
    ease: "Media facil - B2B local com dor operacional objetiva.",
    source: "Site oficial - WhatsApp publico",
    pain: "Entregas, rastreio, armazenamento e solicitacoes por WhatsApp podem precisar de status, prazos e controle de clientes.",
    status: "Pesquisa",
    temperature: "Frio",
    channel: "WhatsApp",
    nextAction: "Oferecer controle de pedidos, status e follow-up B2B",
    message: "Oi, tudo bem? Vi que a RPM trabalha com entregas, rastreio e armazenagem. A Sykron pode ajudar com um controle simples de pedidos, status e retornos para clientes, sem implantar um sistema pesado. Posso te mandar uma ideia pratica?",
  },
  {
    company: "Sorridents Sorocaba",
    segment: "Clinica odontologica",
    size: "Clinica com avaliacao gratuita e WhatsApp",
    whatsapp: "(15) 99744-1135",
    site: "https://www.implantesdentariossorocaba.com.br/",
    contactHint: "Chamar pelo WhatsApp oferecendo melhoria de conversao de avaliacao gratuita.",
    ease: "Media facil - boa dor comercial, mas pode ter padrao de franquia.",
    source: "Site oficial - WhatsApp publico",
    pain: "Avaliacoes gratuitas, agendamento imediato e retorno de interessados pedem funil de atendimento para melhorar conversao.",
    status: "Nutrir",
    temperature: "Bolsao",
    channel: "WhatsApp",
    nextAction: "Enviar abordagem sobre conversao de avaliacoes",
    message: "Oi, tudo bem? Vi que voces trabalham com avaliacao gratuita e agendamento pelo WhatsApp. A Sykron pode ajudar a organizar interessados, retornos e indicadores de conversao em um controle simples. Posso te mandar uma sugestao?",
  },
];

const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);
const whatsappHref = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "#";
  return `https://wa.me/${digits.startsWith("55") ? digits : `55${digits}`}`;
};
const temperatureClass = (temperature: string) => temperature.toLowerCase().replace("super quente", "super-hot").replace("quente", "hot").replace("morno", "warm").replace("frio", "cold").replace("bolsao", "pool");
const historySteps = (timeline: string) => timeline.split("\n").map((line) => line.trim()).filter(Boolean);
const latestHistoryStep = (timeline: string) => historySteps(timeline).at(-1) || "Nenhuma interacao registrada.";
const parseInteractions = (raw?: string) => {
  if (!raw) return [] as Interaction[];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as Interaction[] : [];
  } catch {
    return [] as Interaction[];
  }
};
const legacyInteraction = (line: string, index: number): Interaction => {
  const parts = line.split(" - ");
  return { id: `legacy-${index}`, date: parts[0] || "Data nao informada", type: parts[1] || "Contato", detail: (parts.slice(2).join(" - ") || line).replace("Aprendizado da conta", "Analise da oportunidade") };
};
const timelineInteractions = (timeline: string, raw?: string) => {
  const structured = parseInteractions(raw);
  return structured.length ? structured : historySteps(timeline).map(legacyInteraction);
};

const nav = [
  ["Visao geral", LayoutDashboard],
  ["Prospeccao", Users],
  ["Funil de vendas", Target],
  ["Contatos", ContactRound],
  ["Empresas", BriefcaseBusiness],
  ["Tarefas", ListTodo],
  ["Solucoes", WandSparkles],
] as const;

const editorFields: Record<EntityKind, EditorField[]> = {
  prospect: [
    { name: "company", label: "Empresa" },
    { name: "segment", label: "Segmento" },
    { name: "size", label: "Porte" },
    { name: "whatsapp", label: "WhatsApp" },
    { name: "site", label: "Site" },
    { name: "contactHint", label: "Como abordar", type: "textarea" },
    { name: "ease", label: "Facilidade do lead", type: "textarea" },
    { name: "source", label: "Origem" },
    { name: "pain", label: "Dor provavel", type: "textarea" },
    { name: "status", label: "Status", type: "select", options: ["Pesquisa", "1o contato", "Follow-up 1", "Nutrir", "Qualificado"] },
    { name: "temperature", label: "Temperatura", type: "select", options: salesTemperatures },
    { name: "channel", label: "Canal", type: "select", options: ["WhatsApp", "E-mail", "Ligacao", "LinkedIn"] },
    { name: "nextAction", label: "Proxima acao" },
    { name: "lastInteraction", label: "Ultima interacao" },
    { name: "nextReturn", label: "Proximo retorno" },
    { name: "potential", label: "Potencial estimado", type: "number" },
    { name: "message", label: "Mensagem sugerida", type: "textarea" },
  ],
  deal: [
    { name: "company", label: "Empresa" },
    { name: "title", label: "Solucao identificada" },
    { name: "value", label: "Valor estimado", type: "number" },
    { name: "stage", label: "Etapa", type: "select", options: stages },
    { name: "temperature", label: "Temperatura", type: "select", options: salesTemperatures },
    { name: "nextContact", label: "Proximo contato" },
    { name: "person", label: "Responsavel" },
    { name: "due", label: "Proxima acao" },
    { name: "tag", label: "Tipo de solucao" },
    { name: "history", label: "Historico da negociacao", type: "textarea" },
  ],
  contact: [
    { name: "name", label: "Nome" },
    { name: "company", label: "Empresa" },
    { name: "role", label: "Cargo" },
    { name: "phone", label: "Telefone" },
    { name: "email", label: "E-mail" },
    { name: "status", label: "Status" },
    { name: "next", label: "Proxima acao" },
  ],
  company: [
    { name: "name", label: "Empresa" },
    { name: "segment", label: "Segmento" },
    { name: "size", label: "Porte" },
    { name: "pain", label: "Dor principal", type: "textarea" },
    { name: "fit", label: "Encaixe", type: "select", options: ["Muito alto", "Alto", "Medio", "Baixo"] },
    { name: "owner", label: "Responsavel" },
    { name: "value", label: "Valor potencial", type: "number" },
  ],
  task: [
    { name: "time", label: "Quando" },
    { name: "title", label: "Tarefa" },
    { name: "company", label: "Empresa" },
    { name: "type", label: "Tipo" },
    { name: "priority", label: "Prioridade", type: "select", options: ["Alta", "Media", "Baixa"] },
  ],
  solution: [
    { name: "name", label: "Solucao" },
    { name: "category", label: "Categoria" },
    { name: "description", label: "Descricao", type: "textarea" },
    { name: "price", label: "Preco" },
    { name: "leads", label: "Leads vinculados", type: "number" },
  ],
};

const emptyDrafts: Record<EntityKind, Draft> = {
  prospect: { company: "", segment: "", size: "", whatsapp: "", site: "", contactHint: "", ease: "", source: "", pain: "", status: "Pesquisa", temperature: "Morno", channel: "WhatsApp", nextAction: "", lastInteraction: "Ainda nao registrado", nextReturn: "Definir retorno", potential: "0", message: "" },
  deal: { company: "", title: "", value: "0", stage: "Lead novo", temperature: "Morno", bucket: "7 dias", nextContact: "Definir novo contato", person: "Jefferson", due: "Novo", tag: "Solucao", history: "", historyTimeline: "", interactions: "" },
  contact: { name: "", company: "", role: "", phone: "", email: "", status: "Novo", next: "" },
  company: { name: "", segment: "", size: "", pain: "", fit: "Alto", owner: "Jefferson", value: "0" },
  task: { time: "", title: "", company: "", type: "", priority: "Media" },
  solution: { name: "", category: "", description: "", price: "", leads: "0" },
};

const entityLabels: Record<EntityKind, string> = {
  prospect: "lead",
  deal: "oportunidade",
  contact: "contato",
  company: "empresa",
  task: "tarefa",
  solution: "solucao",
};

export default function Home() {
  const [active, setActive] = useState("Visao geral");
  const [deals, setDeals] = useState(initialDeals);
  const [prospectList, setProspectList] = useState(prospects);
  const [companyList, setCompanyList] = useState(companies);
  const [contactList, setContactList] = useState(contacts);
  const [taskList, setTaskList] = useState(tasks);
  const [solutionList, setSolutionList] = useState(solutions);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ company: "", title: "", value: "", stage: "Lead novo" });
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [draft, setDraft] = useState<Draft>({});

  useEffect(() => {
    const overlayOpen = modal || Boolean(editor);
    if (!overlayOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [modal, editor]);

  const filteredDeals = useMemo(() => {
    const term = query.toLowerCase();
    return deals.filter((deal) => `${deal.company} ${deal.title} ${deal.tag} ${deal.temperature} ${deal.bucket} ${deal.history}`.toLowerCase().includes(term));
  }, [deals, query]);

  const filteredCompanies = useMemo(() => {
    const term = query.toLowerCase();
    return companyList.filter((company) => `${company.name} ${company.segment} ${company.pain}`.toLowerCase().includes(term));
  }, [companyList, query]);

  const filteredContacts = useMemo(() => {
    const term = query.toLowerCase();
    return contactList.filter((contact) => `${contact.name} ${contact.company} ${contact.status}`.toLowerCase().includes(term));
  }, [contactList, query]);

  const filteredSolutions = useMemo(() => {
    const term = query.toLowerCase();
    return solutionList.filter((solution) => `${solution.name} ${solution.category} ${solution.description}`.toLowerCase().includes(term));
  }, [solutionList, query]);

  const filteredProspects = useMemo(() => {
    const term = query.toLowerCase();
    return prospectList.filter((prospect) => `${prospect.company} ${prospect.segment} ${prospect.pain} ${prospect.status} ${prospect.whatsapp} ${prospect.ease}`.toLowerCase().includes(term));
  }, [prospectList, query]);

  const total = deals.reduce((sum, deal) => sum + deal.value, 0);
  const openTasks = taskList.filter((task) => !task.done).length;

  function addDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.title) return;

    setDeals((prev) => [
      ...prev,
      {
        id: Date.now(),
        company: form.company,
        title: form.title,
        value: Number(form.value) || 0,
        stage: form.stage,
        temperature: "Morno",
        bucket: returnPeriodByTemperature.Morno,
        nextContact: "Definir proximo contato",
        history: "Oportunidade criada manualmente. Registrar conversas, objecoes e combinados aqui.",
        historyTimeline: "22/07/2026 - Criacao manual - Oportunidade criada diretamente no funil - Objecao ainda nao mapeada - Definir proximo contato",
        interactions: [],
        person: "Jefferson",
        initials: form.company.slice(0, 2).toUpperCase(),
        color: "#00b9f2",
        due: "Novo",
        tag: "Solucao",
      },
    ]);
    setForm({ company: "", title: "", value: "", stage: "Lead novo" });
    setModal(false);
    setToast("Oportunidade criada com sucesso");
    setTimeout(() => setToast(""), 2800);
  }

  function keyFor(kind: EntityKind, item: Deal | Prospect | Contact | Company | Task | Solution) {
    if (kind === "deal") return String((item as Deal).id);
    if (kind === "contact") return (item as Contact).email;
    if (kind === "task") return `${(item as Task).company}-${(item as Task).title}`;
    if (kind === "company") return (item as Company).name;
    if (kind === "solution") return (item as Solution).name;
    return (item as Prospect).company;
  }

  function draftFrom(kind: EntityKind, item: Deal | Prospect | Contact | Company | Task | Solution): Draft {
    if (kind === "deal") {
      const deal = item as Deal;
      return { company: deal.company, title: deal.title, value: String(deal.value), stage: normalizeStage(deal.stage), temperature: deal.temperature, bucket: deal.bucket, nextContact: deal.nextContact, person: deal.person, due: deal.due, tag: deal.tag, history: deal.history, historyTimeline: deal.historyTimeline, interactions: JSON.stringify(deal.interactions || []) };
    }

    if (kind === "prospect") {
      const prospect = item as Prospect;
      return { company: prospect.company, segment: prospect.segment, size: prospect.size, whatsapp: prospect.whatsapp, site: prospect.site, contactHint: prospect.contactHint, ease: prospect.ease, source: prospect.source, pain: prospect.pain, status: prospect.status, temperature: prospect.temperature, channel: prospect.channel, nextAction: prospect.nextAction, lastInteraction: prospect.lastInteraction || "Pesquisa inicial", nextReturn: prospect.nextReturn || "Definir retorno", potential: String(prospect.potential || 0), historyTimeline: prospect.historyTimeline || "", interactions: JSON.stringify(prospect.interactions || []), message: prospect.message };
    }

    if (kind === "company") {
      const company = item as Company;
      return { name: company.name, segment: company.segment, size: company.size, pain: company.pain, fit: company.fit, owner: company.owner, value: String(company.value) };
    }

    if (kind === "solution") {
      const solution = item as Solution;
      return { name: solution.name, category: solution.category, description: solution.description, price: solution.price, leads: String(solution.leads) };
    }

    return { ...(item as Draft) };
  }

  function openRecord(kind: EntityKind, item: Deal | Prospect | Contact | Company | Task | Solution, mode: "view" | "edit" = "view") {
    setEditor({ kind, key: keyFor(kind, item), mode });
    setDraft(draftFrom(kind, item));
  }

  function newRecord(kind: EntityKind) {
    setEditor({ kind, key: "__new__", mode: "edit" });
    setDraft({ ...emptyDrafts[kind] });
  }

  function saveEditor(e: React.FormEvent) {
    e.preventDefault();
    if (!editor) return;

    const isNew = editor.key === "__new__";
    let saveMessage = `${entityLabels[editor.kind]} salvo com sucesso`;

    if (editor.kind === "prospect") {
      const selectedTemperature = draft.temperature || "Morno";
      const next: Prospect = {
        company: draft.company || "Novo lead",
        segment: draft.segment || "Segmento nao informado",
        size: draft.size || "Porte nao informado",
        whatsapp: draft.whatsapp || "",
        site: draft.site || "",
        contactHint: draft.contactHint || "Validar responsavel antes de apresentar a solucao.",
        ease: draft.ease || "Facilidade ainda nao classificada.",
        source: draft.source || "Manual",
        pain: draft.pain || "Dor ainda nao mapeada.",
        status: draft.status || "Pesquisa",
        temperature: selectedTemperature,
        channel: draft.channel || "WhatsApp",
        nextAction: draft.nextAction || "Definir proxima acao",
        lastInteraction: draft.lastInteraction || "Ainda nao registrado",
        nextReturn: draft.nextReturn || "Definir retorno",
        potential: Number(draft.potential) || 0,
        historyTimeline: draft.historyTimeline || "",
        interactions: parseInteractions(draft.interactions),
        message: draft.message || "Mensagem consultiva ainda nao definida.",
      };
      setProspectList((prev) => isNew ? [next, ...prev] : prev.map((item) => keyFor("prospect", item) === editor.key ? next : item));

      if (next.status === "Qualificado") {
        const returnPeriod = returnPeriodByTemperature[selectedTemperature] || "7 dias";
        const qualifiedDeal: Deal = {
          id: Date.now(),
          company: next.company,
          title: `Diagnostico Sykron - ${next.segment}`,
          value: 1800,
          stage: "Lead novo",
          temperature: selectedTemperature,
          bucket: returnPeriod,
          nextContact: `${returnPeriod} - ${next.nextAction}`,
          history: `Lead qualificado a partir da prospeccao. Dor provavel: ${next.pain} Abordagem sugerida: ${next.message}`,
          historyTimeline: `22/07/2026 - Lead qualificado - Veio da prospeccao com status Qualificado - Dor: ${next.pain} - Proximo: ${next.nextAction}`,
          interactions: parseInteractions(draft.interactions),
          person: "Jefferson",
          initials: next.company.slice(0, 2).toUpperCase(),
          color: "#00b9f2",
          due: returnPeriod,
          tag: "Diagnostico",
        };

        setDeals((prev) => {
          const existing = prev.find((deal) => deal.company.toLowerCase() === next.company.toLowerCase());
          if (!existing) return [qualifiedDeal, ...prev];

          return prev.map((deal) => deal.company.toLowerCase() === next.company.toLowerCase()
            ? {
                ...deal,
                temperature: selectedTemperature,
                bucket: returnPeriod,
                nextContact: `${returnPeriod} - ${next.nextAction}`,
                history: `${deal.history} Atualizado pela prospeccao: lead marcado como Qualificado. Dor provavel: ${next.pain}`,
                historyTimeline: `${deal.historyTimeline}\n22/07/2026 - Atualizacao pela prospeccao - Lead marcado como Qualificado - Dor: ${next.pain} - Proximo: ${next.nextAction}`,
                interactions: deal.interactions || [],
                due: returnPeriod,
              }
            : deal);
        });
        setActive("Funil de vendas");
        saveMessage = "Lead qualificado e enviado ao funil";
      }
    }

    if (editor.kind === "deal") {
      const selectedTemperature = draft.temperature || "Morno";
      const returnPeriod = returnPeriodByTemperature[selectedTemperature] || "7 dias";
      const next: Deal = {
        id: isNew ? Date.now() : Number(editor.key),
        company: draft.company || "Nova empresa",
        title: draft.title || "Nova oportunidade",
        value: Number(draft.value) || 0,
        stage: normalizeStage(draft.stage || "Lead novo"),
        temperature: selectedTemperature,
        bucket: returnPeriod,
        nextContact: draft.nextContact || `Retornar em ${returnPeriod}`,
        history: draft.history || "Historico ainda nao registrado.",
        historyTimeline: draft.historyTimeline || "",
        interactions: parseInteractions(draft.interactions),
        person: draft.person || "Jefferson",
        initials: (draft.company || "NE").slice(0, 2).toUpperCase(),
        color: "#00b9f2",
        due: draft.due || "Novo",
        tag: draft.tag || "Solucao",
      };
      setDeals((prev) => isNew ? [next, ...prev] : prev.map((item) => String(item.id) === editor.key ? next : item));
    }

    if (editor.kind === "contact") {
      const next: Contact = {
        name: draft.name || "Novo contato",
        company: draft.company || "Empresa nao informada",
        role: draft.role || "Cargo nao informado",
        phone: draft.phone || "",
        email: draft.email || `contato-${Date.now()}@sykron.local`,
        status: draft.status || "Novo",
        next: draft.next || "Definir proxima acao",
      };
      setContactList((prev) => isNew ? [next, ...prev] : prev.map((item) => keyFor("contact", item) === editor.key ? next : item));
    }

    if (editor.kind === "company") {
      const next: Company = {
        name: draft.name || "Nova empresa",
        segment: draft.segment || "Segmento nao informado",
        size: draft.size || "Porte nao informado",
        pain: draft.pain || "Dor ainda nao mapeada.",
        fit: draft.fit || "Alto",
        owner: draft.owner || "Jefferson",
        value: Number(draft.value) || 0,
      };
      setCompanyList((prev) => isNew ? [next, ...prev] : prev.map((item) => keyFor("company", item) === editor.key ? next : item));
    }

    if (editor.kind === "task") {
      const next: Task = {
        time: draft.time || "Hoje",
        title: draft.title || "Nova tarefa",
        company: draft.company || "Empresa nao informada",
        type: draft.type || "Atividade",
        priority: draft.priority || "Media",
      };
      setTaskList((prev) => isNew ? [next, ...prev] : prev.map((item) => keyFor("task", item) === editor.key ? next : item));
    }

    if (editor.kind === "solution") {
      const next: Solution = {
        name: draft.name || "Nova solucao",
        category: draft.category || "Consultoria",
        description: draft.description || "Descricao ainda nao definida.",
        price: draft.price || "A definir",
        leads: Number(draft.leads) || 0,
      };
      setSolutionList((prev) => isNew ? [next, ...prev] : prev.map((item) => keyFor("solution", item) === editor.key ? next : item));
    }

    setEditor(null);
    setToast(saveMessage);
    setTimeout(() => setToast(""), 2800);
  }

  return (
    <div className="app-shell">
      <aside className={menu ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <div className="brand-mark"><span className="sykron-diamond" /></div>
          <span>SYKRON</span>
          <button className="close-mobile" onClick={() => setMenu(false)} aria-label="Fechar menu"><X size={20} /></button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">SY</div>
          <div><b>Sykron</b><small>Inteligencia Empresarial</small></div>
          <ChevronDown size={15} />
        </div>

        <nav>
          <small className="nav-label">GESTAO</small>
          {nav.map(([label, Icon]) => (
            <button key={label} className={active === label ? "active" : ""} onClick={() => { setActive(label); setMenu(false); }}>
              <Icon size={18} />
              <span>{label}</span>
              {label === "Tarefas" && <em>{openTasks}</em>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade">
            <Sparkles size={20} />
            <b>Meta Sykron</b>
            <p>{brl(total)} de R$ 100 mil em oportunidades neste mes.</p>
            <button onClick={() => setActive("Funil de vendas")}>Ver planejamento</button>
          </div>
          <button className="settings"><Settings size={18} /> Configuracoes</button>
          <div className="profile"><div className="profile-avatar">JO</div><div><b>Jefferson Oliveira</b><small>Administrador</small></div><MoreHorizontal size={18} /></div>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="menu-mobile" onClick={() => setMenu(true)} aria-label="Abrir menu"><Menu size={22} /></button>
          <div className="search"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar clientes, oportunidades..." /></div>
          <button className="icon-btn" aria-label="Notificacoes"><Bell size={19} /><span /></button>
          <button className="primary" onClick={() => setModal(true)}><Plus size={18} /> Nova oportunidade</button>
        </header>

        <div className="content">
          <section className="welcome">
            <div>
              <p className="eyebrow">SYKRON - INTELIGENCIA EMPRESARIAL</p>
              <h1>{active}</h1>
              <p>{moduleSubtitle(active)}</p>
            </div>
            <button className="secondary"><CalendarDays size={17} /> Ultimos 30 dias <ChevronDown size={15} /></button>
          </section>

          {active === "Visao geral" && (
            <Overview deals={filteredDeals} total={total} prospectCount={prospectList.length} contactCount={contactList.length} companyCount={companyList.length} solutionCount={solutionList.length} setActive={setActive} setModal={setModal} />
          )}

          {active === "Prospeccao" && (
            <ProspectionModule prospects={filteredProspects} onOpen={(prospect) => openRecord("prospect", prospect)} onEdit={(prospect) => openRecord("prospect", prospect, "edit")} onAddInteraction={(prospect) => openRecord("prospect", prospect, "edit")} onNew={() => newRecord("prospect")} />
          )}

          {active === "Funil de vendas" && (
            <PipelineModule deals={filteredDeals} setForm={setForm} setModal={setModal} onOpen={(deal) => openRecord("deal", deal)} onEdit={(deal) => openRecord("deal", deal, "edit")} onAddInteraction={(deal) => openRecord("deal", deal, "edit")} />
          )}

          {active === "Contatos" && (
            <ContactsModule contacts={filteredContacts} onOpen={(contact) => openRecord("contact", contact)} onEdit={(contact) => openRecord("contact", contact, "edit")} onNew={() => newRecord("contact")} />
          )}

          {active === "Empresas" && (
            <CompaniesModule companies={filteredCompanies} onOpen={(company) => openRecord("company", company)} onEdit={(company) => openRecord("company", company, "edit")} onNew={() => newRecord("company")} />
          )}

          {active === "Tarefas" && (
            <TasksModule tasks={taskList} onOpen={(task) => openRecord("task", task)} onEdit={(task) => openRecord("task", task, "edit")} onNew={() => newRecord("task")} />
          )}

          {active === "Solucoes" && (
            <SolutionsModule solutions={filteredSolutions} onOpen={(solution) => openRecord("solution", solution)} onEdit={(solution) => openRecord("solution", solution, "edit")} onNew={() => newRecord("solution")} />
          )}
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={() => setModal(false)}>
          <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div><span className="modal-icon"><BriefcaseBusiness size={20} /></span><div><h2>Nova oportunidade</h2><p>Adicione uma negociacao ao seu pipeline.</p></div></div>
              <button onClick={() => setModal(false)} aria-label="Fechar"><X size={20} /></button>
            </div>
            <form onSubmit={addDeal}>
              <label>Empresa<input autoFocus placeholder="Ex.: Empresa Horizonte" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label>
              <label>Solucao identificada<input placeholder="Ex.: Redesenho do processo comercial" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <div className="form-row">
                <label>Valor estimado<input type="number" placeholder="R$ 0" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></label>
                <label>Etapa<select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
              </div>
              <div className="modal-actions"><button type="button" className="cancel" onClick={() => setModal(false)}>Cancelar</button><button className="primary" type="submit"><Plus size={17} /> Criar oportunidade</button></div>
            </form>
          </div>
        </div>
      )}

      {editor && (
        <RecordEditor
          editor={editor}
          draft={draft}
          setDraft={setDraft}
          onClose={() => setEditor(null)}
          onEdit={() => setEditor({ ...editor, mode: "edit" })}
          onSubmit={saveEditor}
        />
      )}

      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}

function Overview({ deals, total, prospectCount, contactCount, companyCount, solutionCount, setActive, setModal }: { deals: Deal[]; total: number; prospectCount: number; contactCount: number; companyCount: number; solutionCount: number; setActive: (view: string) => void; setModal: (open: boolean) => void }) {
  const hotDeals = deals.filter((deal) => deal.temperature === "Super quente" || deal.temperature === "Quente").length;
  const proposalDeals = deals.filter((deal) => normalizeStage(deal.stage) === "Proposta enviada").length;
  const openDeals = deals.filter((deal) => !["Fechado", "Perdido"].includes(normalizeStage(deal.stage))).length;
  const closedDeals = deals.filter((deal) => normalizeStage(deal.stage) === "Fechado").length;
  const overdueDeals = deals.filter((deal) => /atrasad/i.test(`${deal.due} ${deal.nextContact}`)).length;
  const upcomingVisits = deals.filter((deal) => ["Hoje", "3 dias"].includes(deal.bucket)).length;

  return (
    <>
      <section className="metrics">
        <Metric icon={Users} label="Total de leads" value={String(prospectCount)} note="Base de prospeccao" color="green" />
        <Metric icon={TrendingUp} label="Leads quentes" value={String(hotDeals)} note="Quente ou super quente" up color="orange" />
        <Metric icon={Target} label="Propostas enviadas" value={String(proposalDeals)} note="Aguardando decisao" color="blue" />
        <Metric icon={CircleDollarSign} label="Negociacoes abertas" value={String(openDeals)} note={brl(total)} color="cyan" />
        <Metric icon={CircleDollarSign} label="Fechamentos do mes" value={String(closedDeals)} note="Negocios ganhos" up color="green" />
        <Metric icon={Clock3} label="Follow-ups atrasados" value={String(overdueDeals)} note="Prioridade de hoje" color="orange" />
        <Metric icon={CalendarDays} label="Proximas visitas" value={String(upcomingVisits)} note="Hoje ou em 3 dias" color="blue" />
        <Metric icon={CircleDollarSign} label="Valor potencial" value={brl(total)} note="Pipeline em andamento" up color="cyan" />
      </section>

      <section className="module-grid">
        <button className="module-card" onClick={() => setActive("Prospeccao")}><Users size={21} /><b>Prospeccao</b><span>Leads, dores e cadencias consultivas</span><strong>{prospectCount} leads</strong></button>
        <button className="module-card" onClick={() => setActive("Funil de vendas")}><Target size={21} /><b>Funil de vendas</b><span>Kanban por etapa comercial</span><strong>{brl(total)}</strong></button>
        <button className="module-card" onClick={() => setActive("Contatos")}><ContactRound size={21} /><b>Contatos</b><span>Decisores e proximas conversas</span><strong>{contactCount} contatos</strong></button>
        <button className="module-card" onClick={() => setActive("Empresas")}><BriefcaseBusiness size={21} /><b>Empresas</b><span>Clientes potenciais e dores</span><strong>{companyCount} contas</strong></button>
        <button className="module-card" onClick={() => setActive("Solucoes")}><WandSparkles size={21} /><b>Solucoes</b><span>Portfolio comercial Sykron</span><strong>{solutionCount} ofertas</strong></button>
      </section>

      <section className="bottom-grid">
        <div className="panel tasks-panel">
          <div className="panel-head"><div><h2>Proximas atividades</h2><p>Prioridades para avancar propostas</p></div><button onClick={() => setActive("Tarefas")}>Ver todas <ChevronRight size={16} /></button></div>
          {tasks.slice(0, 3).map((task) => <Activity key={`${task.company}-${task.time}`} {...task} />)}
        </div>
        <div className="panel automations-panel">
          <div className="panel-head"><div><h2>Portifolio Sykron</h2><p>Inteligencia aplicada ao negocio</p></div><div className="zap-icon"><Zap size={18} /></div></div>
          <div className="automation-stat"><div className="bot-icon"><Bot size={23} /></div><div><b>{solutions.length}</b><span>solucoes empresariais</span></div><div><b>{deals.length}</b><span>projetos no pipeline</span></div></div>
          <div className="automation-item"><span className="status-dot" /><div><b>BI, dashboards e indicadores</b><small>Dados transformados em decisao</small></div><em>6 leads</em></div>
          <div className="automation-item"><span className="status-dot" /><div><b>Sistemas, integracoes e automacao</b><small>Operacoes conectadas de ponta a ponta</small></div><em>5 leads</em></div>
          <button className="wide-action" onClick={() => setModal(true)}><Plus size={16} /> Criar oportunidade</button>
        </div>
      </section>
    </>
  );
}

function ProspectionModule({ prospects, onOpen, onEdit, onAddInteraction, onNew }: { prospects: Prospect[]; onOpen: (prospect: Prospect) => void; onEdit: (prospect: Prospect) => void; onAddInteraction: (prospect: Prospect) => void; onNew: () => void }) {
  const hotLeads = prospects.filter((prospect) => prospect.temperature === "Super quente" || prospect.temperature === "Quente").length;

  return (
    <section className="prospection-stack">
      <div className="metrics prospect-metrics">
        <Metric icon={Users} label="Leads mapeados" value={String(prospects.length)} note="Base consultiva" color="cyan" />
        <Metric icon={TrendingUp} label="Acao rapida" value={String(hotLeads)} note="Super quente ou quente" up color="green" />
        <Metric icon={Clock3} label="Follow-ups" value="2" note="Proximas 48 horas" color="orange" />
        <Metric icon={Target} label="Meta da semana" value="8" note="Diagnosticos agendados" color="blue" />
      </div>

      <section className="prospection-layout">
        <div className="panel data-panel">
          <div className="panel-head"><div><h2>Leads priorizados</h2><p>Empresas com dor provavel antes de virar oportunidade</p></div><button onClick={onNew}>Novo lead <ChevronRight size={16} /></button></div>
          <div className="prospect-list">
            {prospects.map((prospect) => (
              <article className="prospect-card" key={prospect.company}>
                <div className="prospect-main">
                  <div className="row-avatar">{prospect.company.slice(0, 2).toUpperCase()}</div>
                  <div><h3>{prospect.company}</h3><span>{prospect.segment} - {prospect.size}</span></div>
                </div>
                <div className="prospect-tags"><em>{prospect.temperature}</em><strong>{prospect.status}</strong><span>{prospect.channel}</span></div>
                <div className="contact-strip">
                  <a href={whatsappHref(prospect.whatsapp)} target="_blank" rel="noreferrer">WhatsApp {prospect.whatsapp}</a>
                  {prospect.site && <a href={prospect.site} target="_blank" rel="noreferrer">Site</a>}
                </div>
                <div className="ease-box"><small>Por que e mais facil</small><b>{prospect.ease}</b><span>{prospect.contactHint}</span></div>
                <div className="pain-box"><small>Dor provavel</small><b>{prospect.pain}</b></div>
                <div className="prospect-followup"><span><small>Ultima interacao</small>{prospect.lastInteraction || "Pesquisa inicial"}</span><span><small>Proximo retorno</small>{prospect.nextReturn || `Em ${returnPeriodByTemperature[prospect.temperature] || "7 dias"}`}</span><strong>{prospect.potential ? brl(prospect.potential) : brl(prospect.temperature === "Super quente" ? 2800 : prospect.temperature === "Quente" ? 2200 : 1800)}</strong></div>
                <footer><span>{prospect.source}</span><strong>{prospect.nextAction}</strong></footer>
                <div className="record-actions"><button onClick={() => onOpen(prospect)}>Abrir historico</button><button className="interaction-action" onClick={() => onAddInteraction(prospect)}>Registrar interacao</button><button onClick={() => onEdit(prospect)}>Editar</button></div>
              </article>
            ))}
          </div>
        </div>

        <aside className="panel cadence-panel">
          <div className="panel-head"><div><h2>Cadencia Sykron</h2><p>Contato consultivo, sem parecer disparo em massa</p></div><div className="zap-icon"><Zap size={18} /></div></div>
          <div className="cadence-steps">
            <div className="cadence-step"><span>1</span><div><b>Pesquisa rapida</b><small>Segmento, decisor e dor provavel</small></div></div>
            <div className="cadence-step"><span>2</span><div><b>Primeiro contato</b><small>Mensagem personalizada com diagnostico</small></div></div>
            <div className="cadence-step"><span>3</span><div><b>Follow-up</b><small>Prova de valor e convite de 30 minutos</small></div></div>
            <div className="cadence-step"><span>4</span><div><b>Converter</b><small>Criar oportunidade no funil</small></div></div>
          </div>
          <div className="message-box">
            <small>Mensagem sugerida</small>
            <p>{prospects[0]?.message ?? "Selecione um lead para gerar uma abordagem consultiva."}</p>
          </div>
        </aside>
      </section>
    </section>
  );
}

function PipelineModule({ deals, setForm, setModal, onOpen, onEdit, onAddInteraction }: { deals: Deal[]; setForm: React.Dispatch<React.SetStateAction<{ company: string; title: string; value: string; stage: string }>>; setModal: (open: boolean) => void; onOpen: (deal: Deal) => void; onEdit: (deal: Deal) => void; onAddInteraction: (deal: Deal) => void }) {
  const hotDeals = deals.filter((deal) => deal.temperature === "Super quente" || deal.temperature === "Quente").length;
  const activeFollowUps = deals.filter((deal) => deal.temperature === "Super quente" || deal.temperature === "Quente").length;

  return (
    <section className="panel pipeline-panel">
      <div className="panel-head"><div><h2>Pipeline de vendas</h2><p>Acompanhe suas negociacoes por etapa</p></div><button onClick={() => setModal(true)}>Nova oportunidade <ChevronRight size={16} /></button></div>
      <div className="pipeline-summary"><div><span className="live-dot" /> <b>{deals.length} oportunidades ativas</b></div><span>{hotDeals} em quente/super quente · {activeFollowUps} para acao rapida</span><strong>{brl(deals.reduce((sum, deal) => sum + deal.value, 0))}</strong></div>
      <div className="followup-board">
        {salesTemperatures.map((temperature) => {
          const temperatureDeals = deals.filter((deal) => deal.temperature === temperature);
          return (
            <div className={`followup-bucket ${temperatureClass(temperature)}`} key={temperature}>
              <small>{returnPeriodByTemperature[temperature]}</small>
              <b>{temperature}</b>
              <span>{temperatureDeals.length} contato{temperatureDeals.length === 1 ? "" : "s"}</span>
            </div>
          );
        })}
      </div>
      <Kanban deals={deals} setForm={setForm} setModal={setModal} onOpen={onOpen} onEdit={onEdit} onAddInteraction={onAddInteraction} />
    </section>
  );
}

function Kanban({ deals, setForm, setModal, onOpen, onEdit, onAddInteraction }: { deals: Deal[]; setForm: React.Dispatch<React.SetStateAction<{ company: string; title: string; value: string; stage: string }>>; setModal: (open: boolean) => void; onOpen: (deal: Deal) => void; onEdit: (deal: Deal) => void; onAddInteraction: (deal: Deal) => void }) {
  return (
    <div className="kanban">
      {stages.map((stage, index) => {
        const stageDeals = deals.filter((deal) => normalizeStage(deal.stage) === stage);
        return (
          <div className="column" key={stage}>
            <div className="column-head"><span className={`stage-dot s${index}`} /><b>{stage}</b><em>{stageDeals.length}</em><small>{brl(stageDeals.reduce((sum, deal) => sum + deal.value, 0))}</small></div>
            <div className="cards">
              {stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} onOpen={onOpen} onEdit={onEdit} onAddInteraction={onAddInteraction} />)}
              <button className="add-card" onClick={() => { setForm((form) => ({ ...form, stage })); setModal(true); }}><Plus size={15} /> Adicionar oportunidade</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DealCard({ deal, onOpen, onEdit, onAddInteraction }: { deal: Deal; onOpen: (deal: Deal) => void; onEdit: (deal: Deal) => void; onAddInteraction: (deal: Deal) => void }) {
  return (
    <article className="deal-card">
      <div className="deal-top"><div className="company-avatar" style={{ background: deal.color }}>{deal.initials}</div><span className="tag">{deal.tag}</span><button aria-label="Mais opcoes"><MoreHorizontal size={17} /></button></div>
      <h3>{deal.title}</h3>
      <p>{deal.company}</p>
      <div className="deal-signals">
        <span className={`temperature-pill ${temperatureClass(deal.temperature)}`}>{deal.temperature}</span>
        <span className="bucket-pill">Retorno: {deal.bucket}</span>
        <span className="stage-pill">{normalizeStage(deal.stage)}</span>
      </div>
      <div className="next-contact"><Clock3 size={13} /><span>{deal.nextContact}</span></div>
      <div className="card-last-interaction"><small>Ultima interacao</small><span>{latestHistoryStep(deal.historyTimeline)}</span></div>
      <strong>{brl(deal.value)}</strong>
      <div className="deal-footer"><span><Clock3 size={13} /> {deal.due}</span><span className="person">{deal.person.slice(0, 1)}</span></div>
      <div className="record-actions"><button onClick={() => onOpen(deal)}>Abrir historico</button><button className="interaction-action" onClick={() => onAddInteraction(deal)}>Adicionar interacao</button><button onClick={() => onEdit(deal)}>Editar</button></div>
    </article>
  );
}

function ContactsModule({ contacts, onOpen, onEdit, onNew }: { contacts: Contact[]; onOpen: (contact: Contact) => void; onEdit: (contact: Contact) => void; onNew: () => void }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Contatos</h2><p>Decisores e influenciadores das oportunidades</p></div><button onClick={onNew}>Novo contato <ChevronRight size={16} /></button></div>
      <div className="table-list">
        {contacts.map((contact) => (
          <article className="row-card" key={contact.email}>
            <div className="row-avatar">{contact.name.slice(0, 2).toUpperCase()}</div>
            <div className="row-main"><b>{contact.name}</b><span>{contact.role} - {contact.company}</span></div>
            <div><small>Status</small><strong>{contact.status}</strong></div>
            <div><small>Proxima acao</small><strong>{contact.next}</strong></div>
            <div className="row-actions"><span>{contact.phone}</span><span>{contact.email}</span></div>
            <div className="record-actions row-record-actions"><button onClick={() => onOpen(contact)}>Abrir</button><button onClick={() => onEdit(contact)}>Editar</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CompaniesModule({ companies, onOpen, onEdit, onNew }: { companies: Company[]; onOpen: (company: Company) => void; onEdit: (company: Company) => void; onNew: () => void }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Empresas</h2><p>Contas qualificadas para consultoria, sistemas e automacoes</p></div><button onClick={onNew}>Nova empresa <ChevronRight size={16} /></button></div>
      <div className="company-grid">
        {companies.map((company) => (
          <article className="company-card" key={company.name}>
            <div className="company-card-head"><div className="row-avatar">{company.name.slice(0, 2).toUpperCase()}</div><span>{company.fit}</span></div>
            <h3>{company.name}</h3>
            <p>{company.segment} - {company.size}</p>
            <div className="pain-box"><small>Dor principal</small><b>{company.pain}</b></div>
            <footer><span>{company.owner}</span><strong>{brl(company.value)}</strong></footer>
            <div className="record-actions"><button onClick={() => onOpen(company)}>Abrir</button><button onClick={() => onEdit(company)}>Editar</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TasksModule({ tasks, onOpen, onEdit, onNew }: { tasks: Task[]; onOpen: (task: Task) => void; onEdit: (task: Task) => void; onNew: () => void }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Tarefas</h2><p>Rotina comercial para manter o funil em movimento</p></div><button onClick={onNew}>Nova tarefa <ChevronRight size={16} /></button></div>
      <div className="task-board">
        {tasks.map((task) => (
          <article className={task.done ? "task-card done" : "task-card"} key={`${task.company}-${task.title}`}>
            <div className="check-dot">{task.done ? "✓" : ""}</div>
            <div><b>{task.title}</b><span>{task.company} - {task.type}</span></div>
            <time>{task.time}</time>
            <em>{task.priority}</em>
            <div className="record-actions row-record-actions"><button onClick={() => onOpen(task)}>Abrir</button><button onClick={() => onEdit(task)}>Editar</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionsModule({ solutions, onOpen, onEdit, onNew }: { solutions: Solution[]; onOpen: (solution: Solution) => void; onEdit: (solution: Solution) => void; onNew: () => void }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Solucoes Sykron</h2><p>Catalogo comercial para transformar dores em ofertas</p></div><button onClick={onNew}>Nova solucao <ChevronRight size={16} /></button></div>
      <div className="solutions-grid">
        {solutions.map((solution) => (
          <article className="solution-card" key={solution.name}>
            <div className="solution-icon"><WandSparkles size={19} /></div>
            <span>{solution.category}</span>
            <h3>{solution.name}</h3>
            <p>{solution.description}</p>
            <footer><b>{solution.price}</b><em>{solution.leads} leads</em></footer>
            <div className="record-actions"><button onClick={() => onOpen(solution)}>Abrir</button><button onClick={() => onEdit(solution)}>Editar</button></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function InteractionTimeline({ items }: { items: Interaction[] }) {
  if (!items.length) return <p className="empty-history">Nenhuma interacao registrada ainda.</p>;

  return (
    <div className="history-timeline">
      {items.map((item, index) => (
        <article className="timeline-item" key={`${item.id}-${index}`}>
          <div className="timeline-marker"><span>{index + 1}</span></div>
          <div className="timeline-content">
            <div className="timeline-meta"><strong>{item.date}</strong><span>{item.type}</span>{item.status && <em>{item.status}</em>}{item.temperature && <i>{item.temperature}</i>}</div>
            <p className="timeline-detail">{item.detail}</p>
            <div className="timeline-fields">
              {item.pain && <div><small>Dor identificada</small><b>{item.pain}</b></div>}
              {item.objection && <div><small>Objecao</small><b>{item.objection}</b></div>}
              {item.solution && <div><small>Solucao/proposta</small><b>{item.solution}</b></div>}
              {item.next && <div><small>Proximo passo</small><b>{item.next}</b></div>}
              {item.returnDate && <div><small>Proximo retorno</small><b>{item.returnDate}</b></div>}
            </div>
            {(item.owner || item.link) && <footer>{item.owner && <span>Responsavel: {item.owner}</span>}{item.link && <a href={item.link} target="_blank" rel="noreferrer">Abrir link/anexo</a>}</footer>}
          </div>
        </article>
      ))}
    </div>
  );
}

function RecordEditor({ editor, draft, setDraft, onClose, onEdit, onSubmit }: { editor: EditorState; draft: Draft; setDraft: React.Dispatch<React.SetStateAction<Draft>>; onClose: () => void; onEdit: () => void; onSubmit: (event: React.FormEvent) => void }) {
  const fields = editorFields[editor.kind];
  const isEditing = editor.mode === "edit";
  const title = editor.key === "__new__" ? `Novo ${entityLabels[editor.kind]}` : `Detalhes do ${entityLabels[editor.kind]}`;
  const isDeal = editor.kind === "deal";
  const isTrackable = isDeal || editor.kind === "prospect";
  const [historyEntry, setHistoryEntry] = useState({ date: "", type: "Visita", detail: "", pain: "", objection: "", solution: "", next: "", returnDate: "", status: "", temperature: draft.temperature || "Morno", owner: "Jefferson", link: "" });
  const interactionItems = isTrackable ? timelineInteractions(draft.historyTimeline || "", draft.interactions) : [];

  function addHistoryStep() {
    if (!historyEntry.date && !historyEntry.detail && !historyEntry.pain && !historyEntry.objection && !historyEntry.next) return;

    const interaction: Interaction = {
      id: `${Date.now()}`,
      date: historyEntry.date || "Data nao informada",
      type: historyEntry.type || "Contato",
      detail: historyEntry.detail || "Sem resumo registrado",
      pain: historyEntry.pain,
      objection: historyEntry.objection,
      solution: historyEntry.solution,
      next: historyEntry.next,
      returnDate: historyEntry.returnDate,
      status: historyEntry.status || draft.stage || "Lead novo",
      temperature: historyEntry.temperature || draft.temperature || "Morno",
      owner: historyEntry.owner || "Jefferson",
      link: historyEntry.link,
    };
    const entry = [interaction.date, interaction.type, interaction.detail, interaction.pain ? `Dor: ${interaction.pain}` : "", interaction.objection ? `Objecao: ${interaction.objection}` : "", interaction.solution ? `Solucao: ${interaction.solution}` : "", interaction.next ? `Proximo passo: ${interaction.next}` : "", interaction.returnDate ? `Retorno: ${interaction.returnDate}` : "", interaction.status ? `Status: ${interaction.status}` : ""].filter(Boolean).join(" - ");

    setDraft((current) => ({
      ...current,
      historyTimeline: [...historySteps(current.historyTimeline || ""), entry].join("\n"),
      interactions: JSON.stringify([...(parseInteractions(current.interactions).length ? parseInteractions(current.interactions) : historySteps(current.historyTimeline || "").map(legacyInteraction)), interaction]),
      ...(editor.kind === "prospect" ? { lastInteraction: `${historyEntry.date || "Hoje"} - ${historyEntry.type || "Contato"}`, nextReturn: historyEntry.returnDate || current.nextReturn || "Definir retorno" } : {}),
      ...(editor.kind === "deal" ? { stage: interaction.status || current.stage, temperature: interaction.temperature || current.temperature, bucket: returnPeriodByTemperature[interaction.temperature || "Morno"] || current.bucket, nextContact: historyEntry.returnDate ? `${historyEntry.returnDate} - ${historyEntry.next || "Retornar ao cliente"}` : current.nextContact, due: historyEntry.returnDate || current.due } : {}),
    }));
    setHistoryEntry({ date: "", type: "Visita", detail: "", pain: "", objection: "", solution: "", next: "", returnDate: "", status: "", temperature: draft.temperature || "Morno", owner: "Jefferson", link: "" });
  }

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal record-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div><span className="modal-icon"><BriefcaseBusiness size={20} /></span><div><h2>{title}</h2><p>{isTrackable ? "Acompanhe a evolucao da negociacao e os proximos passos." : isEditing ? "Edite os campos e salve as informacoes." : "Visualize a informacao cadastrada."}</p></div></div>
          <button onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        </div>

        {isEditing ? (
          <form onSubmit={onSubmit}>
            {isTrackable && (
              <section className="history-builder featured-history-builder">
                <div className="history-builder-head">
                  <div><h3>{isDeal ? "Evolucao da negociacao" : "Historico do lead"}</h3><p>Registre uma nova visita ou contato comercial sem burocracia.</p></div>
                  <span>{interactionItems.length} interacao{interactionItems.length === 1 ? "" : "es"}</span>
                </div>

                <div className="history-entry-grid">
                  <label>Data<input placeholder="Ex.: 22/07/2026" value={historyEntry.date} onChange={(event) => setHistoryEntry((current) => ({ ...current, date: event.target.value }))} /></label>
                  <label>Tipo de interacao<select value={historyEntry.type} onChange={(event) => setHistoryEntry((current) => ({ ...current, type: event.target.value }))}><option>Visita</option><option>WhatsApp</option><option>Ligacao</option><option>Reuniao</option><option>Proposta</option><option>Follow-up</option><option>Fechamento</option><option>Perda</option></select></label>
                  <label className="wide-field">O que aconteceu<textarea placeholder="Resumo da conversa, visita, percepcao ou decisao do cliente" value={historyEntry.detail} onChange={(event) => setHistoryEntry((current) => ({ ...current, detail: event.target.value }))} /></label>
                  <label>Dor identificada<input placeholder="Ex.: perde retornos no WhatsApp" value={historyEntry.pain} onChange={(event) => setHistoryEntry((current) => ({ ...current, pain: event.target.value }))} /></label>
                  <label>Objecao / risco<input placeholder="Ex.: achou caro, precisa falar com socio..." value={historyEntry.objection} onChange={(event) => setHistoryEntry((current) => ({ ...current, objection: event.target.value }))} /></label>
                  <label>Soluçao/proposta apresentada<input placeholder="Ex.: painel simples de agenda e retornos" value={historyEntry.solution} onChange={(event) => setHistoryEntry((current) => ({ ...current, solution: event.target.value }))} /></label>
                  <label>Proximo passo<input placeholder="Ex.: retornar sexta com exemplo visual" value={historyEntry.next} onChange={(event) => setHistoryEntry((current) => ({ ...current, next: event.target.value }))} /></label>
                  <label>Data prevista para retorno<input placeholder="Ex.: 29/07/2026" value={historyEntry.returnDate} onChange={(event) => setHistoryEntry((current) => ({ ...current, returnDate: event.target.value }))} /></label>
                  <label>Nova etapa do funil<select value={historyEntry.status} onChange={(event) => setHistoryEntry((current) => ({ ...current, status: event.target.value }))}><option value="">Manter etapa atual</option>{stages.map((stage) => <option key={stage}>{stage}</option>)}</select></label>
                  <label>Temperatura<select value={historyEntry.temperature} onChange={(event) => setHistoryEntry((current) => ({ ...current, temperature: event.target.value }))}>{salesTemperatures.map((temperature) => <option key={temperature}>{temperature}</option>)}</select></label>
                  <label>Responsavel<input value={historyEntry.owner} onChange={(event) => setHistoryEntry((current) => ({ ...current, owner: event.target.value }))} /></label>
                  <label className="wide-field">Anexo ou link<input placeholder="Cole um link de proposta, reunião ou arquivo" value={historyEntry.link} onChange={(event) => setHistoryEntry((current) => ({ ...current, link: event.target.value }))} /></label>
                </div>
                <button type="button" className="add-history-step" onClick={addHistoryStep}>+ Adicionar interacao</button>
              </section>
            )}
            <div className="editor-grid">
              {fields.map((field) => (
                <label key={field.name} className={field.type === "textarea" ? "wide-field" : ""}>
                  {field.label}
                  {field.type === "select" ? (
                    <select value={draft[field.name] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))}>
                      {field.options?.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea value={draft[field.name] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))} />
                  ) : (
                    <input type={field.type === "number" ? "number" : "text"} value={draft[field.name] ?? ""} onChange={(event) => setDraft((current) => ({ ...current, [field.name]: event.target.value }))} />
                  )}
                </label>
              ))}
            </div>
            {false && isDeal && (
              <section className="history-builder">
                <div className="history-builder-head">
                  <div><h3>Desdobramentos da negociacao</h3><p>Adicione quantas visitas, conversas, objeções, decisões e proximos passos forem necessarios.</p></div>
                  <span>{interactionItems.length} interacao{interactionItems.length === 1 ? "" : "es"}</span>
                </div>

                <div className="history-step-list">
                  {interactionItems.length ? interactionItems.map((step, index) => (
                    <article className="history-step-item" key={`${step.id}-${index}`}>
                      <small>#{index + 1}</small>
                      <p>{step.detail}</p>
                    </article>
                  )) : <p className="empty-history">Nenhum desdobramento registrado ainda.</p>}
                </div>

                <div className="history-entry-grid">
                  <label>Data<input placeholder="Ex.: 22/07/2026" value={historyEntry.date} onChange={(event) => setHistoryEntry((current) => ({ ...current, date: event.target.value }))} /></label>
                  <label>Tipo<select value={historyEntry.type} onChange={(event) => setHistoryEntry((current) => ({ ...current, type: event.target.value }))}><option>Visita</option><option>Ligacao</option><option>WhatsApp</option><option>Reuniao</option><option>Proposta</option><option>Follow-up</option><option>Aprendizado</option></select></label>
                  <label className="wide-field">O que aconteceu<textarea placeholder="Resumo da conversa, visita, percepcao ou decisao do cliente" value={historyEntry.detail} onChange={(event) => setHistoryEntry((current) => ({ ...current, detail: event.target.value }))} /></label>
                  <label>Objecao / risco<input placeholder="Ex.: achou caro, precisa falar com socio..." value={historyEntry.objection} onChange={(event) => setHistoryEntry((current) => ({ ...current, objection: event.target.value }))} /></label>
                  <label>Proximo passo<input placeholder="Ex.: retornar sexta com exemplo visual" value={historyEntry.next} onChange={(event) => setHistoryEntry((current) => ({ ...current, next: event.target.value }))} /></label>
                </div>
                <button type="button" className="add-history-step" onClick={addHistoryStep}>Adicionar desdobramento</button>
              </section>
            )}
            <div className="modal-actions"><button type="button" className="cancel" onClick={onClose}>Cancelar</button><button className="primary" type="submit">Salvar informacoes</button></div>
          </form>
        ) : (
          <div className="record-view">
            {fields.map((field) => (
              <div key={field.name} className={field.type === "textarea" ? "wide-field" : ""}>
                <small>{field.label}</small>
                <b>{draft[field.name] || "Nao informado"}</b>
              </div>
            ))}
            {isTrackable && (
              <section className="history-builder record-history-view">
                <div className="history-builder-head">
                  <div><h3>{isDeal ? "Historico da negociacao" : "Historico do lead"}</h3><p>Evolucao completa da oportunidade, do primeiro contato ao momento atual.</p></div>
                  <span>{interactionItems.length} interacao{interactionItems.length === 1 ? "" : "es"}</span>
                </div>
                <InteractionTimeline items={interactionItems} />
              </section>
            )}
            <div className="modal-actions"><button type="button" className="cancel" onClick={onClose}>Fechar</button><button className="primary" type="button" onClick={onEdit}>Editar informacoes</button></div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, note, up, color }: { icon: React.ElementType; label: string; value: string; note: string; up?: boolean; color: string }) {
  return <article className="metric"><div className={`metric-icon ${color}`}><Icon size={21} /></div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small className={up ? "positive" : ""}>{up && "↗ "}{note}</small></div><button aria-label="Mais opcoes"><MoreHorizontal size={18} /></button></article>;
}

function Activity({ time, title, company, type }: Task) {
  return <div className="activity"><div className="activity-icon"><CalendarDays size={18} /></div><div className="activity-copy"><b>{title}</b><span>{company} - {type}</span></div><time>{time}</time><ChevronRight size={16} /></div>;
}

function moduleSubtitle(active: string) {
  const subtitles: Record<string, string> = {
    "Visao geral": "Sincronizando processos. Potencializando resultados.",
    "Prospeccao": "Organize leads, dores provaveis e abordagens consultivas antes do disparo.",
    "Funil de vendas": "Controle as oportunidades por etapa, valor e proxima acao.",
    "Contatos": "Organize decisores, influenciadores e proximos passos comerciais.",
    "Empresas": "Entenda dores, potencial e encaixe das contas em prospeccao.",
    "Tarefas": "Acompanhe a rotina para transformar diagnosticos em propostas.",
    "Solucoes": "Monte ofertas de processos, sistemas, automacoes, BI e alta gestao.",
  };

  return subtitles[active] ?? subtitles["Visao geral"];
}
