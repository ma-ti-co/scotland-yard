<script>
    import { PUBLIC_SUPABASE_URL } from '$env/static/public'
import * as Card from "$lib/components/ui/card";
import * as Avatar from "$lib/components/ui/avatar";
export let id;
</script>

<Avatar.Root>
  <Avatar.Image src={`${PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${id}`} alt="" />
  <Avatar.Fallback><span class="font-bold">X</span></Avatar.Fallback>
</Avatar.Root>