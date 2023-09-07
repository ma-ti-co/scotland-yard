<script>
  //import {upload_profile_image} from "$lib/db.js"
  import * as Sheet from "$lib/components/ui/sheet";
  import { Badge } from "$lib/components/ui/badge";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import * as Card from "$lib/components/ui/card";
  import * as Dialog from "$lib/components/ui/dialog";
  import { onMount } from "svelte";
  import * as Avatar from "$lib/components/ui/avatar";
  import { stringify } from "postcss";
  import GamePreview from "$lib/components/GamePreview.svelte";
  import { enhance } from "$app/forms";
  import toast, { Toaster } from 'svelte-french-toast';
  export let data;

  let games = data.aggregateGameData;


	let number;
  let {session, profile, supabase} = data;
  $: ({session, profile, supabase} = data);


  const handleDelete = (event) => {
    games = games.filter((node) => node.id !== event.detail.id)
    toast.success("Game deleted!");
  }

</script>


<div class="mb-4">
<Button href="/play">Create new Game</Button>
</div>
<div class="grid gap-4">
  {#each games as game}
    <GamePreview user_id={session.user.id} game={game} on:delete={handleDelete} />
  {/each}
</div>
<!-- <div class="order-1">
<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <form method="POST" action="/profile?/uploadImage" use:enhance>
      <input type="file" name="image"/>
      <button type="submit">Upload</button>
    </form>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>
</div> -->




