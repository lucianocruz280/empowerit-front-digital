async function fetchStates({ queryKey }: { queryKey: unknown[] }) {
  const countryCode = queryKey[1]
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/location/states/${countryCode}`
  )

  if (!response.ok) {
    throw new Error('States fetch failed')
  }

  return response.json()
}

export default fetchStates
