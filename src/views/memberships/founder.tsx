import { FC, useState } from 'react'
import { useAppSelector } from '@/store'
import {
  getRestDaysMembership,
  getRestHoursMembership,
} from '@/utils/membership'
import classNames from 'classnames'
import { Coins, Memberships, createPaymentLink } from './methods'
import dayjs from 'dayjs'
import ShowQR from './components/ShowQR'
import { formatNumberWithCommas } from '@/utils/format'

type Props = {
  days?: number
  days_label?: string

  month_price: number
  year_price?: number

  display_name: string
  name: Memberships
  image: string
}

export type Periods = 'monthly' | 'yearly'

const FounderMembership: FC<Props> = ({
  days_label = 'Mensual',
  days = 30,
  ...props
}) => {
  const [loading, setLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const [period, setPeriod] = useState<Periods>('monthly')

  const _createPaymentLink = async (
    type: Memberships,
    currency: Coins,
    period: Periods
  ) => {
    try {
      if (loading) return
      setLoading(true)
      setPeriod(period)
      await createPaymentLink(user.uid!, type, currency, period)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const is_active = user?.founder_pack?.status == 'paid'

  return (
    <div
      className={classNames(
        'rounded-md w-full ring-1 flex flex-col p-4 space-y-4 transition-all duration-75 h-min',
        is_active && 'shadow-md shadow-green-700/50 ring-green-300',
        !is_active && 'ring-gray-200'
      )}
    >
      <img
        src={props.image}
        className={classNames(
          'aspect-video object-contain transition-all duration-75',
          !is_active && 'brightness-50 contrast-50'
        )}
      />

      <div className="grid grid-cols-[min-content_1fr] w-max gap-x-4">
        <span className="text-right">Membresía: </span>
        <span className="font-bold">{props.display_name}</span>

        {is_active && (
          <>
            <span className="text-right">Estado:</span>
            <span className="font-bold text-green-600">Activa</span>
          </>
        )}
      </div>

      {!is_active && (
        <div className="grid grid-cols-[min-content_1fr] lg:grid-cols-4 gap-x-2 w-full">
          <>
            <span className="text-right"></span>
            <span className="font-bold"></span>

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
      )}

      <ShowQR
        founder
        type={props.name}
        loading={loading}
        createPaymentLink={_createPaymentLink}
        period={period}
        options={
          props.year_price
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

export default FounderMembership
