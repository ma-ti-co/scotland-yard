<script>
    import { Loader2 } from "lucide-svelte";
  import {createEventDispatcher} from 'svelte';
  import { enhance } from "$app/forms";
  import { MoreVertical } from "lucide-svelte";
  import * as Card from "$lib/components/ui/card";
  import { UserPlus2 } from 'lucide-svelte';
  import * as Dialog from "$lib/components/ui/dialog";
  import Label from "./ui/label/label.svelte";
  import Avatar from "./Avatar.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
  import ConfirmationStatus from "$lib/components/ConfirmationStatus.svelte"
  import { onMount } from "svelte";
  import toast, { Toaster } from 'svelte-french-toast';

  export let game
  export let user_id

  let error;
  let dialog;
  let dialog_open = false;
  let is_loading = false;
  let game_is_active = game.game_status
 

  const dispatch = createEventDispatcher();


  const handleGameStatusChange = (status) => {
    game_is_active = status
  }
</script>


<Card.Root>
  <Card.Header>
    <Card.Title>Game #{game.id}</Card.Title>
  </Card.Header>
  <Card.Content>
    {#each game.data as player}
    <div class="flex items-center justify-between pb-4">
      <div class="flex items-center mr-6">
       <Avatar id={player.g_uid} />
        <div class="mx-6 mt-2">
          <div class="font-bold">{player.g_uname}</div>
          <ConfirmationStatus on:status_update={(event) => handleGameStatusChange(event.detail.game_is_active)} game_id={game.id} player_id={player.g_uid} player_status={player.g_status} user_id={user_id} game_owner={game.owner} />
        </div>
      </div>
      {#if user_id === game.owner && player.g_uid !== user_id}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <MoreVertical />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <form action="?/removePlayer" method="POST" use:enhance={({formElement, formData, action, cancel, submitter}) => {
                game.data = game.data.filter((node) => node.g_uid !== player.g_uid)
                formData.append('game_id', game.id);
                return async ({ result, update }) => {
                  if(result.data?.actionNotAllowed){
                    toast.error('Game is active. Player cannot be deleted at the moment.', {
                      duration:3000
                  })
                    return
                  }
                  update()
                  toast.success('Player deleted.', {
                    duration:3000
                  })
                }
              }}>
                <button name="user" value={player.g_uid} variant="destructive">Remove Player</button>
              </form>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      {/if}
    </div>
    {/each}
    {#if user_id === game.owner}
    <Button name="email" variant="ghost" ><UserPlus2 class="mr-2"/> Add Player</Button>
    {/if}
<Dialog.Root bind:this={dialog} open={dialog_open}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Add a Player {dialog_open}</Dialog.Title>
      <Dialog.Description>
        Enter an Email and we will send out an invitation...
      </Dialog.Description>
    </Dialog.Header>
    <form method="POST" action="?/addPlayer" use:enhance={({formElement, formData, action, cancel, submitter}) => {
      return async ({ result, update }) => {
        if(result.data && result.data.error){
          error = result.data.error;
          let t = setTimeout(() => {
            error = null;
          }, 3000)
          return () => t.clearTimeout()
        }else{
          update()
        }

      };
    }}>
      <input class="hidden" name="game_id" value={game.id}/>
      {#if error}
      <div class="rounded-md bg-red-300 text-red-900 p-4">{error}</div>
      {/if}
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label class="text-right">Email</Label>
          <Input name="email" class="col-span-3" />
        </div>
      </div>
    <Dialog.Footer>
      <Button type="submit">Add</Button>
    </Dialog.Footer>
  </form>
  </Dialog.Content>
</Dialog.Root>
  </Card.Content>
  <Card.Footer>
    <div class="flex justify-between w-full mt-14">
      {#if game_is_active}
          <Button data-sveltekit-preload-data="hover" href={`/play/${game.id}`}>Start Game</Button>
      {:else}
      <div class="flex items-center text-gray-600"><Loader2 class="mr-2 h-4 w-4 animate-spin" /> Waiting for all players to confirm.</div>
      {/if}
      {#if user_id === game.owner}
      <div>
        <form action="?/deleteGame" method="POST" use:enhance={({}) => {
          is_loading = true;
          return async ({result, update}) => {
            dispatch('delete', {
			      id: game.id
		        });
          }
        }}>
          {#if is_loading}
          <Button disabled variant="destructive">
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          </Button>
          {:else}
          <Button name="game_id" value={game.id} variant="destructive">Delete Game</Button>
          {/if}
        </form>
      </div>
      {/if}
    </div>
  </Card.Footer>
</Card.Root>
<Toaster />