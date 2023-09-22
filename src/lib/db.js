export const get_game_data_by_id = async (supabaseClient, id) => {
  const {data:game, error} = await supabaseClient
  .from("games")
  .select("*, profiles(*), user_games(user_id, moves)")
  .eq('id', id)
  if(error){
    return error
    //throw  redirect(302, '/profile');
  }else if(game && !game.length){
    return null;
  }else{
    return game[0];
  }
}

export const delete_game_by_id = async (supabaseClient, id) => {
  const {data, error} = await supabaseClient
      .from('games')
      .delete()
      .eq('id', id)
      .select()
    if(error || data.length === 0){
      return {
        success:false
      }
    }
    return {
      success:true
    };
}


export const upload_profile_image = async (supabaseClient,  img, user_id) => {
  const {data, error} = await supabaseClient
    .storage
    .from('avatars')
    .upload(user_id + "/", img);
  if(error){
    return error
  }else{
    const { data:imagePath } = supabaseClient
    .storage
      .from('avatars')
      .getPublicUrl(data.path)
    const {data:_, error} = await supabaseClient
    .from('profiles')
    .update({avatar_url:imagePath})
    .eq('id', user_id);
    console.log(imagePath);
    return imagePath;
  }
}

export const replace_profile_image = async (supabaseClient, img, user_id) => {
  const { data, error } = await supabaseClient
  .storage
  .from('avatars')
  .update(`${user_id}`, img, {
    cacheControl: '3600',
    upsert: true
  })
}


export const delete_profile_image = async (supabaseClient, user_id) => {
  const { data:file, error } = await supabaseClient
  .storage
  .from('avatars')
  .remove([`${user_id}`])
  if(!error){
    const {data, error} = await supabaseClient
      .from('profiles')
      .update({avatar_url: null})
      .eq('id', user_id)
  }
}