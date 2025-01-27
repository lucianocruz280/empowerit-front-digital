import { Button, Dialog, Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'

interface Cart {
     address: {
          state: string
          city: string
          colony: string
          street: string
          cp: string
          reference: string
          num_ext: string
          num_int: string
          phone: string
     }
     json: string
}

interface PendingShip {
     cart: Cart
     sent: boolean
     guide: string
}

export default function PendingShipsTable() {
     const user = useAppSelector((state) => state.auth.user)
     const [dataTable, setDataTable] = useState<PendingShip[]>()
     const [cart, setCart] = useState<any>(null)

     useEffect(() => {
          if (user && user.uid) {
               getData(user.uid)
          }
     }, [])

     const getData = async (id: string) => {
          const pendingShipsRef = collection(db, "users", id, "pending-ships")
          const q = query(pendingShipsRef, orderBy("created_at", "desc"))
          const pendingShipsSnapshot = await getDocs(q)
          let data: PendingShip[] = [];
          for (const pendingShip of pendingShipsSnapshot.docs) {
               data.push(pendingShip.data() as PendingShip)
          }
          setDataTable(data)
     }

     const openDetails = (cart: any) => {
          if (cart.json) setCart({ ...cart, json: JSON.parse(cart.json) })
     }

     console.log(dataTable)
     return (
          <div className='space-y-2'>
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
               <p className="font-bold text-3xl">Historial de Compras</p>
               <Table>
                    <THead>
                         <Tr>
                              <Th>Estado</Th>
                              <Th>Ciudad</Th>
                              <Th>Domicilio</Th>
                              <Th>Teléfono</Th>
                              <Th>Productos</Th>
                              <Th>Enviado</Th>
                              <Th>Guia</Th>
                         </Tr>
                    </THead>
                    <TBody>
                         {dataTable && dataTable.map((row, i) => (
                              <Tr key={i}>
                                   <Td>{row.cart?.address.state}</Td>
                                   <Td>{row.cart?.address.city}</Td>
                                   <Td>{row.cart?.address.street}, {row.cart?.address.colony}, {row.cart?.address.num_int}</Td>
                                   <Td>{row.cart?.address.phone}</Td>
                                   <Td>
                                        <Button size="sm" onClick={() => openDetails(row?.cart)}>
                                             Ver detalles
                                        </Button>
                                   </Td>
                                   <Td>{row?.sent == true ? (<FaCheck className="text-green-400" />
                                   ) : (
                                        <FaTimes className="text-red-400" />)}</Td>

                                   <Td>{row?.guide}</Td>

                              </Tr>
                         ))}
                    </TBody>
               </Table>
          </div>
     )
}
