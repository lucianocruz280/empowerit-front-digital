import { Lesson } from '@/@types/academy'
import { useAppSelector } from '@/store'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import { FC } from 'react'

dayjs.extend(duration)

type Props = {
  lesson: Lesson
  hidePlay?: boolean
}

const CardLesson: FC<Props> = ({ lesson, ...props }) => {
  const user = useAppSelector((state) => state.auth.user)

  const oneMinuteAgo = dayjs().subtract(lesson.played_seconds || 0, 'seconds')
  const dur = dayjs.duration(dayjs().diff(oneMinuteAgo))

  return (
    <div className="flex flex-col 2xl:flex-row 2xl:space-x-2">
      <img
        src={lesson.image_cover}
        className="aspect-video w-full 2xl:w-[200px] hover:brightness-125"
      />
      <div className="flex flex-col space-y-1">
        {!props.hidePlay && (
          <span className="text-blue-500 hover:underline font-semibold">
            Ver Ahora
          </span>
        )}
        <span>
          Duración: <b>{lesson.duration}</b>
        </span>

        {user.authority?.includes('ADMIN') && (
          <>
            <span>
              Cantidad de vistas: <b>{lesson.count_views}</b>
            </span>
            <span>
              Tiempo de reproducción:{' '}
              <b>{dayjs.utc(dur.asMilliseconds()).format('HH:mm:ss')}</b>
            </span>
          </>
        )}
      </div>
    </div>
  )
}

export default CardLesson
