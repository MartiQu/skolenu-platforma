create table if not exists public.game_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_key text not null,
  subject_key text not null,
  score integer not null default 0,
  accuracy integer not null default 0,
  streak integer not null default 0,
  level_reached integer not null default 1,
  completed_at timestamptz not null default now()
);

create index if not exists game_results_user_idx on public.game_results (user_id, completed_at desc);
create index if not exists game_results_game_subject_idx on public.game_results (game_key, subject_key);

alter table public.game_results enable row level security;

create policy "Users can insert own game results"
  on public.game_results
  for insert
  with check (auth.uid() = user_id);

create policy "Users can view own game results"
  on public.game_results
  for select
  using (auth.uid() = user_id);
