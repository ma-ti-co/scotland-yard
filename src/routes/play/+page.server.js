import { redirect } from '@sveltejs/kit';
import { supabase } from '../../utils/supabaseClient.js';

let invitations = [];
export const load = async ({locals: {getSession}}) => {
  const session = await getSession()
}


export const actions = {
  create: async ({request, locals: {supabase, getSession}}) => {
    const session = await getSession()
    const requestData = await request.formData();
    const gameData = {
      allowed_stops:JSON.parse(requestData.get('stops')),
      game_owner: session.user.id
    }

    requestData.forEach((value, key)=>{
      if(key.includes('player')){
        invitations.push(value)
      }
    })

    try{
      const { data:game, error } = await supabase
        .from('games')
        .insert([
          gameData
        ])
        .select()  
        if(error){
          console.log(error)
        }else{
          let response = await _addUsersToGame(invitations, game[0].id, session.user.id)
        }
    }catch(error){
      console.log(error)
    }finally{
      throw redirect(303, '/profile');
    }
  }
}



export async function _addUsersToGame (invitations, game_id, user_id) {
  const promises = [];
  const {data, error} = await supabase
    .from('user_games')
    .insert([{
     user_id:user_id, 
     game_id:game_id,
      status:1
  }])
  console.log(invitations);
  invitations.forEach((email) => {
    promises.push(
      (async () => {
        const { data:user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)  
      .single()
      if(error){
        return email
      }else{
        const {data, err} = await supabase
        .from('user_games')
        .insert([{
          user_id:user.id,
          game_id:game_id
        }])
        .select()
        if(error){
          return error
        }
   }
      })()
    )
  })

    // Wait for all promises to resolve
  const results = await Promise.all(promises);


}
