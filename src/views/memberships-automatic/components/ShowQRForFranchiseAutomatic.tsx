import dayjs from 'dayjs'
import { AutomaticFranchises, Coins, Method } from '@/views/memberships/methods'
import { useAppSelector } from '@/store'
import { Spinner } from '@/components/ui'
import GenerateQRForFranchiseAutomatic from './GenerateQRForFranchiseAutomatic'
import ConfirmMessage from '@/views/memberships/components/ConfirmMessage'
import FormPayForFranchiseAutomatic from './FormPayForFranchiseAutomatic'
import { Periods } from '@/views/memberships/membership'

const ShowQRForFranchiseAutomatic = ({
  type,
  loading,
  createPaymentLink,
  options,
  period,
  
  founder,
}: {
  type: AutomaticFranchises
  loading: boolean
  createPaymentLink: (
    type: AutomaticFranchises,
    coin: Coins,
    period: Periods,
    method: Method,
    buyer_email: string
  ) => void
  options: { value: Periods; label: string }[]
  period: Periods
  founder?: boolean
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
      !user.payment_link_automatic_franchises) ||
    (founder && !user.founder_pack && !user.payment_link_automatic_franchises)
  )
    return (
      <>
        <GenerateQRForFranchiseAutomatic
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
    user.payment_link_automatic_franchises &&
    user.payment_link_automatic_franchises[type] &&
    user.payment_link_automatic_franchises[type].status == 'pending'
  )
    return (
      <>
        <FormPayForFranchiseAutomatic
          type={type}
          loading={loading}
          createPaymentLink={createPaymentLink}
          period={period}
          openModal={() => {
            window.open(
              user.payment_link_automatic_franchises?.[type].redirect_url
            )
          }}
  
          buyer_email={user.email as string}
        />
      </>
    )

  // Sí el pago fue completado
  if (
    user.payment_link_automatic_franchises &&
    user.payment_link_automatic_franchises[type] &&
    user.payment_link_automatic_franchises[type].status == 'confirming'
  )
    return <ConfirmMessage />

  // Sí el pago se completo...
  if (user.membership_status == 'paid') {
    return (
      <>
        <GenerateQRForFranchiseAutomatic
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
  if (
    !user.payment_link_automatic_franchises ||
    !user.payment_link_automatic_franchises[type]
  )
    return (
      <>
        <GenerateQRForFranchiseAutomatic
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

export default ShowQRForFranchiseAutomatic
