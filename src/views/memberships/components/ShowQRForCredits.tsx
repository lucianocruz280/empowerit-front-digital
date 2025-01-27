import dayjs from 'dayjs'
import { Memberships, Coins, PackCredits, Method } from '../methods'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/ui'
import GenerateQR from './GenerateQR'
import ConfirmMessage from './ConfirmMessage'
import FormPay from './FormPay'
import { Periods } from '../membership'
import { useState } from 'react'
import OpenPayCheckout from '@/components/OpenpayCheckout/Checkout'
import GenerateQRForCredits from './GenerateQRForCredits'
import FormPayForCredits from './FormPayForCredits'

const ShowQRForCredits = ({
  type,
  loading,
  createPaymentLink
}: {
  type: PackCredits
  loading: boolean
  createPaymentLink: (type: PackCredits, coin: Coins, method: Method, email: string) => void
  founder?: boolean
}) => {
  // Se obtiene el usuario
  const user = useAppSelector((state) => state.auth.user)


  // Sí el pago sigue pendiente
  if (
    user.payment_link_credits &&
    user.payment_link_credits[type] &&
    user.payment_link_credits[type].status == 'pending'
  )
    return (
      <>
        <FormPayForCredits
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          openModal={() => {
            window.open(user.payment_link_credits![type].redirect_url)
          }}
        />
      </>
    )

  // Sí el pago fue completado
  if (
    user.payment_link_credits &&
    user.payment_link_credits[type] &&
    user.payment_link_credits[type].status == 'confirming'
  )
    return <ConfirmMessage />

  // Sí el pago se completo...
  if (user.membership_status == 'paid') {
    return (
      <>
        <GenerateQRForCredits
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
        />
      </>
    )
  }

  // Sí no se a creado la dirección de pago...
  if (!user.payment_link_credits || !user.payment_link_credits[type])
    return (
      <>
        <GenerateQRForCredits
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
        />
      </>
    )

  return <Spinner />
}

export default ShowQRForCredits
