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
          let response = await addUsersToGame(invitations, game[0].id)
          console.log(response);
          throw redirect(303, '/profile')
          return response.filter(e => e !== undefined)
        }
    }catch(error){
      console.log(error)
    }
  }
}



async function addUsersToGame (invitations, game_id) {
  const promises = [];

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
    return results;

}
