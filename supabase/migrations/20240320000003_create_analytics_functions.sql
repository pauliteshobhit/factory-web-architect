-- Function to get auth event summary
CREATE OR REPLACE FUNCTION public.get_auth_summary()
RETURNS TABLE (
  total_signups bigint,
  total_logins bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) FILTER (WHERE event_type = 'signup') as total_signups,
    COUNT(*) FILTER (WHERE event_type = 'login') as total_logins
  FROM public.user_auth_events;
END;
$$;

-- Function to get click summary
CREATE OR REPLACE FUNCTION public.get_click_summary()
RETURNS TABLE (
  total_clicks bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT COUNT(*) as total_clicks
  FROM public.project_clicks;
END;
$$;

-- Function to get top clicked projects
CREATE OR REPLACE FUNCTION public.get_top_clicked_projects()
RETURNS TABLE (
  project_title text,
  click_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    project_title,
    COUNT(*) as click_count
  FROM public.project_clicks
  GROUP BY project_title
  ORDER BY click_count DESC
  LIMIT 5;
END;
$$;

-- Function to get common signup sources
CREATE OR REPLACE FUNCTION public.get_common_signup_sources()
RETURNS TABLE (
  source_slug text,
  count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    source_slug,
    COUNT(*) as count
  FROM public.user_auth_events
  WHERE event_type = 'signup'
  GROUP BY source_slug
  ORDER BY count DESC
  LIMIT 5;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_auth_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_click_summary() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_top_clicked_projects() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_common_signup_sources() TO authenticated; 