import { useState, useEffect } from 'react'
import ReactECharts from 'echarts-for-react'
import { useAppSelector } from '@/store'
import { Button, Spinner, Table } from '@/components/ui'
import { IProfitsHistory } from './Rank.definition'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import {
  getDocs,
  query,
  collection,
  orderBy,
  where,
  Timestamp,
  doc,
  getDoc,
} from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import classNames from 'classnames'
import { ranksOrder, ranksPoints, ranks_object } from './ranks_object'
import THead from '@/components/ui/Table/THead'
import TBody from '@/components/ui/Table/TBody'
import Tr from '@/components/ui/Table/Tr'
import Th from '@/components/ui/Table/Th'
import Td from '@/components/ui/Table/Td'

const dayweeks = [
  'Lunes',
  'Martes',
  'Miercoles',
  'Jueves',
  'Viernes',
  'Sabado',
  'Domingo',
]

const ranks_name = {
    none: 'Ninguno',
    initial_builder: 'Initial Builder',
    star_builder: 'Star Builder',
    advanced_builder: 'Advance Builder',
    master_2000: 'Master 2000',
    master_2500: 'Master 2500',
    master_3500: 'Master 3500',
    regional_director: 'Regional Director',
    national_director: 'National Director',
    international_director: 'International Director',
    top_diamond: 'TOP Diamond',
    top_1: 'TOP 1%',
    top_legend: 'TOP LENGEND'
}

dayjs.extend(utc)
dayjs.extend(weekday)

const getWeeks = () => {
  const sunday_this_week = dayjs()
    .utcOffset(-6)
    .startOf('week')
    .hour(23)
    .minute(59)
  const sunday_2_weeks = sunday_this_week.subtract(1, 'week')
  const sunday_3_weeks = sunday_this_week.subtract(2, 'week')
  const sunday_4_weeks = sunday_this_week.subtract(3, 'week')
  const sunday_5_weeks = sunday_this_week.subtract(4, 'week')
  const sunday_6_weeks = sunday_this_week.subtract(5, 'week')

  const dates = [
    [sunday_6_weeks, sunday_6_weeks.add(7, 'days')],
    [sunday_5_weeks, sunday_5_weeks.add(7, 'days')],
    [sunday_4_weeks, sunday_4_weeks.add(7, 'days')],
    [sunday_3_weeks, sunday_3_weeks.add(7, 'days')],
    [sunday_2_weeks, sunday_2_weeks.add(7, 'days')],
    [sunday_this_week, sunday_this_week.add(7, 'days')],
  ]

  return {
    array: dates,
    object: {
      'actual (NA)': dates[5],
      '1ra': dates[4],
      '2da': dates[3],
      '3ra': dates[2],
      '4ta': dates[1],
      '5ta (NA)': dates[0],
    },
  }
}

const Rank = () => {
  const user: any = useAppSelector((state) => state.auth.user)
  const [rank, setRank] = useState<any>({})
  const [rankKey, setRankKey] = useState<any>({})
  const [nextRank, setNextRank] = useState<any>(null)
  const [socios, setSocios] = useState<any>({})
  const [lastMonthSocios, setLastMonthSocios] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingRank, setLoadingRank] = useState<boolean>(true)
  const [isLoadingPoints, setIsLoadingPoints] = useState<boolean>(false)
  const [isLoadingPointsLastMonth, setIsLoadingPointsLastMonth] =
    useState<boolean>(false)
  const [leftPeopleData, setLeftPeopleData] = useState<any[]>([])
  const [rightPeopleData, setRightPeopleData] = useState<any[]>([])
  const [isLoadingTableData, setIsLoadingTableData] = useState(false)
  const [points, setPoints] = useState({
    right_points: 0,
    left_points: 0,
  })
  const [lastMonthPoints, setLastMonthPoints] = useState({
    right_points: 0,
    left_points: 0,
  })

  useEffect(() => {
    if (rank) {
      getDocumentsCreatedThisMonth(user.uid)
      getDocumentsCreatedLastMonth()
      getPeople()
    }
  }, [rank, nextRank, user.uid])

  useEffect(() => {
    if (user.uid) {
      getRank(user.uid)
      getCurrentRank(user.rank)
    }
  }, [user.uid])

  const getCurrentRank = async (rank_key: string) => {
    setLoadingRank(true)
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ranks/getRankKey/${rank_key}`,
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
      setRankKey(data)
      setLoadingRank(false)
    } catch (error) {
      setLoadingRank(false)
      return { status: 'error', error }
    }
  }

  /* UseEffect para los puntos de este mes */
  useEffect(() => {
    if (
      !isLoadingPoints &&
      (points.left_points || points.right_points) &&
      rank.rank &&
      nextRank
    ) {
      const options = {
        title: {
          text: 'Puntos del mes actual',
        },
        xAxis: {
          type: 'category',
          data: ['Izquierda', 'Derecha'],
        },
        yAxis: {
          type: 'value',
          min: 0,
          max:
            points.left_points > points.right_points
              ? points.left_points * 1.2
              : points.right_points * 1.2,
        },
        series: [
          {
            data: [points.left_points, points.right_points],
            type: 'bar',
            name: 'Puntos',
            label: {
              show: true,
            },
            markLine: {
              data: [
                {
                  name: nextRank?.key,
                  yAxis: nextRank?.points,
                  label: {
                    position: 'middle',
                    formatter: () => `${nextRank.display}`,
                    fontWeight: 'bold',
                  },
                },
              ],
            },
          },
        ],
      }
      setSocios(options)
    }
  }, [points, isLoadingPoints, rank, rankKey, nextRank])

  /* UseEffect para los puntos del mes pasado */
  useEffect(() => {
    if (
      !isLoadingPointsLastMonth &&
      (lastMonthPoints.left_points || lastMonthPoints.right_points) &&
      rank.rank &&
      nextRank
    ) {
      const options = {
        title: {
          text: 'Puntos del mes anterior',
        },
        xAxis: {
          type: 'category',
          data: ['Izquierda', 'Derecha'],
        },
        yAxis: {
          type: 'value',
          min: 0,
          max:
            lastMonthPoints.left_points > lastMonthPoints.right_points
              ? lastMonthPoints.left_points * 1.2
              : lastMonthPoints.right_points * 1.2,
        },
        series: [
          {
            data: [lastMonthPoints.left_points, lastMonthPoints.right_points],
            type: 'bar',
            name: 'Puntos',
            label: {
              show: true,
            },
          },
        ],
      }
      setLastMonthSocios(options)
    }
  }, [lastMonthPoints, isLoadingPointsLastMonth, rank, rankKey, nextRank])

  useEffect(() => {
    if (rank.rank) {
      const next_rank = ranks_object[ranksOrder[rank.order + 1]]
      const next_rank_points = ranksPoints[next_rank?.key]
      setNextRank({
        ...next_rank,
        points: next_rank_points,
      })
    }
  }, [rankKey, rank])

  const getRank = async (id: string) => {
    setLoading(true)
    try {
      if (user.is_admin) {
        setRank({
          display: 'Top Legend',
          key: 'top_legend',
          next_rank: {
            display: 'Rango sin desbloquear',
            key: '?',
            order: 3,
          },
          totalUSD: {
            totalUSD: 78650,
            total_week: [25000, 18500, 19600, 15500],
          },
          user_id: user.id,
          user: user.id,
          left_week: [6, 7, 7, 5],
          right_week: [6, 8, 7, 6],
          interna: [80, 90, 89, 85],
          externa: [145, 130, 128, 160],
          firmas_directas: [12, 15, 14, 11],
        })
        setLoading(false)
        return
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/ranks/getRank/${user.uid}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
  const endMonth = dayjs().endOf('month')

  async function getDocumentsCreatedThisMonth(user_id: string) {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    setIsLoadingPoints(true)

    try {
      const firstDayOfMonthTimestamp = Timestamp.fromDate(firstDayOfMonth)
      const q = query(
        collection(db, `users/${user_id}/points`),
        where('created_at', '>=', firstDayOfMonthTimestamp),
        orderBy('created_at', 'desc')
      )
      const thisMonthRangePoints = await getDocs(q)

      // Procesa los documentos
      const left_points: any = []
      const right_points: any = []
      let rightPointsTotal = 0
      let leftPointsTotal = 0

      for (const doc of thisMonthRangePoints.docs) {
        if (doc.data().side == 'right') {
          right_points.push({ id: doc.id, ...doc.data() })
          rightPointsTotal += doc.data()?.points
        }
        if (doc.data().side == 'left') {
          left_points.push({ id: doc.id, ...doc.data() })
          leftPointsTotal += doc.data()?.points
        }
      }

      if (user_id == user.uid) {
        setPoints({
          right_points: rightPointsTotal,
          left_points: leftPointsTotal,
        })
      }
      return rightPointsTotal >= leftPointsTotal
        ? leftPointsTotal
        : rightPointsTotal
    } catch (error) {
      console.error('Error obteniendo documentos: ', error)
    } finally {
      setIsLoadingPoints(false)
    }
  }

  async function getDocumentsCreatedLastMonth() {
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    )

    setIsLoadingPointsLastMonth(true)

    try {
      const firstDayOfMonthTimestamp = Timestamp.fromDate(firstDayOfMonth)
      const q = query(
        collection(db, `users/${user.uid}/points`),
        where('created_at', '<=', firstDayOfMonthTimestamp),
        where('created_at', '>=', firstDayOfLastMonth),
        orderBy('created_at', 'desc')
      )
      const thisMonthRangePoints = await getDocs(q)

      // Procesa los documentos
      const left_points: any = []
      const right_points: any = []
      let rightPointsTotal = 0
      let leftPointsTotal = 0

      for (const doc of thisMonthRangePoints.docs) {
        if (doc.data().side == 'right') {
          right_points.push({ id: doc.id, ...doc.data() })
          rightPointsTotal += doc.data()?.points
        }
        if (doc.data().side == 'left') {
          left_points.push({ id: doc.id, ...doc.data() })
          leftPointsTotal += doc.data()?.points
        }
      }

      setLastMonthPoints({
        right_points: rightPointsTotal,
        left_points: leftPointsTotal,
      })
      return `Left points => ${leftPointsTotal}, Right Points => ${rightPointsTotal}`
    } catch (error) {
      console.error('Error obteniendo documentos: ', error)
    } finally {
      setIsLoadingPointsLastMonth(false)
    }
  }

  async function getPeople() {
    try {
      const leftPeopleSnapshots = await getDocs(
        collection(db, `users/${user.uid}/left-people`)
      )
      const rightPeopleSnapshots = await getDocs(
        collection(db, `users/${user.uid}/right-people`)
      )

      const leftPeopleDataPromises = leftPeopleSnapshots.docs.map(
        async (docs) => {
          const data = docs.data()
          const userRef = doc(db, `users`, data.user_id)
          const userSnap = await getDoc(userRef)
          let name = ''
          let rank = ''
          if (userSnap.exists()) {
            name = userSnap.data().name
            rank = userSnap.data().rank
          }
          const volumen = await getDocumentsCreatedThisMonth(
            docs.data().user_id
          )
          if (volumen && volumen > 0) {
            return { volumen, data, name, rank }
          }
          return null
        }
      )

      const rightPeopleDataPromises = rightPeopleSnapshots.docs.map(
        async (docs) => {
          const data = docs.data()
          const userRef = doc(db, `users`, data.user_id)
          const userSnap = await getDoc(userRef)
          let name = ''
          let rank = '' 
          if (userSnap.exists()) {
            ;(name = userSnap.data().name), (rank = userSnap.data().rank)
          }
          const volumen = await getDocumentsCreatedThisMonth(data.user_id)
          if (volumen && volumen > 0) {
            return { volumen, data, name, rank }
          }
          return null
        }
      )

      const leftPeopleDataResults = await Promise.all(leftPeopleDataPromises)
      const rightPeopleDataResults = await Promise.all(rightPeopleDataPromises)

      const leftPeopleData = leftPeopleDataResults
        .filter((item) => item !== null)
        .sort((a, b) => b.volumen - a.volumen)

      const rightPeopleData = rightPeopleDataResults
        .filter((item) => item !== null)
        .sort((a, b) => b.volumen - a.volumen)

      setLeftPeopleData(leftPeopleData)
      setRightPeopleData(rightPeopleData)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoadingTableData(true)
    }
  }

  return (
    <div className="flex flex-col w-full h-full space-y-10">
      <div className="flex w-full justify-between">
        <div>
          Corte: {dayweeks[endMonth.weekday()]} {endMonth.date()}{' '}
          {endMonth.format('MMMM')} 11:59 PM (CDMX)
        </div>
        <div>
          <a
            href="/img/ranks/calificacion_rangos.pdf"
            download="download"
            className="cursor-pointer underline text-blue-400 hidden"
          >
            ¿Guía de clasificación de rangos?
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4 w-full">
        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Rango actual</p>
              {loadingRank ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : (
                <p className="text-[24px] font-bold">{rankKey?.display}</p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rankKey?.key}.png`}
                className={classNames(rankKey?.key == 'none' && 'hidden')}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Rango calificado para el próximo corte</p>
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : rank.order == -1 ? (
                <p className="text-[24px] font-bold">Ninguno</p>
              ) : (
                <p className="text-[24px] font-bold">{rank.display}</p>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rank?.key}.png`}
                className={classNames(
                  (rank?.key == undefined || rank?.key == 'none') && 'hidden'
                )}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>

        <div
          className="card hover:shadow-lg transition duration-150 ease-in-out hover:dark:border-gray-400 card-border cursor-pointer user-select-none"
          role="presentation"
        >
          <div className="flex p-4 justify-between bg-slate-100 rounded-[10px] h-full">
            <div className="flex flex-col">
              <p>Siguiente rango al que puedes llegar</p>
              {loading ? (
                <Spinner className={`select-loading-indicatior`} size={40} />
              ) : rank.order == -1 ? (
                <p className="text-[24px] font-bold">Initial Builder</p>
              ) : (
                <p className="text-[24px] font-bold">{nextRank?.display}</p>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <img
                src={`/img/insignias/${rank?.next_rank?.key}.png`}
                className={classNames(
                  (rank?.next_rank == undefined || rank?.next_rank == 'none') &&
                    'hidden'
                )}
                width={40}
                height={40}
              />
            </div>
          </div>
        </div>
      </div>
      {/* <div>
        <p>
          Pierna interna: {user?.position == 'left' ? 'Derecha' : 'Izquierda'}
        </p>
        <p>
          Pierna externa: {user?.position == 'right' ? 'Derecha' : 'Izquierda'}
        </p>
      </div> */}
      <div className="flex flex-col-reverse xl:flex-row">
        <div className="flex flex-col gap-4 w-full lg:w-[500px] lg:min-w-[450px] xl:w-[600px] h-full">
          {isLoadingPointsLastMonth && (
            <Spinner className={`select-loading-indicatior`} size={40} />
          )}
          <p
            className={
              'text-[24px] font-bold ' + isLoadingPointsLastMonth
                ? ''
                : 'hidden'
            }
          >
            <ReactECharts option={lastMonthSocios} key="1" />
          </p>
        </div>
        <div className="flex flex-col gap-4 w-full lg:w-[500px] lg:min-w-[440px] xl:w-[600px] h-full">
          {isLoadingPoints && (
            <Spinner className={`select-loading-indicatior`} size={40} />
          )}
          <p
            className={
              'text-[24px] font-bold ' + isLoadingPoints ? '' : 'hidden'
            }
          >
            <ReactECharts option={socios} key="2" />
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <div className=" w-[45%] flex flex-col">
          <span className="text-lg font-semibold mb-5 text-center">
            Pierna izquierda (mes actual)
          </span>
          <Table>
            <THead>
              <Tr>
                <Th>Persona</Th>
                <Th>Volumen</Th>
                <Th>Rango</Th>
              </Tr>
            </THead>
            <TBody>
              {leftPeopleData &&
                rank &&
                nextRank &&
                rankKey &&
                leftPeopleData.slice(0, 5).map((doc, index) => (
                  <tr key={index}>
                    <td>{doc.name}</td>
                    <td>{doc.volumen}</td>
                    <td>{doc.rank}</td>
                  </tr>
                ))}
            </TBody>
          </Table>
        </div>
        <div className=" w-[45%] flex flex-col">
          <span className="text-lg font-semibold mb-5 text-center">
            Pierna Derecha (mes actual)
          </span>
          <Table>
            <THead>
              <Tr>
                <Th>Persona</Th>
                <Th>Volumen</Th>
                <Th>Rango</Th>
              </Tr>
            </THead>
            <TBody>
              {isLoadingTableData &&
                rightPeopleData &&
                rank &&
                nextRank &&
                rankKey &&
                rightPeopleData.slice(0, 5).map((doc, index) => (
                  <tr key={index}>
                    <td>{doc.name}</td>
                    <td>{doc.volumen}</td>
                    <td>{ranks_name[doc.rank]}</td>
                  </tr>
                ))}
            </TBody>
          </Table>
        </div>
      </div>
      {/* <div>
        <h5>Requisitos {nextRank?.display}</h5>
        <div>
          <span>Puntos pierna más corta: {nextRank?.points} puntos</span>
          <br />
          <span>Binario activo (una persona activa de cada lado)</span>
        </div>
      </div> */}
    </div>
  )
}

export default Rank
