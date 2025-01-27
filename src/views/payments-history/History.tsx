import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  QueryDocumentSnapshot,
  endAt,
  where,
  setDoc,
  addDoc,
} from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { toast } from '@/components/ui'

interface RowData {
  id: string
  item: string
  status: string
  date: number
  amount: number
}

interface BillingHistoryProps {
  data: RowData[]
}

const History: React.FC<BillingHistoryProps> = ({ data = [], ...rest }) => {
  const [users, setUsers] = useState<any[]>([])
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null)
  const [firstVisible, setFirstVisible] =
    useState<QueryDocumentSnapshot | null>(null)
  const pageSize = 1000

  useEffect(() => {
    loadPage(true)
  }, [])

  /* useEffect(() => {
    if (users.length > 0) {
      isActivatedWithVolumen()
    }
  }, [users])

  const isActivatedWithVolumen = async () => {
    try {
      const activationsWithoutVolumeSnapshot = await getDocs(collection(db, "admin-activations"))
      const activationsWithoutVolume = activationsWithoutVolumeSnapshot.docs.map(doc => doc.data().id_user)
      const activationsWithVolumeSnapshot = await getDocs(collection(db, "admin-actionvations-with-volume"))
      const activationsWithVolume = activationsWithVolumeSnapshot.docs.map(doc => doc.data().user_id)

      const updatedUsers = users.map(user => {
        if (activationsWithoutVolume.includes(user.id)) {
          return { ...user, activatedType: 'Activada Sin Volumen' }
        }
        if (activationsWithVolume.includes(user.id)) {
          return { ...user, activatedType: 'Activada con Volumen' }
        }
        return { ...user, activatedType: '' }
      })

      setUsers(updatedUsers)
      setActivatedType(true)
    } catch (error) {
      console.error(error)
    }
  } */

  const loadPage = async (isNextPage: boolean) => {
    try {
      let _query = null

      if (isNextPage && lastVisible) {
        _query = query(
          collection(db, 'memberships-history'),
          orderBy('created_at', 'desc'),
          limit(pageSize),
          startAfter(lastVisible)
        )
      } else if (!isNextPage && firstVisible) {
        _query = query(
          collection(db, 'memberships-history'),
          orderBy('created_at', 'desc'),
          limit(pageSize),
          endAt(firstVisible)
        )
      } else {
        _query = query(
          collection(db, 'memberships-history'),
          orderBy('created_at', 'desc'),
          limit(pageSize)
        )
      }

      const snapshot = await getDocs(_query!)
      const newUsers: any[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        date: doc.data().created_at
          ? dayjs(doc.data().created_at.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')
          : null,
        sponsor: doc.data().sponsor,
        upline: doc.data().upline,
        position: doc.data().position,
        membership: doc.get('membership'),
        pay_status: doc.data().subscription_status,
        pay_status_link: doc.data().payment_link ? doc.data().payment_link : {},
        activatedType: doc.data().activated,
        currency: doc.data().currency
      }))

      setUsers(newUsers)

      if (snapshot.docs.length > 0) {
        setLastVisible(snapshot.docs[snapshot.docs.length - 1])
        setFirstVisible(snapshot.docs[0])
      }
    } catch (error) {
      console.error('Error loading page:', error)
    }
  }

  /* const test = async () => {
    const ref = collection(db,"memberships-history")
    let xd = 0
    for ( const u of users ){
      await addDoc(ref,{
        activated: u.activatedType,
        date: u.date,
        email: u.email,
        user_id: u.id,
        membership: u.membership,
        name: u.name,
        position: u.position,
        sponsor: u.sponsor,
        upline: u.upline,
        created_at: new Date()
      })
      xd++
    }
  } */

  return (
    <div {...rest} className="ov overflow-x-auto">
      {/* <button onClick={() => test()}>ONlick</button> */}
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y hora
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membresia
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sponsor
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upline
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Posición
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Activación
              </th>
              <th className="py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Divisa
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((item, key) => (
              <tr key={key} className="hover:bg-gray-100 transition-colors text-center">
                <td className="py-4 whitespace-nowrap">{item.date}</td> 
                <td className="py-4 whitespace-nowrap">{item.name}</td>
                <td className="py-4 whitespace-nowrap">{item.membership}</td>
                <td className="py-4 whitespace-nowrap">{item.email}</td>
                <td className="py-4 whitespace-nowrap">{item.sponsor}</td>
                <td className="py-4 whitespace-nowrap">{item.upline}</td>
                <td className="py-4 whitespace-nowrap">
                  {item.position === 'right' ? (
                    <span>Derecha</span>
                  ) : item.position === 'left' ? (
                    <span>Izquierda</span>
                  ) : (
                    ''
                  )}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">{item.activatedType}</td>
                <td className="py-4 px-4 whitespace-nowrap">{item.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      <div className="flex justify-center mt-4">
        {/* Opcional: agregar botones para paginación */}
      </div>
    </div>
  )
}

export default History
