"use client";

import { useMemo, useState } from "react";
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
  person: string;
  initials: string;
  color: string;
  due: string;
  tag: string;
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
  source: string;
  pain: string;
  status: string;
  temperature: string;
  channel: string;
  nextAction: string;
  message: string;
};

type EntityKind = "prospect" | "deal" | "contact" | "company" | "task" | "solution";
type EditorState = { kind: EntityKind; key: string; mode: "view" | "edit" };
type Draft = Record<string, string>;
type EditorField = { name: string; label: string; type?: "text" | "number" | "select" | "textarea"; options?: string[] };

const stages = ["Novos leads", "Diagnostico", "Proposta", "Negociacao"];

const initialDeals: Deal[] = [
  { id: 1, company: "Clinica Aurora", title: "Dashboard executivo de atendimento", value: 8900, stage: "Novos leads", person: "Marina", initials: "CA", color: "#00b9f2", due: "Hoje", tag: "Dashboard" },
  { id: 2, company: "Vertice Imoveis", title: "Sistema inteligente de gestao comercial", value: 12400, stage: "Diagnostico", person: "Rafael", initials: "VI", color: "#e9784d", due: "Amanha", tag: "Sistema" },
  { id: 3, company: "Studio Uno", title: "Automacao de propostas e follow-up", value: 4800, stage: "Diagnostico", person: "Marina", initials: "SU", color: "#198f78", due: "22 jul", tag: "Automacao" },
  { id: 4, company: "Almeida Contabil", title: "BI financeiro e indicadores estrategicos", value: 15600, stage: "Proposta", person: "Jefferson", initials: "AC", color: "#bd6db5", due: "24 jul", tag: "BI" },
  { id: 5, company: "Move Academia", title: "Mapeamento e melhoria de processos", value: 6300, stage: "Proposta", person: "Rafael", initials: "MA", color: "#d59823", due: "25 jul", tag: "Gestao" },
  { id: 6, company: "Norte Solar", title: "Integracao da operacao comercial", value: 18900, stage: "Negociacao", person: "Jefferson", initials: "NS", color: "#3c7dd9", due: "Hoje", tag: "Integracao" },
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
    company: "Roca Distribuidora",
    segment: "Distribuicao e logistica",
    size: "Atua em mais de 70 municipios",
    source: "Pesquisa web - Sorocaba",
    pain: "Operacao de distribuicao regional, rotas, abastecimento, suporte a varejistas e controle de entrega pedem indicadores e integracao.",
    status: "1o contato",
    temperature: "Alta",
    channel: "E-mail",
    nextAction: "Abordar diretoria com diagnostico de inteligencia logistica",
    message: "Vi que a operacao da Roca envolve distribuicao regional, abastecimento e rotas para dezenas de cidades. A Sykron pode fazer um diagnostico rapido para identificar onde dashboards, integracoes e automacoes reduzem retrabalho e aumentam previsibilidade.",
  },
  {
    company: "GA LOG",
    segment: "Transporte e armazenagem",
    size: "Operacao nacional",
    source: "Pesquisa web - Sorocaba",
    pain: "Transporte dedicado, fracionado, armazenagem e entregas urgentes exigem controle de prazos, custos, ocorrencias e performance.",
    status: "1o contato",
    temperature: "Alta",
    channel: "WhatsApp",
    nextAction: "Oferecer diagnostico de indicadores operacionais",
    message: "Vi que a GA LOG atua com transporte dedicado, fracionado e armazenagem. Esse tipo de operacao costuma ganhar muito com painel de indicadores, controle de ocorrencias e integracao dos dados comerciais e operacionais.",
  },
  {
    company: "TransR Sorocaba",
    segment: "Logistica e transportes",
    size: "Mais de uma decada de mercado",
    source: "Pesquisa web - Sorocaba",
    pain: "Coletas, entregas expressas, carga fracionada, carga fechada e logistica reversa geram muitas etapas manuais e necessidade de visibilidade.",
    status: "1o contato",
    temperature: "Alta",
    channel: "WhatsApp",
    nextAction: "Enviar mensagem sobre dashboard de operacao e follow-up comercial",
    message: "A TransR trabalha com entregas expressas, coletas, carga fracionada e logistica reversa. A Sykron pode mapear os gargalos da rotina e mostrar onde automatizar follow-ups, indicadores e controles de operacao.",
  },
  {
    company: "RPM Entregas Rapidas",
    segment: "Entregas rapidas e armazenagem",
    size: "Frota propria e galpao com mais de 400m2",
    source: "Pesquisa web - Sorocaba",
    pain: "Frota propria, rastreio, armazenamento e atendimento rapido indicam necessidade de indicadores, integracao e automacao comercial.",
    status: "Pesquisa",
    temperature: "Alta",
    channel: "WhatsApp",
    nextAction: "Validar decisor e propor diagnostico de rastreio + BI",
    message: "Vi que a RPM ja possui operacao com frota propria, rastreio e armazenagem. O proximo ganho pode estar em integrar esses dados em uma visao gerencial simples para decisao rapida e reducao de retrabalho.",
  },
  {
    company: "Atlanta Industria Metalurgica",
    segment: "Industria metalurgica",
    size: "Mais de 100 colaboradores e 22 mil m2",
    source: "Pesquisa web - Sorocaba",
    pain: "Operacao industrial com corte, solda, tratamento, dobra, usinagem e calandra exige controle de processos, produtividade, qualidade e prazos.",
    status: "Pesquisa",
    temperature: "Alta",
    channel: "E-mail",
    nextAction: "Abordar com diagnostico de processos industriais e BI",
    message: "A Atlanta tem uma operacao industrial robusta, com varias etapas produtivas. A Sykron pode apoiar no mapeamento dos processos e na criacao de indicadores executivos de prazo, produtividade, qualidade e gargalos.",
  },
  {
    company: "SPS Construtora",
    segment: "Construcao civil, mineracao e maquinas",
    size: "Atuacao em diferentes regioes do Brasil",
    source: "Pesquisa web - Sorocaba",
    pain: "Obras, mineracao, locacao de maquinas, terraplenagem e servicos geram alto volume de controle operacional, propostas e acompanhamento de contratos.",
    status: "Pesquisa",
    temperature: "Alta",
    channel: "E-mail",
    nextAction: "Enviar abordagem sobre controle de obras, maquinas e indicadores",
    message: "Pelo perfil da SPS, com obras, mineracao, locacao de maquinas e servicos, pode existir um ganho grande em integrar controles e transformar operacao em indicadores de alta gestao.",
  },
  {
    company: "Orodent Sorocaba",
    segment: "Clinica odontologica",
    size: "2 unidades em Sorocaba",
    source: "Pesquisa web - Sorocaba",
    pain: "Duas unidades, varias especialidades, agenda, orcamentos e retorno de pacientes pedem controle comercial, atendimento e indicadores.",
    status: "1o contato",
    temperature: "Alta",
    channel: "WhatsApp",
    nextAction: "Oferecer diagnostico de agenda, conversao e follow-up",
    message: "Vi que a Orodent possui duas unidades em Sorocaba e tratamentos multidisciplinares. A Sykron pode ajudar a mapear agenda, retorno de pacientes, orcamentos e indicadores de conversao por unidade.",
  },
  {
    company: "CampoClin",
    segment: "Clinica de especialidades",
    size: "8 especialidades e mais de 1 mil consultas por ano",
    source: "Pesquisa web - Sorocaba",
    pain: "Atendimento com hora marcada, WhatsApp, locacao de salas e profissionais cria oportunidade para automacao de agenda, indicadores e funil de atendimento.",
    status: "Pesquisa",
    temperature: "Media",
    channel: "WhatsApp",
    nextAction: "Validar se usam planilhas ou sistema desconectado",
    message: "A CampoClin tem atendimento por agenda, varias especialidades e locacao de salas. A Sykron pode fazer um diagnostico para entender gargalos de atendimento, controle de salas e indicadores de conversao.",
  },
  {
    company: "Escriba Assessoria Contabil",
    segment: "Contabilidade empresarial",
    size: "Mais de 25 anos de mercado",
    source: "Pesquisa web - Sorocaba",
    pain: "Escritorio contabil maduro tende a ter alto volume de rotinas recorrentes, carteira de clientes e necessidade de indicadores por demanda.",
    status: "Follow-up 1",
    temperature: "Media",
    channel: "E-mail",
    nextAction: "Enviar proposta de diagnostico de produtividade e automacao",
    message: "Escritorios contabeis acumulam rotinas repetitivas, prazos e controles por carteira. A Sykron pode diagnosticar gargalos e propor automacoes simples com indicadores de produtividade e atendimento.",
  },
  {
    company: "Gestao CMF",
    segment: "Contabilidade empresarial",
    size: "Mais de 30 anos de experiencia",
    source: "Pesquisa web - Sorocaba",
    pain: "Atua com administracao financeira, legalizacao, certidoes e servicos especiais; bom encaixe para automacao de rotinas e painel de carteira.",
    status: "Pesquisa",
    temperature: "Media",
    channel: "E-mail",
    nextAction: "Abordar com melhoria de processos internos e indicadores",
    message: "A Gestao CMF comunica uma atuacao estrategica e servicos administrativos. A Sykron pode mapear rotinas internas e criar indicadores para prazos, carteira, produtividade e oportunidades de automacao.",
  },
  {
    company: "Imelux Industria Metalurgica",
    segment: "Industria metalurgica",
    size: "Mais de 50 anos de mercado",
    source: "Pesquisa web - Sorocaba",
    pain: "Estamparia, ferramentaria, pintura, tratamentos e entregas com veiculos proprios geram oportunidade para controle de producao e prazo.",
    status: "Nutrir",
    temperature: "Media",
    channel: "E-mail",
    nextAction: "Enviar material sobre indicadores de producao e pedidos",
    message: "A Imelux possui operacao industrial com ferramentaria e estamparia. A Sykron pode ajudar a mapear fluxo de pedidos, prazos, gargalos e indicadores simples para alta gestao.",
  },
];

const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

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
    { name: "source", label: "Origem" },
    { name: "pain", label: "Dor provavel", type: "textarea" },
    { name: "status", label: "Status", type: "select", options: ["Pesquisa", "1o contato", "Follow-up 1", "Nutrir", "Qualificado"] },
    { name: "temperature", label: "Temperatura", type: "select", options: ["Alta", "Media", "Baixa"] },
    { name: "channel", label: "Canal", type: "select", options: ["WhatsApp", "E-mail", "Ligacao", "LinkedIn"] },
    { name: "nextAction", label: "Proxima acao" },
    { name: "message", label: "Mensagem sugerida", type: "textarea" },
  ],
  deal: [
    { name: "company", label: "Empresa" },
    { name: "title", label: "Solucao identificada" },
    { name: "value", label: "Valor estimado", type: "number" },
    { name: "stage", label: "Etapa", type: "select", options: stages },
    { name: "person", label: "Responsavel" },
    { name: "due", label: "Proxima acao" },
    { name: "tag", label: "Tipo de solucao" },
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
  prospect: { company: "", segment: "", size: "", source: "", pain: "", status: "Pesquisa", temperature: "Media", channel: "WhatsApp", nextAction: "", message: "" },
  deal: { company: "", title: "", value: "0", stage: "Novos leads", person: "Jefferson", due: "Novo", tag: "Solucao" },
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
  const [form, setForm] = useState({ company: "", title: "", value: "", stage: "Novos leads" });
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [draft, setDraft] = useState<Draft>({});

  const filteredDeals = useMemo(() => {
    const term = query.toLowerCase();
    return deals.filter((deal) => `${deal.company} ${deal.title} ${deal.tag}`.toLowerCase().includes(term));
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
    return prospectList.filter((prospect) => `${prospect.company} ${prospect.segment} ${prospect.pain} ${prospect.status}`.toLowerCase().includes(term));
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
        person: "Jefferson",
        initials: form.company.slice(0, 2).toUpperCase(),
        color: "#00b9f2",
        due: "Novo",
        tag: "Solucao",
      },
    ]);
    setForm({ company: "", title: "", value: "", stage: "Novos leads" });
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
      return { company: deal.company, title: deal.title, value: String(deal.value), stage: deal.stage, person: deal.person, due: deal.due, tag: deal.tag };
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

    if (editor.kind === "prospect") {
      const next: Prospect = {
        company: draft.company || "Novo lead",
        segment: draft.segment || "Segmento nao informado",
        size: draft.size || "Porte nao informado",
        source: draft.source || "Manual",
        pain: draft.pain || "Dor ainda nao mapeada.",
        status: draft.status || "Pesquisa",
        temperature: draft.temperature || "Media",
        channel: draft.channel || "WhatsApp",
        nextAction: draft.nextAction || "Definir proxima acao",
        message: draft.message || "Mensagem consultiva ainda nao definida.",
      };
      setProspectList((prev) => isNew ? [next, ...prev] : prev.map((item) => keyFor("prospect", item) === editor.key ? next : item));
    }

    if (editor.kind === "deal") {
      const next: Deal = {
        id: isNew ? Date.now() : Number(editor.key),
        company: draft.company || "Nova empresa",
        title: draft.title || "Nova oportunidade",
        value: Number(draft.value) || 0,
        stage: draft.stage || "Novos leads",
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
    setToast(`${entityLabels[editor.kind]} salvo com sucesso`);
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
            <ProspectionModule prospects={filteredProspects} onOpen={(prospect) => openRecord("prospect", prospect)} onEdit={(prospect) => openRecord("prospect", prospect, "edit")} onNew={() => newRecord("prospect")} />
          )}

          {active === "Funil de vendas" && (
            <PipelineModule deals={filteredDeals} setForm={setForm} setModal={setModal} onOpen={(deal) => openRecord("deal", deal)} onEdit={(deal) => openRecord("deal", deal, "edit")} />
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
  return (
    <>
      <section className="metrics">
        <Metric icon={CircleDollarSign} label="Pipeline total" value={brl(total)} note="12,5% este mes" up color="cyan" />
        <Metric icon={Target} label="Oportunidades" value={String(deals.length)} note="Base demonstrativa" color="blue" />
        <Metric icon={Users} label="Leads em prospeccao" value={String(prospectCount)} note="Lista qualificada" color="green" />
        <Metric icon={TrendingUp} label="Taxa de conversao" value="31,8%" note="Meta: 40%" up color="orange" />
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

function ProspectionModule({ prospects, onOpen, onEdit, onNew }: { prospects: Prospect[]; onOpen: (prospect: Prospect) => void; onEdit: (prospect: Prospect) => void; onNew: () => void }) {
  const hotLeads = prospects.filter((prospect) => prospect.temperature === "Alta").length;

  return (
    <section className="prospection-stack">
      <div className="metrics prospect-metrics">
        <Metric icon={Users} label="Leads mapeados" value={String(prospects.length)} note="Base consultiva" color="cyan" />
        <Metric icon={TrendingUp} label="Temperatura alta" value={String(hotLeads)} note="Prioridade de contato" up color="green" />
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
                <div className="pain-box"><small>Dor provavel</small><b>{prospect.pain}</b></div>
                <footer><span>{prospect.source}</span><strong>{prospect.nextAction}</strong></footer>
                <div className="record-actions"><button onClick={() => onOpen(prospect)}>Abrir</button><button onClick={() => onEdit(prospect)}>Editar</button></div>
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

function PipelineModule({ deals, setForm, setModal, onOpen, onEdit }: { deals: Deal[]; setForm: React.Dispatch<React.SetStateAction<{ company: string; title: string; value: string; stage: string }>>; setModal: (open: boolean) => void; onOpen: (deal: Deal) => void; onEdit: (deal: Deal) => void }) {
  return (
    <section className="panel pipeline-panel">
      <div className="panel-head"><div><h2>Pipeline de vendas</h2><p>Acompanhe suas negociacoes por etapa</p></div><button onClick={() => setModal(true)}>Nova oportunidade <ChevronRight size={16} /></button></div>
      <div className="pipeline-summary"><div><span className="live-dot" /> <b>{deals.length} oportunidades ativas</b></div><strong>{brl(deals.reduce((sum, deal) => sum + deal.value, 0))}</strong></div>
      <Kanban deals={deals} setForm={setForm} setModal={setModal} onOpen={onOpen} onEdit={onEdit} />
    </section>
  );
}

function Kanban({ deals, setForm, setModal, onOpen, onEdit }: { deals: Deal[]; setForm: React.Dispatch<React.SetStateAction<{ company: string; title: string; value: string; stage: string }>>; setModal: (open: boolean) => void; onOpen: (deal: Deal) => void; onEdit: (deal: Deal) => void }) {
  return (
    <div className="kanban">
      {stages.map((stage, index) => {
        const stageDeals = deals.filter((deal) => deal.stage === stage);
        return (
          <div className="column" key={stage}>
            <div className="column-head"><span className={`stage-dot s${index}`} /><b>{stage}</b><em>{stageDeals.length}</em><small>{brl(stageDeals.reduce((sum, deal) => sum + deal.value, 0))}</small></div>
            <div className="cards">
              {stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} onOpen={onOpen} onEdit={onEdit} />)}
              <button className="add-card" onClick={() => { setForm((form) => ({ ...form, stage })); setModal(true); }}><Plus size={15} /> Adicionar oportunidade</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DealCard({ deal, onOpen, onEdit }: { deal: Deal; onOpen: (deal: Deal) => void; onEdit: (deal: Deal) => void }) {
  return (
    <article className="deal-card">
      <div className="deal-top"><div className="company-avatar" style={{ background: deal.color }}>{deal.initials}</div><span className="tag">{deal.tag}</span><button aria-label="Mais opcoes"><MoreHorizontal size={17} /></button></div>
      <h3>{deal.title}</h3>
      <p>{deal.company}</p>
      <strong>{brl(deal.value)}</strong>
      <div className="deal-footer"><span><Clock3 size={13} /> {deal.due}</span><span className="person">{deal.person.slice(0, 1)}</span></div>
      <div className="record-actions"><button onClick={() => onOpen(deal)}>Abrir</button><button onClick={() => onEdit(deal)}>Editar</button></div>
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

function RecordEditor({ editor, draft, setDraft, onClose, onEdit, onSubmit }: { editor: EditorState; draft: Draft; setDraft: React.Dispatch<React.SetStateAction<Draft>>; onClose: () => void; onEdit: () => void; onSubmit: (event: React.FormEvent) => void }) {
  const fields = editorFields[editor.kind];
  const isEditing = editor.mode === "edit";
  const title = editor.key === "__new__" ? `Novo ${entityLabels[editor.kind]}` : `Detalhes do ${entityLabels[editor.kind]}`;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal record-modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-head">
          <div><span className="modal-icon"><BriefcaseBusiness size={20} /></span><div><h2>{title}</h2><p>{isEditing ? "Edite os campos e salve as informacoes." : "Visualize a informacao cadastrada."}</p></div></div>
          <button onClick={onClose} aria-label="Fechar"><X size={20} /></button>
        </div>

        {isEditing ? (
          <form onSubmit={onSubmit}>
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
