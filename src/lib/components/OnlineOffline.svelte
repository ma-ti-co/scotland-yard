<script>
export let group
export let id
</script>

{group}
<div class="absolute top-[-5px] right-[-5px]">
<span class="relative flex h-3 w-3">
{#if group.includes(id)}
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
  {:else}
  <span class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
{/if}
</span>
</div>



