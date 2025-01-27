import SkeletonVideo from '@/components/skeleton/SkeletonVideo'
import LessonCard from './components/LessonCard'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import useLives from '@/hooks/useLives'
import LiveCard from './components/LiveCard'
import useLessonsLeadership from '@/hooks/useLessonsLeadership'

const Academy = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState<any>({ name: '' })
  const { data: lessons, isLoading } = useLessonsLeadership(courseId)
  const { data: lives, isLoading: isLoadingLives } = useLives(courseId)

  useEffect(() => {
    getDoc(doc(db, 'courses-leadership/' + courseId)).then((r) => {
      setCourse(r.data())
    })
  }, [courseId])

  return (
    <div className="flex flex-col space-y-8">
      <div>
        <h3 className="text-xl font-bold">Academia de {course.name}</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2">
          {isLoading && (
            <>
              <SkeletonVideo />
              <SkeletonVideo />
              <SkeletonVideo />
              <SkeletonVideo />
            </>
          )}
          {lessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} courseId={courseId!} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold">Clases en vivo (grabadas)</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2">
          {isLoadingLives && (
            <>
              <SkeletonVideo />
              <SkeletonVideo />
              <SkeletonVideo />
              <SkeletonVideo />
            </>
          )}
          {lives.map((lesson) => (
            <LiveCard key={lesson.id} lesson={lesson} courseId={courseId!} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Academy
