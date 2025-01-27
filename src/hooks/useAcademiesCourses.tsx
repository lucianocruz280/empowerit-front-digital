import { Course } from '@/@types/academy';
import { ApiResponse } from '@/@types/common';
import { getCourses, getCourseById } from '@/services/Academy.utils';
import { useEffect, useState } from 'react';

type UseCoursesResult = {
  data: Course[];
  isLoading: boolean;
  courseById: any;
  fetchCourseById: (id: string) => void;
};

const useAcademiesCourses = (isLeadership = false): UseCoursesResult => {
  const [data, setData] = useState<Course[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [courseById, setCourseById] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const fetchCourses = getCourses;

    fetchCourses(isLeadership)
      .then((r: ApiResponse<Course[]>) => {
        if (r.data) setData(r.data);
        else setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isLeadership]);

  const fetchCourseById = (id: string) => {
    setLoading(true);
    const fetchById = getCourseById;

    fetchById(id, isLeadership)
      .then((response: ApiResponse<Course>) => {
        setCourseById(response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, isLoading, courseById, fetchCourseById };
};

export default useAcademiesCourses;
