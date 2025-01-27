import useLessons from '@/hooks/useLessons'
import useLives from '@/hooks/useLives'
import { AcademyType, CoursesType } from '@/views/academies/Academy.definition'
import classNames from 'classnames'
import { useState } from 'react'
import { FaRegClock } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

const SideMenu = () => {
  const { courseId, lessonId, academyType } = useParams()
  const [isLive] = useState(
    window.location.pathname.includes('live') ? true : false
  )
  const localCourseType =
    academyType == AcademyType.LEADERSHIP
      ? CoursesType.LEADERSHIP
      : CoursesType.STANDARD
  const { data: lessons } = useLessons(localCourseType, courseId)
  const { data: lives } = useLives(localCourseType, courseId)

  return (
    <div className="flex flex-col w-full space-y-2">
      {isLive
        ? lives.map((live) => (
            <Link
              key={live.id}
              to={`/${academyType}/course/${courseId}/live/${live.id}`}
            >
              <div
                className={classNames(
                  'hover:bg-gray-200 px-4 py-3 rounded-md hover:cursor-pointer',
                  { 'bg-blue-200': lessonId == live.id }
                )}
              >
                <p className="line-clamp-1 text-ellipsis font-semibold">
                  {live.description}
                </p>
                <span className="flex items-center space-x-1">
                  <FaRegClock />
                  <span>{live.duration}</span>
                </span>
              </div>
            </Link>
          ))
        : lessons.map((lesson) => (
            <Link
              key={lesson.id}
              to={`/${academyType}/course/${courseId}/lesson/${lesson.id}`}
            >
              <div
                className={classNames(
                  'hover:bg-gray-200 px-4 py-3 rounded-md hover:cursor-pointer',
                  { 'bg-blue-200': lessonId == lesson.id }
                )}
              >
                <p className="line-clamp-1 text-ellipsis font-semibold">
                  {lesson.name}
                </p>
                <span className="flex items-center space-x-1">
                  <FaRegClock />
                  <span>{lesson.duration}</span>
                </span>
              </div>
            </Link>
          ))}
    </div>
  )
}

export default SideMenu
