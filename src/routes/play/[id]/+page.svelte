<script>
  import { supabase } from "../../../utils/supabaseClient";
  import {createGameStartConstellation, checkInUser} from "$lib/gameplay"
  import {writable, get, readable} from 'svelte/store'
  import getRoutesForLine from '../../../utils/getLine'
  import Map from "$lib/Mapbox/Map.svelte";
  import Marker from "$lib/Mapbox/Marker.svelte";
  import Route from "$lib/Mapbox/Route.svelte";
  import Info from "$lib/Info.svelte";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { mapboxInstance, mapInstance } from '$lib/Mapbox/mapboxContext.js'; 
  import Connector from '../../../lib/Connector.svelte';
  import { AlertCircle } from "lucide-svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Alert from "$lib/components/ui/alert";
  import Onboarding from "$lib/Onboarding.svelte";
  export let data
  let gameData = data.gameData
  const {allowed_stops} = gameData

  const game_id = data.id;
  const user_id = data.session.user.id;
  const players = [gameData.player_1, gameData.player_2]

  let currentLineDetails = null;
  let currentRoute = null;
  let errors = [];
  // get contexts
  let map, mapbox;
  mapInstance.subscribe(value => {
    map = value;
  });
  mapboxInstance.subscribe(value => {
    mapbox = value;
  });


  afterUpdate(() => {
    if(gameData.misterX_is_visible){
      alert(gameData.current_position_by_station[[gameData.mister_x]])
    }
  })

  
  onMount(async() => {

    const subscription = supabase
      .channel('any')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games'}, async (payload) => {
        const {data:newData, error} = await supabase
          .from("games")
          .select("*, profiles(*)")
          .eq('id', game_id)
          .single()

        console.log(newData);
        gameData = newData;
      })
    .subscribe();
  })

onDestroy(() => {
  mapInstance.set(null);
  mapboxInstance.set(null);
})

const handleUserCheckIn = async (data) => {
  let current_stations  = gameData.current_position_by_station;
  let current_latlng  = gameData.current_position_in_latlng;
  let next_move = gameData.next_move;
  let moves_in_order = gameData.moves_in_order;
  let moves_history = gameData.moves_history;
  let mister_x = gameData.mister_x;
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
    data_to_update: data
  }
  let error_response = await checkInUser(payload);
  if(error_response){
    errors = [error_response, ...errors];
  }
}

</script>


{#if errors.length}
<div class="w-full bg-red-300 text-red-800">
<Alert.Root variant="destructive">
  <AlertCircle class="h-4 w-4" />
  <Alert.Title>Error</Alert.Title>
  <Alert.Description>
    {JSON.stringify(errors)}
  </Alert.Description>
</Alert.Root>
</div>
{/if}

{#if gameData.game_status > 0}
  <div class="flex flex-col grow md:flex-row gap-2 w-full h-full md:p-9">

  {#if currentLineDetails}  
  <div class="md:basis-1/5 grow">
    <div class="rounded-md bg-white h-full">
      <Info details={currentLineDetails} on:checkInUser={(event) => {handleUserCheckIn(event.detail)}} on:lineSelected={(event) => {currentRoute = event.detail}}/>
    </div>
  </div>
  {/if}
  <div class="md:basis-2/5 grow">
    <Map>
      {#each allowed_stops as stop, index}
      <Marker 
        lat={stop.location.latitude}
        lng={stop.location.longitude}
        type="location"
        color="gray"
        on:clickForDetails={(e) => {currentLineDetails = stop}}
      />
      {/each}
      {#if currentRoute}
      <Route mapInstance={map} route={currentRoute} />
      {/if}
      {#each gameData.profiles as player, index}
        {#if
          (user_id === gameData.mister_x) || 
          (player.id !== gameData.mister_x) ||
          (gameData.mister_x_is_visible)
        }
        <!-- <Marker 
          uid={player.id}
          markerOffset={[15, 15]}
          lng={gameData.current_position_in_latlng[player.id][0]}
          lat={gameData.current_position_in_latlng[player.id][1]}
          type="user"
        /> -->
        {/if}
      {/each}
    </Map>
  </div>
  <div class="md:basis-2/5 grow h-full">
    <div class="rounded-md bg-white h-full">
      <Connector game_id={game_id} user_id={user_id} game_data={gameData}/>
    </div>
  </div>
  </div>
{:else if gameData.game_status === 0}
<Onboarding user_id={user_id} gameData={gameData} />
{/if}

