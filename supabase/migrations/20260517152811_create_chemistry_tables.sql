-- ============================================================
-- Chemistry revision schema — Year 9 Forest School
-- ============================================================

-- TABLE 1: chem_skills
create table if not exists public.chem_skills (
  id            uuid primary key default gen_random_uuid(),
  topic_num     int not null check (topic_num between 1 and 5),
  topic_name    text not null,
  skill_ref     text not null unique,
  skill_text    text not null,
  question_type text not null check (
    question_type in (
      'recall', 'describe', 'explain', 'calculate', 'balance', 'diagram'
    )
  ),
  diagram_req   boolean not null default false,
  ao_tag        text not null check (ao_tag in ('AO1', 'AO2', 'AO3')),
  created_at    timestamptz not null default now()
);

-- TABLE 2: chem_content
create table if not exists public.chem_content (
  id          uuid primary key default gen_random_uuid(),
  skill_id    uuid not null references public.chem_skills(id) on delete cascade,
  type        text not null check (
    type in (
      'definition', 'concept', 'worked_example',
      'equation', 'mnemonic', 'common_error'
    )
  ),
  content     text not null,
  created_at  timestamptz not null default now()
);

-- TABLE 3: chem_problems
create table if not exists public.chem_problems (
  id           uuid primary key default gen_random_uuid(),
  skill_id     uuid not null references public.chem_skills(id) on delete cascade,
  difficulty   text not null check (
    difficulty in ('foundation', 'standard', 'stretch')
  ),
  question     text not null,
  hint         text,
  answer       text not null,
  times_served int not null default 0,
  created_at   timestamptz not null default now()
);

-- TABLE 4: chem_progress
create table if not exists public.chem_progress (
  id           uuid primary key default gen_random_uuid(),
  skill_id     uuid not null references public.chem_skills(id) on delete cascade,
  problem_id   uuid references public.chem_problems(id) on delete set null,
  attempt_num  int not null check (attempt_num between 1 and 4),
  attempted_at date not null default current_date,
  confidence   text not null check (confidence in ('red', 'amber', 'green')),
  next_review  date,
  created_at   timestamptz not null default now(),
  unique (skill_id, attempt_num)
);

-- INDEXES
create index if not exists idx_chem_skills_topic
  on public.chem_skills(topic_num);

create index if not exists idx_chem_content_skill
  on public.chem_content(skill_id);

create index if not exists idx_chem_problems_skill_difficulty
  on public.chem_problems(skill_id, difficulty);

create index if not exists idx_chem_progress_next_review
  on public.chem_progress(next_review);

-- ROW LEVEL SECURITY
alter table public.chem_skills    enable row level security;
alter table public.chem_content   enable row level security;
alter table public.chem_problems  enable row level security;
alter table public.chem_progress  enable row level security;

create policy "read chem_skills"
  on public.chem_skills for select
  to authenticated, anon using (true);

create policy "read chem_content"
  on public.chem_content for select
  to authenticated, anon using (true);

create policy "read chem_problems"
  on public.chem_problems for select
  to authenticated, anon using (true);

create policy "insert chem_problems"
  on public.chem_problems for insert
  to authenticated with check (true);

create policy "update chem_problems"
  on public.chem_problems for update
  to authenticated using (true);

create policy "manage chem_progress"
  on public.chem_progress for all
  to authenticated using (true) with check (true);

-- HELPER FUNCTION: next review date from confidence + attempt
create or replace function public.calc_next_review(
  p_confidence text,
  p_attempt_num int
) returns date
language plpgsql as $$
begin
  return case
    when p_confidence = 'red'                              then current_date + 1
    when p_confidence = 'amber'                            then current_date + 3
    when p_confidence = 'green' and p_attempt_num >= 2    then current_date + 14
    when p_confidence = 'green'                            then current_date + 7
    else current_date + 3
  end;
end;
$$;
