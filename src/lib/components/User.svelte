<script>
  import * as Card from "$lib/components/ui/card";
  import * as Avatar from "$lib/components/ui/avatar";
  import OnlineOffline from './OnlineOffline.svelte';

  export let group
  export let user
</script>


<Card.Root>
  <Card.Header class="flex justify-center">
    <Avatar.Root>
      <Avatar.Image src={`https://udazzzqqskonsleaxpwz.supabase.co/storage/v1/object/public/avatars/${user.id}`} alt="" />
      <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
    <Card.Title>{user.username}</Card.Title>
  </Card.Header>
  <Card.Content>
    <OnlineOffline group={group} id={user.id} />
  </Card.Content>
  <Card.Footer>
  </Card.Footer>
</Card.Root>