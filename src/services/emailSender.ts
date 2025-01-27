export const sendEmail = async (email: string, otp: number) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/sendEmail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    return { status: 'success', data }
  } catch (error) {
    return { status: 'error', error }
  }
}
