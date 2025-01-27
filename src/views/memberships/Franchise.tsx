import classNames from 'classnames'
import { useState } from 'react'
import { useAppSelector } from '../sales/SalesDashboard/store'
import dayjs from 'dayjs'
import ShowQR from './components/ShowQR'
import { Coins, Memberships, Method, createPaymentLink } from './methods'

interface FranchiseProps {
  image: string
  name: Memberships
  display_name: string
  month_price: number
  binary_points: number
  range_points: number
  bir: number
  binary_percent: number
  mentor_bonus: number
  cap: number
  year_price?: number
  days_label?: string
  credits?: number
  method: Method
}

export type Periods = 'monthly' | 'yearly'

export default function Franchise({
  image,
  name,
  credits,
  display_name,
  month_price,
  binary_points,
  range_points,
  bir,
  binary_percent,
  mentor_bonus,
  cap,
  year_price,
  days_label = 'Mensual',
  method
}: FranchiseProps) {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [period, setPeriod] = useState<Periods>('monthly')

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
      await createPaymentLink(user.uid!, type, currency, period, method, buyer_email)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const is_active = user.membership == name
  return (
    <div
      className={classNames(
        'rounded-md w-full ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
        is_active && 'shadow-md shadow-green-700/50 ring-green-300',
        !is_active && 'ring-gray-200'
      )}
    >
      <img
        src={image}
        className={classNames(
          'aspect-video object-contain transition-all duration-75'
        )}
      />
      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4 ">
        <span className="text-left max-w-xs truncate">Franquicia: </span>
        <span className="font-bold max-w-xs truncate">{display_name}</span>
        {display_name == 'F49' && (
          <>
            <span className="max-w-xs truncate">Incluye:</span>
            <span className="font-bold">Posicionamiento</span>
            <span></span>
            <span className="font-bold">Acceso a leverage</span>
            <span></span>
            <span className="font-bold">Bono residual leverage</span>
          </>
        )}
        {display_name != 'F49' && (
          <>
            <span className="max-w-xs truncate">Puntos de Binario:</span>
            <span className="font-bold">{binary_points} puntos</span>
          </>
        )}
        {display_name != 'F3000' && (
          <>
            <span className="text-left">Creditos: </span>
            <span className="font-bold">{credits} creditos</span>
          </>
        )}
        <span className="text-left">CAP: </span>
        <span className="font-bold">{cap} dolares</span>
        {display_name == 'F3000' && (
          <>
            <span className="text-left">Beneficios: </span>
            <span className="font-bold">1 año Top Xpert</span>
            <span className="text-left"></span>
            <span className="font-bold">Cuenta leverage 5000 usd</span>
            <span className="text-left"></span>
            <span className="font-bold">Crucero incluido</span>
            <span className="text-left"></span>
            <span className="font-bold">Kit crucero lifestyle</span>
          </>
        )}

        {is_active && (
          <>
            <span className="text-right">Estado:</span>
            <span className="font-bold text-green-600">Activa</span>
            {/* <span className="text-right">Restante:</span>
                        <span className="font-bold">
                            {membership_rest_days} días y{' '}
                            {getRestHoursMembership(
                                membership_rest_days,
                                dayjs(user.membership_expires_at)
                            )}{' '}
                            horas
                        </span>
                        <span className="text-right">Expira el:</span>
                        <span className="font-bold">
                            {dayjs(user.membership_expires_at).format('DD/MMMM/YYYY HH:mm')}
                        </span> */}
          </>
        )}
      </div>

      {/* {!is_active && (
                <div className="grid grid-cols-[min-content_1fr] lg:grid-cols-4 gap-x-2 w-full">
                    <>
                        <span className="text-center font-bold text-xl col-span-2">
                            {days_label}
                        </span>

                        <span className="text-center font-bold text-xl col-span-2">
                            {props.year_price ? 'Anual' : null}
                        </span>

                        <span className="text-right">Duración:</span>
                        <span className="font-bold">{days} días</span>

                        {!props.year_price ? (
                            <span className="col-span-2"></span>
                        ) : (
                            <>
                                <span className="text-right">Duración:</span>
                                <span className="font-bold">365 días</span>
                            </>
                        )}

                        <span className="text-right">Total:</span>
                        <span className="font-bold">
                            $ {formatNumberWithCommas(props.month_price, 0)} USD
                        </span>

                        {!props.year_price ? (
                            <span className="col-span-2"></span>
                        ) : (
                            <>
                                <span className="text-right">Total:</span>
                                <span className="font-bold">
                                    $ {formatNumberWithCommas(props.year_price, 0)} USD`
                                </span>
                            </>
                        )}
                    </>
                </div>
            )} */}

      <ShowQR
        type={name}
        loading={loading}
        createPaymentLink={_createPaymentLink}
        period={period}
        method={method}
        options={
          year_price
            ? [
              { label: days_label, value: 'monthly' },
              { label: 'Anual', value: 'yearly' },
            ]
            : [{ label: days_label, value: 'monthly' }]
        }
      />
    </div>
  )
}
