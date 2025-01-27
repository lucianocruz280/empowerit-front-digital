import { Lesson } from '@/@types/academy'
import { db } from '@/configs/firebaseConfig'
import { useAppSelector } from '@/store'
import { Counter } from '@/utils/academy/Counter'
import { CoursesType } from '@/views/academies/Academy.definition'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'

type Props = {
  lesson: Lesson
  courseId: string
  isLive: boolean
  courseType: CoursesType
}

const Player = (props: Props) => {
  const { courseId, courseType, isLive, lesson } = props
  const user = useAppSelector((state) => state.auth.user)
  const playerRef = useRef(null)
  const [playTime, setPlayTime] = useState(0)
  const [progress, setProgress] = useState(0)
  const [updatedSeconds, setUpdatedSeconds] = useState(0)

  useEffect(() => {
    if (progress && user.uid && lesson.id) {
      const type = isLive ? 'lives' : 'lessons'
      const path = `${courseType}/${courseId}/${type}/${lesson.id}/users/${user.uid}`
      const lessonRef = doc(db, path)

      setDoc(
        lessonRef,
        {
          progress,
        },
        {
          merge: true,
        }
      )
    }
  }, [
    playTime,
    progress,
    courseId,
    isLive,
    lesson.id,
    user.uid,
    courseType,
  ])

  const addSumTime = (seconds: number) => {
    setUpdatedSeconds((secs) => secs + seconds)
    const type = isLive ? 'lives' : 'lessons'

    // user time
    const path = `${courseType}/${courseId}/${type}/${lesson.id}/users/${user.uid}`
    const lessonUserRef = doc(db, path)
    const counter = new Counter(lessonUserRef, 'played_seconds')
    counter.incrementBy(seconds)

    // lesson time
    const path2 = `${courseType}/${courseId}/${type}/${lesson.id}`
    const lessonRef = doc(db, path2)
    const counter2 = new Counter(lessonRef, 'played_seconds')
    counter2.incrementBy(seconds)
  }

  return (
    <div className="">
      <ReactPlayer
        key={lesson.record_link}
        ref={playerRef}
        controls
        url={lesson.record_link}
        width={'100%'}
        height={500}
        progressInterval={3000}
        onProgress={(event) => {
          setProgress(event.played)
          setPlayTime(event.playedSeconds)
          if (event.played > 0) {
            addSumTime(event.playedSeconds - updatedSeconds)
          }
        }}
      />
    </div>
  )
}

export default Player
