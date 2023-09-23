<script>
import {createEventDispatcher, onMount} from "svelte"
import {MapInstance, game_data, user_id, focus_state, visible_stops, current_route, current_line, move_is_allowed, move_error_message, play_area_expanded} from "../store"
import {
  station_by_user_id,
  user_is_at_this_station,
} from "$lib/gameplay"
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
let _move_is_allowed;
let _move_error_message;
let _play_area_expanded;
let current_product;
$: user_can_move = _game_data.next_move === _user_id;



game_data.subscribe((data) => _game_data = data)
  user_id.subscribe((data) => _user_id = data)
  current_line.subscribe((data) => _current_line = data)
  move_is_allowed.subscribe((data) => _move_is_allowed = data);
  move_error_message.subscribe((data) => _move_error_message = data);
  play_area_expanded.subscribe((data) => _play_area_expanded = data)


function ticketIsAvailable(key) {
    const item = _game_data.available_tickets[_user_id].find(entry => entry[key] !== undefined);
    return item ? item[key] > 0 : false;
  }

const handleUserCheckIn = (payload) => {
  play_area_expanded.set(false)
  dispatch('checkInUser', payload);
  // reset some local state
  focus_state.set(false);
  _current_line = null;
}

</script>




<div class="p-2 lg:p-9 pb-4">
  {#if details.name !== undefined}
  <div>
    <h2 class="text-md font-bold">{details.name}</h2>
  </div>
  <div class="mt-2 lg:mt-9">
    {#if user_can_move && !user_is_at_this_station(_user_id, details.name)}
      {#if !_current_line}
      <div class="text-xs">
        Please select a line you want to use first
      </div>
      {:else if !_move_is_allowed}
      <div class="text-xs bg-red-300 text-red-700 p-4 rounded-md">
        {_move_error_message}
      </div>
      {:else}
      <Button class="bg-green-600 hover:bg-green-700" on:click={() => {
        handleUserCheckIn({name: details.name, lnglat:[details.location.longitude, details.location.latitude], product:current_product});
      }
      }>
      Check In
      </Button>
      {/if}

    {:else if user_is_at_this_station(_user_id, details.name)}
    <div class="bg-green-300 text-green-700 p-3 rounded-md">
      You are currently at this station
    </div>
    {:else}
    <Button disabled>
      <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      Wait your turn
    </Button>
    {/if}
  </div>
  <div class="mt-9 flex gap-2 overflow-scroll lg:overflow-auto lg:flex-wrap">
    {_current_line}
    {#each details.lines as line}
    {#if line.product === 'subway' || line.product === 'suburban' || line.product === 'tram'}
      {#if _current_line !== null}
        {#if _current_line === line.id}
        <!-- RESET CURRENT LINE STATE -->
        <Button 
          on:click={() => {
            play_area_expanded.set(false);
             map.flyTo({
              duration: 4000,
              zoom:12
            })
            if(_current_line !== null){
              map.removeLayer('route');
            }
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
        play_area_expanded.set(false);
        map.flyTo({
          duration:12000,
          zoom:14
        })
        current_line.set(line.id);
        current_route.set(line);
        current_product = line.product;
        setTimeout(() => {
          if(line.id !== _current_line){
            // weird workaround. sometimes the status is not
            // set correctly at first try. if so, a retry will
            // do the trick;
            console.log("something is wrong, retrying");
            current_line.set(null);
            current_line.set(line.id);
          }
        }, 500)
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
    {/if}
    {/each}
  </div>
  {/if}
</div>
