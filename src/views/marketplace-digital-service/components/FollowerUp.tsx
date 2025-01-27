import { Button, Dialog } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from 'firebase/firestore'
import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export type FollowerUpProps = {
  img: string
  cost: number
  name: string
}

export default function FollowerUp({ img, cost, name }: FollowerUpProps) {
  const user = useAppSelector((state) => state.auth.user)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [captureModal, setCaptureModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const buyProcess = async () => {
    if (!user || !user.uid) return
    try {
      setLoading(true)
      const userRef = doc(db, 'users', user.uid)
      //Quitarle los creditos a la persona
      await updateDoc(userRef, {
        credits: increment(-cost),
      })
      //Crear el documento de historial de compras
      await addDoc(collection(userRef, 'digital-marketplace-purchases'), {
        user_id: user.uid,
        email: user.email,
        purchase: `Follower Up ${name}`,
        cost,
        created_at: new Date(),
      })
      await addDoc(collection(db, `users/${user.uid}/credits-history/`), {
        id_user: user.uid,
        email: user.email,
        name: user.name,
        total: cost,
        created_at: new Date(),
        concept: `Compra de Follower Up ${name}`,
      })
      await updateCreditsSpentThisMonth()
    } catch (error) {
      console.log(`Error intentando comprar Follower Up${name}`, error)
    } finally {
      setLoading(false)
      setOpenModal(false)
      setCaptureModal(true)
    }
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
        src={img}
        className="max-w-[250px] max-h-[250px] flex-1 object-contain"
      />
      <div className="flex justify-start w-full text-lg">
        <span className="font-bold">Follower Up {name} </span>
      </div>
      <div className="flex justify-start w-full space-x-2">
        <span className="font-medium">{cost} créditos</span>
        <span className="line-through text-gray-400">{cost + 20} créditos</span>
      </div>
      <div className="flex flex-col justify-start w-full">
        <div>
          <span className="font-medium">Duración:</span>
          <span className=" text-gray-400"> Permanente</span>
        </div>
        <div>
          <span className="font-medium"></span>
          <span className="text-gray-400"></span>
        </div>
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
      <div className="pt-4">
        {user && typeof user.credits === 'number' ? (
          user.credits < cost ? (
            <Button
              disabled={true}
              className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
            >
              Creditos insuficientes
            </Button>
          ) : (
            <Button
              className={
                'px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 '
              }
              onClick={() => setOpenModal(true)}
            >
              Comprar
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
      </div>
      <Dialog isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <span className="pt-4">
            Desea comprar este producto por {cost} créditos?
          </span>
          <div className="flex justify-between w-full mt-4">
            <Button loading={loading} onClick={buyProcess}>
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
            <span className="font-bold">+52 8121900185</span>
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
