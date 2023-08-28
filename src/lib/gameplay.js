import { supabase } from "../utils/supabaseClient";



export async function choosePlayerRoles(gameData, id){
  const {data, error} = await supabase
      .from('games')
      .update({mister_x: id})
      .eq('id', gameData.id)
      .select()
      if(error){
        return error
      }else{
        return data
      }
}
export async function restPlayerRoles(gameData){
  const {data, error} = await supabase
      .from('games')
      .update({mister_x: null})
      .eq('id', gameData.id)
      .select()
      if(error){
        return error
      }else{
        return data
      }
}

// create first random station for all players and set first move
// to first non criminal player
export async function createGameStartConstellation(gameData){
  // game was already set up;
  if(gameData.game_status > 0) return;
  let current_stations = {};
  let current_latlng = {};
  let players = gameData.profiles.reduce((prev, node) => [...prev, node.id], []);
  let players_sorted = sortPlayers(players, gameData.mister_x);
  for(let i = 0; i < gameData.profiles.length; i++){
    let random = getRandomInteger(gameData.allowed_stops.length);
    current_stations[`${gameData.profiles[i].id}`] = gameData.allowed_stops[random].name
    current_latlng[`${gameData.profiles[i].id}`] = [gameData.allowed_stops[random].location.longitude, gameData.allowed_stops[random].location.latitude]
  }

  const {data, error} = await supabase
      .from('games')
      .update(
        {
          current_position_in_latlng: current_latlng,
          current_position_by_station: current_stations, 
          game_status: 1,
          next_move:players_sorted[0],
          moves_in_order:players_sorted
        })
      .eq('id', gameData.id)
      .select()
      if(error){
        return error
      }else{
        return data
      }
}


export async function checkInUser(data){
  const {
    user_id,
    game_id,
    current_stations,
    current_latlng,
    next_move,
    moves_in_order,
    moves_history,
    misterX,
    data_to_update
  } = data;
  misterXIsVisible(moves_history, misterX);
  moves_history.push({[user_id]:data_to_update.name})
  let index = moves_in_order.indexOf(next_move);
  let new_index = index===moves_in_order.length-1 ? 0 : index+1;
  let new_move = moves_in_order[new_index];
  current_stations[`${user_id}`] = data_to_update.name;
  current_latlng[`${user_id}`] = data_to_update.lnglat;
  const {data: newData, error} = await supabase
    .from('games')
    .update({
      current_position_in_latlng: current_latlng,
      current_position_by_station: current_stations, 
      next_move: new_move,
      moves_history:moves_history,
      misterX_is_visible:misterXIsVisible(moves_history, misterX)
    })
    .eq('id', game_id)
    .select()
    if(error){
      console.log(error);
      return error
    }else{
      console.log(newData);
    }
}

// after each move by mister X checks the
// current visibility

export function misterXIsVisible(data, misterX){
  let count = 0;
  data.forEach((node) => {
   node.hasOwnProperty([misterX]) ? count++:''
  });
  return (count === 3 || count === 6 || count === 9)
}



function getRandomInteger(max) {
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - 1));
}

function sortPlayers(arr, firstMove) {
  const index = arr.indexOf(firstMove);
  if (index !== -1) {
    arr.splice(index, 1); 
    arr.sort();
    arr.unshift(firstMove); 
    return arr
  }
}