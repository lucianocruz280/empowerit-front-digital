/* eslint-disable import/namespace */
import * as echarts from 'echarts'
import geoJson from '@/assets/maps/mexicoHigh.json'
import { useEffect, useState } from 'react'
import { Spinner } from '@/components/ui'

export default function Map({ url }: { url: string }) {
  type HexColor = `#${string}`

  interface IState {
    coordinates: [number, number]
    name: string
    value: number
    size?: number
    color?: HexColor
  }

  function pieSeries(state: IState) {
    const { coordinates, name, value, size = 7, color = '#90B1DB' } = state
    return {
      type: 'pie',
      coordinateSystem: 'geo',
      tooltip: {
        formatter: '{b}: {c} ({d}%)',
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
      animationDuration: 0,
      radius: size,
      center: coordinates,
      data: [
        {
          value,
          name,
          itemStyle: {
            color,
          },
        },
      ],
    }
  }

  type seriesItem = ReturnType<typeof pieSeries>

  const loadChart = (series: seriesItem[]) => {
    echarts.registerMap('MX', geoJson as never)

    const option = {
      geo: {
        map: 'MX',
        roam: true,
        itemStyle: {
          areaColor: '#e7e8ea',
        },
      },
      tooltip: {},
      legend: {},
      series,
    }

    const el = document.querySelector('#chart') as HTMLDivElement
    const myChart = echarts.getInstanceByDom(el) ?? echarts.init(el)
    myChart.hideLoading()
    myChart.setOption(option)
  }

  const [isLoading, setIsLoading] = useState(true)

  type APIState = {
    coordinates: [number, number]
    name: string
    value: number
    color: HexColor
  }

  type MXStateCode = `${string}-MX`

  type APIStates = {
    [key: MXStateCode]: APIState
  }

  const loadChartSeries = async () => {
    const series: seriesItem[] = []

    const states: APIStates = await fetch(url).then((res) => res.json())

    if (states) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(states).forEach(([_, state]) => {
        if (state.value > 0) series.push(pieSeries(state))
      })
    }

    if (series.length <= 0) {
      console.log(
        'Error occured while loading map data, series is empty || No users in MX'
      )
    }

    setIsLoading(false)
    return loadChart(series)
  }

  useEffect(() => {
    setIsLoading(true)
    loadChartSeries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div
        className="w-full h-full flex items-center justify-center"
        id="chart"
      ></div>
      {isLoading ?? (
        <div className="w-full h-full  flex items-center justify-center">
          <Spinner size={50} className="select-loading-indicatior"></Spinner>
        </div>
      )}
    </>
  )
}
