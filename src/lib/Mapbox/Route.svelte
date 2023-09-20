<script>
  import { onMount, getContext, afterUpdate, createEventDispatcher } from 'svelte'
  import { contextKey } from './mapbox.js';
  import {getRoutesForLine, resetMapRoute} from '$lib/gameplay.js'
  import {supabase} from '../../utils/supabaseClient'
  import Map from './Map.svelte';


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
      case 'suburban':
        return 'rgb(67, 152, 68)';
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
    const data = await getRoutesForLine(route);
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
            'coordinates': data
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
        zoom:12
      })
    }
</script>
