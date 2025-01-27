import { doc } from 'firebase/firestore'
import { Counter } from './Counter'
import { db } from '@/configs/firebaseConfig'

export const incrementVisitLesson = (courseType, courseId, lessonId, userId) => {
  const lessonRef = doc(db, `${courseType}/${courseId}/lessons/${lessonId}`)
  const visits = new Counter(lessonRef, 'count_views')
  visits.incrementBy(1)

  const lessonUserRef = doc(
    db,
    `${courseType}/${courseId}/lessons/${lessonId}/users/${userId}`
  )
  const visits2 = new Counter(lessonUserRef, 'count_views')
  visits2.incrementBy(1)
}

export const incrementVisitLive = (courseType, courseId, lessonId, userId) => {
  const lessonRef = doc(db, `${courseType}/${courseId}/lives/${lessonId}`)
  const visits = new Counter(lessonRef, 'count_views')
  visits.incrementBy(1)

  const lessonUserRef = doc(
    db,
    `${courseType}/${courseId}/lives/${lessonId}/users/${userId}`
  )
  const visits2 = new Counter(lessonUserRef, 'count_views')
  visits2.incrementBy(1)
}
