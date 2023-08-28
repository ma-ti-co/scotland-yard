<script>
  import {PUBLIC_WS_PATH} from '$env/static/public'
  import {dev} from '$app/environment'
  import { onDestroy, onMount } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import OnlineOffline from './components/OnlineOffline.svelte';
  import User from './components/User.svelte';
  import TurnStatus from './components/TurnStatus.svelte';
  export let game_id;
  export let user_id;
  export let game_data

  let ws;
  let active_users = [];

onMount(() => {
  let url = 'wss://hard-cod-29.deno.dev';
  //let url = 'ws://localhost:8080';
  ws = new WebSocket(url);
  ws.addEventListener('open', () => {
      ws
      ws.send(JSON.stringify({
        event: "open",
        message: JSON.stringify({user:user_id, game:game_id}),
      }))
    })
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if(data.event === 'update_users'){
        // i am not getting here !
        active_users = data.user_ids;
      }
      
    })
    ws.addEventListener('close', (event) => {
    })
})

onDestroy(() => {
  if (ws) {
      ws.close();
  }
})



</script>
<TurnStatus turn={game_data.next_move} user_id={user_id}/>
<Card.Root>
  <Card.Content>
    <div>

    <div>Police</div>
<div class="grid grid-cols-3 gap-2">
    {#each game_data.profiles as player, index}
      {#if player.id !== game_data.in_game_criminal}
      <User group={active_users} user={player} />
      {/if}
    {/each}
</div>
</div>
<div>
  <div>Mr. X</div>
  {game_data.misterX_is_visible}
  <div class="grid grid-cols-3 gap-2">
    {#each game_data.profiles as player, index}
      {#if player.id === game_data.in_game_criminal}
      <User group={active_users} user={player} />
      {/if}
    {/each}
  </div>
</div>
</Card.Content>
<Card.Footer>
</Card.Footer>
</Card.Root>
