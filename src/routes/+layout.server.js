export const load = async ({ locals: { supabase, getProfile ,getSession } }) => {
  let session = await getSession();


  return {
    session
  }
}