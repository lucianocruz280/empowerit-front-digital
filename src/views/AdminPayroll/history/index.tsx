import { Checkbox } from '@/components/ui'
import Table from '@/components/ui/Table'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import { formatNumberWithCommas } from '@/utils/format'
import useUserModalStore from '@/zustand/userModal'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const AdminPayroll = () => {
  const userModal = useUserModalStore((state) => state)
  const [payrolls, setPayrolls] = useState<any[]>([])
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null)
  const [modal, setModal] = useState(false)

  useEffect(() => {
    getDocs(
      query(collection(db, 'payroll'), orderBy('created_at', 'desc'))
    ).then((r) => {
      const payrollsPromises = r.docs.map(async (d) => {
        const payrollData = d.data()
        const detailsSnapshot = await getDocs(collection(d.ref, 'details'))
        const details = detailsSnapshot.docs.map((_d) => _d.data())
        const createdAt = payrollData.created_at.toDate()
        const formattedDate = createdAt.toLocaleString()
        return { ...payrollData, details, formattedDate }
      })

      Promise.all(payrollsPromises).then((payrollsData) => {
        setPayrolls(payrollsData)
      })
    })
  }, [])

  const handleRowClick = (payroll: any) => {
    setSelectedPayroll(payroll)
    setModal(true)
  }

  return (
    <div className="flex flex-col items-end space-y-8">
      <div className="w-full">
        <Table>
          <THead>
            <Tr>
              <Th>
                <Checkbox />
              </Th>
              <Th>Fecha de pago</Th>
              <Th>Total LTC</Th>
              <Th>Total USD</Th>
            </Tr>
          </THead>
          <TBody>
            {payrolls.map((payroll) => (
              <Tr
                key={payroll.id}
                onClick={() => handleRowClick(payroll)}
                style={{ cursor: 'pointer' }}
              >
                <Td>
                  <Checkbox />
                </Td>
                <Td>{payroll?.formattedDate}</Td>
                <Td>{payroll?.total_btc} BTC</Td>
                <Td>{payroll?.total_usd} USD</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
      {modal && (
        <div
          style={{ zIndex: 21 }}
          className="modal max-w-sm md:max-w-full overflow-scrol"
        >
          <div className="modal-content">
            <span
              className="close"
              onClick={() => setModal(false)}
              style={{ cursor: 'pointer' }}
            >
              {' '}
              &times;{' '}
            </span>
            <Table>
              <THead>
                <Tr>
                  <Th>Puntos Binario</Th>
                  <Th>Lado de binario cobrado</Th>
                  <Th>Puntos a la izquierda</Th>
                  <Th>Puntos a la derecha</Th>
                  <Th>Cantidad LTC</Th>
                  <Th>Bono Inicio Rapido</Th>
                  <Th>Bono Binario</Th>
                  <Th>Bono Presentador</Th>
                  <Th>Bono Mentor</Th>
                  <Th>Bono Carro</Th>
                  <Th>Nombre</Th>
                  <Th>Sub Total</Th>
                  <Th>Comisiones</Th>
                  <Th>Total</Th>
                </Tr>
              </THead>
              <TBody>
                {selectedPayroll &&
                  selectedPayroll?.details.map((detail: any) => (
                    <Tr key={detail?.id}>
                      <Td>{detail?.binary_points}</Td>
                      <Td>{detail?.binary_side}</Td>
                      <Td>{detail?.left_points}</Td>
                      <Td>{detail?.right_points}</Td>
                      <Td>{detail?.crypto_amount}</Td>
                      <Td>
                        {formatNumberWithCommas(
                          detail?.bond_quick_start + detail?.bond_founder,
                          2
                        )}{' '}
                        USD
                      </Td>
                      <Td>
                        {formatNumberWithCommas(detail?.bond_binary, 2)} USD
                      </Td>
                      <Td>
                        {formatNumberWithCommas(detail?.bond_presenter, 2)} USD
                      </Td>
                      <Td>
                        {formatNumberWithCommas(detail?.bond_mentor || 0, 2)}{' '}
                        USD
                      </Td>
                      <Td>
                        {formatNumberWithCommas(detail?.bond_car || 0, 2)} USD
                      </Td>
                      <Td>
                        <span
                          className="underline text-blue-500 hover:cursor-pointer"
                          onClick={() => userModal.openModal(detail.id)}
                        >
                          {detail?.name}
                        </span>
                      </Td>
                      <Td>{formatNumberWithCommas(detail?.subtotal, 2)} USD</Td>
                      <Td>{detail?.fee} USD</Td>
                      <Td>{formatNumberWithCommas(detail?.total, 2)} USD</Td>
                    </Tr>
                  ))}
              </TBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPayroll
