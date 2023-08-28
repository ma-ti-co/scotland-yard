<script>
  import { fade } from 'svelte/transition';
  import {choosePlayerRoles, restPlayerRoles, createGameStartConstellation} from '$lib/gameplay'
  import {PUBLIC_WS_PATH} from '$env/static/public'
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
  

  onMount(() => {
  ws = new WebSocket(`${PUBLIC_WS_PATH}?id=${user_id}&game=${gameData.id}`);
  ws.addEventListener('open', () => {
      ws
      ws.send(JSON.stringify({
        event: "send-message",
        message: "yo",
      }))
    })
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if(data.event === 'update-users'){
        active_users = data.user_ids;
      }
      
    })
    ws.addEventListener('close', (event) => {
      console.log(event);
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
{steps}
{#if steps === 0}
<div>
  {active_users}
  <div class="text-2xl max-w-7xl m-auto">
    <div>1) Please select who will play the criminal.</div>
  </div>
  <div class="grid grid-cols-3 gap-2 max-w-7xl m-auto mt-9">
    {#each gameData.profiles as player, index}
    {#if player.id !== gameData.in_game_criminal}
    <button on:click={handlePlayerSelect(player.id)} transition:fade={{ duration: 2000 }}>
      <User group={active_users} user={player} />
    </button>
    {/if}
    {/each}
  </div>
  {#if gameData.mister_x}
    <div>
      <Button on:click={restPlayerRoles(gameData)}>Reset Selection</Button>
      <Button on:click={handleStepTwo}>Next Step </Button>
    </div>
    {/if}
</div>
{:else if steps === 1}
  <div>We will now choose the starting point for each player. Remember: The starting point of the criminal is kept secret.</div>
  {#if showStartingPoints}
  {showStartingPoints}
  {/if}
{/if}