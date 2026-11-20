-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Sincronização por código: cada código (8 letras/números) guarda um progresso.
-- Ninguém lê nem lista a tabela diretamente; o app só consegue
-- ler ou gravar o progresso de um código que ele já conhece.

create table if not exists public.sync_slots (
  code       text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.sync_slots enable row level security;
-- Sem nenhuma policy: acesso direto à tabela fica bloqueado.
-- O acesso acontece só pelas duas funções abaixo.

create or replace function public.sync_get(p_code text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  select data from public.sync_slots where code = upper(p_code);
$$;

create or replace function public.sync_put(p_code text, p_data jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_code !~ '^[A-Z0-9]{8}$' then
    raise exception 'codigo invalido';
  end if;
  if pg_column_size(p_data) > 1000000 then
    raise exception 'progresso grande demais';
  end if;
  insert into public.sync_slots (code, data, updated_at)
  values (p_code, p_data, now())
  on conflict (code) do update set data = excluded.data, updated_at = now();
end;
$$;

revoke all on function public.sync_get(text) from public;
revoke all on function public.sync_put(text, jsonb) from public;
grant execute on function public.sync_get(text) to anon;
grant execute on function public.sync_put(text, jsonb) to anon;
