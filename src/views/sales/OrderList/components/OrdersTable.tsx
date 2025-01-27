import dayjs from 'dayjs'
import { Table } from '@/components/ui'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import THead from '@/components/ui/Table/THead'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import { useOrderContext } from './OrderContext'

const OrdersTable = () => {
  const { datatable } = useOrderContext()

  return (
    <Table>
      <THead>
        <Tr>
          <Th>Nombre</Th>
          <Th>Email</Th>
          <Th>Membresia</Th>
          <Th>Lado</Th>
          <Th>Fecha de inicio</Th>
        </Tr>
      </THead>
      <TBody>
        {datatable.map((row) => (
          <Tr key={row.id}>
            <Td>{row.name}</Td>
            <Td>{row.email}</Td>
            <Td>
              <span>
                {row.membership && row.membership_status == 'paid' ? (
                  <span>{row.membership}</span>
                ) : (
                  <span className="text-red-500">Expirado</span>
                )}
              </span>
            </Td>
            <Td>
              <span>{row.position == 'left' ? 'Izquierda' : 'Derecha'}</span>
            </Td>
            <Td>
              <span>{row.created_at}</span>
            </Td>
          </Tr>
        ))}
      </TBody>
    </Table>
  )
}

export default OrdersTable
