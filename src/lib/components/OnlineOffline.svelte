<script>
export let group
export let id
</script>

{#if group.includes(id)}
  <span class="text-xs p-1 rounded-sm bg-green-400">Online</span>
  {:else}
  <span class="text-xs p-1 rounded-sm bg-red-400">Offline</span>
{/if}

