import { Course } from '@/@types/academy'
import { FC } from 'react'
import { HiPencilAlt } from 'react-icons/hi'

type Props = {
  course: Course
}

const CourseCard: FC<Props> = ({ course }) => {
  return (
    <div className="w-68">
      <a href={`/admin-course/edit/${course.id}`}>
        <div className="aspect-video w-full bg-gray-700 overflow-hidden rounded-md">
          <img
            src={course.image_cover}
            alt=""
            className="object-cover h-full w-full"
          />
        </div>
      </a>
      <div className="flex mt-2">
        {/*<div className="h-10 w-10 bg-blue-300 rounded-full flex-shrink-0 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1570724061670-86a53c509dee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=900&q=60"
              alt=""
            />
          </div>*/}
        <div className="ml-2 flex justify-between w-full items-center">
          <a href={`/academy/course/${course.id}`}>
            <div className="text-sm font-bold">{course.name}</div>
          </a>
          <a href={`/admin-course/edit/${course.id}`}>
            <div className="font-bold flex justify-between gap-1 items-center">
              <span>Editar </span>
              <HiPencilAlt />
            </div>
          </a>
          {/*<div className="text-xs text-gray-600">
              <p>{course.count_lesson} clases</p>
            </div>*/}
        </div>
      </div>
    </div>
  )
}

export default CourseCard
