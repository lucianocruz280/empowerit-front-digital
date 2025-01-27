import { db } from '../configs/firebaseConfig'
import { collection, where, query, getDocs } from 'firebase/firestore'

const getPaidAmount = async (
  user_id: string,
  addressWallet: string
): Promise<number> => {
  try {
    // Obtener las transacciones
    const _query = query(
      collection(db, `users/${user_id}/transactions`),
      where(`data.item.address`, '==', addressWallet)
    )
    const transactions = await getDocs(_query)
    const { size } = transactions

    // Obtener monto pagado
    let paidAmount = 0
    for (let i = 0; i < size; i++) {
      const doc = transactions.docs[i]
      const data = doc.data()
      paidAmount += Number.parseFloat(data.data?.item?.amount)
    }

    return paidAmount
  } catch (e) {
    console.error('Error al obtener monto pagado: ', e)
    return 0
  }
}

export { getPaidAmount }
