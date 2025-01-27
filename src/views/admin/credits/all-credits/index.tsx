import { Table } from "@/components/ui";
import TBody from "@/components/ui/Table/TBody";
import Td from "@/components/ui/Table/Td";
import Th from "@/components/ui/Table/Th";
import THead from "@/components/ui/Table/THead";
import Tr from "@/components/ui/Table/Tr";
import { getAllExistantCredits } from "@/services/Credits";
import { useEffect, useState } from "react";

export type ExistantCredits = {
  name: string
  email: string
  credits: number
}

export default function ExistantCreditsTable() {

  const [existantCredits, setExistantCredits] = useState<ExistantCredits[]>([])

  useEffect(() => {
    getCredits()
  }, [])

  const getCredits = async () => {
    const data = await getAllExistantCredits()
    if (data) {
      setExistantCredits(data)
    }
  }

  return (
    <div>
      <p className="font-bold text-3xl">Créditos en la red</p>
      <Table>
        <THead>
          <Tr>
            <Th>Nombre</Th>
            <Th>Email</Th>
            <Th>Créditos</Th>
          </Tr>
        </THead>
        <TBody>
          {existantCredits && existantCredits.map((doc, index) => (
            <Tr key={index}>
              <Td>{doc.name}</Td>
              <Td>{doc.email}</Td>
              <Td>{doc.credits}</Td>
            </Tr>

          ))}
        </TBody>
      </Table>
    </div>
  )
}
