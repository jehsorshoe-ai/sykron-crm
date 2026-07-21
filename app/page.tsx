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
    company: "Delta Odonto",
    segment: "Clinica odontologica",
    size: "22 colaboradores",
    source: "Google Maps",
    pain: "Agenda, financeiro e atendimento controlados em planilhas separadas.",
    status: "1o contato",
    temperature: "Alta",
    channel: "WhatsApp",
    nextAction: "Enviar convite para diagnostico gratuito",
    message: "Notei que clinicas com varias agendas costumam perder visibilidade de indicadores e tempo com controles manuais. A Sykron pode mapear esses gargalos e mostrar onde processo, sistema ou dashboard trariam ganho rapido.",
  },
  {
    company: "Prime Contabilidade",
    segment: "Contabilidade",
    size: "38 colaboradores",
    source: "LinkedIn",
    pain: "Muitas demandas recorrentes, pouco indicador de produtividade por carteira.",
    status: "Follow-up 1",
    temperature: "Media",
    channel: "E-mail",
    nextAction: "Enviar caso de uso sobre BI financeiro",
    message: "Empresas contabeis crescem rapido, mas a gestao da carteira costuma ficar invisivel. Podemos fazer um diagnostico curto para identificar rotinas repetitivas, gargalos e indicadores de alta gestao.",
  },
  {
    company: "ArqNova Engenharia",
    segment: "Engenharia",
    size: "16 colaboradores",
    source: "Indicacao",
    pain: "Propostas, obras e financeiro sem acompanhamento integrado.",
    status: "Pesquisa",
    temperature: "Alta",
    channel: "Ligacao",
    nextAction: "Validar decisor e agendar conversa",
    message: "Pelo perfil da operacao, pode existir oportunidade de organizar fluxo de propostas, execucao e financeiro em uma visao unica. A Sykron trabalha justamente nessa ponte entre processo, sistema e indicador.",
  },
  {
    company: "ViaSul Transportes",
    segment: "Logistica",
    size: "64 colaboradores",
    source: "Lista segmentada",
    pain: "Controles operacionais manuais e retrabalho entre areas.",
    status: "Nutrir",
    temperature: "Baixa",
    channel: "E-mail",
    nextAction: "Enviar material sobre automacao de rotinas",
    message: "Operacoes logisticas costumam acumular controles paralelos. Um diagnostico operacional ajuda a encontrar onde automatizar, integrar dados e reduzir retrabalho antes de investir em qualquer sistema.",
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

export default function Home() {
  const [active, setActive] = useState("Visao geral");
  const [deals, setDeals] = useState(initialDeals);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ company: "", title: "", value: "", stage: "Novos leads" });

  const filteredDeals = useMemo(() => {
    const term = query.toLowerCase();
    return deals.filter((deal) => `${deal.company} ${deal.title} ${deal.tag}`.toLowerCase().includes(term));
  }, [deals, query]);

  const filteredCompanies = useMemo(() => {
    const term = query.toLowerCase();
    return companies.filter((company) => `${company.name} ${company.segment} ${company.pain}`.toLowerCase().includes(term));
  }, [query]);

  const filteredContacts = useMemo(() => {
    const term = query.toLowerCase();
    return contacts.filter((contact) => `${contact.name} ${contact.company} ${contact.status}`.toLowerCase().includes(term));
  }, [query]);

  const filteredSolutions = useMemo(() => {
    const term = query.toLowerCase();
    return solutions.filter((solution) => `${solution.name} ${solution.category} ${solution.description}`.toLowerCase().includes(term));
  }, [query]);

  const filteredProspects = useMemo(() => {
    const term = query.toLowerCase();
    return prospects.filter((prospect) => `${prospect.company} ${prospect.segment} ${prospect.pain} ${prospect.status}`.toLowerCase().includes(term));
  }, [query]);

  const total = deals.reduce((sum, deal) => sum + deal.value, 0);
  const openTasks = tasks.filter((task) => !task.done).length;

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
            <Overview deals={filteredDeals} total={total} setActive={setActive} setModal={setModal} />
          )}

          {active === "Prospeccao" && (
            <ProspectionModule prospects={filteredProspects} />
          )}

          {active === "Funil de vendas" && (
            <PipelineModule deals={filteredDeals} setForm={setForm} setModal={setModal} />
          )}

          {active === "Contatos" && (
            <ContactsModule contacts={filteredContacts} />
          )}

          {active === "Empresas" && (
            <CompaniesModule companies={filteredCompanies} />
          )}

          {active === "Tarefas" && (
            <TasksModule tasks={tasks} />
          )}

          {active === "Solucoes" && (
            <SolutionsModule solutions={filteredSolutions} />
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

      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  );
}

function Overview({ deals, total, setActive, setModal }: { deals: Deal[]; total: number; setActive: (view: string) => void; setModal: (open: boolean) => void }) {
  return (
    <>
      <section className="metrics">
        <Metric icon={CircleDollarSign} label="Pipeline total" value={brl(total)} note="12,5% este mes" up color="cyan" />
        <Metric icon={Target} label="Oportunidades" value={String(deals.length)} note="Base demonstrativa" color="blue" />
        <Metric icon={Users} label="Leads em prospeccao" value={String(prospects.length)} note="Lista qualificada" color="green" />
        <Metric icon={TrendingUp} label="Taxa de conversao" value="31,8%" note="Meta: 40%" up color="orange" />
      </section>

      <section className="module-grid">
        <button className="module-card" onClick={() => setActive("Prospeccao")}><Users size={21} /><b>Prospeccao</b><span>Leads, dores e cadencias consultivas</span><strong>{prospects.length} leads</strong></button>
        <button className="module-card" onClick={() => setActive("Funil de vendas")}><Target size={21} /><b>Funil de vendas</b><span>Kanban por etapa comercial</span><strong>{brl(total)}</strong></button>
        <button className="module-card" onClick={() => setActive("Contatos")}><ContactRound size={21} /><b>Contatos</b><span>Decisores e proximas conversas</span><strong>{contacts.length} contatos</strong></button>
        <button className="module-card" onClick={() => setActive("Empresas")}><BriefcaseBusiness size={21} /><b>Empresas</b><span>Clientes potenciais e dores</span><strong>{companies.length} contas</strong></button>
        <button className="module-card" onClick={() => setActive("Solucoes")}><WandSparkles size={21} /><b>Solucoes</b><span>Portfolio comercial Sykron</span><strong>{solutions.length} ofertas</strong></button>
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

function ProspectionModule({ prospects }: { prospects: Prospect[] }) {
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
          <div className="panel-head"><div><h2>Leads priorizados</h2><p>Empresas com dor provavel antes de virar oportunidade</p></div><button>Novo lead <ChevronRight size={16} /></button></div>
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

function PipelineModule({ deals, setForm, setModal }: { deals: Deal[]; setForm: React.Dispatch<React.SetStateAction<{ company: string; title: string; value: string; stage: string }>>; setModal: (open: boolean) => void }) {
  return (
    <section className="panel pipeline-panel">
      <div className="panel-head"><div><h2>Pipeline de vendas</h2><p>Acompanhe suas negociacoes por etapa</p></div><button onClick={() => setModal(true)}>Nova oportunidade <ChevronRight size={16} /></button></div>
      <div className="pipeline-summary"><div><span className="live-dot" /> <b>{deals.length} oportunidades ativas</b></div><strong>{brl(deals.reduce((sum, deal) => sum + deal.value, 0))}</strong></div>
      <Kanban deals={deals} setForm={setForm} setModal={setModal} />
    </section>
  );
}

function Kanban({ deals, setForm, setModal }: { deals: Deal[]; setForm: React.Dispatch<React.SetStateAction<{ company: string; title: string; value: string; stage: string }>>; setModal: (open: boolean) => void }) {
  return (
    <div className="kanban">
      {stages.map((stage, index) => {
        const stageDeals = deals.filter((deal) => deal.stage === stage);
        return (
          <div className="column" key={stage}>
            <div className="column-head"><span className={`stage-dot s${index}`} /><b>{stage}</b><em>{stageDeals.length}</em><small>{brl(stageDeals.reduce((sum, deal) => sum + deal.value, 0))}</small></div>
            <div className="cards">
              {stageDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)}
              <button className="add-card" onClick={() => { setForm((form) => ({ ...form, stage })); setModal(true); }}><Plus size={15} /> Adicionar oportunidade</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  return (
    <article className="deal-card">
      <div className="deal-top"><div className="company-avatar" style={{ background: deal.color }}>{deal.initials}</div><span className="tag">{deal.tag}</span><button aria-label="Mais opcoes"><MoreHorizontal size={17} /></button></div>
      <h3>{deal.title}</h3>
      <p>{deal.company}</p>
      <strong>{brl(deal.value)}</strong>
      <div className="deal-footer"><span><Clock3 size={13} /> {deal.due}</span><span className="person">{deal.person.slice(0, 1)}</span></div>
    </article>
  );
}

function ContactsModule({ contacts }: { contacts: Contact[] }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Contatos</h2><p>Decisores e influenciadores das oportunidades</p></div><button>Novo contato <ChevronRight size={16} /></button></div>
      <div className="table-list">
        {contacts.map((contact) => (
          <article className="row-card" key={contact.email}>
            <div className="row-avatar">{contact.name.slice(0, 2).toUpperCase()}</div>
            <div className="row-main"><b>{contact.name}</b><span>{contact.role} - {contact.company}</span></div>
            <div><small>Status</small><strong>{contact.status}</strong></div>
            <div><small>Proxima acao</small><strong>{contact.next}</strong></div>
            <div className="row-actions"><span>{contact.phone}</span><span>{contact.email}</span></div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CompaniesModule({ companies }: { companies: Company[] }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Empresas</h2><p>Contas qualificadas para consultoria, sistemas e automacoes</p></div><button>Nova empresa <ChevronRight size={16} /></button></div>
      <div className="company-grid">
        {companies.map((company) => (
          <article className="company-card" key={company.name}>
            <div className="company-card-head"><div className="row-avatar">{company.name.slice(0, 2).toUpperCase()}</div><span>{company.fit}</span></div>
            <h3>{company.name}</h3>
            <p>{company.segment} - {company.size}</p>
            <div className="pain-box"><small>Dor principal</small><b>{company.pain}</b></div>
            <footer><span>{company.owner}</span><strong>{brl(company.value)}</strong></footer>
          </article>
        ))}
      </div>
    </section>
  );
}

function TasksModule({ tasks }: { tasks: Task[] }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Tarefas</h2><p>Rotina comercial para manter o funil em movimento</p></div><button>Nova tarefa <ChevronRight size={16} /></button></div>
      <div className="task-board">
        {tasks.map((task) => (
          <article className={task.done ? "task-card done" : "task-card"} key={`${task.company}-${task.title}`}>
            <div className="check-dot">{task.done ? "✓" : ""}</div>
            <div><b>{task.title}</b><span>{task.company} - {task.type}</span></div>
            <time>{task.time}</time>
            <em>{task.priority}</em>
          </article>
        ))}
      </div>
    </section>
  );
}

function SolutionsModule({ solutions }: { solutions: Solution[] }) {
  return (
    <section className="panel data-panel">
      <div className="panel-head"><div><h2>Solucoes Sykron</h2><p>Catalogo comercial para transformar dores em ofertas</p></div><button>Nova solucao <ChevronRight size={16} /></button></div>
      <div className="solutions-grid">
        {solutions.map((solution) => (
          <article className="solution-card" key={solution.name}>
            <div className="solution-icon"><WandSparkles size={19} /></div>
            <span>{solution.category}</span>
            <h3>{solution.name}</h3>
            <p>{solution.description}</p>
            <footer><b>{solution.price}</b><em>{solution.leads} leads</em></footer>
          </article>
        ))}
      </div>
    </section>
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
