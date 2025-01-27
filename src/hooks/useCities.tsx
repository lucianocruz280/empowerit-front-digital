import { useQuery } from '@tanstack/react-query'
import fetchCities from '@/services/fetchCities'
import { Cities, State } from '@/@types/profile'

type Status = 'loading' | 'error' | 'success'

export type CitiesHook = [Cities, Status | undefined]

export default function useCities(state: State): CitiesHook {
  const stateValue = state.value
  const cities = useQuery(['cities', stateValue], fetchCities)

  return [cities?.data ?? [], cities?.status]
}
