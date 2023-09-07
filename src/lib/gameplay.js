import { supabase } from "../utils/supabaseClient";
import { game_data, focus_state, user_id, visible_stops } from "../store";


let _game_data;
let _user_id;


let moves_by_product = {
  bus:1,
  subway:3,
  tram:2
}

game_data.subscribe((data) => {
  _game_data = data;
})
user_id.subscribe((data) => {
  _user_id = data;
})

export async function checkIfAllPlayersConfirmed(game_id){
  const {data, error} = await supabase
    .from('user_games')
    .select('status')
    .eq('game_id', game_id)
    .select()
    if(!error){
      // if all players are confirmed, update global game_status
      const allPlayersConfirmed = data.every((node) => node.status === 1)
      if(allPlayersConfirmed){
        updateGameField(game_id, 'game_status', 1)
      }
    }
    return data;
}


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
  if(gameData.game_status > 1) return;
  let current_stations = {};
  let current_latlng = {};
  let available_tickets = {};
  let players = gameData.profiles.reduce((prev, node) => [...prev, node.id], []);
  let players_sorted = sortPlayers(players, gameData.mister_x);
  for(let i = 0; i < gameData.profiles.length; i++){
    let random = getRandomInteger(gameData.allowed_stops.length);
    current_stations[`${gameData.profiles[i].id}`] = gameData.allowed_stops[random].name
    current_latlng[`${gameData.profiles[i].id}`] = [gameData.allowed_stops[random].location.longitude, gameData.allowed_stops[random].location.latitude]
    available_tickets[`${gameData.profiles[i].id}`] = [{bus:5}, {subway:3}, {tram:3}];
  }

  const {data, error} = await supabase
      .from('games')
      .update(
        {
          current_position_in_latlng: current_latlng,
          current_position_by_station: current_stations, 
          game_status: 2,
          next_move:players_sorted[0],
          moves_in_order:players_sorted,
          available_tickets:available_tickets
        })
      .eq('id', gameData.id)
      .select()
      if(error){
        console.log(error)
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
    available_tickets,
    data_to_update
  } = data;
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
      available_tickets:available_tickets,
      mister_x_is_visible:misterXIsVisible(moves_history, misterX)
    })
    .eq('id', game_id)
    .select()
    if(error){
      console.log(error);
      return error
    }
}


export const handleUserCheckIn = async (data, gameData, user_id, game_id) => {
  let current_stations  = gameData.current_position_by_station;
  let current_latlng  = gameData.current_position_in_latlng;
  let next_move = gameData.next_move;
  let moves_in_order = gameData.moves_in_order;
  let moves_history = gameData.moves_history;
  let mister_x = gameData.mister_x;
  let product = data.product;
  let new_ticket_count = removeTicketFromStash(gameData.available_tickets, user_id, product)
  // build data object for checkInUser method
  let payload = {
    user_id:user_id,
    game_id:game_id,
    current_stations: current_stations,
    current_latlng: current_latlng,
    next_move: next_move,
    moves_in_order:moves_in_order,
    moves_history:moves_history,
    misterX:mister_x,
    available_tickets: new_ticket_count,
    data_to_update: data
  }
  let error_response = await checkInUser(payload);
  if(error_response){
    errors = [error_response, ...errors];
  }
}


function removeTicketFromStash(available_tickets, user_id, product){
  if (available_tickets[user_id]) {
    for (let i = 0; i < available_tickets[user_id].length; i++) {
        if (available_tickets[user_id][i][product]) {
          available_tickets[user_id][i][product]--;
            break; // Stop after the first match is found
        }
    }
  }
  return available_tickets
}

// after each move by mister X checks the
// current visibility

export function misterXIsVisible(data, misterX){
  let count = 0;
  data.forEach((node) => {
   node.hasOwnProperty([misterX]) ? count++:''
  });
  return (count % 2 === 0)
}


export async function getRoutesForLine (line) {
  const {data, error} = await supabase
    .from('lines')
    .select('*')
    .eq('line', line.id)
    .single()
    if(error){
      return error
    }else{
      console.log(checkIfMoveIsAllowed(data.data, line, line.product))
      return data.data
    }
}


export function checkIfMoveIsAllowed(data, line, current_product){
  console.log(line);
  let allowed_moves = moves_by_product[current_product];
  // get current position of user
  let user_position = getCurrentPositionByUserId(_user_id);
  let position_on_line = data.indexOf(user_position);



  // Initialize a variable to store the matching array
  let matchingArray = null;

  // stringify the latlng array so that
  // we are able to get the users current
  // position on the line as an index
  let latlng_stringified = [];
  // Iterate through the array of arrays
  for (const i of data){
    latlng_stringified.push(JSON.stringify(i));
  }

  let position_on_line_as_index = latlng_stringified.indexOf(JSON.stringify(user_position))

  
  if(position_on_line_as_index === -1){
    alert(`Stop is currently not reachable from your position`)
  }else{
    // create a subset of all the stops that
    // are reachable with the chosen transport
    // e.g. bus => 3 steps forward and 3 steps back
    // if start index is negative (i.e. stop is one of first three stops on line)
    // start with 0 as start_index
    let index_start = position_on_line_as_index - allowed_moves < 0 ? 0 : position_on_line_as_index - allowed_moves;
    let index_end = position_on_line_as_index + allowed_moves + 1;

    let allowed_stops_array = data.slice(index_start, index_end )

    // Create a new array to store the filtered objects
    const filteredArray = [];
    // Iterate through the objects
    for (const obj of _game_data.allowed_stops) {
      // Check if there's a matching array in arrayOfArrays
      const matchingArray = allowed_stops_array.find(arr => {
        return (
          arr[0] === obj.location.longitude &&
          arr[1] === obj.location.latitude
        );
      });

      // If a matching array is found, add the object to the filteredArray
      if (matchingArray) {
        filteredArray.push(obj);
      }
    }

    // filteredArray now contains the objects with matching latitude and longitude values
    visible_stops.set(filteredArray);
  }

  
}

async function updateGameField(game_id, field_key, value){
  const {data, error} = await supabase
    .from('games')
    .update({
      [`${field_key}`] :value
    })
    .eq('id', game_id)
    .select()
    if(error){
      console.log(error)
    }else{
      return data
    }
}

export function resetMapRoute(mapInstance){
  mapInstance.removeLayer('route');
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

function getCurrentPositionByUserId(id){
  return _game_data.current_position_in_latlng[`${id}`];
}