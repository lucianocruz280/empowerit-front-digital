import { useAppSelector } from '@/store'
import { FaCheck, FaTimes } from 'react-icons/fa'

const Summary = () => {
  const user = useAppSelector((state) => state.auth.user)

  const hasBitcoinWallet = Boolean(user.wallet_litecoin)
  const hasRFC = Boolean(user.rfc)
  const hasBankAccount = Boolean(user.bank_account)

  return (
    <>
      <div className="flex flex-col w-full bg-slate-100 p-4 rounded-[10px]">
        <div className="flex justify-between items-center mb-4">
          <h5>Resumen Usuario</h5>
        </div>
        <div className="flex items-center mb-2">
          {hasBitcoinWallet ? (
            <FaCheck className="text-green-600" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
          <div className="flex flex-col ml-4">
            <span className="text-[16px] font-bold">Wallet Litecoin</span>
            {hasBitcoinWallet ? (
              <p className="text-green-600">Capturada</p>
            ) : (
              <a href="/billing">
                <p className="text-red-500">Pendiente</p>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center mb-2">
          {hasRFC ? (
            <FaCheck className="text-green-600" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
          <div className="flex flex-col ml-4">
            <span className="text-[16px] font-bold">RFC</span>
            {hasRFC ? (
              <p className="text-green-600">Capturada</p>
            ) : (
              <a href="/billing">
                <p className="text-red-500">Pendiente</p>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center mb-2">
          {hasBankAccount ? (
            <FaCheck className="text-green-600" />
          ) : (
            <FaTimes className="text-red-500" />
          )}
          <div className="flex flex-col ml-4">
            <span className="text-[16px] font-bold">Cuenta de Banco</span>
            {hasBankAccount ? (
              <p className="text-green-600">Capturada</p>
            ) : (
              <a href="/billing">
                <p className="text-red-500">Pendiente</p>
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Summary
