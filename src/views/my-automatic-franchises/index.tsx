import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Button, Dialog, Table } from '@/components/ui'
import { AutomaticFranchises } from '../memberships/methods'
import Th from '@/components/ui/Table/Th'
import Tr from '@/components/ui/Table/Tr'
import THead from '@/components/ui/Table/THead'
import TBody from '@/components/ui/Table/TBody'
import Td from '@/components/ui/Table/Td'
import Stack from '@mui/material/Stack'
import { Gauge } from '@mui/x-charts/Gauge'
import TFoot from '@/components/ui/Table/TFoot'

export type AutomaticFranchiseData = {
  id?: string
  automatic_franchise_cap_current: number
  automatic_franchise_cap_limit: number
  available_pay_date_for_capital_pay: Timestamp
  available_pay_date_for_capital_performance: Timestamp
  available_pay_date_for_franchise_performance: Timestamp
  capital: number
  email: string
  created_at: Timestamp
  starts_at: Timestamp
  type: AutomaticFranchises
  user_id: string
  is_marketing_franchise?: boolean
}

export type pendingProfitsData = {
  created_at: Timestamp
  daily_performance: number
  doc_id: string
  type: AutomaticFranchises
  user_id: string
}

export type PayrollAutomaticFranchisesProps = {
  created_at: Timestamp
  doc_id: string
  email: string
  total: number
  type_payroll: string
  user_id: string
}

const MARKETING_IDS = ['BjsuClM1KiUi1FNLdUQ7BfeUHhR2']

export default function MyAutomaticFranchisesModal() {
  const user = useAppSelector((state) => state.auth.user)
  const [data, setData] = useState<AutomaticFranchiseData[]>([])
  const [selectedFranchise, setSelectedFranchise] = useState<number>(0)
  const [openEarningsHistoryModal, setOpenEarningsHistoryModal] =
    useState<boolean>(false)
  const [openCapitalEarningsHistoryModal, setOpenCapitalEarningsHistoryModal] =
    useState<boolean>(false)
  const [pendingProfitsData, setPendingProfitsData] = useState<
    pendingProfitsData[]
  >([])
  const [pendingCapitalProfitsData, setCapitalPendingProfitsData] = useState<
    pendingProfitsData[]
  >([])
  const [totalPendingProfits, setTotalPendingProfits] = useState<number>(0)
  const [totalCapitalPendingProfits, setTotalCapitalPendingProfits] =
    useState<number>(0)
  const [loadingPaymentProcess, setLoadingPaymentProcess] =
    useState<boolean>(false)
  const [totalFranchisePerformance, setTotalFranchisePerformance] = useState(0)
  const [
    totalFranchiseCapitalPerformance,
    setTotalFranchiseCapitalPerformance,
  ] = useState(0)
  const [payrollAutomaticFranchiseData, setPayrollAutomaticFranchiseData] =
    useState<PayrollAutomaticFranchisesProps[]>([])
  const [
    payrollAutomaticCapitalFranchiseData,
    setPayrollAutomaticCapitalFranchiseData,
  ] = useState<PayrollAutomaticFranchisesProps[]>([])

  useEffect(() => {
    if (user && user.uid) {
      const getAutomaticFranchisesSize = async () => {
        if (!user?.uid) return
        const automaticFranchisesRef = collection(
          db,
          `users/${user.uid}/automatic-franchises`
        )
        const q = await getDocs(
          query(automaticFranchisesRef, orderBy('created_at', 'desc'))
        )
        const automaticFranchises: AutomaticFranchiseData[] = []
        for (const qDocu of q.docs) {
          automaticFranchises.push({
            id: qDocu.id,
            ...(qDocu.data() as AutomaticFranchiseData),
          })
        }
        setData(automaticFranchises)
      }
      getAutomaticFranchisesSize()
    }
  }, [user])

  useEffect(() => {
    if (
      !user?.uid ||
      !data[selectedFranchise]?.available_pay_date_for_franchise_performance ||
      totalPendingProfits === undefined
    )
      return

    const getTotalFranchisePerformance = async () => {
      if (!user || !user.uid) return
      const userRef = doc(db, 'users', user.uid)
      const q = query(
        collection(userRef, 'payroll-automatic-franchises'),
        where('doc_id', '==', data[selectedFranchise].id)
      )
      const qSnapshot = await getDocs(q)
      let total = 0
      const payroll: PayrollAutomaticFranchisesProps[] = []
      for (const payrollDocu of qSnapshot.docs) {
        const docuData = payrollDocu.data()
        total = total + docuData.total
        payroll.push(docuData as PayrollAutomaticFranchisesProps)
      }
      setTotalFranchisePerformance(Math.floor(total))
      setPayrollAutomaticFranchiseData(payroll)
    }

    const getTotalFranchiseCapitalPerformance = async () => {
      if (!user || !user.uid) return
      const userRef = doc(db, 'users', user.uid)
      const q = query(
        collection(userRef, 'payroll-capital-automatic-franchises'),
        where('doc_id', '==', data[selectedFranchise].id)
      )
      const qSnapshot = await getDocs(q)
      let total = 0
      const payroll: PayrollAutomaticFranchisesProps[] = []
      for (const payrollDocu of qSnapshot.docs) {
        const docuData = payrollDocu.data()
        total = total + docuData.total
        payroll.push(docuData as PayrollAutomaticFranchisesProps)
      }
      setTotalFranchiseCapitalPerformance(Math.floor(total))
      setPayrollAutomaticCapitalFranchiseData(payroll)
    }

    const getPendingProfits = async (doc_id: string) => {
      if (!user || !user.uid) return

      try {
        const userRef = doc(db, 'users', user.uid)
        const automaticFranchisesPendingProfitsRef = collection(
          userRef,
          'automatic-franchises-performance-pending-profits'
        )

        const automaticFranchisesPendingProfitsQuery = query(
          automaticFranchisesPendingProfitsRef,
          orderBy('created_at', 'desc')
        )

        const pendingProfitsDocs = await getDocs(
          automaticFranchisesPendingProfitsQuery
        )
        const pendingProfitsData: pendingProfitsData[] = []
        let total = 0

        pendingProfitsDocs.forEach((docu) => {
          const data = docu.data()
          if (doc_id === data.doc_id) {
            pendingProfitsData.push(data as pendingProfitsData)
          }
          total += Number(data.daily_performance)
        })

        setPendingProfitsData(pendingProfitsData)
        setTotalPendingProfits(Number(total.toFixed(2)))
      } catch (error) {
        console.log('Error en la función de getPendingProfits', error)
      }
    }

    const getCapitalPendingProfits = async (doc_id: string) => {
      if (!user || !user.uid) return

      const userRef = doc(db, 'users', user.uid)
      const automaticFranchisesPendingProfitsRef = collection(
        userRef,
        'automatic-franchises-capital-performance-pending-profits'
      )
      const automaticFranchisesPendingProfitsQuery = query(
        automaticFranchisesPendingProfitsRef,
        orderBy('created_at', 'desc')
      )

      try {
        const pendingProfitsDocs = await getDocs(
          automaticFranchisesPendingProfitsQuery
        )
        const pendingProfitsData: pendingProfitsData[] = []
        let total = 0

        pendingProfitsDocs.forEach((docu) => {
          const data = docu.data()
          if (doc_id === data.doc_id) {
            pendingProfitsData.push(data as pendingProfitsData)
          }
          total += Number(data.daily_performance)
        })

        setCapitalPendingProfitsData(pendingProfitsData)
        setTotalCapitalPendingProfits(Number(total.toFixed(2)))
      } catch (error) {
        console.log('Error en la función de getPendingProfits', error)
      }
    }

    // Obtener las ganancias pendientes solo si hay un id válido
    if (data[selectedFranchise]?.id) {
      getPendingProfits(data[selectedFranchise].id)
      getCapitalPendingProfits(data[selectedFranchise].id)
      getTotalFranchisePerformance()
      getTotalFranchiseCapitalPerformance()
    }
  }, [selectedFranchise, data, user, totalPendingProfits])

  const getDaysRemaining = (date: Date) => {
    const currentDate = new Date()
    const timeDifference = date.getTime() - currentDate.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return `${daysRemaining} días ...`
  }

  const requestPaymentProcess = async (type: string, is_capital: boolean) => {
    if (type == 'quick') {
      setLoadingPaymentProcess(true)
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/subscriptions/quickPayForAutomaticFranchisePerformance`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              doc_id: data[selectedFranchise].id,
              user_id: user.uid,
              is_capital,
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Error en la petición')
        }
      } catch (error) {
        console.log('Error en el retiro rapido ', error)
      } finally {
        window.location.reload()
      }
    } else if (type == 'normal') {
      setLoadingPaymentProcess(true)
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/subscriptions/normalPayForAutomaticFranchisePerformance`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              doc_id: data[selectedFranchise].id,
              user_id: user.uid,
              is_capital,
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Error en la petición')
        }
      } catch (error) {
        console.log('Error en el retiro rapido ', error)
      } finally {
        setLoadingPaymentProcess(false)
      }
    }
  }
  return (
    <div className="h-full lg:space-y-4">
      <div className="-ml-8 -mt-6 w-full ">
        {data &&
          data.map((franchise, index) => (
            <Button
              key={index}
              disabled={selectedFranchise === index}
              className="border-t-0"
              onClick={() => setSelectedFranchise(index)}
            >
              Franquicia {index + 1}
            </Button>
          ))}
      </div>
      {/* Parte de arriba */}
      {data.length > 0 && selectedFranchise >= 0 && (
        <div className="grid grid-cols-1">
          <div className="flex flex-col lg:space-y-2 xl:space-y-0 xl:flex-row">
            <div className=" hidden lg:flex lg:flex-col  mx-4 p-4 items-center justify-center bg-slate-100 min-h-[150px] min-w-[250px] rounded-[10px] card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg xl:w-full">
              <p className="text-lg">Mi franquicia #{selectedFranchise + 1}</p>

              <span className="font-bold text-3xl">
                {data[selectedFranchise]?.type}
              </span>
            </div>
          </div>
        </div>
      )}
      {data.length > 0 && (
        <div className="grid grid-cols-1 3xl:grid-cols-2">
          {/* Parte izquierda CAPITAL */}
          <div className=" space-y-4 m-4 ">
            <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-8">
              <div className="flex flex-col p-4 items-center justify-center bg-slate-100 min-h-[150px]  rounded-[10px] card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg w-full">
                <p className="text-lg">Mi Capital</p>

                <span className="font-bold text-3xl">
                  $ {data[selectedFranchise].capital}
                </span>
              </div>
              <div className="flex flex-col p-4 items-center text-center justify-center bg-slate-100 min-h-[150px]  rounded-[10px] card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg w-full">
                <p className="text-lg">Total de Ganancias</p>

                <span className="font-bold text-3xl">
                  ${' '}
                  {Number(
                    data[
                      selectedFranchise
                    ].automatic_franchise_cap_current.toFixed(2)
                  )}
                </span>
              </div>

              <div className="flex flex-col p-4 items-center justify-center bg-slate-100 min-h-[150px] rounded-[10px] card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg text-center w-full">
                {data[
                  selectedFranchise
                ].available_pay_date_for_capital_performance.toDate() >
                new Date() ? (
                  <>
                    <p className="text-lg">
                      Mi capital generado inicia <br /> en
                    </p>
                    <span className="font-bold text-3xl">
                      {data[selectedFranchise]?.starts_at?.seconds &&
                        getDaysRemaining(
                          new Date(
                            data[selectedFranchise]
                              .available_pay_date_for_capital_performance
                              .seconds * 1000
                          )
                        )}
                    </span>
                  </>
                ) : (
                  <p className="text-3xl text-center font-bold">
                    Rendimiento Capital
                    <br />
                    Activo
                  </p>
                )}
              </div>
            </div>
            {data[
              selectedFranchise
            ].available_pay_date_for_franchise_performance.toDate() <
              new Date() && (
              <div
                className="flex p-4 justify-center m-auto items-center bg-slate-100 min-h-[150px] rounded-[10px] card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg space-x-6"
                onClick={() => setOpenCapitalEarningsHistoryModal(true)}
              >
                <div>
                  <p className="font-bold text-xl">Historial de Ganancias</p>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1, md: 3 }}
                  >
                    <Gauge
                      width={150}
                      height={150}
                      value={totalFranchiseCapitalPerformance}
                      valueMin={0}
                      valueMax={
                        data[selectedFranchise].automatic_franchise_cap_limit
                      }
                      innerRadius="70%"
                      outerRadius="100%"
                    />
                  </Stack>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold truncate">
                    Requisitos para Retiro Rápido:{' '}
                  </p>
                  <ul className="">
                    <li>
                      -{`Contar con un status de 'Rendimiento Capital Activo'`}
                    </li>
                    <li>-Contar con una ganancia mayor a 0 </li>
                  </ul>
                  <p className="font-bold truncate">
                    Requisitos para Solicitar Retiro:{' '}
                  </p>
                  <ul className="">
                    <li>
                      -
                      {`Contar con un mínimo de 365 días después de la adquisición`}
                    </li>
                    <li>-Contar con una ganancia pendiente mayor a $50 </li>
                    <li>-Contar con tu wallet de litecoin en tu perfil </li>
                  </ul>
                </div>
              </div>
            )}
            {data.length > 0 &&
              data[
                selectedFranchise
              ].available_pay_date_for_franchise_performance.toDate() <
                new Date() &&
              user.uid &&
              !data[selectedFranchise].is_marketing_franchise && (
                <div className="flex flex-col 821px:flex-row justify-end space-y-4 821px:space-y-0 821px:space-x-5">
                  <Button
                    className="justify-end"
                    variant="solid"
                    disabled={
                      totalCapitalPendingProfits <= 50 ||
                      data[
                        selectedFranchise
                      ].available_pay_date_for_capital_pay.toDate() >=
                        new Date()
                    }
                    onClick={() => requestPaymentProcess('normal', true)}
                  >
                    {totalCapitalPendingProfits <= 50 ||
                    data[
                      selectedFranchise
                    ].available_pay_date_for_capital_pay.toDate() >= new Date()
                      ? `${getDaysRemaining(
                          new Date(
                            data[selectedFranchise]
                              .available_pay_date_for_capital_pay.seconds * 1000
                          )
                        )}`
                      : 'Solicitar Pago'}
                  </Button>
                  <Button
                    className="justify-end"
                    variant="solid"
                    disabled={totalCapitalPendingProfits <= 0 ? true : false}
                    loading={loadingPaymentProcess}
                    onClick={() => requestPaymentProcess('quick', true)}
                  >
                    Retiro Rápido
                  </Button>
                </div>
              )}
            {data[
              selectedFranchise
            ].available_pay_date_for_franchise_performance.toDate() <
              new Date() &&
              pendingCapitalProfitsData.length > 0 && (
                <>
                  <p className="font-semibold text-xl">
                    Rendimiento de Capital Diario
                  </p>
                  <div className="overflow-y-auto flex-grow max-h-[250px]">
                    <Table className="w-full mt-1">
                      <THead>
                        <Tr className="">
                          <Th className="w-1/3">#</Th>
                          <Th className="w-1/3" align="center">
                            Fecha
                          </Th>
                          <Th className="w-1/3">Monto</Th>
                        </Tr>
                      </THead>
                      <TBody>
                        {pendingCapitalProfitsData &&
                          pendingCapitalProfitsData.map((item, index) => (
                            <Tr key={index}>
                              <Td className="w-1/3">{index}</Td>
                              <Td className="w-1/3">
                                {item.created_at.toDate().toLocaleDateString()}
                              </Td>
                              <Td className="w-1/3">
                                $ {item.daily_performance}
                              </Td>
                            </Tr>
                          ))}
                      </TBody>
                    </Table>
                  </div>
                  {/* Fila total fija */}
                  <Table className="w-full bg-gray-100">
                    <TFoot>
                      <Tr className="font-bold">
                        <Td className="w-1/3"></Td>
                        <Td className="font-bold w-1/3">TOTAL</Td>
                        <Td className="w-1/3">
                          $ {totalCapitalPendingProfits}
                        </Td>
                      </Tr>
                    </TFoot>
                  </Table>
                </>
              )}
            <p className="font-semibold text-3xl 3xl:hidden">Rendimiento</p>
          </div>
          {/* Parte derecha => RENDIMIENTO */}
          <div className="p-4 space-y-4">
            <div className="flex flex-col space space-y-2 lg:space-y-0 lg:flex-row justify-between lg:space-x-8">
              {data[
                selectedFranchise
              ].available_pay_date_for_franchise_performance.toDate() <
                new Date() &&
                pendingProfitsData && (
                  <div className="flex flex-col p-4 items-center justify-center bg-slate-100 min-h-[150px] min-w-[250px] rounded-[10px] h-full card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg w-full">
                    <p className="text-lg">Rendimiento por Cobrar</p>

                    <span className="font-bold text-3xl">
                      $ {totalPendingProfits}
                    </span>
                  </div>
                )}
              <div className="flex flex-col p-4 items-center justify-center bg-slate-100 min-h-[150px] min-w-[250px] rounded-[10px] h-full card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg w-full">
                {data[
                  selectedFranchise
                ].available_pay_date_for_franchise_performance.toDate() >
                new Date() ? (
                  <>
                    <p className="text-lg text-center">
                      Días para comenzar el <br />
                      rendimiento
                    </p>
                    <span className="font-bold text-3xl">
                      {data[selectedFranchise]?.starts_at?.seconds &&
                        getDaysRemaining(
                          new Date(
                            data[selectedFranchise]
                              .available_pay_date_for_franchise_performance
                              .seconds * 1000
                          )
                        )}
                    </span>
                  </>
                ) : (
                  <p className="text-3xl text-center font-bold">
                    Rendimiento <br />
                    Activo
                  </p>
                )}
              </div>
            </div>
            {data[
              selectedFranchise
            ].available_pay_date_for_franchise_performance.toDate() <
              new Date() && (
              <div
                className="flex p-4 justify-center m-auto items-center bg-slate-100 min-h-[150px] rounded-[10px] card-border hover:dark:border-gray-400 cursor-pointer user-select-none hover:shadow-lg space-x-6"
                onClick={() => setOpenEarningsHistoryModal(true)}
              >
                <div>
                  <p className="font-bold text-xl">Historial de Ganancias</p>
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 1, md: 3 }}
                  >
                    <Gauge
                      width={150}
                      height={150}
                      value={totalFranchisePerformance}
                      valueMin={0}
                      valueMax={
                        data[selectedFranchise].automatic_franchise_cap_limit
                      }
                      innerRadius="70%"
                      outerRadius="100%"
                    />
                  </Stack>
                </div>
                <div className="flex flex-col">
                  <p className="font-bold truncate">
                    Requisitos para Retiro Rápido:{' '}
                  </p>
                  <ul className="">
                    <li>-{`Contar con un status de 'Rendimiento Activo'`}</li>
                    <li>-Contar con una ganancia pendiente a 0 </li>
                  </ul>
                  <p className="font-bold truncate">
                    Requisitos para Solicitar Retiro:{' '}
                  </p>
                  <ul className="">
                    <li>-{`Contar con un status de 'Rendimiento Activo'`}</li>
                    <li>-Contar con una ganancia pendiente a $50 </li>
                    <li>-Contar con tu wallet de litecoin en tu perfil </li>
                  </ul>
                </div>
              </div>
            )}
            {data.length > 0 &&
              data[
                selectedFranchise
              ].available_pay_date_for_capital_performance.toDate() <
                new Date() &&
              user.uid &&
              !data[selectedFranchise].is_marketing_franchise && (
                <div className="flex flex-col 821px:flex-row justify-end space-y-4 821px:space-y-0 821px:space-x-5">
                  <Button
                    className="justify-end"
                    variant="solid"
                    disabled={totalPendingProfits < 50 ? true : false}
                    onClick={() => requestPaymentProcess('normal', false)}
                  >
                    {`${
                      totalPendingProfits < 50
                        ? 'Requisitos Pendientes'
                        : 'Solicitar Pago'
                    }  `}
                  </Button>
                  <Button
                    className="justify-end"
                    variant="solid"
                    disabled={totalPendingProfits <= 0 ? true : false}
                    loading={loadingPaymentProcess}
                    onClick={() => requestPaymentProcess('quick', false)}
                  >
                    Retiro Rápido
                  </Button>
                </div>
              )}

            {data[
              selectedFranchise
            ].available_pay_date_for_franchise_performance.toDate() <
              new Date() &&
              pendingProfitsData.length > 0 && (
                <>
                  <p className="font-semibold text-xl">
                    Rendimiento diario por cobrar
                  </p>
                  <div className="overflow-y-auto flex-grow max-h-[250px]">
                    <Table className="w-full mt-1">
                      <THead>
                        <Tr className="">
                          <Th className="w-1/3">#</Th>
                          <Th className="w-1/3" align="center">
                            Fecha
                          </Th>
                          <Th className="w-1/3">Monto</Th>
                        </Tr>
                      </THead>
                      <TBody>
                        {pendingProfitsData &&
                          pendingProfitsData.map((item, index) => (
                            <Tr key={index}>
                              <Td className="w-1/3">{index}</Td>
                              <Td className="w-1/3">
                                {item.created_at.toDate().toLocaleDateString()}
                              </Td>
                              <Td className="w-1/3">
                                $ {item.daily_performance}
                              </Td>
                            </Tr>
                          ))}
                      </TBody>
                    </Table>
                  </div>

                  {/* Fila total fija */}
                  <Table className="w-full bg-gray-100">
                    <TFoot>
                      <Tr className="font-bold">
                        <Td className="w-1/3"></Td>
                        <Td className="font-bold w-1/3">TOTAL</Td>
                        <Td className="w-1/3">$ {totalPendingProfits}</Td>
                      </Tr>
                    </TFoot>
                  </Table>
                </>
              )}
          </div>
        </div>
      )}
      <Dialog
        isOpen={openEarningsHistoryModal}
        onClose={() => setOpenEarningsHistoryModal(false)}
      >
        <div className="space-y-2">
          <p className="text-xl font-bold">Historial de Ganancias</p>
          <Table>
            <THead>
              <Tr>
                <Th>Fecha</Th>
                <Th>Monto</Th>
                <Th>Tipo de Retiro</Th>
              </Tr>
            </THead>
            <TBody>
              {payrollAutomaticFranchiseData.length > 0 &&
                payrollAutomaticFranchiseData.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.created_at.toDate().toLocaleString()}</Td>
                    <Td>$ {item.total}</Td>
                    <Td>{item.type_payroll}</Td>
                  </Tr>
                ))}
            </TBody>
          </Table>
        </div>
      </Dialog>
      <Dialog
        isOpen={openCapitalEarningsHistoryModal}
        onClose={() => setOpenCapitalEarningsHistoryModal(false)}
      >
        <div className="space-y-2">
          <p className="text-xl font-bold">Historial de Ganancias</p>
          <Table>
            <THead>
              <Tr>
                <Th>Fecha</Th>
                <Th>Monto</Th>
                <Th>Tipo de Retiro</Th>
              </Tr>
            </THead>
            <TBody>
              {payrollAutomaticCapitalFranchiseData.length > 0 &&
                payrollAutomaticCapitalFranchiseData.map((item, index) => (
                  <Tr key={index}>
                    <Td>{item.created_at.toDate().toLocaleString()}</Td>
                    <Td>$ {item.total}</Td>
                    <Td>{item.type_payroll}</Td>
                  </Tr>
                ))}
            </TBody>
          </Table>
        </div>
      </Dialog>
    </div>
  )
}
