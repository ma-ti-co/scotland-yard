import { AuthApiError } from '@supabase/supabase-js';
import { fail, redirect } from '@sveltejs/kit';

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
    let errors = [];
    if(!uname){
      errors.push('uname')
    }
    if(!email){
      errors.push('email')
    }
    if(!password){
      errors.push('password')
    }
    if(errors.length){
      return fail(400, errors);
    }
    // form complete
    if(email && password && uname){
      const { data:user, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username:uname
          }
        }
      })
      // check duplicates
      if(error && error instanceof AuthApiError){
        return fail(400, {
          error: 'Invalid Email or password.'
        })
      }
      throw redirect(303, "/profile")
    }
  }
}