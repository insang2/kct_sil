-- admin_documents has policies (admin_all_documents) but RLS was never enabled,
-- so the policies were silently not enforced. Enable RLS to close the gap.
ALTER TABLE public.admin_documents ENABLE ROW LEVEL SECURITY;
