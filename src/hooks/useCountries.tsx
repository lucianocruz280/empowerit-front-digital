import { useQuery } from '@tanstack/react-query'
import fetchCountries from '@/services/fetchCountries'
import { Countries } from '@/@types/profile'

type Status = 'loading' | 'error' | 'success'

export type CountriesHook = [Countries, Status | undefined]

export default function useCountries(): CountriesHook {
  const countries = useQuery(['countries'], fetchCountries)

  return [countries?.data ?? [], countries?.status]
}
