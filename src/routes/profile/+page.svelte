<script>
  import { Badge } from "$lib/components/ui/badge";
  import * as Card from "$lib/components/ui/card";
  export let data;
  let {session, profile, supabase} = data;
  $: ({session, profile, supabase} = data);

  const uploadImage = async (e) => {
    let form = new FormData(e.target);
    let img = form.get('image');
    const {data, error} = await supabase
      .storage
      .from('avatars')
      .upload(session.user.id + "/", img);
    if(error){
      console.log(error)
    }else{
      console.log(data);
      const { data:image } = supabase
      .storage
        .from('avatars')
        .getPublicUrl(data.path)
      
      console.log(image.pu)
    }
  }
</script>




<Card.Root>
  <Card.Header>
    <Card.Title>Card Title</Card.Title>
    <Card.Description>Card Description</Card.Description>
  </Card.Header>
  <Card.Content>
    <form on:submit|preventDefault={uploadImage}>
      <input type="file" name="image"/>
      <button type="submit">Upload</button>
    </form>
    <p>Card Content</p>
  </Card.Content>
  <Card.Footer>
    <p>Card Footer</p>
  </Card.Footer>
</Card.Root>