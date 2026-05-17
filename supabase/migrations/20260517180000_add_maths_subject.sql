-- ============================================================
-- Maths revision schema — Year 9 Forest School
-- Session M1: 4 tables mirroring the chem_* pattern
-- ============================================================

-- TABLE 1: maths_skills
create table if not exists public.maths_skills (
  id          uuid primary key default gen_random_uuid(),
  skill_ref   text unique not null,   -- e.g. MA1-01
  term        text not null,          -- Michaelmas 1 | Michaelmas 2 | Lent 1 | Lent 2 | Trinity 1 | Trinity 2
  skill_name  text not null,
  sort_order  integer not null
);
alter table public.maths_skills enable row level security;
create policy "public read maths_skills" on public.maths_skills for select using (true);

-- TABLE 2: maths_content
create table if not exists public.maths_content (
  id            uuid primary key default gen_random_uuid(),
  skill_id      uuid references public.maths_skills(id) on delete cascade,
  content_type  text not null check (content_type in ('concept','worked_example','common_error','mnemonic','definition','formula')),
  content_text  text not null
);
alter table public.maths_content enable row level security;
create policy "public read maths_content" on public.maths_content for select using (true);

-- TABLE 3: maths_problems (generated problem cache)
create table if not exists public.maths_problems (
  id             uuid primary key default gen_random_uuid(),
  skill_id       uuid references public.maths_skills(id) on delete cascade,
  difficulty     text not null check (difficulty in ('easy','medium','hard')),
  question_text  text not null,
  answer_text    text not null,
  hint_text      text,
  times_served   integer default 0,
  created_at     timestamptz default now()
);
alter table public.maths_problems enable row level security;
create policy "public read maths_problems"    on public.maths_problems for select using (true);
create policy "service insert maths_problems" on public.maths_problems for insert with check (true);
create policy "service update maths_problems" on public.maths_problems for update using (true);

-- TABLE 4: maths_progress (RAG attempt history, max 4 per skill per user)
create table if not exists public.maths_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  skill_id      uuid references public.maths_skills(id) on delete cascade,
  attempt_num   integer not null check (attempt_num between 1 and 4),
  confidence    text not null check (confidence in ('red','amber','green')),
  attempted_at  timestamptz default now(),
  next_review   date not null,
  unique (user_id, skill_id, attempt_num)
);
alter table public.maths_progress enable row level security;
create policy "user read own maths_progress"   on public.maths_progress for select  using (auth.uid() = user_id);
create policy "user insert own maths_progress" on public.maths_progress for insert  with check (auth.uid() = user_id);
create policy "user update own maths_progress" on public.maths_progress for update  using (auth.uid() = user_id);

-- INDEXES
create index if not exists idx_maths_content_skill
  on public.maths_content(skill_id);

create index if not exists idx_maths_problems_skill_difficulty
  on public.maths_problems(skill_id, difficulty);

create index if not exists idx_maths_progress_user_skill
  on public.maths_progress(user_id, skill_id);
