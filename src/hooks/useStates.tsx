import { useQuery } from '@tanstack/react-query'
import fetchStates from '@/services/fetchStates'
import { Country, States } from '@/@types/profile'

type Status = 'loading' | 'error' | 'success'

export type StatesHook = [States, Status | undefined]

export default function useStates(country: Country): StatesHook {
  const countryCode = country.value
  const states = useQuery(['states', countryCode], fetchStates)

  return [states?.data ?? [], states?.status]
}
