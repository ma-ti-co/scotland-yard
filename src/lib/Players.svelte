<script>
  import {PUBLIC_WS_PATH} from '$env/static/public'
  import {flip} from 'svelte/animate'
  import {dev} from '$app/environment'
  import { onDestroy, onMount, afterUpdate, tick } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import OnlineOffline from './components/OnlineOffline.svelte';
  import User from './components/User.svelte';
  import TurnStatus from './components/TurnStatus.svelte';
  import {game_data} from "../store"

  // passed props from Play
  export let game_id;
  export let user_id;
  export let map

  let ws;
  let active_users = [];
  // this value is non reactive
  // it simply reacts to the incoming next_move value
  let _game_data;
  let next_move


  game_data.subscribe((data) => _game_data = data)

  let order = _game_data.moves_in_order;

  $: {
    //console.log(order);
    let next = _game_data.next_move;
    let next_pos = order.indexOf(next);
    order.splice(next_pos, 1);
    order.unshift(next);
  }

  // afterUpdate(() => {
  //   let el = order.shift();
  //   order.push(el);
  // })

  onMount(() => {
    //let url = 'wss://hard-cod-29.deno.dev';
  let url = 'ws://localhost:8000';
  ws = new WebSocket(url);
  ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        event: "open",
        message: {user_id:user_id, game_id:game_id},
      }))
    })
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if(data.event==="new_user"){
        active_users = [...data.users]
      }
      ws.send(JSON.stringify({
        event:"update",
        message: {user_id:user_id, game_id:game_id}
      }))
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

<TurnStatus turn={next_move} user_id={user_id}/>
<div class="grid grid-cols-1 gap-2 p-2">
  {#each order as id (id)}
  <div class="view-transition" style={`--index:${order.indexOf(id)}`} animate:flip={{
     duration: 400
  }}>
  <User pin={true} map={map} group={active_users} user={_game_data.profiles.filter((node) => node.id === id)[0]} mister_x={_game_data.mister_x}/>
  </div>
{/each}
</div>


<style>
.view-transition{
  view-transition-name: var(--index)
}
</style>
