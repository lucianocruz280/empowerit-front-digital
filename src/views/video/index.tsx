import React, { lazy, useEffect, useState } from 'react'
import SideMenu from './components/SideMenu'
import { Tabs } from '@/components/ui'
import VideoDescription from './components/VideoDescription'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import { incrementVisitLesson, incrementVisitLive } from '@/utils/academy/views'
import { useAppSelector } from '@/store'
import { CoursesType } from '../academies/Academy.definition'

const Player = lazy(() => import('./components/Player'))
const { TabNav, TabList } = Tabs

interface SettingsMenu {
  [key: string]: { label: string; path: string }
}

const settingsMenu: SettingsMenu = {
  description: { label: 'Descripción', path: 'description' },
  //questions: { label: 'Preguntas', path: 'questions' },
  //comments: { label: 'Comentarios', path: 'comments' },
}

const VideoSettingsMenu: React.FC = () => {
  const [isLive] = useState(
    window.location.pathname.includes('live') ? true : false
  )
  const [courseType] = useState(
    window.location.pathname.includes('academy-leadership') ? CoursesType.LEADERSHIP : CoursesType.STANDARD
  )
  const user = useAppSelector((state) => state.auth.user)
  const { courseId, lessonId } = useParams()
  const [currentTab, setCurrentTab] = useState<string>('description')

  const [lesson, setLesson] = useState<any>({})

  useEffect(() => {
    if (isLive) {
      incrementVisitLive(courseType, courseId, lessonId, user.uid)
    } else {
      incrementVisitLesson(courseType, courseId, lessonId, user.uid)
    }

    getDoc(
      doc(
        db,
        `${courseType}/` + courseId + `/${isLive ? 'lives' : 'lessons'}/` + lessonId
      )
    ).then((r) => setLesson({ id: r.id, ...r.data() }))
  }, [courseId, lessonId])

  const onTabChange = (val: string) => {
    setCurrentTab(val)
  }

  return (
    <div className="flex flex-col md:flex-row md:space-x-4 w-full h-fit">
      <div className="w-[80%]">
        <React.Suspense fallback={<div>Loading...</div>}>
          {lesson.record_link ? (
            <Player courseId={courseId!} lesson={lesson} isLive={isLive} courseType={courseType} />
          ) : (
            <span>Loading...</span>
          )}
        </React.Suspense>
        <Tabs value={currentTab} onChange={(val: string) => onTabChange(val)}>
          <TabList>
            {Object.keys(settingsMenu).map((key) => (
              <TabNav key={key} value={key}>
                {settingsMenu[key].label}
              </TabNav>
            ))}
          </TabList>
        </Tabs>
        {currentTab === 'description' && <VideoDescription lesson={lesson} />}
        {currentTab === 'questions' && <span>Preguntas</span>}
        {currentTab === 'comments' && <span>Comentarios</span>}
      </div>
      <div className="flex flex-col w-[20%]">
        <SideMenu />
      </div>
    </div>
  )
}

export default VideoSettingsMenu
