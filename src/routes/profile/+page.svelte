<script>
  //import {upload_profile_image} from "$lib/db.js"
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
  export let data;

  let games = data.aggregateGameData;


	let number;
  let error_msg;
  let {session, profile, supabase} = data;
  $: ({session, profile, supabase} = data);


  const handleDelete = (event) => {
    games = games.filter((node) => node.id !== event.detail.id)
    toast.success("Game deleted!");
  }

</script>


<div class="flex flex-col lg:flex-row gap-2">
  <div class="mb-4 bg-white rounded-md basis-96 flex-1 p-9">
    {#if games.length}
    <Button href="/play">Create new Game</Button>
    <div class="grid gap-4 mt-2">
      {#each games as game}
        <GamePreview user_id={session.user.id} game={game} on:delete={handleDelete} />
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
  <Card.Root>
    <Card.Header class="flex justify-center">
      <div class="flex justify-center my-6">
        <Avatar id={session.user.id} />
      </div>
      <Card.Title class="flex justify-center">{profile.data.username}</Card.Title>
      <Card.Description class="flex justify-center">{profile.data.email}</Card.Description>
    </Card.Header>
    <Card.Content>
      <div class="text-sm">
        <form method="POST" action="?/uploadImage" use:enhance={({}) => {
          return async ({result, update}) => {
            if(result.type === "failure"){
              if(result.data.img === null){
                error_msg = "Please choose an image."
              }
            }
            update();
          }
        }}>
          <input type="file" name="image" class="flex mb-2 h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          {#if error_msg}
          <div class="text-red-700 my-2">{error_msg}</div>
          {/if}
          <Button variant="outline">Upload</Button>
        </form>
      </div>
    </Card.Content>
    <div class="flex justify-end p-6">
      <Button variant="destructive">Delete Profile</Button>
    </div>
  </Card.Root>
  </div>
</div>




