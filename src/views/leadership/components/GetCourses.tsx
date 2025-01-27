import SkeletonVideo from '@/components/skeleton/SkeletonVideo'
import CourseCard from './CourseCard'
import useLeadershipCourses from '@/hooks/useLeadershipCourses'

const AcademyCourses = () => {
  const { data: courses, isLoading } = useLeadershipCourses()

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
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default AcademyCourses
