import { Dialog } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const PACK_NAMES = {
  '100-pack': 'F100',
  '300-pack': 'F300',
  '500-pack': 'F500',
  '1000-pack': 'F1000',
  '2000-pack': 'F2000',
}

type DataPayroll = {
  created_at: Date
  total: number
}

export default function CapSlider() {
  const user = useAppSelector((state) => state.auth.user)
  const [modal, setModal] = useState(false)
  const [lastCycle, setLastCycle] = useState<Date | null>(null)
  const [dataPayroll, setDataPayroll] = useState<DataPayroll[] | null>([])

  useEffect(() => {
    if (user && user.membership) {
      getLastCycle()
    }
  }, [])

  useEffect(() => {
    if (user && lastCycle) {
      getPayrollAfterLastCycle()
    }
  }, [lastCycle])

  if (
    !user ||
    user.membership_cap_current === undefined ||
    user.membership_cap_limit === undefined
  ) {
    return null
  }

  const currentCap = user.membership_cap_current
  const capLimit = user.membership_cap_limit

  const percentage = (currentCap / capLimit) * 100

  const capBackgroundColor = percentage >= 80 ? 'bg-red-500' : 'bg-indigo-400'

  const getLastCycle = async () => {
    let startsAt = null
    if (user.uid && user.membership) {
      const q = query(
        collection(db, 'users', user.uid, 'cycles'),
        where('type', '==', user.membership),
        orderBy('created_at', 'desc')
      )
      const qSnapshot = await getDocs(q)
      if (!qSnapshot.empty) {
        startsAt = qSnapshot.docs[0].data().created_at.toDate()
      }
    }
    setLastCycle(startsAt)
  }

  const getPayrollAfterLastCycle = async () => {
    const data = []
    if (user.uid && lastCycle) {
      const q = query(
        collection(db, 'users', user.uid, 'payroll'),
        where('created_at', '>=', lastCycle),
        orderBy('created_at', 'desc')
      )
      const qSnapshot = await getDocs(q)
      for (const docu of qSnapshot.docs) {
        data.push({
          created_at: docu.data().created_at.toDate(),
          total: docu.data().total,
        })
      }
    }
    setDataPayroll(data)
  }

  return (
    <div>
      <div
        className="card p-4  card-border bg-slate-100 rounded-[10px] flex flex-col hover:cursor-pointer hover:shadow-lg"
        onClick={() => setModal(true)}
      >
        {user.membership && typeof user.membership == 'string' && (
          <span className="mx-auto font-bold text-xl uppercase">
            {PACK_NAMES[user.membership]}
          </span>
        )}
        <div className="w-full bg-white h-[30px] rounded-full my-4 mx-auto">
          <div
            style={{ minWidth: '80px', width: `${percentage}%` }}
            className={`rounded-full h-[30px] flex text-center justify-center text-white ${capBackgroundColor}`}
          >
            <span className="font-bold pt-1">
              {user.membership_cap_current.toFixed(2)}
            </span>
          </div>
          <div className="justify-between flex font-bold mt-1">
            <span className="text-left">0</span>
            <span className="text-right">CAP {user.membership_cap_limit}</span>
          </div>
        </div>
      </div>
      <Dialog isOpen={modal} onClose={() => setModal(false)}>
        <p className="text-2xl font-semibold text-center">Historial</p>
        <p className="font-semibold">
          Fecha de adquisición de la franquicia:{' '}
          <span className="font-normal">
            {lastCycle ? lastCycle.toLocaleDateString() : 'No hay registro'}
          </span>
        </p>
        {lastCycle &&
          (dataPayroll && dataPayroll.length > 0 ? (
            <>
              <p className="font-semibold">Pagos registrados:</p>
              {dataPayroll.map((data, i) => (
                <div key={i}>
                  <p className="font-semibold">
                    {data.created_at.toLocaleDateString()} {'=>'}{' '}
                    <span className="font-normal">
                      ${data.total.toFixed(2)}
                    </span>
                  </p>
                </div>
              ))}
            </>
          ) : (
            'Aún no hay registros de pago'
          ))}
      </Dialog>
    </div>
  )
}
