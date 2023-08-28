import { redirect , fail} from '@sveltejs/kit';



// getting locals from main layout.ts
// check for current session -> if true redirect to profile

export const load = async ({cookies, locals: {getSession}}) => {
  const session = await getSession()

  if(session){
    throw redirect(301, '/profile');
  }
  return {}
}

export const actions = {
  default: async ({request, locals: {supabase, getSession}}) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');
    let errors = [];
    if(!email){
      errors.push({email:false})
    }
    if(!password){
      errors.push({password:false})
    }
    if(errors.length){
      return fail(400, errors);
    }
    if(email && password){
      const { data:user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if(error){
        return fail(400, {credentials:false})
        //return JSON.stringify(error);
      }
    }
  }
}






