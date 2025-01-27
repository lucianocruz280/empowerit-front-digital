import {
  Button,
  Input,
  Notification,
  Radio,
  Switcher,
  toast,
} from '@/components/ui'
import { useState } from 'react'

const AdminWithdraw = () => {
  const [wallet, setWallet] = useState('')
  const [amount, setAmount] = useState('')
  const [blockchain, setBlockchain] = useState('litecoin')

  const enter = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/admin/withdraw`, {
      body: JSON.stringify({
        blockchain,
        address: wallet,
        amount,
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setWallet('')
    setAmount('')

    toast.push(
      <Notification title="Aprobar transacción en cryptoapis" type="success" />,
      {
        placement: 'top-center',
      }
    )
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="w-full md:w-1/2 flex flex-col space-y-4 items-end">
        <div className="flex space-x-4">
          <Radio
            name="blockchain"
            checked={blockchain == 'bitcoin'}
            onChange={(e) => setBlockchain('bitcoin')}
          >
            Bitcoin
          </Radio>
          <Radio
            defaultChecked
            name="blockchain"
            checked={blockchain == 'litecoin'}
            onChange={(e) => setBlockchain('litecoin')}
          >
            Litecoin
          </Radio>
        </div>
        <Input
          placeholder="Wallet"
          onChange={(e) => setWallet(e.target.value)}
        />
        <Input
          placeholder={`Cantidad (${blockchain})`}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div>
          <Button color="primary" onClick={enter}>
            Retirar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdminWithdraw
