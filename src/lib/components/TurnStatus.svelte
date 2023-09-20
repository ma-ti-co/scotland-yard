<script>
import { Loader2, Terminal } from "lucide-svelte";
import * as Alert from "$lib/components/ui/alert";
import {game_data} from "../../store"
import { onMount, afterUpdate } from "svelte";
export let user_id

let _game_data;

let next_move

$: {
  next_move = Object.values(_game_data.profiles).find((node) => node.id === _game_data.next_move).username;
}


game_data.subscribe((data) => {
  _game_data = data;
})


</script>



{#if _game_data.next_move === user_id}
<section class="bg-green-200 text-green-700 p-4">
  <div><strong>Your turn!</strong></div>
  <div>
    You can now choose your next turn. See below which tickets are still available.
  </div>
</section>
{:else}
<section class="bg-red-200 text-red-700 p-4">
  <div class="flex items-center"><Loader2 class="h-3 w-3 animate-spin mr-2" /> Waiting for <span class="mx-1 font-bold">{next_move}</span> to make a move</div>
  <div class="text-xs text-red-700">
    In the meantime, look for a Späti and get a beer.
  </div>
</section>
{/if}