import { useEffect, useState } from 'react'
import FounderMembership from './founder'
import Membership from './membership'
import { doc, onSnapshot } from 'firebase/firestore'
import { useAppSelector } from '@/store'
import { db } from '@/configs/firebaseConfig'
import { Memberships } from './methods'
import { Dialog } from '@/components/ui'
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'
import Franchise from './Franchise'
import Participation from './Participation'

const PayMembership = () => {
  const [transactionStatus, setTransactionStatus] = useState<
    'failed' | 'success' | 'pending' | null
  >(null)
  const user = useAppSelector((state) => state.auth.user)

  console.log(user)

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('transaction')) {
      setTransactionStatus('pending')
      console.log('esperando respuesta de openpay')
      const unsubscribe = onSnapshot(doc(db, `users/${user.uid}`), (snap) => {
        const payment_link = snap.get('payment_link')
        const membership = Object.keys(payment_link)[0] as Memberships
        if (snap.get(`payment_link.${membership}.status`) != 'pending') {
          setTransactionStatus(snap.get(`payment_link.${membership}.status`))
          unsubscribe()
        }
      })
      return () => {
        unsubscribe()
      }
    }
  }, [])

  return (
    <div className="flex flex-col gap-4 h-full">
      <Dialog
        isOpen={transactionStatus !== null}
        onClose={() => {
          if (transactionStatus !== 'pending') {
            setTransactionStatus(null)
          }
        }}
      >
        {transactionStatus == 'pending' && (
          <div>
            <span className="text-blue-500">
              Confirmando tu transacción, espere...
            </span>
          </div>
        )}
        {transactionStatus == 'success' && (
          <div className="text-green-500 flex items-center space-x-4">
            <FaCheckCircle size={24} />
            <span>Transacción completada con éxito</span>
          </div>
        )}
        {transactionStatus == 'failed' && (
          <div className="text-red-500 flex items-center space-x-4">
            <FaTimesCircle size={24} />
            <span>Transacción rechazada</span>
          </div>
        )}
      </Dialog>

      {/* <div className="flex items-center space-x-4">
        <img
          src="/img/logo3/Logo-Empower-It-Up-Black.png"
          height={100}
          className="h-[40px] w-min"
        />
        <span>(PRODUCTOS)</span>
      </div>
      <div>
        Dirección de Correo Electrónico : admin@empoweritup.com
        <br />
        Dirección: Benito Juarez 47bis Manzanillo Colima, México
        <br />
        Télefono: +5213148726886
      </div> */}
      {/* <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">Membresias y Franquicias</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/img/memberships/alive-pack.png"
          name={'alive-pack'}
          display_name="Alive Pack"
          month_price={129}
        />
        <Membership
          image="/img/memberships/freedom-pack.png"
          name="freedom-pack"
          display_name="Freedom Pack"
          month_price={479}
        />
        <Membership
          image="/img/memberships/business-pack.png"
          name="business-pack"
          display_name="Business Pack"
          days_label="Trimestral"
          days={90}
          month_price={1289}
        />
      </div> */}
      <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">Franquicias Manuales</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        {/* <Franchise
          image="/img/Franchises/49-pack.png"
          name="49-pack"
          display_name="F49"
          month_price={100}
          binary_points={0}
          range_points={0}
          bir={0}
          binary_percent={10}
          mentor_bonus={10}
          cap={0}
          credits={0}
        /> */}
        <Franchise
          image="/img/Franchises/100-pack.png"
          name="100-pack"
          display_name="F100"
          month_price={100}
          binary_points={50}
          range_points={100}
          bir={15}
          binary_percent={10}
          mentor_bonus={10}
          cap={300}
          credits={100}
        />
        <Franchise
          image="/img/Franchises/300-pack.png"
          name="300-pack"
          display_name="F300"
          month_price={300}
          binary_points={150}
          range_points={300}
          bir={15}
          binary_percent={10}
          mentor_bonus={15}
          cap={1000}
          credits={300}
        />
        <Franchise
          image="/img/Franchises/500-pack.png"
          name="500-pack"
          display_name="F500"
          month_price={500}
          binary_points={250}
          range_points={500}
          bir={20}
          binary_percent={10}
          mentor_bonus={15}
          cap={2000}
          credits={500}
        />
        <Franchise
          image="/img/Franchises/1000-pack.png"
          name="1000-pack"
          display_name="F1000"
          month_price={1000}
          binary_points={500}
          range_points={1000}
          bir={20}
          binary_percent={15}
          mentor_bonus={15}
          cap={5000}
          credits={1000}
        />
        <Franchise
          image="/img/Franchises/2000-pack.png"
          name="2000-pack"
          display_name="F2000"
          month_price={2000}
          binary_points={1000}
          range_points={2000}
          bir={20}
          binary_percent={15}
          mentor_bonus={20}
          cap={10000}
          credits={2000}
        />
        <Franchise
          image="/img/Franchises/3000-pack.png"
          name="3000-pack"
          display_name="F3000"
          month_price={3000}
          binary_points={300}
          range_points={1000}
          bir={20}
          binary_percent={15}
          mentor_bonus={20}
          cap={15000}
          credits={0}
        />
      </div>

      {/* <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">ACCESO CON SERVICIO DIGITAL</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/img/memberships/pro.png"
          name="pro"
          display_name="PRO"
          month_price={99}
          year_price={999}
        />
        <Membership
          image="/img/memberships/supreme.png"
          name="supreme"
          display_name="SUPREME"
          month_price={199}
          year_price={1999}
        />
      </div> */}

      {/* <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">ACCESO HÍBRIDO</span>
        <span>(PRODUCTO Y SERVICIO)</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        <Membership
          image="/img/memberships/vip-pack.png"
          name="vip-pack"
          display_name="Paquete VIP"
          month_price={228}
        />
        <Membership
          image="/img/memberships/elite-pack.png"
          name="elite-pack"
          display_name="Paquete Elite"
          month_price={678}
        />
      </div> */}

      <div className="flex items-center space-x-4">
        <span className="font-bold text-3xl">PARTICIPACIONES</span>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 gap-y-2 gap-x-4">
        {/* <FounderMembership
          image="/img/memberships/p300.png"
          name="founder-pack"
          display_name="Participación 3000"
          month_price={3000}
        /> */}
        <Participation
          image="/img/memberships/p300.png"
          name="3000-participation"
          display_name="Participación 3000"
          price={3000}
          binary_points={300}
          range_points={1000}
          bir={5}
        />
      </div>
    </div>
  )
}

export default PayMembership
