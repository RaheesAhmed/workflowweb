-- Create usage tracking table
CREATE TABLE user_usage (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  month_year text NOT NULL, -- Format: "2024-01"
  workflows_used integer DEFAULT 0,
  voice_minutes_used integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, month_year)
);

-- Enable RLS
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own usage
CREATE POLICY "Users can view own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can update their own usage
CREATE POLICY "Users can update own usage" ON user_usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can insert their own usage
CREATE POLICY "Users can insert own usage" ON user_usage
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create mcp_servers table
create table public.mcp_servers (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    url text not null,
    authorization_token text,
    tool_configuration jsonb default '{"enabled": true}'::jsonb,
    status text default 'disconnected' check (status in ('connected', 'disconnected', 'testing')),
    tools jsonb default '[]'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table public.mcp_servers enable row level security;

-- Policy for users to view their own MCP servers
create policy "Users can view their own MCP servers"
    on public.mcp_servers for select
    using (auth.uid() = user_id);

-- Policy for users to insert their own MCP servers
create policy "Users can insert their own MCP servers"
    on public.mcp_servers for insert
    with check (auth.uid() = user_id);

-- Policy for users to update their own MCP servers
create policy "Users can update their own MCP servers"
    on public.mcp_servers for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for users to delete their own MCP servers
create policy "Users can delete their own MCP servers"
    on public.mcp_servers for delete
    using (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger handle_mcp_servers_updated_at
    before update on public.mcp_servers
    for each row
    execute procedure public.handle_updated_at();

-- Add indexes for better performance
create index mcp_servers_user_id_idx on public.mcp_servers(user_id);
create index mcp_servers_status_idx on public.mcp_servers(status);

-- Create n8n_connections table
create table public.n8n_connections (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    instance_name text not null,
    base_url text not null,
    api_key text not null,
    is_active boolean default true,
    last_connected timestamp with time zone,
    connection_status text default 'connected' check (connection_status in ('connected', 'disconnected', 'error')),
    version text,
    workflow_count integer default 0,
    execution_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for n8n_connections
alter table public.n8n_connections enable row level security;

-- Policy for users to view their own n8n connections
create policy "Users can view their own n8n connections"
    on public.n8n_connections for select
    using (auth.uid() = user_id);

-- Policy for users to insert their own n8n connections
create policy "Users can insert their own n8n connections"
    on public.n8n_connections for insert
    with check (auth.uid() = user_id);

-- Policy for users to update their own n8n connections
create policy "Users can update their own n8n connections"
    on public.n8n_connections for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy for users to delete their own n8n connections
create policy "Users can delete their own n8n connections"
    on public.n8n_connections for delete
    using (auth.uid() = user_id);

-- Create trigger to automatically update updated_at timestamp for n8n_connections
create trigger handle_n8n_connections_updated_at
    before update on public.n8n_connections
    for each row
    execute procedure public.handle_updated_at();

-- Add indexes for better performance
create index n8n_connections_user_id_idx on public.n8n_connections(user_id);
create index n8n_connections_is_active_idx on public.n8n_connections(is_active);
create index n8n_connections_status_idx on public.n8n_connections(connection_status); 


create table public.workflows (
  id serial not null,
  filename text not null,
  name text not null,
  active boolean not null default true,
  trigger_type text not null,
  complexity text not null,
  node_count integer not null,
  integrations jsonb not null,
  description text null,
  file_hash text not null,
  analyzed_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  created_at timestamp without time zone not null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone not null,
  constraint workflows_pkey primary key (id)
) TABLESPACE pg_default;

create unique INDEX IF not exists workflows_filename_key on public.workflows using btree (filename) TABLESPACE pg_default;

create index IF not exists workflows_name_idx on public.workflows using btree (name) TABLESPACE pg_default;

create index IF not exists workflows_trigger_type_idx on public.workflows using btree (trigger_type) TABLESPACE pg_default;

create index IF not exists workflows_complexity_idx on public.workflows using btree (complexity) TABLESPACE pg_default;

create index IF not exists workflows_node_count_idx on public.workflows using btree (node_count) TABLESPACE pg_default;