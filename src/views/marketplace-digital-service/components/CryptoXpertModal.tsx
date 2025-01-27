import { Button, Dialog } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  increment,
  updateDoc,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function CryptoXpertModal() {
  const user = useAppSelector((state) => state.auth.user)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [leftDaysString, setLeftDaysString] = useState<string>()
  const [captureModal, setCaptureModal] = useState<boolean>(false)
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [cost, setCost] = useState<number>(50)
  const navigate = useNavigate()

  const getLeftDays = (expires_at: any) => {
    if (expires_at && expires_at.seconds > new Date().getTime() / 1000) {
      const leftDays = Math.floor(
        (expires_at.seconds - new Date().getTime() / 1000) / 60 / 60 / 24
      )
      setHasAccess(true)
      setLeftDaysString(leftDays + ' días restantes')
    } else {
      setHasAccess(false)
    }
  }

  useEffect(() => {
    if (user && user.crypto_xpert_expires_at) {
      getLeftDays(user.crypto_xpert_expires_at)
    } else {
      setHasAccess(false)
    }
  }, [user])

  const buyProcess = async () => {
    setLoading(true)
    try {
      await createHistoryCreditsDoc(cost)
      await updateCreditsSpentThisMonth()
    } catch (error) {
      console.log('Error en la compra de CryptoXpertModal')
    } finally {
      setLoading(false)
      setOpenModal(false)
      setCaptureModal(true)
    }
  }

  const createHistoryCreditsDoc = async (total: number) => {
    const now = new Date()
    const expiresAt = new Date()

    expiresAt.setDate(now.getDate() + 30)

    const usersRef = doc(db, `users/${user.uid}`)

    await updateDoc(usersRef, {
      credits: Number(user.credits) - cost,
      crypto_xpert_expires_at: expiresAt,
    })

    await addDoc(collection(db, `users/${user.uid}/credits-history/`), {
      id_user: user.uid,
      email: user.email,
      name: user.name,
      total,
      created_at: now,
      concept: 'Compra de Acceso de Crypto Xpert',
      crypto_xpert_expires_at: expiresAt,
    })
    await addDoc(
      collection(db, `users/${user.uid}/digital-marketplace-purchases/`),
      {
        user_id: user.uid,
        email: user.email,
        purchase: 'Compra de Acceso de Crypto Xpert',
        cost,
        created_at: new Date(),
      }
    )
  }
  const updateCreditsSpentThisMonth = async () => {
    if (!user.uid) return
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      credits_spent_this_month: increment(Number(cost)),
    })
  }
  return (
    <div className="bg-gray-100 flex flex-col items-center rounded-lg px-4 pb-4">
      <img
        src="/img/digital-marketplace/crypto-xpert-1.png"
        className="max-w-[250px] max-h-[250px] flex-1 object-contain"
      />
      <div className="flex justify-start w-full text-lg">
        <span className="font-bold">Acceso a Crypto Xpert </span>
      </div>
      <div className="flex justify-start w-full space-x-2">
        <span className="font-medium">{cost} créditos</span>
        <span className="line-through text-gray-400">79 créditos</span>
      </div>
      <div className="flex justify-start w-full space-x-2">
        {!hasAccess ? (
          <div className="flex flex-col">
            <div>
              <span className="font-medium">Duración:</span>
              <span className=" text-gray-400">30 días</span>
            </div>
          </div>
        ) : (
          <>
            <span className="font-bold text-green-400">Activa:</span>
            <span className=" text-gray-400">{leftDaysString}</span>
          </>
        )}
      </div>
      <div className="flex justify-start items-center w-full pb-4 space-x-2">
        <div className="flex justify-start text-yellow-500 space-x-1">
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
          <FaStar />
        </div>
        <div>
          <span className="font-medium">En existencia</span>
        </div>
      </div>
      {/* Verificar que exista user y efectivamente tenga creditos */}
      {user && typeof user.credits === 'number' ? (
        user.credits < cost ? (
          <Button
            disabled={true}
            className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed mt-4"
          >
            Creditos insuficientes
          </Button>
        ) : (
          <Button
            disabled={hasAccess}
            className={`px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 mt-4`}
            onClick={() => setOpenModal(true)}
          >
            {hasAccess ? leftDaysString : 'Comprar Acceso'}
          </Button>
        )
      ) : (
        <Button
          disabled={true}
          className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
        >
          Creditos insuficientes
        </Button>
      )}
      <Dialog isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <span className="pt-4">
            Desea comprar este producto por {cost} créditos?
          </span>
          <div className="flex justify-between w-full mt-4">
            <Button loading={loading} onClick={() => buyProcess()}>
              ACEPTAR
            </Button>
            <Button onClick={() => setOpenModal(true)}>CERRAR</Button>
          </div>
        </div>
      </Dialog>
      <Dialog
        isOpen={captureModal}
        onClose={() => {
          setCaptureModal(false)
          navigate('/home')
        }}
      >
        <div>
          <p className="text-2xl font-bold text-center">
            ¡Su compra se ha realizado exitosamente!
          </p>
          <p>
            La compra de su producto ha sido realizada con éxito. Una vez
            adquirido el servicio, deberás tomar una captura de pantalla y
            comunicarte al siguiente número para la activación:{' '}
            <span className="font-bold"> +52 3345813983</span>
          </p>
          <p className="font-bold">
            Nombre: <span className="font-normal">{user.name}</span>
          </p>
          <p className="font-bold">
            Correo: <span className="font-normal">{user.email}</span>
          </p>
          <p className="font-bold">
            Fecha de Adquisición:{' '}
            <span className="font-normal">
              {new Date().toLocaleString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </p>
          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                setCaptureModal(false)
                navigate('/home')
              }}
            >
              Aceptar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
