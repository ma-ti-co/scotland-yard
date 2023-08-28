<script>
import { Terminal } from "lucide-svelte";
import * as Alert from "$lib/components/ui/alert";
export let turn
export let user_id
</script>

{#if turn === user_id}
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
    Waiting for {turn}
  </Alert.Description>
</Alert.Root>
{/if}