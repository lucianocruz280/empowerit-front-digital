import { Button, Dialog } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import AlgorithmMrRangeComponent from './components/AlgorithmMrRangeComponent'
import { useNavigate } from 'react-router-dom'
import MrSportMoney from './components/MrSportMoney'
import MrMoneyPower from './components/MrMoneyPower'
import FollowerUp from './components/FollowerUp'
import CryptoXpertModal from './components/CryptoXpertModal'
import ProFunnelModal from './components/ProFunnelModal'
import InstaAdsModal from './components/InstaAdsModal'
import FlowBotModal from './components/FlowBotModal'
import PackMarketing from './components/PackMarketing'

export default function MartketplaceDigitalService() {
  const user = useAppSelector((state) => state.auth.user)

  const [openModal, setOpenModal] = useState(false)
  const [academyAccess, setAcademyAccess] = useState(false)
  const [leftDaysString, setLeftDaysString] = useState<string>()
  const navigate = useNavigate()

  const getLeftDays = (expires_at: any) => {
    if (expires_at && expires_at.seconds > new Date().getTime() / 1000) {
      const leftDays = Math.floor(
        (expires_at.seconds - new Date().getTime() / 1000) / 60 / 60 / 24
      )
      setAcademyAccess(true)
      setLeftDaysString(leftDays + ' días restantes')
      return
    }
    setAcademyAccess(false)
  }

  useEffect(() => {
    if (user && user.academy_access_expires_at) {
      getLeftDays(user.academy_access_expires_at)
    } else {
      setAcademyAccess(false)
    }
  }, [user])

  const enoughCredits = async () => {
    const usersRef = doc(db, `users/${user.uid}`)
    const res = await getDoc(usersRef)
    if (res.data()?.credits >= 0) {
      return true
    }
    return false
  }

  const buyAcademyAccess = async () => {
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(now.getDate() + 30)

    const usersRef = await doc(db, `users/${user.uid}`)
    const res = await getDoc(usersRef)
    const isEnoughtCredits = await enoughCredits()
    if (isEnoughtCredits) {
      if (res.exists()) {
        const creditsLeft = res.data().credits
        await updateDoc(usersRef, {
          credits: creditsLeft - 100,
          academy_access_expires_at: expiresAt,
        })
      }
      createHistoryCreditsDoc(100)
    }
    setOpenModal(false)
    navigate('/home')
  }

  const createHistoryCreditsDoc = async (total: number) => {
    const now = new Date()
    const expiresAt = new Date(now)
    expiresAt.setDate(now.getDate() + 30)

    await addDoc(collection(db, `users/${user.uid}/credits-history/`), {
      id_user: user.uid,
      email: user.email,
      name: user.name,
      total,
      created_at: new Date(),
      concept: 'Compra en Marketplace Servicios Digital',
      academy_access_expires_at: expiresAt,
    })
  }

  return (
    <div>
      <img src="/img/empoweritup.png" className="w-[400px]" />
      <p className="text-lg italic my-4">
        Arma tu carrito con nuestros productos digitales
      </p>
      <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
        {/* <div
                    className="bg-gray-100 flex flex-col items-center rounded-lg px-4 pb-4"
                >
                    <img
                        src="/membership/top-xpert-imagen-marketplace.jpg"
                        className="max-w-[250px] max-h-[250px] flex-1 object-contain"
                    />
                    <div className="flex justify-start w-full text-lg">
                        <span className="font-bold">Acceso a academia</span>
                    </div>
                    <div className="flex justify-start w-full space-x-2">
                        <span className="font-medium">
                            100 créditos
                        </span>
                        <span className="line-through text-gray-400">
                            120 créditos
                        </span>
                    </div>
                    <div className="flex justify-start w-full space-x-2">
                        <span className="font-medium">
                            Duración:
                        </span>
                        <span className=" text-gray-400">
                            30 días
                        </span>
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
                    {user && typeof user.credits === 'number' ? (
                        user.credits < 100 ? (
                            <Button
                                onClick={() => setOpenModal(true)}
                                disabled={true}
                                className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                            >
                                {academyAccess ? leftDaysString : 'Créditos insuficientes'}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setOpenModal(true)}
                                disabled={academyAccess}
                                className={`px-4 py-2 font-semibold rounded ${academyAccess ? 'bg-gray-400 text-gray-700 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'}`}
                            >
                                {academyAccess ? leftDaysString : 'Comprar Acceso'}
                            </Button>
                        )
                    ) : (
                        <Button
                            onClick={() => setOpenModal(true)}
                            disabled={true}
                            className="px-4 py-2 font-semibold rounded bg-gray-400 text-gray-700 cursor-not-allowed"
                        >
                            Créditos insuficientes
                        </Button>
                    )}
                </div> */}
        {/* <AlgorithmMrRangeComponent /> */}
        <MrSportMoney />
        <MrMoneyPower />
        {/* <FollowerUp
          img="/img/digital-marketplace/follower-up.png"
          cost={16}
          name="1K"
        />
        <FollowerUp
          img="/img/digital-marketplace/follower-up-5k.png"
          cost={39}
          name="5K"
        />
        <FollowerUp
          img="/img/digital-marketplace/follower-up-10k.png"
          cost={72}
          name="10K"
        /> */}
        <ProFunnelModal />
        <InstaAdsModal />
        <FlowBotModal />
        <PackMarketing />
      </div>
      <Dialog isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div>
          <span className="pt-4">
            Desea comprar este producto por 100 créditos?
          </span>
          <div className="flex justify-between w-full mt-4">
            <Button onClick={() => buyAcademyAccess()}>ACEPTAR</Button>
            <Button onClick={() => setOpenModal(true)}>CERRAR</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
