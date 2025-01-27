import { useEffect, useState } from 'react'
import { Button, Input } from '@/components/ui'
import useTimer from '@/hooks/useTimer'
import dayjs from 'dayjs'
import { onSnapshot, collection, doc, updateDoc } from 'firebase/firestore'
import { BsClock, BsWallet } from 'react-icons/bs'
import { FiCopy } from 'react-icons/fi'
import { Coins, Memberships, PackCredits, Participations } from '../methods'
import { useAppSelector } from '@/store'
import useClipboard from '@/utils/hooks/useClipboard'
import { getPaidAmount } from '@/services/Memberships'
import { db } from '@/configs/firebaseConfig'
import ButtonSwapCurrency, { currencyIcon } from './ButtonSwapCurrency'
import { Periods } from '../membership'
import classNames from 'classnames'

const FormPayForParticipations = ({
  type,
  createPaymentLink,
  loading,
  openModal,
}: {
  type: Participations
  createPaymentLink: (type: Participations, coin: Coins) => void
  loading: boolean
  founder?: boolean
  openModal: () => void
}) => {
  const user = useAppSelector((state) => state.auth.user)
  const { copy } = useClipboard()
  const [amount, setAmount] = useState(0)
  const [amountChanged, setAmountChanged] = useState(false)

  const address =
    user.payment_link_participations &&
    user.payment_link_participations[type] &&
    user.payment_link_participations[type]?.address
  const amountcrypto =
    user.payment_link_participations &&
    user.payment_link_participations[type] &&
    user.payment_link_participations[type]?.amount
  const expires_at =
    user.payment_link_participations &&
    user.payment_link_participations[type] &&
    user.payment_link_participations[type]?.expires_at
  const qr =
    user.payment_link_participations &&
    user.payment_link_participations[type] &&
    user.payment_link_participations[type]?.qr

  const isExpired = dayjs(
    expires_at?.seconds ? expires_at?.seconds * 1000 : null
  ).isBefore(dayjs())

  /**
   * Calcular monto pendiente a pagar
   */
  const calculatePenfindAmount = async () => {
    // Obtener el monto total
    const totalAmount = Number(user.payment_link_participations![type].amount)

    try {
      // Obtener el monto ya pagado
      const paidAmount = await getPaidAmount(
        user.uid ? user.uid : '',
        address ? address : ''
      )

      // Obtener el faltante
      const result: number = totalAmount - paidAmount

      // Redondearlo
      const decimals = 8
      const roundedNumber =
        Math.ceil(result * Math.pow(10, decimals)) / Math.pow(10, decimals)

      if (paidAmount > 0) setAmountChanged(true)
      setAmount(roundedNumber)
    } catch (e) {
      console.error('Error al calcular el monto pendiente: ', e)
      setAmount(totalAmount)
    }
  }

  useEffect(() => {
    if (user.uid) {
      const unsub = onSnapshot(
        collection(db, `users/${user.uid}/transactions`),
        () => {
          calculatePenfindAmount()
        }
      )
      return () => unsub()
    }
  }, [user.uid])

  useEffect(() => {
    if (
      address &&
      user.payment_link_participations &&
      user.payment_link_participations[type]
    ) {
      setAmount(Number(user.payment_link_participations[type].amount) || 0)
    }
  }, [address, amountcrypto])

  // Obtener tiempo que se ocupa
  const timer = useTimer(
    user.payment_link_participations &&
      user.payment_link_participations[type] &&
      user.payment_link_participations[type].expires_at &&
      expires_at &&
      !amountChanged
      ? expires_at.seconds * 1000
      : undefined
  )

  const deletePaymentLinkForParticipations = async () => {
    const userRef = doc(db, `users/${user.uid}`)

    await updateDoc(userRef, {
      payment_link_participations: {},
    })
  }

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2 items-center">
        <span>{user.email}</span>

        {isExpired && !amountChanged ? null : (
          <div>
            <img
              src={qr}
              className={classNames(
                'h-[150px] w-[150px]',
                user.payment_link_participations![type].currency == 'MXN' &&
                  'hidden'
              )}
            />
          </div>
        )}

        <Input
          readOnly
          prefix={<BsWallet />}
          value={isExpired && !amountChanged ? '' : address}
          className={classNames(
            user.payment_link_participations![type].currency == 'MXN' &&
              'hidden'
          )}
          suffix={
            <div
              className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
              onClick={() => copy(address!)}
            >
              <FiCopy />
            </div>
          }
        />

        <div
          className={
            !(isExpired || amountChanged)
              ? 'grid grid-cols-[30%_1fr] gap-x-4 w-full'
              : 'grid gap-x-4 w-full'
          }
        >
          {!(isExpired || amountChanged) ? (
            <Input readOnly prefix={<BsClock />} value={timer} />
          ) : null}
          <Input
            readOnly
            prefix={
              currencyIcon[
                user.payment_link_participations![type].currency || 'BTC'
              ]
            }
            value={isExpired && !amountChanged ? '' : amount.toFixed(8)}
            suffix={
              <div className="flex items-center space-x-2">
                <span>{user.payment_link_participations![type].currency}</span>{' '}
                <div
                  className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
                  onClick={() => copy(amount.toFixed(8) || '')}
                >
                  <FiCopy />
                </div>
              </div>
            }
          />
        </div>

        {!isExpired &&
          user.payment_link_participations![type].currency == 'MXN' && (
            <div className="flex justify-between space-x-2 w-full py4">
              <button
                className="bg-green-600 rounded-md px-4 py-2 text-white text-xl hover:bg-green-800"
                onClick={() => openModal()}
              >
                Pagar
              </button>
            </div>
          )}

        {/* <div className="w-full flex justify-end">
          {import.meta.env.VITE_ENABLE_OPENPAY &&
            user.payment_link![type].currency != 'MXN' && (
              <ButtonSwapCurrency
                currency="MXN"
                createPaymentLink={createPaymentLink}
                type={type}
              />
            )}
          {user.payment_link![type].currency != 'LTC' && (
            <ButtonSwapCurrency
              currency="LTC"
              createPaymentLink={createPaymentLink}
              type={type}
            />
          )}
        </div> */}
      </div>
      {amountChanged ? (
        <div>
          <p className="text-red-400 font-bold text-center">
            Se detectó un pago
            <br />
            que no cubre la totalidad,
            <br />
            favor de pagar el resto.
          </p>
        </div>
      ) : null}
      {isExpired && !amountChanged ? (
        <div>
          <p className="text-red-400 font-bold text-center">
            QR de pago caducado.
          </p>
        </div>
      ) : null}
      <div>
        <p className="text-center">
          Los créditos se te añadiran
          <br />
          despues de confirmar el pago.
        </p>
      </div>
      <div>
        <button
          className="rounded-md px-4 py-2 underline"
          onClick={() => deletePaymentLinkForParticipations()}
        >
          {'<-'} Cambiar metodo de pago
        </button>
      </div>
      {isExpired && !amountChanged ? (
        <div className="flex justify-end space-x-1">
          <Button
            loading={loading}
            disabled={!isExpired}
            onClick={() =>
              createPaymentLink(
                type,
                user.payment_link_participations![type].currency
              )
            }
          >
            Calcular de nuevo
          </Button>
        </div>
      ) : null}
      {user.payment_link_participations![type] && expires_at && (
        <span className="text-xs text-gray-300">
          Tu membresia expiró el:{' '}
          {dayjs(expires_at!.seconds * 1000).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      )}
    </>
  )
}

export default FormPayForParticipations
