import { useAppSelector } from '@/store'
import Map from '../components/Map'

const SanguineMap = () => {
  const user = useAppSelector((state) => state.auth.user)
  const userId = user?.uid

  return (
    <Map
      url={`${import.meta.env.VITE_API_URL}/users/mx-users-sanguine/${userId}`}
    />
  )
}
export default SanguineMap
