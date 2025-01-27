import { db } from '@/configs/firebaseConfig'
import { validateWallet } from '@/services/ValidateWallet'
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore'

const usersCollectionRef = collection(db, 'users')

export const getUsersWallet = async () => {
  const data = await getDocs(usersCollectionRef)
  const filteredData = data.docs.map((doc) => {
    const docData = doc.data()
    if (docData.wallet_bitcoin) {
      return {
        docId: doc.id,
        wallet_bitcoin: docData.wallet_bitcoin,
      }
    }
  })

  const validData = filteredData.filter((data) => data !== undefined)
  return validData
}

export const removeInvalidWallet = async () => {
  try {
    const usersData = await getUsersWallet()
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    if (!usersData) return

    for (const user of usersData) {
      if (!user) continue
      const { docId, wallet_bitcoin } = user

      const res = await validateWallet(wallet_bitcoin, 'bitcoin')
      const { isValid } = res

      if (!isValid) {
        const userDoc = doc(db, 'users', docId)
        await updateDoc(userDoc, {
          wallet_bitcoin: '',
        })
        console.log(
          'Invalid wallet removed: ',
          wallet_bitcoin,
          'from user: ',
          docId
        )
      }

      await delay(50)
    }
    console.log('All invalid wallets removed')
  } catch (error) {
    console.error('Error:', error)
  }
}
