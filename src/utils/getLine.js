import {supabase} from './supabaseClient'

const getRoutesForLine = async (line) => {
  const {data, error} = await supabase
    .from('lines')
    .select('*')
    .eq('line', line)
    if(error){
      return error
    }else{
      return data[0].data
    }
}

export default getRoutesForLine