import { useState } from 'react'
import { useAppSelector } from '@/store'
import Membership, { Periods } from '@/views/memberships/membership'
import ShowQR from '@/views/memberships/components/ShowQR'
import {
  Coins,
  createPaymentLink,
  Memberships,
  Method,
} from '@/views/memberships/methods'
import { MembershipsDigitalProps } from '../data/MembershipsDigitalData'
import { BsCheck } from 'react-icons/bs'
import { PiCheck } from 'react-icons/pi'

export default function FranchiseDigital({
  image,
  name,
  label,
  cap,
  binary_points,
  range_points,
  duration
}: MembershipsDigitalProps) {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [period, setPeriod] = useState<Periods>('monthly')
  const [method, setMethod] = useState<Method>('Fiat')
  const _createPaymentLink = async (
    type: Memberships,
    currency: Coins,
    period: Periods,
    method: Method,
    buyer_email: string
  ) => {
    try {
      if (loading) return
      setLoading(true)
      setPeriod(period)
      setMethod(user.payment_link ? user.payment_link[type]?.openpay ? 'Fiat' : 'Coinpayments' : 'Coinpayments')
      await createPaymentLink(user.uid!, type, currency, period, method, buyer_email)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className={`flex flex-col relative rounded-md w-full p-4 space-y-4 transition-all duration-75 items-center ring-gray-200 border ${user.membership == name ? 'border-2 border-green-500' : ''}`}>
      <div className='absolute border rounded-full px-3 py-2 right-2 top-2'><span>{duration} {duration == 1 ? 'Mes' : 'Meses'}</span></div>
      <div className="flex justify-center">
        <img src={image} alt={image} className="max-h-[250px] max-w-[300px]" />
      </div>
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4 ">
        <span className="text-left">Membresía: </span>
        <span className="font-bold">{label}</span>
        <span className="text-left truncate">Puntos de Binario: </span>
        <span className="font-bold">{binary_points} puntos</span>
        <span className="text-left truncate">Puntos de Rango: </span>
        <span className="font-bold">{range_points} puntos</span>

      </div>
      {user.membership == name ? (
        <div className='flex justify-center'>
          <span className='border border-2 border-green-500 p-4 text-[50px] rounded-full text-green-500'><PiCheck width={100} /></span>
        </div>
      ) :

        (
          <ShowQR
            type={name}
            loading={loading}
            createPaymentLink={_createPaymentLink}
            period={period}
            options={[{ label: 'Mensual', value: 'monthly' }]}
            method={method}
          />
        )}

    </div>
  )
}
