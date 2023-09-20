<!-- 
  Pass user_id, game owner id, player id
  return confirmation status for current game
-->
<script>
import Button from "./ui/button/button.svelte";
import { enhance } from "$app/forms";
import { Loader2 } from "lucide-svelte";
import { Check } from 'lucide-svelte';
import { createEventDispatcher } from "svelte";
export let player_status;
export let player_id;
export let user_id;
export let game_owner;
export let game_id;
let is_loading = false;
$: player_is_owner = player_id === game_owner

let player_is_confirmed = player_status

const dispatch = createEventDispatcher()
</script>

<div class="text-gray-500 text-xs">
  {#if player_is_owner}
  <div>Owner</div>
  {:else if !player_is_owner &&  player_is_confirmed===0}
    {#if user_id === player_id}
      <form method="POST" action="?/confirmInvitation" use:enhance={(form, data, action, cancel) => {
        is_loading = true;
        return async ({result, update}) => {
          if(result.type==='success'){
            player_is_confirmed = 1
            dispatch('status_update', result.data)
            is_loading=false;
          }
        }
      }}>
        <input class="hidden" name="game_id" value={game_id} />
        <input class="hidden" name="uid" value={user_id} />
        {#if is_loading}
        <Button disabled><Loader2 class="mr-2 h-4 w-4 animate-spin" /></Button>
        {:else}
        <Button>Please Accept Your Invitation</Button>
        {/if}
      </form>
    {:else}
    <div class="flex text-[12px] items-center">
      <span class="whitespace-nowrap">Confirmation Pending</span><Loader2 class="ml-2 h-2 w-2 animate-spin" />
    </div>
    {/if}
  {:else}
  <div class="flex items-center text-xs">
   <span class="whitespace-nowrap">Confirmed</span>
  </div>
  {/if}
</div>