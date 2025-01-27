import classNames from "classnames"
import { useState } from "react"
import { useAppSelector } from "../sales/SalesDashboard/store"
import dayjs from "dayjs"
import ShowQR from "./components/ShowQR"
import { Coins, Participations, createPaymentLinkForParticipations } from "./methods"
import ShowQRForParticipations from "./components/ShowQRForParcipations"

interface ParticipationProps {
     image: string
     name: Participations
     display_name: string
     price: number
     binary_points: number
     range_points: number
     bir: number
}

export type Periods = 'monthly' | 'yearly'

export default function Participation({ image, name, display_name, price, binary_points, range_points, bir }: ParticipationProps) {

     const [loading, setLoading] = useState(false)
     const user = useAppSelector((state) => state.auth.user)
     const [period, setPeriod] = useState<Periods>('monthly')

     const _createPaymentLink = async (
          type: Participations,
          currency: Coins
     ) => {
          try {
               if (loading) return
               setLoading(true)
               setPeriod(period)
               await createPaymentLinkForParticipations(user.uid!, type, currency)
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
                    <span className="max-w-xs truncate">Puntos de Binario:</span>
                    <span className="font-bold">{binary_points} puntos</span>
                    <span className="max-w-xs truncate">Puntos de Rango:</span>
                    <span className="font-bold">{range_points} puntos</span>
                    
                    

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

               <ShowQRForParticipations
                    type={name}
                    loading={loading}
                    createPaymentLink={_createPaymentLink}
               />
          </div>
     )
}
