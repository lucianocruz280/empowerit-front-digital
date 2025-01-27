import { db } from '@/configs/firebaseConfig'
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

import { ApiResponse } from '@/@types/common'
import { Inscription } from '@/views/sales/OrderList/store/inscriptionsSlice'
import dayjs from 'dayjs'

export async function getInscriptions(
  userId: string
): Promise<ApiResponse<{ total: number; data: Inscription[] }>> {
  try {
    const _query = query(
      collection(db, 'users'),
      where('sponsor_id', '==', userId),
      orderBy('created_at', 'desc')
    )
    const total = await getCountFromServer(_query)

    const result = await getDocs(_query)
    const data: any[] = result.docs.map(parseRef)
    return {
      status: 'success',
      data: { data, total: Number(total.data().count) },
    }
  } catch (e) {
    console.error(e)
    return { status: 'failed', e }
  }
}

export const parseRef = (doc: any) => {
  const docData = doc.data()
  return {
    id: doc.id,
    ...docData,
    subscription_expires_at: docData.subscription_expires_at
      ? dayjs(docData.subscription_expires_at.seconds * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        )
      : null,
    created_at: docData.created_at
      ? dayjs(docData.created_at.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
      : null,
    updated_at: docData.updated_at
      ? dayjs(docData.updated_at.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
      : null,
  }
}
