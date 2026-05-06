import 'server-only';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl?.trim()) {
  throw new Error(
    'NEXT_PUBLIC_SUPABASE_URL が設定されていません（Vercel の Environment Variables を確認してください）'
  );
}

const serverKey = serviceRoleKey?.trim() || anonKey?.trim();
if (!serverKey) {
  throw new Error(
    'SUPABASE_SERVICE_ROLE_KEY または NEXT_PUBLIC_SUPABASE_ANON_KEY のどちらかが必要です'
  );
}

const isNextProdBuild = process.env.NEXT_PHASE === 'phase-production-build';
if (
  !serviceRoleKey?.trim() &&
  process.env.NODE_ENV === 'production' &&
  !isNextProdBuild
) {
  console.warn(
    '[supabase] SUPABASE_SERVICE_ROLE_KEY が未設定です。anon キーのみでは RLS により API が拒否されることがあります。Vercel にサービスロールキーを設定してください。'
  );
}

/** API Route / サーバー専用。クライアントへインポートしないこと（server-only）。 */
export const supabase = createClient(supabaseUrl, serverKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
