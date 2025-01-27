import { Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type WalletsDoc = {
     created_at: Timestamp
     new_wallet: string
     prev_wallet: string
     type: string
}

export default function WalletsHistoryTable() {

     const [wallets, setWallets] = useState<WalletsDoc[]>()
     const user = useAppSelector((state) => state.auth.user)

     useEffect(() => {
          getWallets()
     }, [user])


     const getWallets = async () => {
          if (!user.uid) return
          const querySnapshot = await getDocs(collection(db, "users", user.uid, "wallets-history"));
          let wallets: WalletsDoc[] = [];
          for (const docu of querySnapshot.docs) {
               wallets.push(docu.data() as WalletsDoc)
          }
          setWallets(wallets)
     }

     return (
          <div className='space-y-3'>
               {
                    wallets && wallets.length > 0 && (
                         <>
                              <span className="font-bold text-3xl">Historial de Wallets</span>
                              <Table>
                                   <THead>
                                        <Tr>
                                             <Th>Wallet Anterior</Th>
                                             <Th>Wallet Nueva</Th>
                                             <Th>Divisa</Th>
                                             <Th>Fecha</Th>
                                        </Tr>
                                   </THead>
                                   <TBody>
                                        {wallets.map((wallet, index) => (
                                             <Tr key={index}>
                                                  <Td>{wallet.prev_wallet == '' ? 'Wallet Eliminada' : wallet.prev_wallet}</Td>
                                                  <Td>{wallet.new_wallet == '' ? 'Wallet Eliminada' : wallet.new_wallet}</Td>
                                                  <Td>{wallet.type}</Td>
                                                  <Td>{wallet.created_at.toDate().toLocaleDateString()}</Td>
                                             </Tr>
                                        ))}
                                   </TBody>
                              </Table>
                         </>
                    )
               }

          </div>
     )
}
