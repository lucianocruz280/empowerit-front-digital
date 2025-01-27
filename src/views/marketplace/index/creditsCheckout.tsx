import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { useEffect, useState } from 'react'
import useClipboard from '@/utils/hooks/useClipboard'
import { useAppSelector } from '@/store'
import { useNavigate } from 'react-router-dom'
import Button from '@/components/ui/Button'

type MarketplaceCreditsCheckoutProps = {
  onBack: () => void
}

export default function MarketplaceCreditsCheckout(
  props: MarketplaceCreditsCheckoutProps
) {
  const { copy } = useClipboard()
  const navigate = useNavigate()
  const user = useAppSelector((state) => state.auth.user)

  const [cart, setCart] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)
  const [cartComplete, setCartComplete] = useState<DocumentData>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    getCart()
  }, [])

  useEffect(() => {
    getTotal()
  }, [cart])

  const getCart = async () => {
    const res = await getDoc(doc(db, `users/${user.uid}/cart/1`))
    if (res.exists()) {
      const documentData = res.data()
      setCartComplete(documentData)
      try {
        const _cart = JSON.parse(res.get('json'))
        setCart(_cart)
      } catch (err) {
        console.error(err)
      }
    }
  }
  const getTotal = () => {
    let total = 0
    cart
      .filter((p) => p.quantity)
      .forEach((p) => {
        total += Math.ceil(p.sale_price / 17) * p.quantity
      })

    let sendPrice = 12
    const hasFreeShipping = cart.some(
      (p) =>
        (p.id === 94320904768178 || p.id === 943209047681782) && p.quantity > 0
    )

    if (hasFreeShipping) {
      sendPrice = 0
    } else if (quantity >= 22) {
      sendPrice = 36
    } else if (quantity >= 10) {
      sendPrice = 18
    }

    let totalWithShipment = total + sendPrice
    setTotal(totalWithShipment)
  }

  const quantity = cart.reduce((a, b) => a + b.quantity, 0)

  const substractCredits = async () => {
    let endCredits = Number(user.credits) - Number(total)
    const userDocRef = doc(db, `users/${user.uid}`)
    await updateDoc(userDocRef, {
      credits: endCredits,
    })
    navigate('/home')
  }
  const createPendingShip = async () => {
    const docRef = await addDoc(
      collection(db, `users/${user.uid}/pending-ships/`),
      {
        cart: cartComplete,
        cartId: '1',
        created_at: new Date(),
        pack: 'none',
        sent: 'false',
      }
    )
  }
  const deleteCart = async () => {
    await deleteDoc(doc(db, `users/${user.uid}/cart/1`))
  }
  const createHistoryCreditsDoc = async () => {
    const docRef = await addDoc(
      collection(db, `users/${user.uid}/credits-history/`),
      {
        id_user: user.uid,
        email: user.email,
        name: user.name,
        total,
        created_at: new Date(),
        concept: 'Compra en Marketplace',
      }
    )
  }
  const completeBuyProcess = async () => {
    setIsLoading(true)
    try {
      await createPendingShip()
      await deleteCart()
      await createHistoryCreditsDoc()
      await substractCredits()
      await updateCreditsSpentThisMonth()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
  const updateCreditsSpentThisMonth = async () => {
    if (!user.uid) return
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      credits_spent_this_month: increment(Number(total)),
    })
  }

  return (
    <div>
      <p className="font-bold underline underline-offset-8 mb-2 text-lg">
        Lista de compra
      </p>
      <div className="grid grid-cols-[min-content_1fr] gap-2 mb-8">
        {cart
          .filter((p) => p.quantity)
          .map((p) => (
            <>
              <span className="font-bold">x{p.quantity}</span>
              <span>{p.name}</span>
            </>
          ))}
      </div>
      <p className="font-bold underline underline-offset-8 mb-2 text-lg">
        Total a pagar
      </p>
      <div>
        <span>{total} créditos</span>
      </div>
      <div className="flex justify-between mt-8">
        <Button
          className="bg-black rounded-full px-6 py-2"
          onClick={props.onBack}
        >
          Regresar al carrito
        </Button>
        <Button
          loading={isLoading}
          className="bg-black rounded-full px-6 py-2"
          onClick={() => completeBuyProcess()}
        >
          Comprar
        </Button>
      </div>
    </div>
  )
}
