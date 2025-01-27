import { BsTrophy } from 'react-icons/bs'
import {
  onSnapshot,
  doc,
  getDocs,
  query,
  collection,
  orderBy,
  limit,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store'
import { db } from '@/configs/firebaseConfig'
import { FaPeopleArrows, FaCar } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { Dialog, Spinner } from '@/components/ui'
import dayjs from 'dayjs'
import useUserModalStore from '@/zustand/userModal'

import { FaRegMoneyBill1, FaNetworkWired, FaPeopleLine } from 'react-icons/fa6'
import { RiPresentationFill } from 'react-icons/ri'
import { formatNumberWithCommas } from '@/utils/format'
import { usersIndex } from '@/algolia'

const Rank = () => {
  const userModal = useUserModalStore((state) => state)
  const [data, setData] = useState<any>({})
  const user = useAppSelector((state) => state.auth.user)
  const navigate = useNavigate()
  const [rank, setRank] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastPayroll, setLastPayroll] = useState<any>(null)

  const [payrollDetails, setPayrollDetails] = useState<any[]>([])
  const [binaryPoints, setBinaryPoints] = useState<any[]>([])
  const [modalDetails, setModalDetails] = useState<any[]>([])
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [isOpenModalBinary, setIsOpenModalBinary] = useState(false)
  const [isTopDollarsDisplayed, setIsTopDollarsDisplayed] = useState(false)
  const [totalAutomaticFranchisesProfits, setTotalAutomaticFranchisesProfits] =
    useState<number>(0)

  useEffect(() => {
    if (user.uid) {
      const unsub1 = onSnapshot(doc(db, 'users/' + user.uid), (snap) => {
        setData(snap.data())
      })
      return () => {
        unsub1()
      }
    }
  }, [user.uid])

  useEffect(() => {
    displayTopDollars()
  }, [data])
  useEffect(() => {
    if (typeof user.max_rank == 'string') {
      getRank(user.max_rank)
    } else {
      getRank('none')
    }
  }, [user.max_rank])

  useEffect(() => {
    if (user.uid) {
      if (user.uid != '7iRezG7E6vRq7OQywQN3WawSa872') {
        getDocs(collection(db, 'users/' + user.uid, '/left-points')).then(
          (snap) => {
            setBinaryPoints((data) => [
              ...data,
              ...snap.docs.map((r) => ({ side: 'left', ...r.data() })),
            ])
          }
        )
      }
      getDocs(collection(db, 'users/' + user.uid, '/right-points')).then(
        (snap) => {
          setBinaryPoints((data) => [
            ...data,
            ...snap.docs.map((r) => ({ side: 'right', ...r.data() })),
          ])
        }
      )
    }
  }, [user.uid])

  useEffect(() => {
    const getAutomaticFranchisesTotalProfits = () => {
      const automaticFranchisesRef = collection(
        db,
        `users/${user.uid}/automatic-franchises`
      )
      const unsubscribe = onSnapshot(
        automaticFranchisesRef,
        (snapshot) => {
          let totalProfit = 0
          snapshot.forEach((docu) => {
            const profit = Number(docu.data().automatic_franchise_cap_current)
            totalProfit += profit
          })
          setTotalAutomaticFranchisesProfits(totalProfit)
        },
        (error) => {
          console.log(
            'Error en la función getAutomaticFranchisesTotalProfits',
            error
          )
        }
      )
      return () => unsubscribe()
    }

    if (user && user.uid) {
      if (!user.has_automatic_franchises) {
        setTotalAutomaticFranchisesProfits(0)
      } else {
        getAutomaticFranchisesTotalProfits()
      }
    }
  }, [user])

  useEffect(() => {
    if (user.uid) {
      getDocs(
        query(
          collection(db, 'users/' + user.uid + '/payroll'),
          orderBy('created_at', 'desc'),
          limit(1)
        )
      ).then((snap) => {
        if (!snap.empty) setLastPayroll(snap.docs[0].data())
      })
    }
  }, [user.uid])

  useEffect(() => {
    const _query = lastPayroll
      ? query(
          collection(db, 'users/' + user.uid + '/profits_details'),
          where('created_at', '>=', lastPayroll.created_at),
          orderBy('created_at', 'asc')
        )
      : query(
          collection(db, 'users/' + user.uid + '/profits_details'),
          orderBy('created_at', 'asc')
        )
    getDocs(_query).then((snap) => {
      setPayrollDetails(() => snap.docs.map((d) => d.data()))
    })
  }, [lastPayroll])

  const getRank = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ranks/getRankKey/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id_user: user.uid,
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      setRank(data)
      setLoading(false)
    } catch (error) {
      setLoading(false)

      return { status: 'error', error }
    }
  }

  const displayTopDollars = () => {
    if (data && data.created_at) {
      const userCreatedAt = data.created_at?.toDate()
      const validTopDollarsDate = new Date('2023-12-05T00:00:00')
      setIsTopDollarsDisplayed(userCreatedAt >= validTopDollarsDate)
    }
  }

  const openDetails = (...types: string[]) => {
    setModalDetails(payrollDetails.filter((r) => types.includes(r.type)))
    setIsOpenModal(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
          onClick={() => navigate('/rank')}
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col ">
              <p>Rango Máximo Alcanzado</p>
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : (
                <p className="text-[24px] font-bold">{rank?.display || ''}</p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              {rank?.key && rank?.key != 'none' ? (
                <img
                  src={`/img/insignias/${rank?.key}.png`}
                  width={40}
                  height={40}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Ganancias obtenidas</p>
              <p className="text-[24px] font-bold">
                ${data?.profits?.toFixed(2) || 0}{' '}
                <span className="text-[20px]">USD</span>
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <BsTrophy />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Miembros Directos</p>
              <p className="text-[24px] font-bold">
                {data?.count_direct_people || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Miembros organización</p>
              <p className="text-[24px] font-bold">
                {data?.count_underline_people || 0}
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <FaPeopleArrows />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        <Card onClick={() => openDetails('bond_quick_start', 'bond_founder')}>
          <div className="flex space-x-2 items-center">
            <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
              <FaRegMoneyBill1 size={30} className="text-yellow-600" />
            </div>
            <span className="text-lg font-medium">Bono Inicio Rápido</span>
          </div>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
            <span className="font-bold text-right">
              ${' '}
              <span className="text-3xl">
                {(data?.bond_quick_start ?? 0) + (data?.bond_founder ?? 0)}
              </span>{' '}
              USD
            </span>
          </div>
        </Card>

        <Card onClick={() => openDetails('bond_binary')}>
          <div className="flex space-x-2 items-center">
            <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
              <FaNetworkWired size={30} className="text-gray-700" />
            </div>
            <span className="text-lg font-medium">Bono Binario</span>
          </div>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
            <span className="font-bold text-right">
              <span className="text-3xl">{rank?.binary_percent * 100}</span> %
            </span>
          </div>
        </Card>

        <Card onClick={() => openDetails('bond_mentor')}>
          <div className="flex space-x-2 items-center">
            <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
              <FaPeopleLine size={30} className="text-green-700" />
            </div>
            <span className="text-lg font-medium">Bono Mentor</span>
          </div>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
            <span className="font-bold text-right">
              <span className="text-3xl">{rank?.mentor_percent * 100}</span> %
            </span>
          </div>
        </Card>

        {/* <Card onClick={() => openDetails('bond_car')}>
          <div className="flex space-x-2 items-center">
            <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
              <FaCar size={30} className="text-red-500" />
            </div>
            <span className="text-lg font-medium">Bono Auto</span>
          </div>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
            <span className="font-bold text-right">
              $ <span className="text-3xl">{data?.bond_car ?? 0}</span> USD
            </span>
          </div>
        </Card> */}
        <Card>
          <div className="flex space-x-2 items-center">
            <div className="rounded-full h-[40px] w-[40px] p-2 flex items-center justify-center bg-gray-300">
              <RiPresentationFill size={30} className="text-purple-500" />
            </div>
            <span className="text-lg font-medium">Mis Franq. Aut.</span>
          </div>
          <div className="grid grid-cols-[max-content_1fr] gap-x-4 pl-2 text-xl">
            <span className="font-bold text-right">
              ${' '}
              <span className="text-3xl">
                {formatNumberWithCommas(
                  totalAutomaticFranchisesProfits ?? 0,
                  2
                )}
              </span>{' '}
              USD
            </span>
          </div>
        </Card>
      </div>

      <Dialog
        isOpen={isOpenModal}
        width={700}
        onClose={() => setIsOpenModal(false)}
      >
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Concepto</th>
                <th className="text-left">Usuario</th>
                <th className="text-right">USD</th>
                <th className="text-right">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {modalDetails.map((r, idx) => (
                <tr key={idx}>
                  <td>{r.description}</td>
                  <td>
                    <span
                      className="text-blue-500 underline hover:cursor-pointer"
                      onClick={() => userModal.openModal(r.id_user)}
                    >
                      {r.user_name}
                    </span>
                  </td>
                  <td className="text-right">{r.amount}</td>
                  <td className="text-right">
                    {r.created_at.seconds
                      ? dayjs(r.created_at.seconds * 1000).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )
                      : null}
                  </td>
                </tr>
              ))}
              {modalDetails.length == 0 && (
                <tr>
                  <td colSpan={4} className="text-left">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Dialog>

      <Dialog
        isOpen={isOpenModalBinary}
        width={700}
        onClose={() => setIsOpenModalBinary(false)}
      >
        <div className="p-4 max-h-[50vh] overflow-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Usuario</th>
                <th className="text-left">Lado</th>
                <th className="text-right">Puntos</th>
                <th className="text-right">Expiran</th>
              </tr>
            </thead>
            <tbody>
              {binaryPoints.map((r, idx) => (
                <tr key={idx}>
                  <td>
                    <span
                      className="text-blue-500 underline hover:cursor-pointer"
                      onClick={() => {
                        userModal.openModal(r.user_id)
                        setIsOpenModalBinary(false)
                      }}
                    >
                      {r.name}
                    </span>
                  </td>
                  <td>{r.side}</td>
                  <td className="text-right">{r.points}</td>
                  {/* <td className="text-right">
                    {r.expires_at.seconds
                      ? dayjs(r.expires_at.seconds * 1000).format(
                          'DD/MM/YYYY HH:mm:ss'
                        )
                      : null}
                  </td> */}
                </tr>
              ))}
              {binaryPoints.length == 0 && (
                <tr>
                  <td colSpan={4} className="text-left">
                    No hay datos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Dialog>
    </>
  )
}

const Card = ({ children, onClick }: any) => {
  return (
    <div
      className="bg-slate-100 rounded-[10px] p-4 card-border cursor-pointer user-select-none hover:shadow-lg flex flex-col space-y-2"
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Rank
