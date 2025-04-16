interface Item {
  address: string
  isValid: boolean
}

interface Data {
  item: Item
}

interface Response {
  apiVersion: string
  requestId: string
  context: string
  data: Data
}

export const validateWallet = async (
  wallet: string,
  blockchain: 'bitcoin' | 'xrp' | 'litecoin'
) => {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/subscriptions/validate-wallet/${wallet}`
    )
   

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const res: boolean = await response.json()
    console.log("response", res)
    return { status: 'success', isValid: res }
  } catch (error) {
    return { status: 'error', error }
  }
}
