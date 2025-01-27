import { db } from '@/configs/firebaseConfig';
import {
  getDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

import { Course, Lesson, Live } from '@/@types/academy';
import { ApiResponse } from '@/@types/common';
import { CoursesType } from '@/views/academies/Academy.definition';

export async function getCourses(isLeadership = false): Promise<ApiResponse<Course[]>> {
  try {
    const courses: Course[] = [];
    const collectionPath = isLeadership ? CoursesType.LEADERSHIP : CoursesType.STANDARD;
    const res = await getDocs<any, any>(
      query(collection(db, collectionPath), where('status', '!=', 'archived'))
    );
    res.docs.forEach((doc) => {
      courses.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { status: 'success', data: courses };
  } catch (e) {
    return { status: 'failed', e };
  }
}

export async function getCourseById(isLeadership = false, id: string): Promise<ApiResponse<Course>> {
  try {
    const collectionPath = isLeadership ? CoursesType.LEADERSHIP : CoursesType.STANDARD;
    const res = await getDoc<any, any>(doc(db, collectionPath, id));

    if (res.exists()) {
      const course: Course = {
        id: res.id,
        ...res.data(),
      };

      return { status: 'success', data: course };
    } else {
      throw new Error('Course not found');
    }
  } catch (e) {
    return { status: 'failed', e };
  }
}

export async function getLessons(isLeadership = false, idCourse?: string): Promise<ApiResponse<Lesson[]>> {
  try {
    const data: Lesson[] = [];
    const collectionPath = isLeadership ? CoursesType.LEADERSHIP : CoursesType.STANDARD;
    const res = await getDocs<any, any>(
      query(
        collection(db, `${collectionPath}/${idCourse}/lessons`),
        orderBy('order', 'asc')
      )
    );
    res.docs.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { status: 'success', data: data };
  } catch (e) {
    return { status: 'failed', e };
  }
}

export async function getLives(isLeadership = false, idCourse?: string): Promise<ApiResponse<Live[]>> {
  try {
    const data: Live[] = [];
    const collectionPath = isLeadership ? CoursesType.LEADERSHIP : CoursesType.STANDARD;
    const res = await getDocs<any, any>(
      query(
        collection(db, `${collectionPath}/${idCourse}/lives`),
        orderBy('date', 'asc')
      )
    );
    res.docs.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return { status: 'success', data: data };
  } catch (e) {
    return { status: 'failed', e };
  }
}

export async function getLesson(isLeadership = false, idCourse: string, idLesson: string) {
  try {
    const collectionPath = isLeadership ? CoursesType.LEADERSHIP : CoursesType.STANDARD;
    const res = await getDoc<any, any>(doc(db, `${collectionPath}/${idCourse}/lessons/${idLesson}`));
    const row = {
      id: res.id,
      ...res.data(),
    };

    return { status: 'success', data: row };
  } catch (e) {
    return { status: 'failed', e };
  }
}
