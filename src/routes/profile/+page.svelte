<script>
   import { fade } from 'svelte/transition';
  import * as Sheet from "$lib/components/ui/sheet";
  import { Badge } from "$lib/components/ui/badge";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import { onMount } from "svelte";
  import { stringify } from "postcss";
  import GamePreview from "$lib/components/GamePreview.svelte";
  import { enhance } from "$app/forms";
  import toast, { Toaster } from 'svelte-french-toast';
  import Avatar from "$lib/components/Avatar.svelte";
  import ProfileCard from '$lib/components/ProfileCard.svelte';
  export let data;

  let games = data.aggregateGameData;


	let number;
  let error_msg;
  let {session, profile, supabase} = data;
  $: ({session, profile, supabase} = data);


  const handleDelete = (event) => {
    let t = setTimeout(() => {
      games = games.filter((node) => node.id !== event.detail.id)
    }, 600);
    toast.success("Game deleted!");
    return () => clearTimeout(t);
  }

</script>


<div class="flex flex-col lg:flex-row gap-2">
  <div class="mb-4 bg-white rounded-md basis-96 flex-1 p-2 xl:p-9">
    {#if games.length}
    <Button href="/play">Create new Game</Button>
    <div class="grid lg:grid-cols-2 gap-4 mt-2">
      {#each games as game}
        <div transition:fade={{ delay: 250, duration: 300 }}>
        <GamePreview user_id={session.user.id} game={game} on:delete={handleDelete} />
        </div>
      {/each}
    </div>
    {:else}
    <div class="h-full grid place-items-center">
      <div>
        <div class="text-2xl text-gray-300 text-center">No active games at the moment. Create one!</div>
        <div class="text-center mt-4">
          <Button href="/play">Create new Game</Button>
        </div>
      </div>
    </div>
    {/if}
  </div>


  <div class="order-1">
    <ProfileCard session={session} profile={profile} />
  </div>
</div>




