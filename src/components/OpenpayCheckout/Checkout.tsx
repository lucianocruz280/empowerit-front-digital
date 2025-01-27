import OpenPay from '../openpay/index'
import axios from 'axios'
import { FC, useEffect, useMemo, useState } from 'react'
import InputCard from './InputCard'
import InputExpiry from './InputExpiry'
import { formatNumberWithCommas } from '@/utils/format'
import { Dialog } from '../ui'

type Props = {
  quoteId: string
  amount: number
}

const OpenPayCheckout: FC<Props> = (props) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<null | string>(null)
  const [card, setCard] = useState({
    email: '',
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardHolderLast: '',
    phoneNumber: '',

    address: '',
    city: '',
    state: '',
    neighborhood: '',
    postal_code: '',
  })

  const validate = () => {
    if (!card.address) throw new Error('La dirección no puede ser vacio')
    if (!card.neighborhood) throw new Error('La colonia no puede ser vacio')
    if (!card.postal_code)
      throw new Error('El código postal no puede ser vacio')
    if (!card.state) throw new Error('El estado no puede ser vacio')
    if (!card.city) throw new Error('La ciudad no puede ser vacio')
    if (!card.phoneNumber) throw new Error('El teléfono no puede ser vacio')
    if (card.phoneNumber.length !== 10)
      throw new Error('El teléfono debe tener 10 dígitos')
    if (!card.email) throw new Error('El correo no puede ser vacio')

    if (!OpenPay.card.validateCardNumber(card.cardNumber))
      throw new Error('Número de tarjeta invalido')

    if (!OpenPay.card.validateCVC(card.cvv, card.cardNumber))
      throw new Error('Código de seguridad invalido')

    const [month, year] = card.expiry.split('/')
    if (!OpenPay.card.validateExpiry(month, year))
      throw new Error('Código de seguridad invalido')
  }

  const send = async () => {
    try {
      setLoading(true)
      setError(null)
      validate()

      const [month, year] = card.expiry.split('/')
      const response = await OpenPay.token.create({
        address: {
          line1: card.address,
          line2: card.neighborhood,
          country_code: 'MX',
          city: card.city,
          state: card.state,
          postal_code: card.postal_code,
        },
        card_number: card.cardNumber,
        cvv2: card.cvv,
        expiration_month: month,
        expiration_year: year,
        holder_name: card.cardHolder,
      })

      const api_charge =
        process.env.NEXT_PUBLIC_FIREBASE_ENV == 'develop'
          ? 'https://us-central1-voltz-develop.cloudfunctions.net/api_payment_openpay/payments/charge'
          : 'https://us-central1-voltz-pro.cloudfunctions.net/api_payment_openpay/payments/charge'

      try {
        await axios.post(api_charge, {
          method: 'card',
          source_id: response.data.id,
          customer: {
            name: card.cardHolder,
            last_name: card.cardHolderLast,
            phone_number: card.phoneNumber,
            email: card.email,
          },
          device_session_id: deviceId,
          quote_id: props.quoteId,
          currency: 'MXN',
        })
      } catch (err) {
        throw new Error('Transacción rechazada')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.toString())
    } finally {
      setLoading(false)
    }
  }

  const cardType = useMemo(() => {
    const type = OpenPay.card.cardType(card.cardNumber)
    if (type) {
      return OpenPay.card.cardTypes()[type]
    }
    return null
  }, [card.cardNumber])

  return (
    <Dialog isOpen>
      <div className="px-4 pb-4 md:px-8 md:pb-4 lg:mt-0">
        <div className="">
          <label
            htmlFor="email"
            className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
          >
            Email
          </label>
          <div className="relative flex">
            <input
              type="text"
              id="email"
              name="email"
              className="w-full rounded-md border border-border-input px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              placeholder="your.email@gmail.com"
              onChange={(e) =>
                setCard((c) => ({ ...c, email: e.target.value }))
              }
              disabled={loading}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                />
              </svg>
            </div>
          </div>
          <label
            htmlFor="phone"
            className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
          >
            Teléfono
          </label>
          <div className="relative flex">
            <input
              type="text"
              id="phone"
              name="phone"
              className="w-full rounded-md border border-border-input px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              placeholder="10 DÍGITOS"
              onChange={(e) =>
                setCard((c) => ({ ...c, phoneNumber: e.target.value }))
              }
              disabled={loading}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              <svg
                height="17px"
                width="17px"
                version="1.1"
                id="Capa_1"
                viewBox="0 0 202.592 202.592"
                className="text-gray-400"
              >
                <g>
                  <g>
                    <path
                      fill="currentColor"
                      d="M198.048,160.105l-31.286-31.29c-6.231-6.206-16.552-6.016-23.001,0.433l-15.761,15.761
			c-0.995-0.551-2.026-1.124-3.11-1.732c-9.953-5.515-23.577-13.074-37.914-27.421C72.599,101.48,65.03,87.834,59.5,77.874
			c-0.587-1.056-1.145-2.072-1.696-3.038l10.579-10.565l5.2-5.207c6.46-6.46,6.639-16.778,0.419-23.001L42.715,4.769
			c-6.216-6.216-16.541-6.027-23.001,0.433l-8.818,8.868l0.243,0.24c-2.956,3.772-5.429,8.124-7.265,12.816
			c-1.696,4.466-2.752,8.729-3.235,12.998c-4.13,34.25,11.52,65.55,53.994,108.028c58.711,58.707,106.027,54.273,108.067,54.055
			c4.449-0.53,8.707-1.593,13.038-3.275c4.652-1.818,9.001-4.284,12.769-7.233l0.193,0.168l8.933-8.747
			C204.079,176.661,204.265,166.343,198.048,160.105z M190.683,176.164l-3.937,3.93l-1.568,1.507
			c-2.469,2.387-6.743,5.74-12.984,8.181c-3.543,1.364-7.036,2.24-10.59,2.663c-0.447,0.043-44.95,3.84-100.029-51.235
			C14.743,94.38,7.238,67.395,10.384,41.259c0.394-3.464,1.263-6.95,2.652-10.593c2.462-6.277,5.812-10.547,8.181-13.02l5.443-5.497
			c2.623-2.63,6.714-2.831,9.112-0.433l31.286,31.286c2.394,2.401,2.205,6.492-0.422,9.13L45.507,73.24l1.95,3.282
			c1.084,1.829,2.23,3.879,3.454,6.106c5.812,10.482,13.764,24.83,29.121,40.173c15.317,15.325,29.644,23.27,40.094,29.067
			c2.258,1.249,4.32,2.398,6.17,3.5l3.289,1.95l21.115-21.122c2.634-2.623,6.739-2.817,9.137-0.426l31.272,31.279
			C193.5,169.446,193.31,173.537,190.683,176.164z"
                    />
                  </g>
                </g>
              </svg>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-2">
            <div className="flex-1">
              <label
                htmlFor="card-holder"
                className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
              >
                Nombre
              </label>
              <div className="relative flex">
                <input
                  type="text"
                  id="card-holder"
                  name="card-holder"
                  className="w-full rounded-md border border-border-input px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nombre"
                  onChange={(e) =>
                    setCard((c) => ({ ...c, cardHolder: e.target.value }))
                  }
                  disabled={loading}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label
                htmlFor="card-holder-last"
                className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
              >
                Apellido
              </label>
              <div className="relative flex">
                <input
                  type="text"
                  id="card-holder-last"
                  name="card-holder-last"
                  className="w-full rounded-md border border-border-input px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Apellido"
                  onChange={(e) =>
                    setCard((c) => ({ ...c, cardHolderLast: e.target.value }))
                  }
                  disabled={loading}
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <label
            htmlFor="card-no"
            className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
          >
            Detalles de Tarjeta
          </label>
          <div className="relative flex md:hidden">
            <InputCard
              type="text"
              id="card-no"
              name="card-no"
              className="w-full rounded-md border border-border-input px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              onChange={(value) =>
                setCard((c) => ({ ...c, cardNumber: value }))
              }
              disabled={loading}
            />
            <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
              {cardType ? (
                <img width={20} height={20} src={cardType?.icon} alt="" />
              ) : (
                <svg
                  className="h-4 w-4 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                  <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                </svg>
              )}
            </div>
          </div>
          <div className="mt-2 flex w-full gap-x-4 md:mt-0 md:grid md:grid-cols-[1fr_min-content_min-content] md:gap-x-0">
            <div className="relative hidden md:flex">
              <InputCard
                type="text"
                id="card-no"
                name="card-no"
                className="w-full rounded-md border border-border-input px-2 py-3 pl-11 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="xxxx-xxxx-xxxx-xxxx"
                onChange={(value) =>
                  setCard((c) => ({ ...c, cardNumber: value }))
                }
                disabled={loading}
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                {cardType ? (
                  <img width={20} height={20} src={cardType?.icon} alt="" />
                ) : (
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 5.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1z" />
                    <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm13 2v5H1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1zm-1 9H2a1 1 0 0 1-1-1v-1h14v1a1 1 0 0 1-1 1z" />
                  </svg>
                )}
              </div>
            </div>
            <div className="flex">
              <InputExpiry
                type="text"
                name="credit-expiry"
                className="w-full min-w-[80px] rounded-md border border-border-input px-2 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="MM/YY"
                value={card.expiry}
                disabled={loading}
                onChange={(e) => {
                  if (e.target.value.length == 6) return
                  setCard((c) => ({ ...c, expiry: e.target.value }))
                }}
              />
            </div>
            <div className="flex">
              <input
                type="text"
                name="credit-cvc"
                className="w-full min-w-[60px] rounded-md border border-border-input px-2 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                placeholder="CVC"
                maxLength={4}
                onChange={(e) =>
                  setCard((c) => ({ ...c, cvv: e.target.value }))
                }
                disabled={loading}
              />
            </div>
          </div>
          <br />
          <hr />
          <h2 className="text-text-primary">Dirección de facturación</h2>
          <label
            htmlFor="address"
            className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
          >
            Callé y número
          </label>
          <div className="relative flex">
            <input
              type="text"
              id="address"
              name="address"
              className="w-full rounded-md border border-border-input px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
              placeholder="Linea 1"
              onChange={(e) =>
                setCard((c) => ({ ...c, address: e.target.value }))
              }
              disabled={loading}
            />
          </div>

          <div className="flex space-x-2">
            <div className="flex flex-1 flex-col">
              <label
                htmlFor="neighborhood"
                className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
              >
                Colonia
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  className="w-full rounded-md border border-border-input px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Colonia"
                  onChange={(e) =>
                    setCard((c) => ({ ...c, neighborhood: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <label
                htmlFor="postal_code"
                className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
              >
                Código Postal
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  className="w-full rounded-md border border-border-input px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Código"
                  onChange={(e) =>
                    setCard((c) => ({ ...c, postal_code: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <div className="flex flex-1 flex-col">
              <label
                htmlFor="state"
                className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
              >
                Estado
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="state"
                  name="state"
                  className="w-full rounded-md border border-border-input px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Estado"
                  onChange={(e) =>
                    setCard((c) => ({ ...c, state: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col">
              <label
                htmlFor="city"
                className="mb-2 mt-4 block text-sm font-medium text-text-secondary"
              >
                Ciudad
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full rounded-md border border-border-input px-4 py-3 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ciudad"
                  onChange={(e) =>
                    setCard((c) => ({ ...c, city: e.target.value }))
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </div>
        {error && (
          <span className="mt-2 block text-center text-red-400">{error}</span>
        )}
        <button
          className="mb-8 mt-4 w-full rounded-md border-none bg-green-600 px-6 py-3 font-medium text-white hover:cursor-pointer hover:bg-green-800"
          onClick={loading ? undefined : send}
          disabled={loading}
        >
          {loading ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="h-6 w-6 animate-spin fill-blue-600 text-gray-200"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            <span>Pagar ${formatNumberWithCommas(props.amount, 2)} MXN</span>
          )}
        </button>
        <div>
          <div className="flex flex-col items-center">
            <span className="text-text-fourth">
              Transacciones realizadas vía:
            </span>
            <img src="/checkout/openpay.png" />
          </div>
          <div className="mt-8 flex justify-center">
            <img src="/checkout/cards1.png" className="max-w-full" />
          </div>
          <div className="flex justify-center">
            <img src="/checkout/cards2.png" className="max-w-full" />
          </div>
          <div className="mt-4 flex justify-center">
            <span className="flex items-center space-x-2 text-sm">
              <img src="/checkout/security.png" height={20} />
              <span className="text-center text-gray-500">
                Tus transacciones se realizan de forma segura <br /> con
                encriptación de 256 bits
              </span>
            </span>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default OpenPayCheckout
