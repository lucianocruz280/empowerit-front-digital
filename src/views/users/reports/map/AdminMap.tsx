import Map from '../components/Map'

const AdminMap = () => {
  return <Map url={`${import.meta.env.VITE_API_URL}/users/mx-users`} />
}
export default AdminMap
