import SkeletonVideo from '@/components/skeleton/SkeletonVideo'
import useAcademiesCourses from '@/hooks/useAcademiesCourses'
import PreviewCourseCard from './PreviewCourseCard.component'
import { AcademyType } from '../Academy.definition'
import EditCourseCard from '../admin/EditCourseCard'
import { useEffect, useState } from 'react'
import { Course } from '@/@types/academy'

interface AcademyCoursesListProps {
    isLeadership: boolean
    isEditable: boolean
}

const AcademyCoursesList = (props: AcademyCoursesListProps) => {
    const { isLeadership, isEditable } = props;
    const { data: courses, isLoading } = useAcademiesCourses(isLeadership)
    const [coursesAcademy, setCoursesAcademy] = useState<Course[]>()
    
    useEffect(() => {
        removeInvalidCourse(courses)
    },[courses])

    const invalidCourses = ['C0n4amHlu5aFEu7T7D4R', 'xLvEPccG4yWYen4PcWTN', 'r3OFhhJPyZc5b17NDavo']

    const removeInvalidCourse = (courses : Course[]) => {
        setCoursesAcademy(courses.filter(course => !invalidCourses.includes(course.id)))
    };

    const getCourseCards = () => {
        return isEditable ? (courses.map((course) => (
                <EditCourseCard key={course.id} course={course} academyType={isLeadership ? AcademyType.LEADERSHIP : AcademyType.STANDARD} />
            ))) :
            coursesAcademy && (coursesAcademy.map((course) => (
                <PreviewCourseCard key={course.id} course={course} academyType={isLeadership ? AcademyType.LEADERSHIP : AcademyType.STANDARD} />
            )))
    }

    return (
        <div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-10 gap-x-2">
            {isLoading && (
            <>
                <SkeletonVideo />
                <SkeletonVideo />
                <SkeletonVideo />
                <SkeletonVideo />
            </>
            )}
            {getCourseCards()}
        </div>
        </div>
    )
}

export default AcademyCoursesList
