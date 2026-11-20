-- Rode no Supabase: SQL Editor → New query → cole tudo → Run. Pode rodar de novo sem problema.
-- Sincronização por código: cada código (8 letras/números) guarda um progresso.
-- Ninguém lê nem lista a tabela diretamente; o app só consegue
-- ler ou gravar o progresso de um código que ele já conhece.

create table if not exists public.sync_slots (
  code       text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.sync_slots enable row level security;
alter table public.sync_slots force row level security;
-- Sem nenhuma policy e sem nenhuma permissão: acesso direto à tabela fica bloqueado.
-- O acesso acontece só pelas duas funções abaixo.
revoke all on table public.sync_slots from anon, authenticated, public;

create or replace function public.sync_get(p_code text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select data from public.sync_slots
  where p_code ~ '^[A-Za-z0-9]{8}$' and code = upper(p_code);
$$;

create or replace function public.sync_put(p_code text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_code is null or p_code !~ '^[A-Z0-9]{8}$' then
    raise exception 'codigo invalido';
  end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'progresso invalido';
  end if;
  if pg_column_size(p_data) > 300000 then
    raise exception 'progresso grande demais';
  end if;
  -- App pessoal: no máximo 10 códigos no total. Impede que alguém encha o banco.
  if not exists (select 1 from public.sync_slots where code = p_code)
     and (select count(*) from public.sync_slots) >= 10 then
    raise exception 'limite de codigos atingido';
  end if;
  insert into public.sync_slots (code, data, updated_at)
  values (p_code, p_data, now())
  on conflict (code) do update set data = excluded.data, updated_at = now();
end;
$$;

revoke all on function public.sync_get(text) from public, anon, authenticated;
revoke all on function public.sync_put(text, jsonb) from public, anon, authenticated;
grant execute on function public.sync_get(text) to anon;
grant execute on function public.sync_put(text, jsonb) to anon;

-- Limpa a linha usada no teste da instalação.
delete from public.sync_slots where code = 'TESTE234';
