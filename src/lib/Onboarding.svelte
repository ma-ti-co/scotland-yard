<script>
  import {game_data} from "../store.js"
  import { ChevronRight } from "lucide-svelte";
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import {choosePlayerRoles, restPlayerRoles, createGameStartConstellation} from '$lib/gameplay'
  import { onMount, onDestroy } from "svelte";
  import User from '$lib/components/User.svelte'
  import OnlineOffline from './components/OnlineOffline.svelte';
  import Button from './components/ui/button/button.svelte';
  export let gameData
  export let user_id

  let ws;
  let active_users = [];
  let user_is_criminal = null;
  let steps = 0;
  let showStartingPoints = null;

  let _game_data;

  game_data.subscribe((data) => {
    _game_data = data;
  })

  let emit = 
  

  onMount(() => {
    let url = 'wss://hard-cod-29.deno.dev';
  //let url = 'ws://localhost:8080';
  ws = new WebSocket(url);
  ws.addEventListener('open', () => {
      ws
      ws.send(JSON.stringify({
        event: "open",
        message: JSON.stringify({user:user_id, game:_game_data.id}),
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
    console.log("closing");
      ws.close();
  }
})

const handlePlayerSelect = (id) => {
  choosePlayerRoles(gameData, id)
}

const handleStepTwo = async () => {
  steps = steps + 1;
  let data = await createGameStartConstellation(gameData)
  if(data){
    data = showStartingPoints;
  }
}


</script>
{#if steps === 0}
<div class="px-6" transition:fly={{ delay: 200, duration: 300, x: 500, y: 0, opacity: 0.5, easing: quintOut }}>
  {#if !_game_data.mister_x}
  <div class="text-2xl max-w-7xl m-auto">
    <div>Please select who will play Mister X.</div>
  </div>
  <div class="grid grid-cols-2 lg:grid-cols-3 gap-2 max-w-7xl m-auto mt-9">
    {#each _game_data.profiles as player, index}
    {#if player.id !== _game_data.mister_x}
    <button on:click={handlePlayerSelect(player.id)} transition:fade={{ duration: 2000 }}>
      <User group={active_users} user={player} />
    </button>
    {/if}
    {/each}
  </div>
  {:else}
  <div class="flex flex-wrap gap-2 justify-between">
    {#each _game_data.profiles as player, index}
    {#if player.id === _game_data.mister_x}
    <div class="flex-1">
      <div class="text-xl">Mr. X</div>
      <User group={active_users} user={player} />
      <div class="mt-2">
        <span class="font-bold">Rules for Mr.X</span>
        <ul>
          <li>Moves first</li>
          <li>Is only visible to the other players after every 2nd move.</li>
        </ul>
      </div>
    </div>
    {:else}
    <div class="flex-1">
      <div class="text-xl">Police</div>
      <User group={active_users} user={player} />
    </div>
    {/if}
    {/each}
  </div>
  <div class="basis-full mt-6">
    <Button on:click={restPlayerRoles(gameData)}>Reset Selection</Button>
    <Button on:click={handleStepTwo}>Next Step <ChevronRight /></Button>
  </div>
  {/if}
</div>
{:else if steps === 1}
  <div transition:fly={{ delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut }}>We will now choose the starting point for each player. Remember: The starting point of the criminal is kept secret.</div>
  {#if showStartingPoints}
  {showStartingPoints}
  {/if}
{/if}