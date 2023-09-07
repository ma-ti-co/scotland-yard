<script>
import { Terminal } from "lucide-svelte";
import * as Alert from "$lib/components/ui/alert";
import {game_data} from "../../store"
import { onMount, afterUpdate } from "svelte";
export let user_id

let _data;

game_data.subscribe((prev) => {
  _data = prev;
})



</script>



{#if _data.next_move === user_id}
<Alert.Root class="bg-green-300">
  <Alert.Title><strong>Your turn!</strong></Alert.Title>
  <Alert.Description>
    You can now choose your next turn. See below which tickets are still available.
  </Alert.Description>
</Alert.Root>
{:else}
<Alert.Root class="bg-red-300">
  <Alert.Title>{user_id}</Alert.Title>
  <Alert.Description>
    Waiting for
  </Alert.Description>
</Alert.Root>
{/if}