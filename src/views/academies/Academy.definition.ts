export interface IAcademyModalUploadContentProps {
    isLeadership: boolean
    isLive: boolean
    courseId: string
    show: boolean
    onClose: () => void
    orderIndex?: number
}

export interface ContentData {
    name: string,
    description: string,
    duration: string,
    order: number,
    image_cover: string | null | File | undefined,
    record_link?: string,
    date?: Date
}

export enum AcademyType {
    LEADERSHIP = 'academy-leadership',
    STANDARD = 'academy'
}

export enum CoursesType {
    LEADERSHIP = 'courses-leadership',
    STANDARD = 'courses'
}

export enum ContentType {
    LIVE = 'lives',
    LESSON = 'lessons',
}