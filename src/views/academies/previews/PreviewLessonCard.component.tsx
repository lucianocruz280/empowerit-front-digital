import { Lesson } from '@/@types/academy';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import ConditionalWrapper from '@/components/shared/ConditionalWrapper';
import { ReactElement } from 'react-markdown/lib/react-markdown';
import dayjs from 'dayjs';
import { AcademyType } from '../Academy.definition';

type Props = {
  lesson: Lesson;
  courseId: string;
  isLeadership: boolean;
};

const PreviewLessonCard: FC<Props> = ({ lesson, courseId, isLeadership = false }) => {
  return (
    <ConditionalWrapper
      condition={lesson.status !== 'scheduled'}
      wrapper={(children: ReactElement) => (
        <Link
          to={
            `/${isLeadership ? AcademyType.LEADERSHIP : AcademyType.STANDARD}/course/${courseId}/lesson/${lesson.id}`
          }
        >
          {children}
        </Link>
      )}
    >
      <div className="w-68">
        <div className="aspect-video w-full bg-gray-700 overflow-hidden relative">
          <img src={lesson.image_cover} alt="" className="w-full h-full object-cover" />
          <div className="absolute right-0 bottom-0 bg-gray-500/50 p-1 text-white z-10">
            {lesson.duration}
          </div>
        </div>
        <div className="flex mt-2">
          <div className="ml-2">
            <div className="text-sm font-bold">{lesson.name}</div>
            <div className="text-xs text-gray-600">
              <p>{lesson.author?.name}</p>
              <p>
                {dayjs(lesson.created_at.seconds * 1000).fromNow()}{' '}
                {/*&middot; {lesson.count_views} views*/}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ConditionalWrapper>
  );
};

export default PreviewLessonCard;
