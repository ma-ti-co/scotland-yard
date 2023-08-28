<script>
  import { onMount, getContext, afterUpdate, createEventDispatcher } from 'svelte'
  import { contextKey } from './mapbox.js';
  import getRoutesForLine from '../../utils/getLine.js'
  import {supabase} from '../../utils/supabaseClient'
  import Map from './Map.svelte';
  import { mapboxInstance } from './mapboxContext.js';


  const dispatch = createEventDispatcher();
  export let route;
  export let mapInstance;

  const getRouteColor = (type) => {
    switch(type){
      case 'bus':
        return 'rgb(169, 85, 153)';
        break;
      case 'subway':
        return 'rgb(0, 51, 153)';
      default:
        return 'orange';
    }

  }
  

  afterUpdate(() => {
    if(mapInstance.getLayer('route') !== undefined){
      mapInstance.removeLayer('route')
    }

    getRouteData();
  })



  async function getRouteData(){
    const {data, error} = await supabase
    .from('lines')
    .select('*')
    .eq('line', route.id)
    if(error){
      return error
    }else{

    if(!data) return;
    // check if source was already fetched previously
    // if so, just append it to the layer again
    if(mapInstance.getSource(route.id)===undefined){
      mapInstance.addSource(route.id, {
        'type':'geojson',
        'data': {
          'type':'Feature',
          'properties':{},
          'geometry': {
            'type': 'LineString',
            'coordinates': data[0].data
          }
        }
      })
    }
    mapInstance.addLayer({
        'id': 'route',
        'type': 'line',
        'source': route.id,
        'layout': {
        'line-join': 'round',
        'line-cap': 'round'
        },
        'paint': {
        'line-color': getRouteColor(route.product),
        'line-width': 8
        }
      });
      mapInstance.flyTo({
        zoom:14
      })
    }
  }
</script>
