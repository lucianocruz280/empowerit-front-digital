import CapSliderParticipations from './components/CapSliderParticipations'
import { useAppSelector } from '@/store'
import { useEffect, useState } from 'react'
import { Timestamp } from 'firebase/firestore'
import ParticipationsTable from './components/ParticipationsTable'
import { getParticipations } from '@/services/Participations'
import { Button } from '@/components/ui'
import axios from 'axios'

export type ParticipationName = '3000-participation'

export type Participation = {
  id_doc?: string
  created_at: Timestamp
  next_pay: Timestamp
  participation_cap_current: number
  participation_cap_limit: number
  participation_name: ParticipationName
  starts_at: Timestamp
  email: string
  userName: string
  has_wallet?: boolean
  pending_amount: 0
}

export const INVESTMENT_PARTICIPATION = {
  '3000-participation': 3000,
}

export default function ParticipationPage() {
  const user = useAppSelector((state) => state.auth.user)
  const [participations, setParticipations] = useState<Participation[]>([])
  const [investment, setInvestment] = useState<number>()
  const [profitReceived, setProfitReceived] = useState<number>()
  const [totalPendingAmount, setTotalPendingAmount] = useState<number>(0)

  useEffect(() => {
    const fetchParticipations = async (userId: string) => {
      const data = await getParticipations(userId)
      setParticipations(data as Participation[])
    }

    if (user && user.uid) {
      fetchParticipations(user.uid)
    }
  }, [user])

  useEffect(() => {
    if (participations) {
      let res = 0
      let received = 0
      let pending_amount = 0
      for (const participation of participations) {
        res += INVESTMENT_PARTICIPATION[participation.participation_name]
        received += participation.participation_cap_current
        pending_amount += participation.pending_amount
      }
      setTotalPendingAmount(pending_amount)
      setInvestment(res)
      setProfitReceived(received)
    }
  })
  const onPaymentProcess = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/participations/payrollRequest`
      )
      console.log('esto es la data => ', response.data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="flex flex-col space-y-2 2xl:w-[1200px] 2xl:mx-auto">
      <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">Franquicias</span>
      </div>
      <div className="flex justify-between">
        <div className="card transition duration-150 ease-in-out card-border user-select-none w-[280px] mr-2 lg:w-[350px]">
          <div className="flex flex-col p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <p className="text-lg font-semibold text-center">Mi inversión</p>
            <p className="text-xl font-md text-center">$ {investment}</p>
          </div>
        </div>
        <div className="card transition duration-150 ease-in-out card-border user-select-none w-[280px] mr-2 lg:w-[350px]">
          <div className="flex flex-col p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <p className="text-lg font-semibold text-center">Monto Pendiente</p>
            <p className="text-xl font-md text-center">
              $ {totalPendingAmount}
            </p>
          </div>
        </div>
        <div className="card transition duration-150 ease-in-out card-border user-select-none w-[280px] lg:w-[350px]">
          <div className="flex flex-col py-4 pl-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <p className="text-lg font-semibold text-center">Total recibido</p>
            <p className="text-xl font-md text-center">$ {profitReceived}</p>
          </div>
        </div>
      </div>
      {participations && participations.length > 0 && (
        <div className="flex flex-col space-y-4 justify-center text-center">
          {participations.map((participation, index) => (
            <div
              key={index}
              className="w-full flex  justify-center items-center"
            >
              <CapSliderParticipations
                participation={participation}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
      {/* <div className="flex justify-end">
        <Button
          variant="solid"
          disabled={totalPendingAmount && totalPendingAmount > 0 ? false : true}
          onClick={onPaymentProcess}
        >
          Solicitar Pago
        </Button>
      </div> */}
      <div className="flex items-center space-x-4">
        <span className="font-bold text-lg my-4">
          Historial de Participaciones
        </span>
      </div>
      {participations && participations.length > 0 && (
        <ParticipationsTable participations={participations} />
      )}
    </div>
  )
}
