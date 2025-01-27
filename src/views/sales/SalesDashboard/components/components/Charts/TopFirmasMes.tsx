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

const TopFirmasMes = () => {
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
      },
      series: [
        {
          realtimeSort: true,
          name: 'X',
          type: 'bar',
          data: topPeople.map((r, index) =>
            index > 9 ? '' : r.count_direct_people_this_month
          ),
          label: {
            show: true,
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
        where('count_direct_people_this_month', '>', 0),
        //where('type', '!=', 'top-lider'),
        orderBy('count_direct_people_this_month', 'desc'),
        limit(3)
      ),
      (snap) => {
        setTopPeople(snap.docs.map((r) => r.data()))
        setLoading(false)
      }
    )

    return () => unsub()
  }, [])

  useEffect(() => {
    loadChart()
  }, [topPeople])

  return (
    <div id="top-firmas-mes p-1">
      <h1 className="text-xl font-bold">COMPETENCIA</h1>
      <h1 className="text-xl font-medium">
        Top Firmas ({dayjs().format('MMMM')})
      </h1>
      {topPeople.length > 0 && (
        <ReactECharts option={options} style={{ height: 140 }} />
      )}
      {topPeople.length == 0 && (
        <>
          <Player
            autoplay
            loop
            src="https://lottie.host/68698fc0-37e6-46b1-beb4-874035dffda0/UzU5sGPcjP.json"
            style={{ height: '180px', width: '300px' }}
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

export default TopFirmasMes
