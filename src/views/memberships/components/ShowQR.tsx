import dayjs from 'dayjs'
import { Memberships, Coins, Method } from '../methods'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/ui'
import GenerateQR from './GenerateQR'
import ConfirmMessage from './ConfirmMessage'
import FormPay from './FormPay'
import { Periods } from '../membership'
import { useState } from 'react'
import OpenPayCheckout from '@/components/OpenpayCheckout/Checkout'

const ShowQR = ({
  type,
  loading,
  createPaymentLink,
  options,
  period,
  founder,
  method,
}: {
  type: Memberships
  loading: boolean
  createPaymentLink: (type: Memberships, coin: Coins, period: Periods, method: Method, buyer_email: string) => void
  options: { value: Periods; label: string }[]
  period: Periods
  founder?: boolean
  method: Method
 
}) => {
  // Se obtiene el usuario
  const user = useAppSelector((state) => state.auth.user)

  // Obtener fecha de expiración
  const expires_at = user?.membership_expires_at
  const expiredDate = expires_at ? dayjs(expires_at) : null
  // Obtener fecha de mañana
  const tomorrowDate = dayjs().add(1, 'days')

  // Sí la fecha de expiración es el siguiente día
  if (
    (expires_at &&
      expiredDate &&
      expiredDate.isBefore(tomorrowDate.toDate()) &&
      !user.payment_link) ||
    (founder && !user.founder_pack && !user.payment_link)
  )
    return (
      <>
        <GenerateQR
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          options={options}
          founder={founder}
    
        />
      </>
    )

  // Sí el pago sigue pendiente
  if (
    user.payment_link &&
    user.payment_link[type] &&
    user.payment_link[type].status == 'pending'
  )
    return (
      <>
        <FormPay
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          period={period}
          openModal={() => {
            window.open(user.payment_link![type].redirect_url)
          }}
          method={method}
        />
      </>
    )

  // Sí el pago fue completado
  if (
    user.payment_link &&
    user.payment_link[type] &&
    user.payment_link[type].status == 'confirming'
  )
    return <ConfirmMessage />

  // Sí el pago se completo...
  if (user.membership_status == 'paid') {
    return (
      <>
        <GenerateQR
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          options={options}
          founder={founder}
      
        />
      </>
    )
  }

  // Sí no se a creado la dirección de pago...
  if (!user.payment_link || !user.payment_link[type])
    return (
      <>
        <GenerateQR
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          options={options}
          founder={founder}
       
        />
      </>
    )

  return <Spinner />
}

export default ShowQR
