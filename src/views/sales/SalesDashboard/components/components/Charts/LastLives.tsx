/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Lesson, Live } from '@/@types/academy'
import CardLesson from '@/components/lives/CardLesson'
import CardLive from '@/components/lives/CardLive'
import { db } from '@/configs/firebaseConfig'
import dayjs from 'dayjs'
import {
  collectionGroup,
  getDocs,
  limit,
  orderBy,
  query,
} from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const orderByDate = (array: any[]) => {
  return array.sort(function (a, b) {
    // @ts-ignore
    return b.order_date - a.order_date
  })
}



const LastLives = () => {
  const [lives, setLives] = useState<Live[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    getDocs(
      query(collectionGroup(db, 'lives'), orderBy('date', 'desc'), limit(8))
    ).then((snap) => {
      setLives(
        snap.docs.map(
          (r) =>
            ({
              id: r.id,
              ...r.data(),
              course_id: r.ref.parent?.parent?.id,
            } as Live)
        )
      )
    })

    getDocs(
      query(
        collectionGroup(db, 'lessons'),
        orderBy('created_at', 'desc'),
        limit(8)
      )
    ).then((snap) => {
      setLessons(
        snap.docs.map(
          (r) =>
            ({
              id: r.id,
              ...r.data(),
              course_id: r.ref.parent?.parent?.id,
            } as Lesson)
        )
      )
    })
  }, [])

  return (
    <div className="flex flex-col space-y-4 overflow-auto">
      <span className="text-lg font-bold text-black">
        Lo mas reciente (Academia)
      </span>
      {orderByDate([
        lives.map((r) => ({
          ...r,
          type: 'live',
          order_date: dayjs(r.date.seconds * 1000).toDate(),
        })),
        lessons.map((r) => ({
          ...r,
          type: 'lesson',
          order_date: dayjs(r.created_at.seconds * 1000).toDate(),
        })),
      ])
        .flat()
        .map((lesson) => (
          <Link
            key={lesson.id}
            to={`/academy/course/${lesson.course_id}/${
              lesson.type == 'live' ? 'live' : 'lesson'
            }/${lesson.id}`}
          >
            {lesson.type == 'live' ? (
              <CardLive live={lesson as Live} />
            ) : (
              <CardLesson lesson={lesson as Lesson} />
            )}
          </Link>
        ))}
    </div>
  )
}

export default LastLives
