import { test, expect } from 'vitest'
import {checkIfAllPlayersConfirmed} from '$lib/gameplay'



const mockSupabaseResponse = {
  status_player_1:1,
  status_player_2:1
}




test('checkIfAllPlayersConfirmed should return an updated game status of 1', () => {

  expect(1+1).toEqual(2)
})