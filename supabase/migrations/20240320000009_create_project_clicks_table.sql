-- Create project_clicks table
CREATE TABLE IF NOT EXISTS public.project_clicks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  project_id UUID NOT NULL REFERENCES public.projects(id),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.project_clicks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own clicks"
  ON public.project_clicks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clicks"
  ON public.project_clicks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_project_clicks_user_id ON public.project_clicks(user_id);
CREATE INDEX idx_project_clicks_project_id ON public.project_clicks(project_id);
CREATE INDEX idx_project_clicks_clicked_at ON public.project_clicks(clicked_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_project_clicks_updated_at
  BEFORE UPDATE ON public.project_clicks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at(); 