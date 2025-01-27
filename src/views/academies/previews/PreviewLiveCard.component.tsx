import { Live } from '@/@types/academy';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { AcademyType } from '../Academy.definition';

type Props = {
  lesson: Live;
  courseId: string;
  isLeadership: boolean;
};


const PreviewLiveCard: FC<Props> = ({ lesson, courseId, isLeadership = false }) => {
  return (
    <Link
      to={
        `/${isLeadership ? AcademyType.LEADERSHIP : AcademyType.STANDARD}/course/${courseId}/live/${lesson.id}`
      }
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
            <div className="text-sm font-bold">
              {dayjs(lesson.date.seconds * 1000).format('DD MMMM YYYY')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PreviewLiveCard;
