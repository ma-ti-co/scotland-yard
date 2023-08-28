// src/routes/+layout.ts
import { invalidate } from '$app/navigation'
import { PUBLIC_SUPABASE_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import "../app.css";

export const load = async ({ fetch, data, depends }) => {
  // invalidates load function
  depends('supabase:auth')

  const supabase = createSupabaseLoadClient({
    supabaseUrl: PUBLIC_SUPABASE_URL,
    supabaseKey: PUBLIC_SUPABASE_KEY,
    event: { fetch },
    serverSession: data.session,
  })

  console.log()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const profile = session ? 
  await supabase
      .from("profiles")
      .select("*")
      .eq('id', session.user.id)
      .single()
  : null


  return { supabase, session, profile }
}