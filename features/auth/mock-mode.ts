/**
 * True when Supabase isn't configured with a real project (local/dev setup
 * using the placeholder values from .env.example). Lets auth flows succeed
 * without a live Supabase project so the app remains demoable locally.
 */
export function isSupabaseMockMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return !url || url === "https://mock.supabase.co";
}
