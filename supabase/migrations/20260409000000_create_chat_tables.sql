-- Sessions: one row per scenario conversation
create table sessions (
  id           uuid primary key default gen_random_uuid(),
  scenario_id  text not null,
  scenario_label text not null,
  character_name text not null,
  created_at   timestamptz default now(),
  ended_at     timestamptz
);

-- Messages: every user input + assistant reply in a session
create table messages (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references sessions(id) on delete cascade not null,
  role        text not null check (role in ('user', 'assistant')),
  user_text   text,
  reply       text,
  feedback    jsonb,
  created_at  timestamptz default now()
);

-- Indexes for common queries
create index messages_session_id_idx on messages(session_id);
create index messages_created_at_idx on messages(created_at);

-- RLS: enable but allow anon access (no auth in Phase 1)
alter table sessions enable row level security;
alter table messages enable row level security;

create policy "anon can insert sessions" on sessions for insert to anon with check (true);
create policy "anon can select sessions" on sessions for select to anon using (true);
create policy "anon can update sessions" on sessions for update to anon using (true);

create policy "anon can insert messages" on messages for insert to anon with check (true);
create policy "anon can select messages" on messages for select to anon using (true);
