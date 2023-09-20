<script>
  import {game_data} from "../store.js"
  import {Loader2} from "lucide-svelte"
  import { CheckCircle2 } from 'lucide-svelte';
  import { Progress } from "$lib/components/ui/progress";
  import { ChevronRight } from "lucide-svelte";
  import { ChevronLeft } from "lucide-svelte";
  import { fade } from 'svelte/transition';
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import {choosePlayerRoles, resetPlayerRoles, selectGameLength, createGameStartConstellation} from '$lib/gameplay'
  import { onMount, onDestroy } from "svelte";
  import User from '$lib/components/User.svelte'
  import OnlineOffline from './components/OnlineOffline.svelte';
  import Button from './components/ui/button/button.svelte';
  export let gameData
  export let user_id

  let ws;
  let value = 0;
  let active_users = [];
  let game_length = null;
  let user_is_criminal = null;
  let steps = 0;
  let showStartingPoints = null;

  let _game_data;

  game_data.subscribe((data) => {
    _game_data = data;
  })

  $: {
    if(!gameData.mister_x && !gameData.available_tickets){
      steps = 0;
    }else if(gameData.mister_x && !gameData.available_tickets){
      value = 50;
      steps = steps + 1;
    }else if(gameData.mister_x && gameData.available_tickets){
      value = 100;
      steps = steps + 1;
    }
  }

  $: {
    if(gameData?.available_tickets && Object.values(gameData?.available_tickets)[0][0]['suburban'] === 3){
      game_length = 'short';
    }else if(gameData?.available_tickets && Object.values(gameData?.available_tickets)[0][0]['suburban'] === 6){
      game_length = 'medium length';
    }else if(gameData?.available_tickets && Object.values(gameData?.available_tickets)[0][0]['suburban'] === 9){
      game_length = 'long';
    }
  }
  

  onMount(() => {
    //let url = 'wss://hard-cod-29.deno.dev';
  let url = 'ws://localhost:8000';
  ws = new WebSocket(url);
  ws.addEventListener('open', () => {
      ws.send(JSON.stringify({
        event: "open",
        message: {user_id:user_id, game_id:_game_data.id},
      }))
    })
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if(data.event==="new_user"){
        active_users = [...data.users]
      }
      ws.send(JSON.stringify({
        event:"update",
        message: {user_id:user_id, game_id:_game_data.id}
      }))
      if(data.event==="user_left"){
        active_users = active_users.filter((node) => node !== data.user_id);
      }
  })
  window.addEventListener('beforeunload', function(){
    ws.send(JSON.stringify({
        event: "close",
        message: {user_id:user_id, game_id:_game_data.id},
      }))
      ws.close();
  })
})

onDestroy(() => {
  if (ws) {
    ws.send(JSON.stringify({
      event: "close",
      message: {user_id:user_id, game_id:_game_data.id},
    }))
    
    ws.close();
  }
})


const handlePlayerSelect = (id) => {
  choosePlayerRoles(gameData, id)
}

const handleGameLength = async (id) => {
  let data = await selectGameLength(gameData, id);
  let t = setTimeout(() => {
    handleStepTwo()
  }, 3000);
  return () => clearTimeout(t);
}


async function handleStepTwo(){
  steps = steps + 1;
  let data = await createGameStartConstellation(gameData)
  if(data){
    data = showStartingPoints;
  }
}

</script>
<div class="container mx-auto">
  <div class="my-16">
    <div class="text-xs text-gray-600 mb-2">Only 2 more steps...</div>
    <Progress {value} max={100} class="lg:w-[60%]" />
    <div class="flex flex-col lg:flex-row lg:w-[60%] mt-2">
        {#each _game_data.profiles as player, index}
        {#if player.id === _game_data.mister_x}
        <div class="lg:w-1/2 mb-2 lg:mb-0 flex-grow text-xs flex items-center">
          <CheckCircle2 class="text-green-600 mr-2"/><span class="font-bold">{player.username}&nbsp;</span> will play Mr. X
        </div>
        {/if}
        {/each}
        <div class="lg:w-1/2 flex-grow text-xs flex items-center">
          {#if game_length}
          <CheckCircle2 class="text-green-600 mr-2"/>This will be a&nbsp;<span class="font-bold">{game_length}&nbsp;</span> game
          {/if}
        </div>
    </div>
  </div>
  {#if steps === 0}
  <section transition:fly={{ delay: 100, duration: 1000, x: 0, y: -100, opacity: 0.5, easing: quintOut }}>
    <div>
      <h2 class="text-xl mb-3">
        Who will play Mr. X?
      </h2>
      <div class="text-gray-400">
        Remember: Mr. X will move first and is only visible after every other move. 
      </div>
    </div>
    <div class="flex gap-2">
      {#each _game_data.profiles as player, index}
        {#if player.id !== _game_data.mister_x}
          {#if gameData.game_owner === user_id}
            <button class="w-33 flex-auto" on:click={() => handlePlayerSelect(player.id)}>
              <User pin={false} group={active_users} user={player} />
            </button>
            {:else}
            <div class="w-33 flex-auto opacity-60">
              <User pin={false} group={active_users} user={player} />
            </div>
          {/if}
        {/if}
        {/each}
    </div>
  </section>
  {:else if steps === 1}
  <section transition:fly={{ delay: 100, duration: 1000, x: 0, y: -100, opacity: 0.5, easing: quintOut }}>
    <div>
      <h2 class="text-xl mb-3">
        How long should this game last?
      </h2>
      <div class="text-gray-400">
        Depending on your selection we will distribute a certain amount of tickets for each mode of transport.
      </div>
    </div>
    <div class="flex gap-2 mt-9">
      {#each Array(3) as node, index}
      <button class="font-bold border rounded px-9 py-6 bg-white hover:bg-slate-200" on:click={() => handleGameLength(index)}>
        {#if index===0}
        Short
        {:else if index===1}
        Medium
        {:else}
        Long
        {/if}
      </button>
      {/each}
    </div>
  </section>
  {:else if steps === 2}
  <div class="flex items-center text-xl" transition:fly={{ delay: 100, duration: 1000, x: 0, y: -100, opacity: 0.5, easing: quintOut }}>
    <Loader2 class="mr-2 h-4 w-4 animate-spin" /> We are preparing your game now ...
  </div>
  {/if}
</div>

<!--
<div class="container mx-auto mt-24">
  {#if steps === 0}
  <div transition:fly={{ delay: 200, duration: 300, x: 500, y: 0, opacity: 0.5, easing: quintOut }}>
    {#if !_game_data.mister_x}
    <div class="text-2xl">
      {#if gameData.game_owner === user_id}
      <div>Please select who will play Mister X.</div>
      {:else}
      <div class="opacity-60">Please wait...</div>
      {/if}
    </div>
    <div class="flex gap-2 flex-wrap mt-16">
      {#each _game_data.profiles as player, index}
      {#if player.id !== _game_data.mister_x}
        {#if gameData.game_owner === user_id}
          <button class="w-33 flex-auto" on:click={handlePlayerSelect(player.id)} transition:fade={{ duration: 2000 }}>
            <User group={active_users} user={player} />
          </button>
          {:else}
          <div class="w-33 flex-auto opacity-60">
            <User group={active_users} user={player} />
          </div>
        {/if}
      {/if}
      {/each}
    </div>
    {:else}
    <div class="text-2xl">Roles selected!</div>
    <div class="flex gap-2 flex-wrap mt-9">
      {#each _game_data.profiles as player, index}
      {#if player.id === _game_data.mister_x}
      <div class="w-33 flex-auto">
        <div class="text-xl">Mr. X</div>
        <User group={active_users} user={player} />
      </div>
      {:else}
      <div class="w-33 flex-auto">
        <div class="text-xl">Police</div>
        <User group={active_users} user={player} />
      </div>
      {/if}
      {/each}
    </div>
    <div class="basis-full mt-6 flex items-center justify-between">
      {#if gameData.game_owner === user_id}
      <Button on:click={resetPlayerRoles(gameData)}><ChevronLeft /> Reset Selection</Button>
      <Button on:click={handleStepTwo}>Next Step <ChevronRight /></Button>
      {/if}
    </div>
    {/if}
  </div>
  {:else if steps === 1}
    <div transition:fly={{ delay: 250, duration: 300, x: 100, y: 500, opacity: 0.5, easing: quintOut }}>We will now choose the starting point for each player. Remember: The starting point of the criminal is kept secret.</div>
    {#if showStartingPoints}
    {showStartingPoints}
    {/if}
  {/if}
</div>
-->