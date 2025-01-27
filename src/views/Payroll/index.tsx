import { Dialog } from '@/components/ui'
import Table from '@/components/ui/Table'
import TBody from '@/components/ui/Table/TBody'
import THead from '@/components/ui/Table/THead'
import Td from '@/components/ui/Table/Td'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import useUserModalStore from '@/zustand/userModal'
import dayjs from 'dayjs'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const AdminPayroll = () => {
  const userModal = useUserModalStore((state) => state)

  const [payrolls, setPayrolls] = useState<any[]>([])
  const [selectedPayroll, setSelectedPayroll] = useState<any>(null)
  const [selectePayrollDetails, setSelectedPayrollDetails] = useState<any[]>([])
  const user = useAppSelector((state) => state.auth.user)
  const userId = user?.uid

  useEffect(() => {
    getDocs(
      query(
        collection(db, 'users/' + userId + '/payroll'),
        orderBy('created_at', 'desc')
      )
    ).then((r) => {
      const payrollsPromises = r.docs.map(async (d) => {
        const payrollData = d.data()
        const createdAt = payrollData.created_at.toDate()
        const formattedDate = createdAt.toLocaleString()
        return { ...payrollData, formattedDate }
      })
      Promise.all(payrollsPromises).then((payrollsData) => {
        setPayrolls(payrollsData)
      })
    })
  }, [])

  const handleRowClick = async (payroll: any, payrollIndex: number) => {
    const pastPayroll =
      payrolls[payrollIndex + 1 < payrolls.length ? payrollIndex + 1 : 0]
    setSelectedPayroll(payroll.id)

    const date = dayjs(payroll.created_at.seconds * 1000)
    const dateFrom = dayjs(pastPayroll.created_at.seconds * 1000)
    /**
     * de 11pm a 11pm
     */
    const snap = await getDocs(
      query(
        collection(db, `users/${userId}/profits_details`),
        where('created_at', '>=', dateFrom.toDate()),
        where(
          'created_at',
          '<=',
          date.endOf('day').subtract(1, 'hour').toDate()
        ),
        orderBy('created_at', 'asc')
      )
    )
    setSelectedPayrollDetails(
      snap.docs.map((r) => ({
        id: r.id,
        ...r.data(),
      }))
    )
  }

  return (
    <div className="flex flex-col items-end space-y-8">
      <div className="w-full">
        <Table>
          <THead>
            <Tr>
              <Th></Th>
              <Th>Fecha de pago</Th>
              <Th>Binario</Th>
              <Th>Puntos de binario</Th>
              <Th>Lado de binario cobrado</Th>
              <Th>Puntos izquierda</Th>
              <Th>Puntos derecha</Th>
              <Th>Cantidad LTC</Th>
              <Th>Bono Inicio Rapido</Th>
              <Th>Bono Binario</Th>
              <Th>Bono Mentor</Th>
              <Th>Bono Carro</Th>
              <Th>Subtotal USD</Th>
              <Th>Comisión</Th>
              <Th>Total USD</Th>
            </Tr>
          </THead>
          <TBody>
            {payrolls.map((payroll, index) => (
              <Tr key={payroll.id}>
                <Td className="whitespace-nowrap">
                  <span
                    className="underline text-blue-400 hover:cursor-pointer hover:text-blue-600 select-none"
                    onClick={() => handleRowClick(payroll, index)}
                  >
                    Ver detalles
                  </span>
                </Td>
                <Td>{payroll?.formattedDate}</Td>
                <Td className="whitespace-nowrap">
                  {payroll?.binary?.toFixed(2) || 0} USD
                </Td>
                <Td>{payroll?.binary_points || 0} </Td>
                <Td>{payroll?.binary_side || 0} </Td>
                <Td>{payroll?.left_points || 0} </Td>
                <Td>{payroll?.right_points || 0}</Td>
                <Td className="whitespace-nowrap">
                  {payroll?.btc_amount || 0} BTC
                </Td>
                <Td className="whitespace-nowrap">
                  {payroll?.bond_quick_start} USD
                </Td>
                <Td className="whitespace-nowrap">
                  {payroll?.bond_binary} USD
                </Td>
                <Td className="whitespace-nowrap">
                  {payroll?.bond_mentor} USD
                </Td>
                <Td className="whitespace-nowrap">
                  {payroll?.bond_car || 0} USD
                </Td>
                <Td className="whitespace-nowrap">{payroll?.subtotal} USD</Td>
                <Td className="whitespace-nowrap">{payroll?.fee} USD</Td>
                <Td className="whitespace-nowrap">
                  <b>{payroll?.total} USD</b>
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>

        <Dialog
          isOpen={selectedPayroll}
          width={700}
          onClose={() => setSelectedPayroll(null)}
        >
          <div className={'pt-4'}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Concepto</th>
                  <th className="text-left">Usuario</th>
                  <th className="text-right">USD</th>
                  <th className="text-right">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {selectePayrollDetails.map((r, idx) => (
                  <tr key={idx}>
                    <td>{r.description}</td>
                    <td>
                      <span
                        className="underline text-blue-500 hover:cursor-pointer"
                        onClick={() => userModal.openModal(r.id_user)}
                      >
                        {r.user_name}
                      </span>
                    </td>
                    <td className="text-right">{r.amount}</td>
                    <td className="text-right">
                      {r.created_at.seconds
                        ? dayjs(r.created_at.seconds * 1000).format(
                            'DD/MM/YYYY HH:mm:ss'
                          )
                        : null}
                    </td>
                  </tr>
                ))}
                {selectePayrollDetails.length == 0 && (
                  <tr>
                    <td colSpan={4} className="text-left">
                      No hay datos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminPayroll
