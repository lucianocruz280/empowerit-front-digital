import { db } from '@/configs/firebaseConfig'
import {
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
  where,
} from 'firebase/firestore'

export const getAllExistantCredits = async () => {
  const usersRef = collection(db, 'users')
  const q = query(
    usersRef,
    where('credits', '>', 0),
    orderBy('credits', 'desc')
  )
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const data = querySnapshot.docs.map((doc) => ({
      name: doc.data().name,
      email: doc.data().email,
      credits: doc.data().credits,
    }))
    return data
  } else {
    return null
  }
}

export const getHistoryCredits = async () => {
  const notAvailable = [
    'Compra en Marketplace',
    'Compra en Marketplace Servicios Digital',
    'Compra de Acceso de Mr Sport Money en Marketplace Servicios Digital ',
    'Compra de Acceso de Mr Money Power en Marketplace Servicios Digital ',
    'Compra de Acceso de Mr Sport en Marketplace Servicios Digital ',
  ]
  const q = query(
    collectionGroup(db, 'credits-history'),
    orderBy('created_at', 'desc')
  )
  const qSnapshot = await getDocs(q)
  let data = []
  for (const docu of qSnapshot.docs) {
    if (!notAvailable.includes(docu.data().concept)) {
      data.push(docu.data())
    }
  }
  return data
}
