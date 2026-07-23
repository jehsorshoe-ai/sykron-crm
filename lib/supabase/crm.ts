import type { SupabaseClient } from "@supabase/supabase-js";

export type CloudDeal = {
  local_id: number;
  company: string;
  title: string;
  value: number | string;
  stage: string;
  temperature: string;
  bucket: string;
  next_contact: string;
  history: string;
  person: string;
  due: string;
  tag: string;
  history_timeline: string;
};

export type CloudProspect = {
  record_key: string;
  company: string;
  segment: string;
  size: string;
  whatsapp: string;
  site: string;
  contact_hint: string;
  ease: string;
  source: string;
  pain: string;
  status: string;
  temperature: string;
  channel: string;
  next_action: string;
  message: string;
  history_timeline: string;
  last_interaction: string;
  next_return: string;
  potential: number | string;
};

export type CloudInteraction = {
  local_id: string;
  entity_type: "deal" | "prospect";
  entity_key: string;
  date: string;
  type: string;
  detail: string;
  pain?: string;
  objection?: string;
  solution?: string;
  next?: string;
  return_date?: string;
  status?: string;
  temperature?: string;
  owner_name?: string;
  link?: string;
};

export async function loadCloudCrm(client: SupabaseClient, userId: string) {
  const [dealsResult, prospectsResult, interactionsResult] = await Promise.all([
    client.from("crm_deals").select("*").eq("owner_id", userId),
    client.from("crm_prospects").select("*").eq("owner_id", userId),
    client.from("crm_interactions").select("*").eq("owner_id", userId).order("created_at", { ascending: true }),
  ]);

  const error = dealsResult.error || prospectsResult.error || interactionsResult.error;
  if (error) throw error;

  return {
    deals: (dealsResult.data || []) as CloudDeal[],
    prospects: (prospectsResult.data || []) as CloudProspect[],
    interactions: (interactionsResult.data || []) as CloudInteraction[],
  };
}

export async function saveCloudDeal(client: SupabaseClient, userId: string, deal: Record<string, unknown>) {
  const { error } = await client.from("crm_deals").upsert({
    owner_id: userId,
    local_id: Number(deal.id),
    company: deal.company,
    title: deal.title,
    value: Number(deal.value) || 0,
    stage: deal.stage,
    temperature: deal.temperature,
    bucket: deal.bucket,
    next_contact: deal.nextContact,
    history: deal.history,
    person: deal.person,
    due: deal.due,
    tag: deal.tag,
    history_timeline: deal.historyTimeline || "",
    updated_at: new Date().toISOString(),
  }, { onConflict: "owner_id,local_id" });
  if (error) throw error;
}

export async function saveCloudProspect(client: SupabaseClient, userId: string, prospect: Record<string, unknown>) {
  const { error } = await client.from("crm_prospects").upsert({
    owner_id: userId,
    record_key: String(prospect.company),
    company: prospect.company,
    segment: prospect.segment,
    size: prospect.size,
    whatsapp: prospect.whatsapp,
    site: prospect.site,
    contact_hint: prospect.contactHint,
    ease: prospect.ease,
    source: prospect.source,
    pain: prospect.pain,
    status: prospect.status,
    temperature: prospect.temperature,
    channel: prospect.channel,
    next_action: prospect.nextAction,
    message: prospect.message,
    history_timeline: prospect.historyTimeline || "",
    last_interaction: prospect.lastInteraction || "",
    next_return: prospect.nextReturn || "",
    potential: Number(prospect.potential) || 0,
    updated_at: new Date().toISOString(),
  }, { onConflict: "owner_id,record_key" });
  if (error) throw error;
}

export async function saveCloudInteractions(client: SupabaseClient, userId: string, entityType: CloudInteraction["entity_type"], entityKey: string, interactions: CloudInteraction[]) {
  if (!interactions.length) return;
  const rows = interactions.map((interaction) => ({
    owner_id: userId,
    entity_type: entityType,
    entity_key: entityKey,
    local_id: String(interaction.local_id),
    date: interaction.date,
    type: interaction.type,
    detail: interaction.detail,
    pain: interaction.pain || null,
    objection: interaction.objection || null,
    solution: interaction.solution || null,
    next: interaction.next || null,
    return_date: interaction.return_date || null,
    status: interaction.status || null,
    temperature: interaction.temperature || null,
    owner_name: interaction.owner_name || null,
    link: interaction.link || null,
  }));
  const { error } = await client.from("crm_interactions").upsert(rows, { onConflict: "owner_id,entity_type,entity_key,local_id" });
  if (error) throw error;
}
