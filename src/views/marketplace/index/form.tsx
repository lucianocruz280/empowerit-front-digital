import { Button, Dialog, Input, Notification, toast } from "@/components/ui"
import { db } from "@/configs/firebaseConfig"
import { useAppSelector } from "@/store"
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ChangeEventHandler, FC, useEffect, useState } from "react"

type Props = {
  onBack: () => void
  onComplete: () => void
}

const DEFAULT_ADDRESS = {
  country: '',
  state: '',
  city: '',
  cp: '',
  street: '',
  reference: '',
  num_ext: '',
  num_int: '',
  phone: '',
  colony: ''
}

const MarketplaceForm: FC<Props> = (props) => {
  const user = useAppSelector((state) => state.auth.user)
  const [cart, setCart] = useState({
    address: DEFAULT_ADDRESS,
  })
  const [modal, setModal] = useState(false)

  useEffect(() => {
    getCart()
  }, [])

  const setAddress = async () => {
    try {
      if (!cart.address.state) throw new Error('Estado es requerido')
      if (!cart.address.city) throw new Error('Ciudad es requerido')
      if (!cart.address.cp) throw new Error('CP es requerido')
      if (!cart.address.street) throw new Error('Calle es requerido')
      if (!cart.address.colony) throw new Error('Colonia es requerido')
      if (!cart.address.phone) throw new Error('Telefono es requerido')
      if (!cart.address.reference)
        throw new Error('Referencia es requerido')
      if (!cart.address.num_ext)
        throw new Error('Número exterior es requerido')

      await updateDoc(doc(db, `users/${user.uid}/cart/1`), {
        updated_at: new Date(),
        address: cart.address,
      })

      props.onComplete()
    } catch (err: any) {
      toast.push(<Notification title={err.toString()} type="danger" />, {
        placement: 'top-center',
      })
    }
  }

  const getCart = async () => {
    const res = await getDoc(doc(db, `users/${user.uid}/cart/1`))
    if (res.exists()) {
      try {
        setCart({
          address: res.get('address') || DEFAULT_ADDRESS,
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  const change = (name: string) => (e: any) => {
    setCart({
      ...cart,
      address: {
        ...cart.address,
        [name]: e.target.value
      }
    })
  }

  return (
    <div>
      <Dialog isOpen={modal} onClose={() => setModal(false)}>
        <p className="text-center font-bold text-xl mb-2">¿Tus datos son correctos?</p>
        <div className="grid grid-cols-2 gap-4 justify-between p-4 rounded-lg">
          <div className="font-semibold">
            <p>Estado:</p>
            <p>Ciudad:</p>
            <p>Código Postal:</p>
            <p>Colonia:</p>
            <p>Calle:</p>
            <p>Referencias:</p>
            <p>Teléfono de contacto:</p>
          </div>
          <div>
            <p>{cart.address.state}</p>
            <p>{cart.address.city}</p>
            <p>{cart.address.cp}</p>
            <p>{cart.address.colony}</p>
            <p>{cart.address.street}</p>
            <p>{cart.address.reference}</p>
            <p>{cart.address.phone}</p>
          </div>
        </div>
        <div className="flex justify-between mx-4">
          <Button onClick={() => setModal(false)}>Regresar</Button>
          <Button onClick={setAddress}>Aceptar</Button>

        </div>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>Páis</label>
          <Input value="México" disabled />
        </div>
        <div>
          <label>Estado</label>
          <Input
            name="state"
            value={cart.address.state}
            onChange={change('state')}
          />
        </div>
        <div>
          <label>Ciudad</label>
          <Input
            name="city"
            value={cart.address.city}
            onChange={change('city')}
          />
        </div>
        <div>
          <label>Código Postal</label>
          <Input name="cp" value={cart.address.cp} onChange={change('cp')} />
        </div>
        <div>
          <label>Colonia</label>
          <Input
            name="colony"
            value={cart.address.colony}
            onChange={change('colony')}
          />
        </div>
        <div>
          <label>Calle</label>
          <Input
            name="street"
            value={cart.address.street}
            onChange={change('street')}
          />
        </div>
        <div>
          <label>Referencias</label>
          <Input
            name="reference"
            value={cart.address.reference}
            onChange={change('reference')}
            placeholder="Entre calles"
          />
        </div>
        <div>
          <label>Número Exterior</label>
          <Input
            name="num_ext"
            value={cart.address.num_ext}
            onChange={change('num_ext')}
          />
        </div>
        <div>
          <label>Número Interior (Opcional)</label>
          <Input
            name="num_int"
            value={cart.address.num_int}
            onChange={change('num_int')}
          />
        </div>
        <div>
          <label>Télefono</label>
          <Input
            name="phone"
            value={cart.address.phone}
            onChange={change('phone')}
          />
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <span className="underline hover:cursor-pointer" onClick={props.onBack}>
          {'<'} Regresar al carrito
        </span>
        <button
          className="bg-black text-white rounded-full px-6 py-2"
          onClick={() => setModal(true)}
        >
          Pagar
        </button>
      </div>
    </div>
  )
}

export default MarketplaceForm