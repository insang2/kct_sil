import { createClient } from '@supabase/supabase-js'

export const ADMIN_COOKIE = 'kct_admin_token'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** Returns session token on success, null on failure */
export async function verifyCredentials(username: string, password: string): Promise<string | null> {
  const { data } = await db().rpc('admin_login', { p_username: username, p_password: password })
  return (data as string | null) ?? null
}

/** Returns logged-in username, or null if session invalid/expired */
export async function verifySession(token: string): Promise<string | null> {
  const { data } = await db().rpc('admin_verify_session', { p_token: token })
  return (data as string | null) ?? null
}

/** Invalidates the session (logout) */
export async function logoutSession(token: string): Promise<void> {
  await db().rpc('admin_logout', { p_token: token })
}

/** Lists all admin accounts */
export async function listAdminUsers(token: string): Promise<Array<{ id: string; username: string; created_at: string }>> {
  const { data, error } = await db().rpc('admin_list_users', { p_token: token })
  if (error) throw error
  return (data as any[]) ?? []
}

/** Creates a new admin account. Returns false if username already exists. */
export async function createAdminUser(token: string, username: string, password: string): Promise<boolean> {
  const { data } = await db().rpc('admin_create_user', { p_token: token, p_username: username, p_password: password })
  return data === true
}

/** Deletes an admin account (cannot delete own account) */
export async function deleteAdminUser(token: string, targetUsername: string): Promise<boolean> {
  const { data } = await db().rpc('admin_delete_user', { p_token: token, p_target_username: targetUsername })
  return data === true
}

/** Changes password for any admin account */
export async function changeAdminPassword(token: string, targetUsername: string, newPassword: string): Promise<boolean> {
  const { data } = await db().rpc('admin_change_password', { p_token: token, p_target_username: targetUsername, p_new_password: newPassword })
  return data === true
}
