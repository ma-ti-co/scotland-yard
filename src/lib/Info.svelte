<script>
import {createEventDispatcher, onMount} from "svelte"
import BvgIcons from "./BVGIcons.svelte";
import Button from "./components/ui/button/button.svelte";
export let details;

let dispatch = createEventDispatcher();



</script>


{JSON.stringify(details)}

<!-- <div class="p-9">
  {#if details.name !== undefined}
  <div>
    <h2 class="text-2xl">{details.name}</h2>
  </div>
  <div class="mt-9">
    <Button on:click={() => dispatch('checkInUser', {name: details.name, lnglat:[details.location.longitude, details.location.latitude]})}>
      Check In
    </Button>
  </div>
  <div class="mt-9">
    {#each details.lines as line}
    <div class="flex items-center mb-4">
      <BvgIcons type={line.product} />
      <div class="ml-6">{line.name}</div>
      <button class="ml-4 p-2 bg-gray-300 rounded-sm text-[12px]" on:click={() => dispatch('lineSelected', line)}>See Route</button>
    </div>
    {/each}
  </div>
  {/if}
</div> -->