async function fetchCountries() {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/location/countries`
  )

  if (!response.ok) {
    throw new Error('Countries fetch failed')
  }

  return response.json()
}

export default fetchCountries
