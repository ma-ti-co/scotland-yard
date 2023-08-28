import { redirect } from '@sveltejs/kit';



// check for current session -> if true redirect to profile

export const load = async ({params, locals: {supabase, getSession}}) => {
  let gameData;
  const session = await getSession()
  if(!session){
    throw redirect(302, '/login')
  } 
  const {id} = params
  const {data:game, error} = await supabase
  .from("games")
  .select("*, profiles(*)")
  .eq('id', id)
  .single()
  if(error){
    //console.log(error)
    throw  redirect(302, '/profile');
  }
  if(game){
    if(!accessAllowed(game.profiles, session.user.id)){
      console.log("hier");
      throw  redirect(302, '/profile');
    }
    gameData = game
  }
  return {id, gameData , session}
}

// middleware function checks if user is allowed to access
function accessAllowed(allowed_players, user_id){
  return allowed_players.some((node) => node.id === user_id);
}