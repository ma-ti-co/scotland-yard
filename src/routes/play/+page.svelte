<script>
  import { Loader2 } from "lucide-svelte";
  import { UserPlus2 } from 'lucide-svelte';
  import { Check } from 'lucide-svelte';
  import {enhance} from '$app/forms'
	import { fly, slide } from 'svelte/transition';
  import { onMount, afterUpdate } from "svelte";
  import * as Card from "$lib/components/ui/card";
  import * as Select from "$lib/components/ui/select";
  import { AlertCircle } from "lucide-svelte";
  import * as Alert from "$lib/components/ui/alert";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Input } from "$lib/components/ui/input";
  import Button from "$lib/components/ui/button/button.svelte";
  let lnglat_static;

  let options = [{value:1000, label:"1km"}, {value:2000, label:'2km'}, {value:3000, label:'3km'}, {value:4000, label:'4km'},{value:5000, label:'5km'}];
  let locations = [
    {value:[13.36018, 52.49098], label:"Schöneberg"}, 
    {value:[13.29561, 52.52212], label:"Charlottenburg"}, 
    {value:[13.41829, 52.49911], label:"Kreuzberg"},
    {value:[13.425283287011766, 52.53880273581597], label:"Prenzlauer Berg"},
    {value:[13.45395, 52.51584], label:"Friedrichshain"},
  ]
  let players = 1;
  let is_loading = true;
  let response_errors;
  let stops = null;
  let stops_filtered;
  let stops_are_loaded = false;

  $: {
    stops_are_loaded = stops !== null;
  }

  $: {
    is_loading = lnglat_static=== undefined || lnglat_static === null
  }

  onMount(() => {
    lnglat_static = localStorage.getItem('latlng_static') ? JSON.parse(localStorage.getItem('latlng_static')) : null
    if (navigator.geolocation && !lnglat_static) {
      navigator.geolocation.getCurrentPosition((o) => {
        lnglat_static = [o.coords.longitude, o.coords.latitude];
        localStorage.setItem('lnglat_static', JSON.stringify(lnglat_static))
    })
  }
  })


  const fetchStops = async (lnglat) => {
    const URL = `https://v6.bvg.transport.rest/locations/nearby?latitude=${lnglat[1]}&longitude=${lnglat[0]}&distance=25000&results=1500&linesOfStops=true`;
    try{
      const response = await fetch(URL);
      if(response.status === 200){
        stops = await response.json();
        stops_filtered = stops.filter((node) =>  node.products.subway === true || node.products.suburban === true);
        is_loading=false;
      }
    }catch(err){
      console.log(err)
    }
  }
</script>

<svelte:head>
	<title>Kottbusser Damm - Create a Game</title>
</svelte:head>

<div class="m-2">
  {#if lnglat_static!== undefined && lnglat_static !== null}
  <Card.Root class="w-full lg:w-[400px] self-center mb-4 bg-green-200 pt-3 text-sm">
      <Card.Content class="text-center text-green-700">
        <Check />
        <p>We have received your current location <span class="font-bold">{lnglat_static}</span></p><p>We will use it to calculate 
        your game area</p>
      </Card.Content>
  </Card.Root>
  {:else}
  <Card.Root class="w-[400px] self-center mb-4 bg-gray-200 p-3 text-sm">
    <div class="text-center">
      <div class="flex items-center">
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        <p>We are trying to find you ... Please allow the browser to get your current position</p>
      </div>
    </div>
  </Card.Root>

  {/if}


  <Card.Root class="w-full lg:w-[400px] self-center">
    <Card.Header class="text-center">
      <Card.Title tag="h1">Create a new Game</Card.Title>
    </Card.Header>
    <Card.Content>
  <form method="POST" action="?/create" use:enhance={({formElement, formData, action, cancel, submitter}) => {
      is_loading=true;
      formData.append('stops', JSON.stringify(stops_filtered));
      return async ({ result, update }) => {
        update()

      };
  }}>
    <!-- <input class="hidden" value={lnglat_static} name="lnglat" /> -->
    <Label class="font-bold mb-1">
      Choose an Area
    </Label>
    {#if stops && stops_are_loaded}
    <Card.Root class="self-center mb-2 bg-green-200 text-green-700 p-3 text-sm">
        <div>Great! We've loaded the {stops.length} nearest stops for your game.</div>
  </Card.Root>
    {/if}
    <select on:change={(e) => {
      let lnglat = e.target.value.split(',');
      is_loading=true
      fetchStops(lnglat)}
    } name="area" class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium pr-4 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4">
      <option selected disabled>Select a play area</option>
      {#if lnglat_static}
      <option value={lnglat_static}>My Current Location</option>
      {/if}
      {#each locations as l}
      <option value={l.value}>{l.label}</option>
      {/each}
    </select>
    <div class="mt-9">
      <Label class="font-bold mb-1">
        Invite a Player
      </Label>
      {#each Array(players) as player, index}
      <Input class="mb-4" name={`player_${index}`} placeholder="Enter an Email Address" type="email" />
      {/each}
      <button class="flex text-xs items-center" on:click|preventDefault={() => players++}><UserPlus2 class="mr-2 items-center"/> Add another Player</button>
    </div>
    {#if response_errors}
    <Alert.Root variant="destructive">
      <Alert.Title>Error</Alert.Title>
      <Alert.Description>
        {response_errors} was not found. But you can add more players later.
      </Alert.Description>
    </Alert.Root>
    {/if}
    <div class="mt-9">
      {#if is_loading || !stops_are_loaded}
      <Button disabled>
        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
      </Button>
      {:else}
      <Button>Create</Button>
      {/if}
    </div>
  </form>
  </Card.Content>
  <Card.Footer>
  </Card.Footer>
  </Card.Root>
</div>




