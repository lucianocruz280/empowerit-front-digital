import { useAppSelector } from '@/store'
import { FaCheck } from 'react-icons/fa'

const ConfirmMessage = () => {
  const user = useAppSelector((state) => state.auth.user)
  return (
    <div className="flex flex-col justify-center items-center">
      <span>{user?.email}</span>
      <span>Se está confirmando tu transacción</span>
      <span>Esto puede tardar varios minutos</span>
      <div className="bg-green-400 rounded-full p-4 w-min mt-8">
        <FaCheck fontSize={40} />
      </div>
      <span className="mt-8">Tu membresia quedará activada pronto</span>
    </div>
  )
}
export default ConfirmMessage
