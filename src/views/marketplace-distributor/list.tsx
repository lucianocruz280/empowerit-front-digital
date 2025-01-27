import { useEffect, useState } from 'react'
import { FaMinus, FaPlus, FaStar } from 'react-icons/fa'
import products from '../marketplace/index/products.json'
import { formatNumberWithCommas } from '@/utils/format'
import { useAppSelector } from '@/store'
import { Button, Dialog } from '@/components/ui'

type MarketplaceDistributorListProps = {
  onComplete: () => void
}

export default function MarketplaceDistributorList({
  onComplete,
}: MarketplaceDistributorListProps) {
  const user = useAppSelector((state) => state.auth.user)
  const [cart, setCart] = useState(
    products
      .filter((p) => p.distributor_usd_price !== undefined)
      .map((p) => ({
        id: p.id,
        product_galleries: [p.product_galleries[0]],
        name: p.name,
        sale_price: p.distributor_usd_price,
        price: p.sale_price,
        quantity: 0,
      }))
  )
  const [isAvailable, setIsAvailable] = useState<boolean>(false)
  const [availableProcess, setAvailableProcess] = useState<boolean>(false)
  const [totalPrice, setTotalPrice] = useState<number>(0)
  const quantity = cart.reduce((a, b) => a + b.quantity, 0)

  const setToCart = (product_id: number, quantity: number) => {
    if (quantity < 0) return
    setCart((products) => {
      const _products = [...products]
      const index = _products.findIndex((r) => r.id == product_id)
      if (index > -1) {
        if (product_id === 9432090476817) {
          // id de la uritea
          if (quantity == 4) {
            quantity = 0
          } else if (quantity == 1) {
            quantity = 5
          }
        }
        _products[index].quantity = quantity
      }
      return _products
    })
  }

  useEffect(() => {
    if (
      user &&
      user.credits_spent_this_month &&
      user.credits_spent_this_month >= 100
    ) {
      setIsAvailable(true)
    } else {
      setIsAvailable(false)
    }
  }, [user])

  useEffect(() => {
    const totalWithShipment = () => {
      let total = 0
      cart
        .filter((p) => p.quantity)
        .forEach((p) => {
          total += p.sale_price * p.quantity
        })

      let sendPrice = 0

      if (quantity >= 22) {
        sendPrice = 36
      } else if (quantity >= 10) {
        sendPrice = 18
      }

      const totalWithShipment = total + sendPrice
      setTotalPrice(totalWithShipment)
    }
    if (user) {
      totalWithShipment()
    }
  }, [cart])

  const enoughCredits = () => {
    onComplete()
  }

  return (
    <div>
      <Dialog isOpen={!isAvailable} onClose={() => setIsAvailable(true)}>
        <div className="space-y-1 flex flex-col">
          <p className="font-bold text-xl">Faltan requisitos</p>
          <p className="font-lg">
            Para disfrutar de los beneficios de Marketplace Bono Distribuidor
            deberás de contar con un mínimo de 100 créditos utilizados en el
            mes.
          </p>
        </div>
        <div className="text-right mt-2">
          <Button onClick={() => setIsAvailable(true)}>ACEPTAR</Button>
        </div>
      </Dialog>

      <img src="/img/empoweritup.png" className="w-[400px]" />
      <p className="flex font-bold text-lg mt-2">
        Créditos utilizados en el mes:{' '}
        <span className="ml-1 font-normal">
          {' '}
          {user.credits_spent_this_month} créditos
        </span>
      </p>
      <p className="text-lg italic my-2">
        Arma tu carrito y pagalo a precio preferencial
      </p>
      <div className="grid grid-cols-1  lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
        {cart.map((p) => (
          <div
            key={p.id.toString()}
            className="bg-gray-100 flex flex-col items-center rounded-lg px-4 pb-4"
          >
            <img
              src={p.product_galleries[0].original_url}
              className="w-[80%] flex-1 object-contain"
            />
            <div className="flex justify-start w-full text-lg">
              <span className="font-bold">{p.name}</span>
            </div>
            <div className="flex justify-start w-full space-x-2">
              <span className="font-medium">$ {p.sale_price}</span>
              <span className="line-through text-gray-400">
                ${Math.ceil(Number(p.price) / 17)}
              </span>
            </div>
            {p.id && p.id == 9432090476817 && (
              <div className="flex justify-start w-full space-x-2">
                <span>Minimo de compra: 5 unidades</span>
              </div>
            )}
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
            <div className="flex items-center space-x-1">
              <button
                className="rounded-full bg-black text-white p-2 text-lg hover:bg-slate-800 disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!p.quantity}
                onClick={() => setToCart(p.id, p.quantity - 1)}
              >
                <FaMinus />
              </button>
              <input
                value={p.quantity}
                className="flex-1 rounded-full text-black bg-gray-300 h-full text-center"
              />
              <button
                className="rounded-full bg-black text-white p-2 text-lg hover:bg-slate-700"
                onClick={() => setToCart(p.id, p.quantity + 1)}
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-8 w-full">
        <div className="w-max text-lg px-4 border-t border-gray-400">
          <div className="w-full grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 pt-2">
            <div className="font-bold text-right"># Articulos</div>
            <div>{quantity}</div>

            <div className="font-bold text-right">Envio</div>
            <div>
              {/* Cuando son 22 o mas seran 36 de envio, cuando son 10 o mas son 18 y cuando son menos de 10 son 12 */}
              ${' '}
              {formatNumberWithCommas(
                quantity >= 22 ? 36 : quantity >= 10 ? 18 : 12
              )}{' '}
            </div>

            <div className="font-bold text-right">Subtotal</div>
            <div>
              ${' '}
              {formatNumberWithCommas(
                cart.reduce((a, b) => a + b.sale_price * b.quantity, 0),
                0,
                '-',
                false
              )}{' '}
            </div>
            <div className="font-bold text-right">Total</div>
            <div>$ {totalPrice}</div>
          </div>
          <div className="w-full mt-2">
            <button
              className="bg-black text-white rounded-full w-full p-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                user.credits &&
                user.credits_spent_this_month &&
                user.credits_spent_this_month >= 100 &&
                totalPrice > 0 &&
                totalPrice <= user.credits
                  ? false
                  : true
              }
              onClick={() => enoughCredits()}
            >
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
