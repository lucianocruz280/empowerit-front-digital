import THead from '@/components/ui/Table/THead'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import { Dialog, Table } from '@/components/ui'
import { SevenLevelsProps } from '..'
import { useState } from 'react'

type SevenLevelsTableProps = {
  data: SevenLevelsProps[]
}

export default function SevenLevelsTable({ data }: SevenLevelsTableProps) {
  const [modal, setModal] = useState(false)
  const [dialogData, setDialogData] = useState<SevenLevelsProps | null>()

  const openModalWithProps = (data: SevenLevelsProps) => {
    setDialogData(data)
    setModal(true)
  }

  return (
    <>
      <Table>
        <THead>
          <Tr>
            <Th>Cuenta 7 niveles</Th>
            <Th>Correo</Th>
            <Th>Monto</Th>
          </Tr>
        </THead>
        <TBody>
          {data.map((item, index) => (
            <Tr
              key={index}
              className="hover:cursor-pointer"
              onClick={() => openModalWithProps(item)}
            >
              <Td>{item.seven_levels_account}</Td>
              <Td>{item.email}</Td>
              <Td>{item.amount}</Td>
            </Tr>
          ))}
        </TBody>
      </Table>
      <Dialog
        isOpen={modal}
        className="min-w-[600px]"
        onClose={() => setModal(false)}
      >
        {dialogData && dialogData && (
          <>
            <p className="text-2xl font-bold">Detalles 7 niveles</p>
            <p className="font-bold">
              Cuenta 7 niveles:
              <span className="font-normal">
                {dialogData.seven_levels_account}
              </span>
            </p>
            <p className="font-bold">
              Correo: <span className="font-normal"> {dialogData.email}</span>
            </p>
            <p className="font-bold">
              Monto: <span className="font-normal"> ${dialogData.amount}</span>
            </p>
            <Table className="mt-3">
              <THead>
                <Tr>
                  <Th>Nivel</Th>
                  <Th>Correo</Th>
                  <Th>%</Th>
                  <Th>Monto</Th>
                </Tr>
              </THead>
              <TBody>
                {dialogData &&
                  dialogData.seven_level_sponsors.map((item, index) => (
                    <Tr key={index}>
                      <Td>Nivel {index + 1}</Td>
                      <Td>{item.email}</Td>
                      <Td>{item.percentage}</Td>
                      <Td>$ {item.amount}</Td>
                    </Tr>
                  ))}
              </TBody>
            </Table>
          </>
        )}
      </Dialog>
    </>
  )
}
