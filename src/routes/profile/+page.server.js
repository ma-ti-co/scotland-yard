import {fail, json, redirect } from '@sveltejs/kit';
import {delete_game_by_id, upload_profile_image, replace_profile_image ,delete_profile_image} from '$lib/db.js'
import {checkIfAllPlayersConfirmed} from '$lib/gameplay.js'

// getting locals from main layout.ts
// check for current session -> if true redirect to profile


export const load = async ({request, locals:{supabase, profile, getSession}}) => {
  const session = await getSession();
  
  if(!session){
    throw redirect(303, '/login');
  }
  let aggregateGameData = [];
  const {data:games, error:errorData} = await supabase
    .from('user_games')
    .select('game_id, games(*)')
    .eq('user_id', session.user.id);
    if(games){
      await Promise.all(games.map(async (game) => {
        const { data, error } = await supabase.rpc('all_games', { gid: game.game_id });
        aggregateGameData.push({ id:game.game_id, game_status:game.games.game_status ,owner:game.games.game_owner, data:data });
      }));
    }
    
  return {
    aggregateGameData
  }
}

export const actions = {
	create: async ({ cookies, request }) => {

	},

	deleteGame: async ({ request, locals: {supabase, getSession} }) => {
    const data = await request.formData();
    const id = data.get('game_id');
    const session = getSession();
    const _data = await delete_game_by_id(supabase, id);
    console.log(_data);
    // if(success){
    //   return {success:true}
    // }else{
    //   return fail(400, {msg:"Something went wrong."})
    // }
	},

  addPlayer: async ({ request, locals: {supabase, getSession}}) => {
    const data = await request.formData();
    const email = data.get('email');
    const game = data.get('game_id');
    const {data:user, error} = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email )
      .single();
    if(user){
      const {data:new_user, error} = await supabase
        .from('user_games')
        .insert({
          user_id:user.id,
          game_id:game
        })
      if(error && error.code==='23505'){
        return fail(400, {error:"User was already invited"})
      }
      if(!error){
        return {data:user}
      }
    }
  },

  removePlayer: async ({ request, locals: {supabase, getSession} }) => {
    const data = await request.formData();
    const id = data.get('user');
    const game_id = data.get('game_id');
    const {data:game} = await supabase
      .from('games')
      .select('*')
      .eq('id', game_id)
      .single()
    if(game.game_status > 0){
      return fail(400, {actionNotAllowed:true})
    }
		const {error} = await supabase
      .from('user_games')
      .delete()
      .match({user_id: id, game_id: game_id})
    if(!error){
      return {data:id}
    }
	},

  confirmInvitation: async ({request, locals: {supabase, getSession}}) => {
    const formData = await request.formData();
    const uid = formData.get('uid');
    const game_id = formData.get('game_id');
    const {data, error} = await supabase
      .from('user_games')
      .update({status:1})
      .match({'user_id': uid, 'game_id':game_id})
      .single();
    if(error){
      console.log(error);
      return {msg:"error"}
    }
    const game_status = await checkIfAllPlayersConfirmed(game_id);
    const game_is_active = game_status.some((node) => node.status !== 1)
    return {user_id:uid, game_is_active:!game_is_active}
  },



  uploadImage: async ({request, locals: {supabase, getSession}}) => {
    let session = await getSession();
    let form = await request.formData();
    let img = form.get('image');
    if(!img){
      return fail(400, { img, missing: true });
    }
    let user_id = session.user.id
    let upload = await upload_profile_image(supabase, img, user_id);
    console.log(upload);
    if(upload.statusCode === '409'){
      let upload = await replace_profile_image(supabase, img, user_id);
      console.log(upload);
    }
    return {img: upload.publicUrl}
  },


  deleteImage: async ({request, locals: {supabase, getSession}}) => {
    let session = await getSession();
    let user_id = session.user.id;
    console.log(user_id);
    const data = await delete_profile_image(supabase, user_id);
    console.log(data);
  },
};