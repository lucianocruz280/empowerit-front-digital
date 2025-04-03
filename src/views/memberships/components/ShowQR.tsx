import dayjs from 'dayjs'
import { Memberships, Coins, Method } from '../methods'
import { useAppSelector } from '@/store'
import { Progress, Spinner } from '@/components/ui'
import GenerateQR from './GenerateQR'
import ConfirmMessage from './ConfirmMessage'
import FormPay from './FormPay'
import { Periods } from '../membership'
import { useEffect, useState } from 'react'
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
  const [payment, setPayment] = useState<{ processStep: number, processTotalSteps: number } | null>(null)
  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const polling = async () => {
      const seconds = user?.payment_link?.[type]?.expires_at?.seconds
      const expiredDate = seconds ? dayjs(seconds * 1000) : null
      console.log(expiredDate && expiredDate >= dayjs())
      if (
        expiredDate &&
        expiredDate >= dayjs() &&
        user?.payment_link &&
        user?.payment_link[type]
      ) {
        const url = `https://my.disruptivepayments.io/api/payments/status?network=POLYGON&address=${user.payment_link[type].address}`
        const clientApiKey = import.meta.env.VITE_CLIENT_API_KEY

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'client-api-key': clientApiKey
            },
          })

          if (!response.ok) return
          const res = await response.json()

          if (res.data?.status) {
            const status = res.data.status
            setPayment(res.data)
            await fetch(
              `${import.meta.env.VITE_API_URL}/subscriptions/getStatus/${status}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: user.email }),
              }
            )
          }
        } catch (err) {
          console.error('Polling error:', err)
        }
      }
    }


    polling()

    //se va a ejecutar cada 5s hasta que expires at sea menor al actual
    intervalId = setInterval(polling, 5000)


    return () => {
      clearInterval(intervalId)
    }
  }, [user?.payment_link, user?.membership_expires_at, type])
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
    user.payment_link[type].status == 'pending' &&
    payment && payment.processStep > 1
  )
  return (
    <div className='flex flex-col items-center w-full'>
      <Progress percent={parseFloat(((payment.processStep / payment.processTotalSteps) * 100).toFixed(2))} />
      <span className=''>Tu pago se acreditará pronto</span>
    </div>

  )

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
