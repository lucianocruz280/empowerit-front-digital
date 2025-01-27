import { Table } from '@/components/ui'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import React, { useEffect, useState } from 'react'
import { getHistoryCredits } from '@/services/Credits'
import { Timestamp } from 'firebase/firestore'

interface CreditHistory {
  name?: string;
  email?: string;
  total: number;
  concept: string;
  created_at: Timestamp;
}

export default function CreditsPurchaseHistoryTable() {

  const [dataTable, setDataTable] = useState<CreditHistory[] | null>(null);

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (dataTable) {
      console.log(dataTable)
    }
  }, [dataTable])

  const getData = async () => {
    const data = await getHistoryCredits()
    if (data) {
      setDataTable(data as CreditHistory[])
    }
  }



  return (
    <div>
      <p className="font-bold text-3xl">Historial de Créditos</p>

      <Table>
        <THead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Créditos</Th>
            <Th>Concepto</Th>
            <Th>Fecha</Th>
          </Tr>
        </THead>
        <TBody>
          {dataTable && dataTable.map((doc, index) => (
            <Tr key={index}>
              <Td>{doc?.name}</Td>
              <Td>{doc?.email}</Td>
              <Td>{doc.total}</Td>
              <Td>{doc.concept}</Td>
              <Td>{doc.created_at.toDate().toLocaleDateString()}</Td>
            </Tr>

          ))}
        </TBody>
      </Table>
    </div>
  )
}
