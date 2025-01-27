/* eslint-disable react/no-unescaped-entities */
import { Button, Input, Spinner } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { setUser, useAppDispatch, useAppSelector } from '@/store'
import dayjs from 'dayjs'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { BsClock, BsWallet } from 'react-icons/bs'
import { FaBitcoin, FaCheck } from 'react-icons/fa'
import axios from 'axios'
import useTimer from '@/hooks/useTimer'
import useClipboard from '@/utils/hooks/useClipboard'
import { CgCopy } from 'react-icons/cg'
import { FiCopy } from 'react-icons/fi'

const PayMembership = () => {
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()
  const [userDoc, setUserDoc] = useState<any>({})
  const paymentlink = userDoc.payment_link
  const [loading, setLoading] = useState(false)
  const [expired, setExpired] = useState(false)
  const [hasNotLink, setHasNotLink] = useState(false)
  const [transactions, setTransactions] = useState(0)

  const { copy } = useClipboard()

  const timer = useTimer(
    paymentlink && paymentlink.expires_at
      ? paymentlink.expires_at.seconds * 1000
      : undefined,
    () => setExpired(true)
  )

  useEffect(() => {
    if (user.uid) {
      getDocs(collection(db, 'users/' + user.uid + '/transactions')).then((r) =>
        setTransactions(r.size)
      )
      const unsub = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        const data = snap.data()!
        setUserDoc(data)

        const hasNotLink =
          !data.payment_link || JSON.stringify(data.payment_link) == '{}'
        const linkExpired =
          data.payment_link &&
          data.payment_link.expires_at &&
          dayjs().isAfter(dayjs(data.payment_link.expires_at.seconds * 1000))

        setExpired(linkExpired)
        setHasNotLink(hasNotLink)

        if (data.subscription_expires_at) {
          dispatch(
            setUser({
              ...user,
              subscription_expires_at: data.subscription_expires_at,
            })
          )
        }
      })

      return () => {
        unsub()
      }
    }
  }, [user.uid])

  const createPaymentLink = async () => {
    try {
      if (loading) return

      setLoading(true)
      await axios.post(`${import.meta.env.VITE_API_URL}/createPaymentAddress`, {
        userId: user.uid,
      })
      setExpired(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const FormPay = () => (
    <>
      <div className="flex flex-1 flex-col space-y-2 items-center">
        <img src={paymentlink?.qr} className="h-[150px] w-[150px]" />

        <Input
          readOnly
          prefix={<BsWallet />}
          value={paymentlink?.address}
          suffix={
            <div
              className="bg-gray-200 p-2 rounded-lg hover:cursor-pointer hover:bg-gray-300"
              onClick={() => copy(paymentlink.address)}
            >
              <FiCopy />
            </div>
          }
        />

        <div className="grid grid-cols-[30%_1fr] gap-x-4 w-full">
          <Input
            readOnly
            prefix={<BsClock />}
            value={expired ? '00:00' : timer}
          />
          <Input
            prefix={<FaBitcoin />}
            readOnly
            value={paymentlink?.amount}
            suffix={'BTC'}
          />
        </div>
      </div>
      <div>
        <p className="text-center">
          La cuenta se activará automaticamente
          <br />
          despues de confirmar el pago
        </p>
      </div>
      <div className="flex justify-end space-x-1">
        <Button
          onClick={createPaymentLink}
          loading={loading}
          disabled={!expired}
        >
          Calcular de nuevo
        </Button>
      </div>
    </>
  )

  const ConfirmMessage = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <span>Se está confirmando tu transacción</span>
        <span>Esto puede tardar varios minutos</span>
        <div className="bg-green-400 rounded-full p-4 w-min mt-8">
          <FaCheck fontSize={40} />
        </div>
        <span className="mt-8">Tu academia quedará activada pronto</span>
      </div>
    )
  }

  const GenerateQR = () => {
    return (
      <div>
        <Button loading={loading} onClick={createPaymentLink}>
          Generar QR de Pago
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <h3>Pagar membresia</h3>
      <div className="">
        <div className="rounded-md shadow-md w-[500px] flex flex-col p-4 space-y-4">
          <div className="grid grid-cols-2 w-1/2 gap-x-4">
            <span className="text-right">Membresía: </span>
            <span className="font-bold">PRO</span>
            <span className="text-right">Duración:</span>
            <span className="font-bold">
              {transactions == 0 ? '56' : '28'} días
            </span>
            <span className="text-right">Total:</span>
            <span className="font-bold">$ 177 USD</span>
          </div>
          {hasNotLink || expired ? (
            <GenerateQR />
          ) : paymentlink ? (
            paymentlink.status == 'pending' ? (
              <FormPay />
            ) : (
              <ConfirmMessage />
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  )
}

export default PayMembership
