async function fetchCities({ queryKey }: { queryKey: unknown[] }) {
  const state = queryKey[1]
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/location/cities/${state}`
  )

  if (!response.ok) {
    throw new Error('Cities fetch failed')
  }

  return response.json()
}

export default fetchCities
