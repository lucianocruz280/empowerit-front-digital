import React, { useState } from 'react'
import ShowQRForFranchiseAutomatic from './components/ShowQRForFranchiseAutomatic'
import {
  AutomaticFranchises,
  Coins,
  createPaymentLinkForFranchiseAutomatic,
  Method,
} from '../memberships/methods'
import { Periods } from '../memberships/membership'
import { useAppSelector } from '@/store'

export type FranchiseAutomaticProps = {
  name: AutomaticFranchises
  binary_points: number
  range_points: number
  cap: number
  image: string
  days_label?: string
}

export default function FranchiseAutomatic({
  name,
  binary_points,
  range_points,
  cap,
  image,
  days_label = 'Mensual',
}: FranchiseAutomaticProps) {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [period, setPeriod] = useState<Periods>('monthly')

  const _createPaymentLink = async (
    type: AutomaticFranchises,
    currency: Coins,
    period: Periods,
    method: Method,
    buyer_email: string
  ) => {
    try {
      if (loading) return
      setLoading(true)
      setPeriod(period)
      await createPaymentLinkForFranchiseAutomatic(user.uid!, type, currency, method, buyer_email)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col rounded-md w-full p-4 space-y-4 transition-all duration-75 ring-gray-200 border">
      <div className="flex justify-center">
        <img src={image} alt={name} className="max-h-[250px] max-w-[300px]" />
      </div>
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4 ">
        {/* Nombre de la franquicia automatica */}
        <span className="text-left">Franquicia: </span>
        <span className="font-bold">{name}</span>
        {/* Puntos de binario */}
        <span className="text-left truncate">Puntos de Binario: </span>
        <span className="font-bold">{binary_points} puntos</span>
        {/* Puntos de rango */}
        <span className="text-left truncate">Puntos de Rango: </span>
        <span className="font-bold">{range_points} puntos</span>
        {/* CAP */}
        <span className="text-left">CAP: </span>
        <span className="font-bold">{cap} dolares</span>
      </div>
      <ShowQRForFranchiseAutomatic
        type={name}
        loading={loading}
        createPaymentLink={_createPaymentLink}
        period={period}
        options={[{ label: days_label, value: 'monthly' }]}
      />
    </div>
  )
}
