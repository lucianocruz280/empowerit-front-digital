/**
 * REMOVE THIS HOOK
 */

import { Lesson } from '@/@types/academy'
import { db } from '@/configs/firebaseConfig'
import { getLeadershipLessons } from '@/services/AcademyLeadership'
import { onSnapshot, query, orderBy, collection } from 'firebase/firestore'
import { useEffect, useState } from 'react'

const useLessonsLeadership = (idCourse?: string, subscribe = false) => {
  const [data, setData] = useState<Lesson[]>([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    if (subscribe) {
      const unsub = onSnapshot(
        query(
          collection(db, `courses-leadership/${idCourse}/lessons`),
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
      getLeadershipLessons(idCourse)
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

export default useLessonsLeadership
