import { Button, Select } from '@/components/ui'
import { Coins, Memberships, Method, PackCredits } from '../methods'
import { useState } from 'react'
import { SiCashapp } from 'react-icons/si'
import { Periods } from '../membership'
import { useAppSelector } from '@/store'

const GenerateQRForCredits = ({
  type,
  loading,
  createPaymentLink,
  founder,
}: {
  type: PackCredits
  loading: boolean
  createPaymentLink: (type: PackCredits, coin: Coins, method: Method, email: string) => void
  founder?: boolean
}) => {
  const [period, setPeriod] = useState<Periods>('monthly')
  const [showCoin, setShowCoin] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const _create = (coin: Coins, method: Method) => {
    try {
      setDisabled(true)
      createPaymentLink(type, coin, method, user.email as string)
    } catch (err) {
      console.error(err)
    } finally {
      setDisabled
    }
  }

  const selectCoin = () => {
    setShowCoin(true)
  }

  if (showCoin) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          {import.meta.env.VITE_ENABLE_OPENPAY && (
            <Button
              className="h-max"
              disabled={disabled}
              onClick={() => _create('MXN', 'Fiat')}
            >
              <div className="flex flex-col items-center space-y-4">
                <SiCashapp
                  height={50}
                  width={50}
                  className="h-[50px] w-[50px]"
                />
                <span>Fiat (MXN)</span>
              </div>
            </Button>
          )}

          {import.meta.env.VITE_ENABLE_OPENPAY && (
            <Button
              className="h-max"
              disabled={disabled}
              onClick={() => _create('MXN', 'Coinpayments')}
            >
              <div className="flex flex-col items-center space-y-4">
                <img src='/img/insignias/USDT.svg' className='w-[50px] h-[50px]' />
                <span>Tether (USDT)</span>
              </div>
            </Button>
          )}
          {/* <Button
            className="h-max"
            disabled={disabled}
            onClick={() => _create('LTC')}
          >
            <div className="flex flex-col items-center space-y-4">
              <img
                src="/img/ltc-logo.svg"
                height={50}
                width={50}
                className="h-[50px] w-[50px]"
              />
              <span>Litecoin (LTC)</span>
            </div>
          </Button> */}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Button loading={loading} onClick={selectCoin}>
        Generar QR de Pago
      </Button>
    </div>
  )
}

export default GenerateQRForCredits
