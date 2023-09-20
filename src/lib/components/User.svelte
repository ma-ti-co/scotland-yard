<script>
import {game_data, user_id} from "../../store";
import * as Card from "$lib/components/ui/card";
import Avatar from "./Avatar.svelte";
import Button from "./ui/button/button.svelte";
import Badge from "./ui/badge/badge.svelte";
import OnlineOffline from './OnlineOffline.svelte';
import { Pin } from 'lucide-svelte';
import { onMount } from "svelte";
import { misterXIsVisible } from "$lib/gameplay";
  import BvgIcons from "$lib/BVGIcons.svelte";

// passed props from Connector
  export let group
  export let user
  export let mister_x
  export let map
  export let pin

  let _game_data;
  let _user_id;

  game_data.subscribe((data) => {
  _game_data = data;
  })

  user_id.subscribe((data) => {
  _user_id = data;
  })

  const product_to_color = {
    'suburban':'bg-green-600',
    'subway':'bg-blue-600',
    'tram':'bg-red-600'
  }

  const zoomToUser = () => {
    let lng = _game_data.current_position_in_latlng[user.id][0];
    let lat = _game_data.current_position_in_latlng[user.id][1];
    map.flyTo({
      center:[lng, lat],
      zoom:13
    })
  }

</script>


<div class="relative mt-4">
  {#if _user_id===mister_x || user.id !== mister_x || _game_data.mister_x_is_visible}
    {#if pin}
    <div class="absolute top-0 right-0">
      <Button variant="ghost" on:click={zoomToUser}>
        <Pin />
      </Button>
    </div>
    {/if}
  {/if}
<div class="hover:bg-slate-200 rounded-lg p-2 flex flex-col items-center border bg-card text-card-foreground shadow-sm">
  <div class="flex flex-row items-center mb-2 w-full">
    <div>
      <Avatar id={user.id} />
    </div>
    {user.id}
    <div class="font-bold ml-3">
      {user.username} {#if user.id===mister_x}<span class="text-[9px] bg-red-700 text-white p-2 rounded-lg italic">Mister X</span>{/if}
    </div>
  </div>
  {#if _game_data.game_status > 1}
  <div class="w-full text-xs">
    <div class="text-xs mb-2 font-bold">Current Position:</div>
    {#if _user_id===mister_x || user.id !== mister_x || _game_data.mister_x_is_visible}
    {_game_data.current_position_by_station ? _game_data.current_position_by_station[user.id] : ''}
    {:else}
    ?
    {/if}
  </div>
  <div class="w-full my-4">
    <div class="text-xs mb-2 font-bold">Available Tickets:</div>
    <div class="flex">
    {#each _game_data.available_tickets[user.id] as tickets}
    <div class="border py-2 px-9 flex w-fit mr-2 rounded-md bg-white">
      <BvgIcons type={Object.keys(tickets)[0]}/><span class="ml-2 font-bold">{Object.values(tickets)[0]}</span>
    </div>
    {/each}
  </div></div>
  {/if}
  <OnlineOffline group={group} id={user.id} />
</div>
</div>