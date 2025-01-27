import { db } from '@/configs/firebaseConfig'
import dayjs from 'dayjs'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

const NewUsers = () => {
  const [topPeople, setTopPeople] = useState<any[]>([])

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'users'),
        where('subscription.pro.status', '==', 'paid'),
        orderBy('created_at', 'desc'),
        limit(15)
      ),
      (snap) => {
        setTopPeople(snap.docs.map((r) => ({ id: r.id, ...r.data() })))
      }
    )

    return () => unsub()
  }, [])

  return (
    <div id="p-1">
      <h1 className="text-xl font-medium">REGISTROS</h1>

      <table className="w-full h-full">
        <thead>
          <tr>
            <th></th>
            <th colSpan={2}>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {topPeople.map((doc) => {
            const date = dayjs(doc.subscription?.pro?.start_at?.seconds * 1000)
            return (
              <tr key={doc.id}>
                <td>
                  🔊🎉 Nuevo socio Empowerit{' '}
                  <span className="font-medium text-black">{doc.name}</span>
                </td>
                <td className="text-right">
                  {date.isValid() ? date.format('DD/MM') : ''}
                </td>
                <td className="text-right">
                  {date.isValid() ? date.format('HH:mm') : ''}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default NewUsers
