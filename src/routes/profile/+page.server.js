import { redirect } from '@sveltejs/kit';

// getting locals from main layout.ts
// check for current session -> if true redirect to profile

export const load = async ({locals:{supabase, getProfile, getSession}}) => {
  const session = await getSession();
  if(!session){
    throw redirect(303, '/login');
  }
  return {
    
  }
}