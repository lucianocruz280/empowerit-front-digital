import { Course } from '@/@types/academy'
import { FC } from 'react'
import { HiPencilAlt } from 'react-icons/hi'
import { AcademyType } from '../Academy.definition'

type Props = {
  course: Course
  academyType: AcademyType
}

const EditCourseCard: FC<Props> = ({ course, academyType }) => {
  
  return (
    <div className="w-68">
      <a href={`admin/edit/${course.id}`}>
        <div className="aspect-video w-full bg-gray-700 overflow-hidden rounded-md">
          <img
            src={course.image_cover}
            alt=""
            className="object-cover h-full w-full"
          />
        </div>
      </a>
      <div className="flex mt-2">
        <div className="ml-2 flex justify-between w-full items-center">
          <a href={`/${academyType}/course/${course.id}`}>
            <div className="text-sm font-bold">{course.name}</div>
          </a>
          <a href={`admin/edit/${course.id}`}>
            <div className="font-bold flex justify-between gap-1 items-center">
              <span>Editar </span>
              <HiPencilAlt />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}

export default EditCourseCard
