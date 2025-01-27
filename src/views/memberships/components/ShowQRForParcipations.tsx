import dayjs from 'dayjs'
import { Memberships, Coins, PackCredits, Participations } from '../methods'
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
import FormPayForParticipations from './FormPayForParticipations'
import GenerateQRForParticipations from './GenerateQRForParticipations'
import { redirect } from 'react-router-dom'

const ShowQRForParticipations = ({
  type,
  loading,
  createPaymentLink
}: {
  type: Participations
  loading: boolean
  createPaymentLink: (type: Participations, coin: Coins) => void
  founder?: boolean
}) => {
  // Se obtiene el usuario
  const user = useAppSelector((state) => state.auth.user)


  // Sí el pago sigue pendiente
  if (
    user.payment_link_participations &&
    user.payment_link_participations[type] &&
    user.payment_link_participations[type].status == 'pending'
  )
    return (
      <>
        <FormPayForParticipations
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          openModal={() => {
            window.open(user.payment_link_participations![type].qr)
          }}
        />
      </>
    )

  // Sí el pago fue completado
  if (
    user.payment_link_participations &&
    user.payment_link_participations[type] &&
    user.payment_link_participations[type].status == 'confirming'
  )
    return <ConfirmMessage />

  // Sí el pago se completo...
  if (user.membership_status == 'paid') {
    return (
      <>
        <GenerateQRForParticipations
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
        />
      </>
    )
  }

  // Sí no se a creado la dirección de pago...
  if (!user.payment_link_participations || !user.payment_link_participations[type])
    return (
      <>
        <GenerateQRForParticipations
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
        />
      </>
    )

  return <Spinner />
}

export default ShowQRForParticipations
