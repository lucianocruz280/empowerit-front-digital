import SkeletonVideo from "@/components/skeleton/SkeletonVideo"
import { db } from "@/configs/firebaseConfig"
import useLessons from "@/hooks/useLessons"
import useLives from "@/hooks/useLives"
import { AcademyType, CoursesType } from "@/views/academies/Academy.definition"
import PreviewLessonCard from "@/views/academies/previews/PreviewLessonCard.component"
import PreviewLiveCard from "@/views/academies/previews/PreviewLiveCard.component"
import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"


export default function AlgorithmVideos() {

    const [course, setCourse] = useState<any>({ name: '' })
    const { data: lessons, isLoading } = useLessons(CoursesType.STANDARD, 'C0n4amHlu5aFEu7T7D4R')
    const { data: lives, isLoading: isLoadingLives } = useLives(CoursesType.STANDARD, 'C0n4amHlu5aFEu7T7D4R')

    useEffect(() => {
        getDoc(doc(db, 'courses/C0n4amHlu5aFEu7T7D4R')).then((r) => {
        setCourse(r.data())
        })
    }, [])


    return (
        <div className="flex flex-col space-y-8">
            <div>
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
                        <PreviewLessonCard key={lesson.id} lesson={lesson} courseId={'C0n4amHlu5aFEu7T7D4R'} isLeadership={false} />
                    ))}
                </div>
            </div>

            <div>
                {lives && lives.length > 0 && <h3 className="text-xl font-bold">Clases en vivo (grabadas)</h3>}
                
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
                        <PreviewLiveCard key={lesson.id} lesson={lesson} courseId={'C0n4amHlu5aFEu7T7D4R'} isLeadership={false} />
                    ))}
                </div>
            </div>
        </div>
    )
}
