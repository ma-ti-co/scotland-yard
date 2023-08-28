<script>
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
  let players = 1;
  let response_errors;
  let stops;

  onMount(() => {
    lnglat_static = localStorage.getItem('latlng_static') ? JSON.parse(localStorage.getItem('latlng_static')) : null
    if (navigator.geolocation && !lnglat_static) {
      navigator.geolocation.getCurrentPosition((o) => {
        lnglat_static = [o.coords.longitude, o.coords.latitude];
        localStorage.setItem('lnglat_static', JSON.stringify(lnglat_static))
    })
  }
  })


  const fetchStops = async () => {
    const URL = `https://v6.bvg.transport.rest/locations/nearby?latitude=${lnglat_static[0]}&longitude=${lnglat_static[1]}&distance=5000&results=250&linesOfStops=true`;
    try{
      const response = await fetch(URL);
      if(response.status === 200){
        stops = await response.json()
        console.log(stops);
      }
    }catch(err){
      console.log(err)
    }
  }
</script>
{#if lnglat_static!== undefined && lnglat_static !== null}
<Card.Root class="w-[400px] self-center mb-4 bg-green-400 pt-3 text-sm">
    <Card.Content class="text-center">
      <p>We have received your current location <span class="font-bold">{lnglat_static}</span></p><p>We will use it to calculate 
      your game area</p>
    </Card.Content>
</Card.Root>
{/if}

<Card.Root class="w-[400px] self-center">
  <Card.Header class="text-center">
    <Card.Title tag="h1">Create a new Game</Card.Title>
  </Card.Header>
  <Card.Content>
<form method="POST" action="?/create" use:enhance={({formElement, formData, action, cancel, submitter}) => {
    formData.append('stops', JSON.stringify(stops));
    return async ({ result, update }) => {
      response_errors = result.data;

    };
}}>
  <input class="hidden" value={lnglat_static} name="lnglat" />
  <Label class="font-bold mb-1">
    Choose an Area
  </Label>
  <select on:change={() => fetchStops()} name="area" class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium pr-4 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mb-4">
    <option selected disabled>Select a play area</option>
    {#each options as o}
    <option value={o.value}>{o.label}</option>
    {/each}
  </select>
  <div class="mt-9">
    <Label class="font-bold mb-1">
      Invite a Player
    </Label>
    {#each Array(players) as player, index}
    <Input class="mb-4" name={`player_${index}`} placeholder="Enter an Email Address" type="email" />
    {/each}
    <button on:click|preventDefault={() => players++}>Add another Player</button>
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
    <Button>Create</Button>
  </div>
</form>
</Card.Content>
<Card.Footer>
  Read the rules
</Card.Footer>
</Card.Root>



