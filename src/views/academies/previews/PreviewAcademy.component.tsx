import SkeletonVideo from '@/components/skeleton/SkeletonVideo'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import useLives from '@/hooks/useLives'
import PreviewLessonCard from './PreviewLessonCard.component'
import PreviewLiveCard from './PreviewLiveCard.component'
import { AcademyType, CoursesType } from '../Academy.definition'
import useLessons from '@/hooks/useLessons'

interface PreviewAcademyProps {
    isLeadership: boolean
}

const PreviewAcademy = (props: PreviewAcademyProps) => {
    const { courseId, academyType } = useParams()
    const isLeadership = academyType === AcademyType.LEADERSHIP
    const courseType = academyType === AcademyType.LEADERSHIP ? CoursesType.LEADERSHIP : CoursesType.STANDARD
    const [course, setCourse] = useState<any>({ name: '' })
    const { data: lessons, isLoading } = useLessons(courseType, courseId)
    const { data: lives, isLoading: isLoadingLives } = useLives(courseType, courseId)

    
    useEffect(() => {
        getDoc(doc(db, `${courseType}/` + courseId)).then((r) => {
        setCourse(r.data())
        })
    }, [courseId])

    return (
        <div className="flex flex-col space-y-8">
        <div>
            <h3 className="text-xl font-bold">Academia de {course.name}</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2">
            {isLoading && (
                <>
                <SkeletonVideo />
                <SkeletonVideo />
                <SkeletonVideo />
                <SkeletonVideo />
                </>
            )}
            {lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                <PreviewLessonCard key={lesson.id} lesson={lesson} courseId={courseId!} isLeadership={isLeadership} />
            ))}
            </div>
        </div>

        <div>
            <h3 className="text-xl font-bold">Clases en vivo (grabadas)</h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-2">
            {isLoadingLives && (
                <>
                <SkeletonVideo />
                <SkeletonVideo />
                <SkeletonVideo />
                <SkeletonVideo />
                </>
            )}
            {lives.sort((a, b) => a.order - b.order).map((lesson) => (
                <PreviewLiveCard key={lesson.id} lesson={lesson} courseId={courseId!} isLeadership={isLeadership} />
            ))}
            </div>
        </div>
        </div>
    )
}

export default PreviewAcademy
