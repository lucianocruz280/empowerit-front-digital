import { Button } from '@/components/ui'
import Table from '@/components/ui/Table'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import dayjs from 'dayjs'
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

const GetUsersPacks = () => {
  const [users, setUsers] = useState<any[]>([])

  const getData = async () => {
    const res = await getDocs(
      query(
        collectionGroup(db, 'pending-fund-account'),
        where('sent', '==', false)
      )
    )
    const data = []
    for (const s_doc of res.docs) {
      const user = await getDoc(
        doc(db, `users/${s_doc.ref.parent?.parent?.id}`)
      )
      const sponsor = await getDoc(doc(db, `users/${user.get('sponsor_id')}`))
      data.push({
        ...s_doc.data(),
        ref_path: s_doc.ref.path,
        user: user.data(),
        sponsor: sponsor.data(),
      })
    }
    setUsers(data)
  }

  useEffect(() => {
    getData()
  }, [])

  const markSent = async (path: string, index: number) => {
    await updateDoc(doc(db, path), {
      sent: true,
      sent_at: new Date(),
    })

    const _data = [...users]
    _data.splice(index, 1)
    setUsers(_data)
  }

  return (
    <div className="flex flex-col space-y-8 w-full">
      <Table>
        <THead>
          <Tr>
            <Th>Correo</Th>
            <Th>Nombre</Th>
            <Th>Paquete</Th>
            <Th>Patrocinador</Th>
            <Th>Patrocinador Correo</Th>
            <Th>Fecha de inscripción</Th>
            <Th></Th>
          </Tr>
        </THead>
        <TBody>
          {users.map((user, i) => (
            <Tr key={i}>
              <Td>{user.user?.email}</Td>
              <Td>{user.user?.name}</Td>
              <Td>{user.pack}</Td>
              <Td>{user.sponsor?.name}</Td>
              <Td>{user.sponsor?.email}</Td>
              <Td>
                {dayjs(user?.created_at?.seconds * 1000).format(
                  'YYYY-MM-DD HH:mm:ss'
                )}
              </Td>
              <Td>
                <Button onClick={() => markSent(user.ref_path, i)}>
                  Macar como enviado
                </Button>
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

export default GetUsersPacks
