import { Button, Dialog, Input, Notification, toast } from '@/components/ui'
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
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'

const GetUsersPacks = () => {
  const [users, setUsers] = useState<any[]>([])
  const [cart, setCart] = useState<any>(null)
  const [guide, setGuide] = useState<string>('')
  const [guideModal, setGuideModal] = useState<boolean>(false)
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null)

  const getData = async () => {
    const res = await getDocs(
      query(collectionGroup(db, 'pending-ships'), orderBy('created_at', 'desc'))
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
        user: { ...user.data(), id: user.id },
        sponsor: { ...sponsor.data(), id: sponsor.id },
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
    _data[index].sent = true
    setUsers(_data)
  }

  const openGuideModal = async (path: string, index: number, prevGuide: string) => {
    setSelectedUserIndex(index)
    setGuide(prevGuide)
    setGuideModal(true)
  }
  const addGuide = async () => {
    if (selectedUserIndex !== null) {
      const path = users[selectedUserIndex].ref_path
      await updateDoc(doc(db, path), {
        guide: guide,
      })

      const _data = [...users]
      _data[selectedUserIndex].guide = guide
      setUsers(_data)
      setGuideModal(false)
      setGuide('')
    }
  }

  const sendShopify = async (user: any) => {
    await fetch(`${import.meta.env.VITE_API_URL}/subscriptions/sendPack`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: user.user.id,
        pack: user.pack,
      }),
    })
    toast.push(
      <Notification title="Shopify" type="success">
        Pedido creado en shopify
      </Notification>,
      {
        placement: 'top-center',
      }
    )
  }

  const openDetails = (cart: any) => {
    if (cart.json) setCart({ ...cart, json: JSON.parse(cart.json) })
  }

  return (
    <div className="flex flex-col space-y-8 w-full">
      <Dialog isOpen={cart !== null} onClose={() => setCart(null)}>
        <div className="flex">
          <div className="flex-1">
            Estado: {cart?.address.state}
            <br />
            Ciudad: {cart?.address.city}
            <br />
            Colonia: {cart?.address.colony}
            <br />
            Calle: {cart?.address.street}
            <br />
            CP: {cart?.address.cp}
            <br />
            Referencia: {cart?.address.reference}
            <br />
            num exterior: {cart?.address.num_ext}
            <br />
            num interior: {cart?.address.num_int}
            <br />
            Télefono: {cart?.address.phone}
            <br />
          </div>
          <div className="pr-8">
            <ul>
              {cart?.json
                .filter((r: any) => r.quantity)
                .map((r: any) => (
                  <li key={r.id}>
                    {r.quantity} x {r.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </Dialog>
      <Dialog isOpen={guideModal} onClose={() => setGuideModal(false)}>
        <div className='space-y-2'>
          <p className='text-lg font-semibold'>Ingrese la guía</p>
          <Input type="text" onChange={(e) => setGuide(e.target.value)} value={guide} />
          <Button onClick={addGuide}>
            Agregar Guia
          </Button>
        </div>
      </Dialog>
      <Table>
        <THead>
          <Tr>
            <Th>Correo</Th>
            <Th>Nombre</Th>
            <Th>Paquete</Th>
            <Th>Patrocinador</Th>
            <Th>Patrocinador Correo</Th>
            <Th>Fecha de creación de pedido</Th>
            <Th>Detalles de envío</Th>
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
              <Td className='flex flex-col'>
                <Button size="sm" onClick={() => openDetails(user.cart)}>
                  Ver detalles
                </Button>
                {user.sent == 'false' || user.sent == false ? (
                  <Button size="sm" onClick={() => markSent(user.ref_path, i)}>
                    Marcar como enviado
                  </Button>
                ) : (
                  <Button size="sm" disabled={true} >
                    Enviado
                  </Button>
                )}
                {user.guide ? (
                  <Button size='sm' onClick={() => openGuideModal(user.ref_path, i, user.guide)} >
                    Guía añadida
                  </Button>
                ) : (
                  <Button size='sm' onClick={() => openGuideModal(user.ref_path, i, '')}>
                    Agregar Guia
                  </Button>
                )}

                {/*<Button onClick={() => sendShopify(user)}>
                  Crear en shopify
                </Button>*/}
              </Td>
            </Tr>
          ))}
        </TBody>
      </Table>
    </div>
  )
}

export default GetUsersPacks
