<script>
  import {PUBLIC_WS_PATH} from '$env/static/public'
  import {dev} from '$app/environment'
  import { onDestroy, onMount, afterUpdate } from "svelte";
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
  //let url = 'wss://hard-cod-29.deno.dev';
  let url = 'ws://localhost:8080';
  ws = new WebSocket(url);
  ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        event: "open",
        message: {user_id:user_id, game_id:game_id},
      }))
    })
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if(data.event==="new_user" && active_users.indexOf(data.user_id) === -1){
        active_users = [...active_users, data.user_id]
      }
      ws.send(JSON.stringify({
        event:"update",
        message: {user_id:user_id, game_id:game_id}
      }))
      if(data.event==="update_user" && active_users.indexOf(data.user_id) === -1){
        active_users = [...active_users, data.user_id]
      }
      if(data.event==="user_left"){
        active_users = active_users.filter((node) => node !== data.user_id);
      }
    })

})



onDestroy(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
        event: "close",
        message: {user_id:user_id, game_id:game_id},
    }))
      
    // Close the WebSocket
    ws.close(1000, "Closing for a reason");
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
      {#if player.id !== game_data.mister_x}
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
      {#if player.id === game_data.mister_x}
      <User group={active_users} user={player} />
      {/if}
    {/each}
  </div>
</div>
</Card.Content>
<Card.Footer>
</Card.Footer>
</Card.Root>
