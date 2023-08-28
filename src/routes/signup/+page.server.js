import { redirect } from '@sveltejs/kit';

// getting locals from main layout.ts
// check for current session -> if true redirect to profile

export const load = async ({locals: {getSession}}) => {
  const session = await getSession()

  if(session){
    throw redirect(301, '/profile');
  }
  return {}
}

export const actions = {
  default: async ({request, locals: {supabase, getSession}}) => {
    const data = await request.formData();
    const uname = data.get('uname')
    const email = data.get('email');
    const password = data.get('password');
    if(email && password && uname){
      const { data:user, error } = await supabase.auth.signInWithPassword({
        uname: uname,
        email: email,
        password: password,
      })
      if(error){
        console.log(error);
      }
      console.log(user)
    }
  }
}