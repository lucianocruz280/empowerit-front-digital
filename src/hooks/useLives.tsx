import { Live } from '@/@types/academy'
import { db } from '@/configs/firebaseConfig'
import { getLives } from '@/services/Academy.utils'
import { CoursesType } from '@/views/academies/Academy.definition'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useLives = ( courseType: CoursesType, idCourse?: string, subscribe = false,) => {
  const [data, setData] = useState<Live[]>([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    if (subscribe) {
      const unsub = onSnapshot(
        query(
          collection(db, `${courseType}/${idCourse}/lives`),
          orderBy('date', 'asc')
        ),
        (snap) => {
          setData(snap.docs.map((r) => ({ id: r.id, ...r.data() } as Live)))
        }
      )
      return () => {
        unsub()
      }
    } else {
      getLives(courseType === CoursesType.LEADERSHIP, idCourse)
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

export default useLives
