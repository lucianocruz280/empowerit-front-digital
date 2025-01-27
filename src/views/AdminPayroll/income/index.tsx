import {
  collectionGroup,
  getDoc,
  getDocs,
  query,
  where,
  doc,
  orderBy,
  collection,
} from 'firebase/firestore'
import { useEffect, useMemo, useState } from 'react'

import { db } from '@/configs/firebaseConfig'
import dayjs from 'dayjs'
import { Loading } from '@/components/shared'

const IncomeReport = () => {
  const [loading, setLoading] = useState(true)
  const [income, setIncome] = useState<any[]>([])
  const [outgoing, setOutgoing] = useState<any[]>([])
  const [withdraws, setWithdraws] = useState<any[]>([])

  const getData = async () => {
    setLoading(true)
    const data = []
    const res = await getDocs(
      query(
        collectionGroup(db, `transactions`),
        where('data.event', '==', 'ADDRESS_COINS_TRANSACTION_CONFIRMED'),
        orderBy('created_at', 'desc')
      )
    )

    for (const _doc of res.docs) {
      data.push({
        ..._doc.data(),
        user: await getDoc(doc(db, `users/${_doc.ref.parent.parent?.id}`)).then(
          (r) => r.data()
        ),
      })
    }

    setLoading(false)
    setIncome(data)
  }

  const getOutgoint = async () => {
    const data = []
    const res = await getDocs(query(collection(db, `payroll`)))

    for (const _doc of res.docs) {
      data.push({
        amount: _doc.get('total_btc'),
      })
    }

    setOutgoing(data)
  }

  const getWithdraw = async () => {
    const data = []
    const res = await getDocs(query(collection(db, `withdraws`)))

    for (const _doc of res.docs) {
      data.push({
        amount: _doc.get('amount'),
      })
    }

    setWithdraws(data)
  }

  useEffect(() => {
    getData()
    getOutgoint()
    getWithdraw()
  }, [])

  const entradas = useMemo(
    () => income.reduce((a, b) => a + (Number(b.data.item.amount) || 0), 0),
    [income]
  )

  const salidas = useMemo(
    () =>
      Math.ceil(outgoing.reduce((a, b) => a + Number(b.amount), 0) * 100) / 100,
    [outgoing]
  )

  const withdraw_total = useMemo(
    () =>
      Math.ceil(withdraws.reduce((a, b) => a + Number(b.amount), 0) * 100) /
      100,
    [withdraws]
  )

  return (
    <div>
      <div className="mb-8 flex space-x-4">
        <div className="border border-solid rounded-md p-8 w-min">
          <span className="whitespace-nowrap">
            <span className="text-xl text-green-500">{entradas}</span>
            <span> LTC</span>
          </span>
          <br />
          <p className="text-sm whitespace-nowrap">
            Suma total <span>(entradas)</span>
          </p>
        </div>

        <div className="border border-solid rounded-md p-8 w-min">
          <span className="whitespace-nowrap">
            <span className="text-xl text-red-500">{salidas}</span>
            <span> LTC</span>
          </span>
          <br />
          <p className="text-sm whitespace-nowrap">
            Suma total <span>(pagos)</span>
          </p>
        </div>

        <div className="border border-solid rounded-md p-8 w-min">
          <span className="whitespace-nowrap">
            <span className="text-xl text-red-500">{withdraw_total}</span>
            <span> LTC</span>
          </span>
          <br />
          <p className="text-sm whitespace-nowrap">
            Suma total <span>(retiros)</span>
          </p>
        </div>

        <div className="border border-solid rounded-md p-8 w-min">
          <span className="whitespace-nowrap">
            <span className="text-xl">
              {Math.floor((entradas - salidas - withdraw_total) * 100) / 100}
            </span>
            <span> LTC</span>
          </span>
          <br />
          <p className="text-sm whitespace-nowrap">
            Balance <span>(aprox)</span>
          </p>
        </div>
      </div>
      <table className="w-full">
        <tr>
          <th className="text-left">Usuario</th>
          <th className="text-left">Wallet</th>
          <th className="text-right">Amount</th>
          <th>Currency</th>
          <th>Dirección</th>
          <th className="text-left">Fecha</th>
        </tr>
        {loading && (
          <tr>
            <th colSpan={6} className="text-center">
              <span className="text-xl">cargando...</span>
            </th>
          </tr>
        )}
        {income.map((row) => (
          <tr key={row.id}>
            <td className="text-left">{row.user.email}</td>
            <td className="text-left">{row.data.item.address}</td>
            <td className="text-right">{row.data.item.amount}</td>
            <td className="text-center">{row.data.item.unit}</td>
            <td className="text-center text-green-600">Entrante</td>
            <td className="text-left">
              {dayjs(row.created_at.seconds * 1000).format(
                'YYYY-MM-DD HH:mm:ss'
              )}
            </td>
          </tr>
        ))}
      </table>
    </div>
  )
}

export default IncomeReport
