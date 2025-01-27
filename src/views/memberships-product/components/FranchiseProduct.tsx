import {
  MembershipsProductsNames,
  MembershipsProductsProps,
} from '../data/MembershipsProductsData'
import { useState } from 'react'
import { useAppSelector } from '@/store'
import { Periods } from '@/views/memberships/membership'
import ShowQR from '@/views/memberships/components/ShowQR'
import {
  Coins,
  createPaymentLink,
  Memberships,
  Method,
} from '@/views/memberships/methods'

export default function FranchiseProduct({
  image,
  name,
  cap,
  binary_points,
  range_points,
}: MembershipsProductsProps) {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [period, setPeriod] = useState<Periods>('monthly')
  const [method, setMethod] = useState<Method>('Fiat')
  const _createPaymentLink = async (
    type: Memberships,
    currency: Coins,
    period: Periods,
    method: Method
  ) => {
    try {
      if (loading) return
      setLoading(true)
      setPeriod(period)
      setMethod(user.payment_link ? user.payment_link[type]?.openpay ? 'Fiat' : 'Coinpayments' : 'Coinpayments')
      await createPaymentLink(user.uid!, type, currency, period, method, user.email as string)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="flex flex-col rounded-md w-full p-4 space-y-4 transition-all duration-75 ring-gray-200 border">
      <div className="flex justify-center">
        <img src={image} alt={image} className="max-h-[250px] max-w-[300px]" />
      </div>
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4 ">
        <span className="text-left">Franquicia: </span>
        <span className="font-bold">{name}</span>
        <span className="text-left truncate">Puntos de Binario: </span>
        <span className="font-bold">{binary_points} puntos</span>
        <span className="text-left truncate">Puntos de Rango: </span>
        <span className="font-bold">{range_points} puntos</span>
        <span className="text-left">CAP: </span>
        <span className="font-bold">{cap} dolares</span>
      </div>
      <ShowQR
        type={name}
        loading={loading}
        createPaymentLink={_createPaymentLink}
        period={period}
        options={[{ label: 'Mensual', value: 'monthly' }]}
        method={method}
      />
    </div>
  )
}
