"use client";

import { useMemo, useState } from "react";
import {
  Bell, Bot, BriefcaseBusiness, CalendarDays, ChevronDown, ChevronRight, CircleDollarSign,
  Clock3, ContactRound, LayoutDashboard, ListTodo, Menu, MoreHorizontal, Plus,
  Search, Settings, Sparkles, Target, TrendingUp, Users, WandSparkles, X, Zap,
} from "lucide-react";

type Deal = { id: number; company: string; title: string; value: number; stage: string; person: string; initials: string; color: string; due: string; tag: string };

const initialDeals: Deal[] = [
  { id: 1, company: "Clínica Aurora", title: "Dashboard executivo de atendimento", value: 8900, stage: "Novos leads", person: "Marina", initials: "CA", color: "#00b9f2", due: "Hoje", tag: "Dashboard" },
  { id: 2, company: "Vértice Imóveis", title: "Sistema inteligente de gestão comercial", value: 12400, stage: "Diagnóstico", person: "Rafael", initials: "VI", color: "#e9784d", due: "Amanhã", tag: "Sistema" },
  { id: 3, company: "Studio Uno", title: "Automação de propostas e follow-up", value: 4800, stage: "Diagnóstico", person: "Marina", initials: "SU", color: "#198f78", due: "22 jul", tag: "Automação" },
  { id: 4, company: "Almeida Contábil", title: "BI financeiro e indicadores estratégicos", value: 15600, stage: "Proposta", person: "Jefferson", initials: "AC", color: "#bd6db5", due: "24 jul", tag: "BI" },
  { id: 5, company: "Move Academia", title: "Mapeamento e melhoria de processos", value: 6300, stage: "Proposta", person: "Rafael", initials: "MA", color: "#d59823", due: "25 jul", tag: "Gestão" },
  { id: 6, company: "Norte Solar", title: "Integração da operação comercial", value: 18900, stage: "Negociação", person: "Jefferson", initials: "NS", color: "#3c7dd9", due: "Hoje", tag: "Integração" },
];

const stages = ["Novos leads", "Diagnóstico", "Proposta", "Negociação"];
const brl = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(n);

export default function Home() {
  const [active, setActive] = useState("Visão geral");
  const [deals, setDeals] = useState(initialDeals);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [menu, setMenu] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ company: "", title: "", value: "", stage: "Novos leads" });

  const filtered = useMemo(() => deals.filter(d => `${d.company} ${d.title}`.toLowerCase().includes(query.toLowerCase())), [deals, query]);
  const total = deals.reduce((sum, d) => sum + d.value, 0);

  function addDeal(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company || !form.title) return;
    setDeals(prev => [...prev, { id: Date.now(), company: form.company, title: form.title, value: Number(form.value) || 0, stage: form.stage, person: "Jefferson", initials: form.company.slice(0, 2).toUpperCase(), color: "#00b9f2", due: "Novo", tag: "Solução" }]);
    setForm({ company: "", title: "", value: "", stage: "Novos leads" });
    setModal(false); setToast("Oportunidade criada com sucesso");
    setTimeout(() => setToast(""), 2800);
  }

  const nav = [
    ["Visão geral", LayoutDashboard], ["Funil de vendas", Target], ["Contatos", ContactRound],
    ["Empresas", BriefcaseBusiness], ["Tarefas", ListTodo], ["Soluções", WandSparkles],
  ] as const;

  return <div className="app-shell">
    <aside className={menu ? "sidebar open" : "sidebar"}>
      <div className="brand"><div className="brand-mark"><span className="sykron-diamond"/></div><span>SYKRON</span><button className="close-mobile" onClick={() => setMenu(false)}><X size={20}/></button></div>
      <div className="workspace"><div className="workspace-avatar">SY</div><div><b>Sykron</b><small>Inteligência Empresarial</small></div><ChevronDown size={15}/></div>
      <nav>
        <small className="nav-label">GESTÃO</small>
        {nav.map(([label, Icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => {setActive(label); setMenu(false)}}><Icon size={18}/><span>{label}</span>{label === "Tarefas" && <em>4</em>}</button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade"><Sparkles size={20}/><b>Meta Sykron</b><p>R$ 66,9 mil de R$ 100 mil em oportunidades neste mês.</p><button>Ver planejamento</button></div>
        <button className="settings"><Settings size={18}/> Configurações</button>
        <div className="profile"><div className="profile-avatar">JO</div><div><b>Jefferson Oliveira</b><small>Administrador</small></div><MoreHorizontal size={18}/></div>
      </div>
    </aside>

    <main>
      <header className="topbar">
        <button className="menu-mobile" onClick={() => setMenu(true)}><Menu size={22}/></button>
        <div className="search"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar clientes, oportunidades..."/><kbd>⌘ K</kbd></div>
        <button className="icon-btn"><Bell size={19}/><span/></button>
        <button className="primary" onClick={() => setModal(true)}><Plus size={18}/> Nova oportunidade</button>
      </header>

      <div className="content">
        <section className="welcome"><div><p className="eyebrow">SYKRON · INTELIGÊNCIA EMPRESARIAL</p><h1>Bom dia, Jefferson <span>👋</span></h1><p>Sincronizando processos. Potencializando resultados.</p></div><button className="secondary"><CalendarDays size={17}/> Últimos 30 dias <ChevronDown size={15}/></button></section>

        <section className="metrics">
          <Metric icon={CircleDollarSign} label="Pipeline total" value={brl(total)} note="12,5% este mês" up color="violet" />
          <Metric icon={Target} label="Oportunidades" value={String(deals.length + 18)} note="6 novas esta semana" color="blue" />
          <Metric icon={TrendingUp} label="Taxa de conversão" value="31,8%" note="4,2% este mês" up color="green" />
          <Metric icon={Clock3} label="Ticket médio" value="R$ 11.480" note="Ciclo médio: 18 dias" color="orange" />
        </section>

        <section className="panel pipeline-panel">
          <div className="panel-head"><div><h2>Pipeline de vendas</h2><p>Acompanhe suas negociações em andamento</p></div><button onClick={() => setActive("Funil de vendas")}>Ver funil completo <ChevronRight size={16}/></button></div>
          <div className="pipeline-summary"><div><span className="live-dot"/> <b>{filtered.length} oportunidades ativas</b></div><strong>{brl(filtered.reduce((s,d) => s+d.value, 0))}</strong></div>
          <div className="kanban">
            {stages.map((stage, index) => <div className="column" key={stage}>
              <div className="column-head"><span className={`stage-dot s${index}`}/><b>{stage}</b><em>{filtered.filter(d => d.stage === stage).length}</em><small>{brl(filtered.filter(d => d.stage === stage).reduce((s,d)=>s+d.value,0))}</small></div>
              <div className="cards">
                {filtered.filter(d => d.stage === stage).map(deal => <article className="deal-card" key={deal.id}>
                  <div className="deal-top"><div className="company-avatar" style={{background: deal.color}}>{deal.initials}</div><span className="tag">{deal.tag}</span><button><MoreHorizontal size={17}/></button></div>
                  <h3>{deal.title}</h3><p>{deal.company}</p><strong>{brl(deal.value)}</strong>
                  <div className="deal-footer"><span><Clock3 size={13}/> {deal.due}</span><span className="person">{deal.person.slice(0,1)}</span></div>
                </article>)}
                <button className="add-card" onClick={() => {setForm(f=>({...f,stage}));setModal(true)}}><Plus size={15}/> Adicionar oportunidade</button>
              </div>
            </div>)}
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel tasks-panel"><div className="panel-head"><div><h2>Próximas atividades</h2><p>Prioridades para hoje</p></div><button>Ver todas</button></div>
            <Activity color="purple" time="10:30" title="Reunião de diagnóstico" company="Vértice Imóveis" type="Reunião" />
            <Activity color="orange" time="14:00" title="Apresentar proposta comercial" company="Almeida Contábil" type="Proposta" />
            <Activity color="green" time="16:30" title="Follow-up da negociação" company="Norte Solar" type="Ligação" />
          </div>
          <div className="panel automations-panel"><div className="panel-head"><div><h2>Portfólio Sykron</h2><p>Inteligência aplicada ao negócio</p></div><div className="zap-icon"><Zap size={18}/></div></div>
            <div className="automation-stat"><div className="bot-icon"><Bot size={23}/></div><div><b>8</b><span>soluções empresariais</span></div><div><b>6</b><span>projetos no pipeline</span></div></div>
            <div className="automation-item"><span className="status-dot"/><div><b>BI, dashboards e indicadores</b><small>Dados transformados em decisão</small></div><em>3 leads</em></div>
            <div className="automation-item"><span className="status-dot"/><div><b>Sistemas, integrações e automação</b><small>Operações conectadas de ponta a ponta</small></div><em>3 leads</em></div>
          </div>
        </section>
      </div>
    </main>

    {modal && <div className="modal-backdrop" onMouseDown={() => setModal(false)}><div className="modal" onMouseDown={e=>e.stopPropagation()}>
      <div className="modal-head"><div><span className="modal-icon"><BriefcaseBusiness size={20}/></span><div><h2>Nova oportunidade</h2><p>Adicione uma negociação ao seu pipeline.</p></div></div><button onClick={()=>setModal(false)}><X size={20}/></button></div>
      <form onSubmit={addDeal}><label>Empresa<input autoFocus placeholder="Ex.: Empresa Horizonte" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/></label><label>Solução identificada<input placeholder="Ex.: Redesenho do processo comercial" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label><div className="form-row"><label>Valor estimado<input type="number" placeholder="R$ 0" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/></label><label>Etapa<select value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>{stages.map(s=><option key={s}>{s}</option>)}</select></label></div><div className="modal-actions"><button type="button" className="cancel" onClick={()=>setModal(false)}>Cancelar</button><button className="primary" type="submit"><Plus size={17}/> Criar oportunidade</button></div></form>
    </div></div>}
    {toast && <div className="toast"><span>✓</span>{toast}</div>}
  </div>;
}

function Metric({ icon: Icon, label, value, note, up, color }: {icon: React.ElementType; label:string; value:string; note:string; up?:boolean; color:string}) {
  return <article className="metric"><div className={`metric-icon ${color}`}><Icon size={21}/></div><div className="metric-copy"><span>{label}</span><strong>{value}</strong><small className={up ? "positive" : ""}>{up && "↗ "}{note}</small></div><button><MoreHorizontal size={18}/></button></article>
}

function Activity({color,time,title,company,type}:{color:string;time:string;title:string;company:string;type:string}) {
  return <div className="activity"><div className={`activity-icon ${color}`}><CalendarDays size={18}/></div><div className="activity-copy"><b>{title}</b><span>{company} · {type}</span></div><time>{time}</time><ChevronRight size={16}/></div>
}
