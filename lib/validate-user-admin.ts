import { NextRequest } from 'next/server';
import { supabaseAdmin } from './supabase-admin';

async function validateUserAdmin(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;

  const token = authHeader.replace('Bearer ', '');

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return null;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') return null;

  return user;
}

export default validateUserAdmin;