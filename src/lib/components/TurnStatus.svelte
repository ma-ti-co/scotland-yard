<script>
import { Terminal } from "lucide-svelte";
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
<Alert.Root class="bg-green-300">
  <Alert.Title><strong>Your turn!</strong></Alert.Title>
  <Alert.Description>
    You can now choose your next turn. See below which tickets are still available.
  </Alert.Description>
</Alert.Root>
{:else}
<Alert.Root class="bg-red-300">
  <Alert.Title>Waiting for <span class="font-bold">{next_move}</span> to make a move</Alert.Title>
  <Alert.Description>
    In the meantime, look for a Späti and get a beer.
  </Alert.Description>
</Alert.Root>
{/if}