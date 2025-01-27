import { Course } from '@/@types/academy'
import { getCourseById, getCourses } from '@/services/Academy.utils'
import { CoursesType } from '@/views/academies/Academy.definition'
import { useEffect, useState } from 'react'

const useCourses = (courseType: CoursesType) => {
  const [data, setData] = useState<Course[]>([])
  const [isLoading, setLoading] = useState(false)
  const [courseById, setCourseById] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    getCourses(courseType === CoursesType.LEADERSHIP)
      .then((r) => {
        if (r.data) setData(r.data)
        else setData([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const fetchCourseById = (courseType: CoursesType, id: string) => {
    setLoading(true)
    getCourseById(courseType === CoursesType.LEADERSHIP, id)
      .then((response) => {
        setCourseById(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { data, isLoading, courseById, fetchCourseById }
}

export default useCourses
