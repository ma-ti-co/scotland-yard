import { redirect } from '@sveltejs/kit';
import {get_game_data_by_id} from '$lib/db.js'



// check for current session -> if true redirect to profile

export const load = async ({params, locals: {supabase, getSession}}) => {
  const session = await getSession()
  if(!session){
    throw redirect(302, '/login')
  } 
  const {id} = params
  const gameData = await get_game_data_by_id(supabase, id)
  if(gameData === null){
    throw  redirect(300, '/profile');
  }else{
    if(!accessAllowed(gameData.profiles, session.user.id)){
      throw  redirect(300, '/profile');
    }
  }
  return {id, gameData , session}
}

// middleware function checks if user is allowed to access
function accessAllowed(allowed_players, user_id){
  return allowed_players.some((node) => node.id === user_id);
}