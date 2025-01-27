import { db } from '@/configs/firebaseConfig'
import {
  collectionGroup,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore'

export type CreditsHistoryDocProps = {
  concept: string
  created_at: Timestamp
  email: string
  id_user: string
  mr_money_power_expires_at: Timestamp
  name: string
  total: number
}

export const getHistoryPurchases = async () => {
  const q = query(
    collectionGroup(db, 'credits-history'),
    where(
      'concept',
      '==',
      'Compra de Acceso de Mr Money Power en Marketplace Servicios Digital '
    ),
    orderBy('created_at', 'desc')
  )
  const qSnapshot = await getDocs(q)
  const data: CreditsHistoryDocProps[] = []
  for (const qSnapshotDocu of qSnapshot.docs) {
    data.push(qSnapshotDocu.data() as CreditsHistoryDocProps)
  }
  return data
}
