import { db } from '@/configs/firebaseConfig'
import ReactECharts from 'echarts-for-react'
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

const TopGananciasMes = () => {
  const [loading, setLoading] = useState(true)
  const [topPeople, setTopPeople] = useState<any[]>([])
  const [options, setOptions] = useState({})

  const loadChart = () => {
    const options = {
      title: {
        text: '',
      },
      grid: {
        top: 30,
        bottom: 30,
        left: 150,
        right: 80,
      },
      xAxis: {
        max: 'dataMax',
        axisLabel: {
          formatter: function (n: number) {
            return Math.round(n) + ''
          },
        },
        label: {
          show: false,
        },
        spltiLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        data: topPeople.map((r) => r.name.slice(0, 15)),
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 20,
      },
      series: [
        {
          realtimeSort: true,
          name: 'X',
          type: 'bar',
          data: topPeople.map((r, index) => r.profits_this_month),
          label: {
            show: false,
            precision: 1,
            position: 'right',
            valueAnimation: true,
            fontFamily: 'monospace',
          },
        },
      ],
      legend: {
        show: false,
      },
      animationDuration: 0,
      animationDurationUpdate: 1000,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear',
    }

    setOptions(options)
  }

  useEffect(() => {
    const unsub = onSnapshot(
      query(
        collection(db, 'users'),
        where('profits_this_month', '>', 0),
        where('membership_status', '==', 'paid'),
        orderBy('profits_this_month', 'desc'),
        limit(14)
      ),
      (snap) => {
        setTopPeople(
          snap.docs
            .filter(
              (r) =>
                ![
                  '9CXMbcJt2sNWG40zqWwQSxH8iki2',
                  'eN7hWGlS2mVC1O9YnXU3U5xEknz1',
                  'sVarUBihvSZ7ahMUMgwaAbXcRs03',
                  'vzzvaofd1GXAdgH890pGswl5A5x1',
                ].includes(r.id)
            )
            .map((r) => ({ id: r.id, ...r.data() }))
            .slice(0, 3)
        )
        setLoading(false)
      }
    )

    return () => unsub()
  }, [])

  return (
    <div id="top-firmas-mes p-1">
      <h1 className="text-xl font-bold">COMPETENCIA</h1>
      <h1 className="text-xl font-medium">
        Top Ganancias ({dayjs().format('MMMM')})
      </h1>
      {topPeople.length > 0 && (
        <div className="flex mt-4 space-x-8">
          <table border={1}>
            <tbody>
              {topPeople.slice(0, 10).map((r, i) => (
                <tr key={r.id} className="text-lg">
                  <th>#{Number(i + 1)}</th>
                  <td>{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table border={1} className="hidden 2xl:block">
            <tbody>
              {topPeople.slice(10, 20).map((r, i) => (
                <tr key={r.id}>
                  <th>#{Number(i + 11)}</th>
                  <td>{r.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {topPeople.length == 0 && (
        <>
          <Player
            autoplay
            loop
            src="https://lottie.host/68698fc0-37e6-46b1-beb4-874035dffda0/UzU5sGPcjP.json"
            style={{ height: '225px', width: '300px' }}
          >
            <Controls
              visible={false}
              buttons={['play', 'repeat', 'frame', 'debug']}
            />
          </Player>
          {!loading && <p className="text-center">No hay datos</p>}
        </>
      )}
    </div>
  )
}

export default TopGananciasMes
