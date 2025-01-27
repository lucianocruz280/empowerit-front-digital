import { Lesson } from '@/@types/academy'
import { db } from '@/configs/firebaseConfig'
import { getLessons } from '@/services/Academy.utils'
import { CoursesType } from '@/views/academies/Academy.definition'
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useLessons = (courseType: CoursesType, idCourse?: string, subscribe = false) => {
  const [data, setData] = useState<Lesson[]>([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (subscribe) {
      const unsub = onSnapshot(
        query(
          collection(db, `${courseType}/${idCourse}/lessons`),
          orderBy('order', 'asc')
        ),
        (snap) => {
          setData(snap.docs.map((r) => ({ id: r.id, ...r.data() } as Lesson)))
        }
      )
      return () => {
        unsub()
      }
    } else {
      getLessons(courseType === CoursesType.LEADERSHIP, idCourse)
        .then((r) => {
          if (r.data) setData(r.data)
          else setData([])
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [idCourse])

  return { data, isLoading }
}

export default useLessons
