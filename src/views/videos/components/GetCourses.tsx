import SkeletonVideo from '@/components/skeleton/SkeletonVideo'
import useCourses from '@/hooks/useCourses'
import CourseCard from './CourseCard'

const AcademyCourses = () => {
  const { data: courses, isLoading } = useCourses()

  return (
    <div>
      {/*<div className="flex items-center py-3 space-x-3 select-none">
        <span className="text-sm bg-gray-700 border border-gray-800 rounded-full px-2 py-1 text-gray-200 shadow-inner">
          All Recommendations
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Tailwindcss
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Javascript
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Wrestling
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Python
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Coding
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          News
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          CSS
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Computer Science
        </span>
        <span className="text-sm bg-gray-200 border border-gray-300 rounded-full px-2 py-1 text-gray-800 shadow-inner">
          Comedy
        </span>
      </div>*/}
      {/*<h3 className="text-xl font-bold">Recomendados</h3>*/}
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
