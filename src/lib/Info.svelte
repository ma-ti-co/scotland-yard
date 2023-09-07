<script>
import {createEventDispatcher, onMount} from "svelte"
import {MapInstance, game_data, user_id, focus_state, visible_stops, current_route, current_line} from "../store"
import BvgIcons from "./BVGIcons.svelte";
import { Loader2 } from "lucide-svelte";
import Button from "./components/ui/button/button.svelte";
import toast, { Toaster } from 'svelte-french-toast';




export let details;
export let map

let dispatch = createEventDispatcher();
let _game_data;
let _user_id;
let _current_line;
let current_product;
$: user_can_move = _game_data.next_move === _user_id;




game_data.subscribe((data) => _game_data = data)
user_id.subscribe((data) => _user_id = data)
current_line.subscribe((data) => _current_line = data)


function ticketIsAvailable(key) {
    const item = _game_data.available_tickets[_user_id].find(entry => entry[key] !== undefined);
    return item ? item[key] > 0 : false;
  }

const handleUserCheckIn = (payload) => {
  dispatch('checkInUser', payload);
  // reset some local state
  focus_state.set(false);
  selected_line = null;
}



</script>




<div class="p-2 lg:p-9 pb-4">
  {#if details.name !== undefined}
  <div>
    <h2 class="text-md font-bold">{details.name}</h2>
  </div>
  <div class="mt-2 lg:mt-9">
    {#if user_can_move}
    <Button class="bg-green-600 hover:bg-green-700" on:click={() => {
      handleUserCheckIn({name: details.name, lnglat:[details.location.longitude, details.location.latitude], product:current_product});
    }
    }>
      Check In
    </Button>
    {:else}
    <Button disabled>
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      Wait your turn
    </Button>
    {/if}
  </div>
  <div class="mt-9 flex gap-2 overflow-scroll lg:overflow-auto lg:flex-wrap">
    {#each details.lines as line}
      {#if _current_line !== null}
        {#if _current_line === line.id}
        <Button 
          on:click={() => {
             map.flyTo({
              zoom:14
            })
            map.removeLayer('route');
            visible_stops.set(_game_data.allowed_stops);
            current_line.set(null)
            current_route.set(null)
            current_product = null
          }}>
          <div>
            <BvgIcons type={line.product} />
          </div>
          <div class="ml-6">{line.name}</div>
        </Button>
        {:else}
        <Button variant="outline" disabled>
          <div>
            <BvgIcons type={line.product} />
          </div>
          <div class="ml-6">{line.name}</div>
        </Button>
        {/if}
      {:else}
      {#if ticketIsAvailable(line.product)}
      <Button variant="outline" on:click={() => {
        map.flyTo({
          zoom:16
        })
        current_line.set(line.id);
        current_route.set(line);
        current_product = line.product;
      }}>
        <div>
          <BvgIcons type={line.product} />
        </div>
        <div class="ml-6">{line.name}</div>
      </Button>
      {:else}
      <Button disabled variant="outline">
        <div>
          <BvgIcons type={line.product} />
        </div>
        <div class="ml-6">{line.name}</div>
      </Button>
      {/if}
      {/if}
    {/each}
  </div>
  {/if}
</div>
