<script>
  import { supabase } from "../../../utils/supabaseClient";
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import {createGameStartConstellation, checkInUser, handleUserCheckIn, resetMapRoute, getRoutesForLine, user_and_x_overlap} from "$lib/gameplay"
  import {writable, get, readable} from 'svelte/store'
  import { ChevronUp } from 'lucide-svelte';
  import Map from "$lib/Mapbox/Map.svelte";
  import Marker from "$lib/Mapbox/Marker.svelte";
  import Route from "$lib/Mapbox/Route.svelte";
  import Info from "$lib/Info.svelte";
  import { afterUpdate, onDestroy, onMount } from "svelte";
  import { mapboxInstance, mapInstance } from '$lib/Mapbox/mapboxContext.js'; 
  import Players from '../../../lib/Players.svelte';
  import { AlertCircle } from "lucide-svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import * as Tabs from "$lib/components/ui/tabs";
  import * as Alert from "$lib/components/ui/alert";
  import Onboarding from "$lib/Onboarding.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import {game_data, focus_state, visible_stops, current_route, current_line, current_stop} from "../../../store.js"
  import { beforeNavigate } from "$app/navigation";
  import toast, { Toaster } from 'svelte-french-toast';


  export let data
  let gameData = data.gameData
  const {allowed_stops} = gameData

  const game_id = gameData.id;
  const user_id = data.session.user.id;


  let currentLineDetails = null;
  let _current_route;
  let _current_line;
  let errors = [];
  let mister_x_is_visible = gameData.mister_x_is_visible;
  // get contexts
  let map, mapbox;
  mapInstance.subscribe(value => {
    map = value;
  });
  mapboxInstance.subscribe(value => {
    mapbox = value;
  });

  $: {
    if(gameData.mister_x_is_visible){
      toast.success(`${user_id===gameData.mister_x_is_visible ? 'You are':'Mr. X is'} now visible!`)
    }
  }

  $: {
    if(_current_line === null){
      visible_stops.set(gameData.allowed_stops);
    }
  }

  current_route.subscribe(((data) => _current_route = data))
  current_line.subscribe(((data) => _current_line = data))


  let slider
  let subscription
  let focus_is_on_stop
  let _visible_stops
  let play_area_expanded = false
  focus_state.subscribe((data) => {
    focus_is_on_stop = data;
  })
  visible_stops.subscribe((data) => {
    _visible_stops = data;
  })

  afterUpdate(() => {
    if(slider){
      if(focus_is_on_stop){
        slider.scrollTo({left:slider.clientWidth, behavior:'smooth'});
      }else{
        slider.scrollTo({left:0, behavior:'smooth'});
      }
    }
    user_and_x_overlap()
  })

  // set store to initial data from server;
  game_data.update((data) => gameData)

  // set visible stops as local state in the store so that
  // it can later be updated through the Route module
  visible_stops.update((data) => gameData.allowed_stops)

  
  onMount(() => {
    let mb = document.querySelector('.mapboxgl-ctrl-bottom-left');
    if(mb){
      mb.style.pointerEvents = 'none';
      mb.style.zIndex = 0; 
    }
    focus_state.set(false);
    if(slider){
      slider.addEventListener('scrollend', () => {
        if(slider.scrollLeft < slider.clientWidth / 2){
          focus_state.set(false)
        }else{
          focus_state.set(true);
        }
      }) 
    }

    const subscription = supabase
      .channel('any')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${game_id}`}, async (payload) => {
        
        // replace local game state with new payload
        // keep allowed_stops & profiles
        let newData = {...payload.new, allowed_stops:gameData.allowed_stops, profiles:gameData.profiles}
        gameData = newData;
        game_data.update((data) => newData)
      })
    .subscribe();
    return () => subscription.unsubscribe();
  })



onDestroy(async () => {
  mapInstance.set(null);
  mapboxInstance.set(null);
  // current_route.set(null);
  // current_line.set(null)
})


const handleClickOnMarker = (stop) => {
  current_stop.set(stop);
  if(stop.lines.some(node => node.id === _current_line)){
  }else{
    resetMapRoute(map)
    current_line.set(null);
  }
  focus_state.set(true);
  currentLineDetails = stop;
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


{#if gameData.game_status === 2}
<div class="flex flex-col grow md:flex-row gap-2 w-full h-full relative">
  <!-- MAP -->
    <div class="bais-full aspect-square md:basis-2/5 grow relative">
      <Map>
        {#each _visible_stops as stop, index}
        <Marker 
          lat={stop.location.latitude}
          lng={stop.location.longitude}
          type="location"
          color="gray"
          on:clickForDetails={() => {handleClickOnMarker(stop)}}
        />
        {/each}
        {#if _current_route}
        <Route mapInstance={map} route={_current_route} />
        {/if}
        {#each gameData.profiles as player, index}
          {#if
            (user_id === gameData.mister_x) || 
            (player.id !== gameData.mister_x) ||
            (gameData.mister_x_is_visible)
          }
          <Marker 
            uid={player.id}
            markerOffset={[15, 15]}
            lng={gameData.current_position_in_latlng[player.id][0]}
            lat={gameData.current_position_in_latlng[player.id][1]}
            type="user"
            mister_x={(player.id === gameData.mister_x)}
          />
          {/if}
        {/each}
      </Map>
    </div>

  <!-- PLAY -->
    <div class={"z-2 slider-wrapper md:basis-2/5 fixed h-full left-0 transition-all w-full md:relative bg-white " + (play_area_expanded ? "top-[15vh] md:top-0":"top-[60vh] md:top-0")}>
      <div class="flex justify-between p-2">
        <Tabs.Root value={focus_is_on_stop.toString()} class="w-[400px]">
          <Tabs.List>
            <Tabs.Trigger on:click={() => focus_state.set(false)} value="false">Players</Tabs.Trigger>
            <Tabs.Trigger on:click={() => focus_state.set(true)} value="true">Line Details</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        <div class="md:hidden">
          <Button class={ play_area_expanded ? 'rotate-180':''} variant="ghost" on:click={() => play_area_expanded = !play_area_expanded}>
            <ChevronUp />
          </Button>
        </div>
      </div>
      <div class="snap-mandatory snap-x overflow-x-auto flex h-full w-full lg:p-6 border gap-2" bind:this={slider}>
        <div class="slider_card snap-start	h-full min-w-full">
            <Players 
              map={map} 
              game_id={game_id}
              user_id={user_id}
              game_data={gameData}
            />
        </div>
        <div class="slider_card snap-start rounded-md bg-white min-h-full min-w-full md:basis-2/5">
          <div class="h-full">
              {#if currentLineDetails}
              <Info 
                map={map}
                details={currentLineDetails}
                on:checkInUser={(event) => {
                  resetMapRoute(map);
                  _visible_stops = gameData.allowed_stops;
                  handleUserCheckIn(event.detail, gameData, user_id, game_id)
                }}
                on:lineSelected={(event) => {current_route.set(event.detail)}}
              />
              {:else}
              <div class="h-full grid lg:place-items-center text-gray-600">
                <span class="p-4">Select a point on the map to get connection detail</span>
              </div>
              {/if}
          </div>
        </div>
      </div>
    </div>
</div>
{:else if gameData.game_status === 1}
<Onboarding user_id={user_id} gameData={gameData} />
{:else if gameData.game_status === 3}
<div class="h-[100vh] text-xl grid place-items-center w-full">
  <div class="text-center">
    <div class="mb-2">Game Over. Mr. X has been found!</div>
    <Button href="/profile">Return to Profile</Button>
  </div>
</div>
{/if}
<Toaster />


<style>
.slider{
  overflow-x: scroll;
  scroll-snap-type: x manadatory;
}

:global(.mapboxgl-ctrl-bottom-right){
    display: none!important;
    opacity: 0;
    visibility: hidden;
  }

:global(.mapboxgl-ctrl-logo){
  pointer-events: none;
  background-image: none!important;
}  
</style>

