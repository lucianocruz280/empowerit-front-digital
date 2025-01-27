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
      }/cryptoapis/validateWallet?blockchain=${blockchain}&wallet=` +
        encodeURIComponent(wallet)
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const res: Response = await response.json()
    return { status: 'success', isValid: res.data.item.isValid }
  } catch (error) {
    return { status: 'error', error }
  }
}
