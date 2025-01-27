import { db } from '@/configs/firebaseConfig'
import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

import { Course, Lesson, Live } from '@/@types/academy'
import { ApiResponse } from '@/@types/common'

export async function getCourses(): Promise<ApiResponse<Course[]>> {
  try {
    const courses: Course[] = []
    const res = await getDocs<any, any>(
      query(collection(db, 'courses'), where('status', '!=', 'archived'))
    )
    res.docs.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    return { status: 'success', data: courses }
  } catch (e) {
    return { status: 'failed', e }
  }
}

export async function getCourseById(id: string): Promise<ApiResponse<Course>> {
  try {
    const res = await getDoc<any, any>(doc(db, 'courses', id))

    if (res.exists()) {
      const course: Course = {
        id: res.id,
        ...res.data(),
      }

      return { status: 'success', data: course }
    } else {
      throw new Error('Course not found')
    }
  } catch (e) {
    return { status: 'failed', e }
  }
}

export async function getLessons(
  idCourse?: string
): Promise<ApiResponse<Lesson[]>> {
  try {
    const data: Lesson[] = []
    const res = await getDocs<any, any>(
      query(
        collection(db, 'courses/' + idCourse + '/lessons'),
        orderBy('order', 'asc')
      )
    )
    res.docs.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    return { status: 'success', data: data }
  } catch (e) {
    return { status: 'failed', e }
  }
}

export async function getLives(
  idCourse?: string
): Promise<ApiResponse<Live[]>> {
  try {
    const data: Live[] = []
    const res = await getDocs<any, any>(
      query(
        collection(db, 'courses/' + idCourse + '/lives'),
        orderBy('date', 'asc')
      )
    )
    res.docs.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    return { status: 'success', data: data }
  } catch (e) {
    return { status: 'failed', e }
  }
}
export async function getLesson(idCourse: string, idLesson: string) {
  try {
    const res = await getDoc<any, any>(
      doc(db, 'courses/' + idCourse + '/lessons/' + idLesson)
    )
    const row = {
      id: res.id,
      ...res.data(),
    }

    return { status: 'success', data: row }
  } catch (e) {
    return { status: 'failed', e }
  }
}
