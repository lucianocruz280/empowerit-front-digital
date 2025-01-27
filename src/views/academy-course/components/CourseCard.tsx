/**
 * NOT IN USE. REMOVE THIS FILE AND UPDATE REFERENCE TO PreviewCourseCard
 */
import { Course } from '@/@types/academy'
import { FC } from 'react'

type Props = {
  course: Course
}

const CourseCard: FC<Props> = ({ course }) => {
  return (
    <a href={`/academy/course/${course.id}`}>
      <div className="w-68">
        <div className="h-40 w-full bg-gray-700 overflow-hidden">
          <img src={course.image_cover} alt="" />
        </div>
        <div className="flex mt-2">
          <div className="h-10 w-10 bg-blue-300 rounded-full flex-shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1570724061670-86a53c509dee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
              alt=""
            />
          </div>
          <div className="ml-2">
            <div className="text-sm font-bold">{course.name}</div>
            <div className="text-xs text-gray-600">
              <p>9 hours ago &middot; {course.count_lesson} clases</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default CourseCard
