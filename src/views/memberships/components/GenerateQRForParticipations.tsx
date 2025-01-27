import { Button, Select } from '@/components/ui'
import { Coins, Memberships, PackCredits, Participations } from '../methods'
import { useState } from 'react'
import { SiCashapp } from 'react-icons/si'
import { Periods } from '../membership'

const GenerateQRForParticipations = ({
  type,
  loading,
  createPaymentLink,
  founder,
}: {
  type: Participations
  loading: boolean
  createPaymentLink: (type: Participations, coin: Coins) => void
  founder?: boolean
}) => {
  const [period, setPeriod] = useState<Periods>('monthly')
  const [showCoin, setShowCoin] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const _create = (coin: Coins) => {
    try {
      setDisabled(true)
      createPaymentLink(type, coin)
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
          {/* {import.meta.env.VITE_ENABLE_OPENPAY && (
            <Button
              className="h-max"
              disabled={disabled}
              onClick={() => _create('MXN')}
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
          )} */}
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

export default GenerateQRForParticipations
