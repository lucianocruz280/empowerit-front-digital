import { useEffect, useState } from 'react'
import {
  getHistoryPurchases,
  CreditsHistoryDocProps,
} from '@/services/MrMoneyPower'
import THead from '@/components/ui/Table/THead'
import TBody from '@/components/ui/Table/TBody'
import Tr from '@/components/ui/Table/Tr'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import { Table } from '@/components/ui'

export default function MrMoneyHistoryAdmin() {
  const [purchases, setPurchases] = useState<CreditsHistoryDocProps[]>([])

  useEffect(() => {
    const fetchPurchases = async () => {
      const data = await getHistoryPurchases()
      setPurchases(data)
    }

    fetchPurchases()
  }, [])

  return (
    <div className="space-y-2">
      <p className="text-3xl font-bold">Historial Mr. Money Power</p>
      {purchases && (
        <Table>
          <THead>
            <Tr>
              <Th>Correo</Th>
              <Th>Fecha de compra</Th>
              <Th>Fecha de expiracion</Th>
              <Th>Nombre</Th>
              <Th>Costo</Th>
            </Tr>
          </THead>
          <TBody>
            {purchases.map((purchase, index) => (
              <Tr key={index}>
                <Td>{purchase.email}</Td>
                <Td>{purchase.created_at.toDate().toLocaleDateString()}</Td>
                <Td>
                  {purchase.mr_money_power_expires_at
                    .toDate()
                    .toLocaleDateString()}
                </Td>
                <Td>{purchase.name}</Td>
                <Td>$ {purchase.total}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      )}
    </div>
  )
}
