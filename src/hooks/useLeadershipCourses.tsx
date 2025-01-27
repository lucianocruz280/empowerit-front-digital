/**
 * REMOVE THIS HOOK
 */

import { Course } from '@/@types/academy'
import {
  getLeadershipCourseById,
  getLeadershipCourses,
} from '@/services/AcademyLeadership'
import { useEffect, useState } from 'react'

const useLeadershipCourses = () => {
  const [data, setData] = useState<Course[]>([])
  const [isLoading, setLoading] = useState(false)
  const [courseById, setCourseById] = useState<any>(null)

  useEffect(() => {
    setLoading(true)
    getLeadershipCourses()
      .then((r) => {
        if (r.data) setData(r.data)
        else setData([])
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const fetchCourseById = (id: string) => {
    setLoading(true)
    getLeadershipCourseById(id)
      .then((response) => {
        setCourseById(response.data)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return { data, isLoading, courseById, fetchCourseById }
}

export default useLeadershipCourses
