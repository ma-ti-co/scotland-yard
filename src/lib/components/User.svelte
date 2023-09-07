<script>
import {game_data} from "../../store"
  import * as Card from "$lib/components/ui/card";
  import Avatar from "./Avatar.svelte";
  import Badge from "./ui/badge/badge.svelte";
  import OnlineOffline from './OnlineOffline.svelte';
  import { onMount } from "svelte";

  export let group
  export let user
  export let mister_x

  let _game_data;
  game_data.subscribe((data) => {
  _game_data = data;
  })

</script>


<div class="relative mt-4">
<div class={`rounded-lg p-2 flex flex-col items-center border bg-card text-card-foreground shadow-sm ${user.id===mister_x ? 'bg-gray-600 text-white':''}`}>
  <div class="flex flex-row items-center mb-2 w-full">
    <div>
      <Avatar id={user.id} />
    </div>
    <div class="font-bold ml-3">
      {user.username}
    </div>
  </div>
  <div class="w-full text-xs">
    <div class="text-xs mb-2 font-bold">Current Position:</div>
    {_game_data.current_position_by_station ? _game_data.current_position_by_station[user.id] : ''}
  </div>
  <div class="w-full my-4">
    <div class="text-xs mb-2 font-bold">Available Tickets:</div>
    {#each _game_data.available_tickets[user.id] as tickets}
    <Badge>{Object.keys(tickets)[0][0].toUpperCase()+Object.keys(tickets)[0].substring(1)}: {Object.values(tickets)[0]}</Badge>
    {/each}
  </div>
  <OnlineOffline group={group} id={user.id} />
</div>
</div>