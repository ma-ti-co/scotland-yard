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
    console.log(data);
    const { data:image } = supabaseClient
    .storage
      .from('avatars')
      .getPublicUrl(data.path)
    return image;
  }
}