import { Button, Dialog, Input } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { uploadImage } from '@/utils/academy/storage'
import dayjs from 'dayjs'
import { doc, setDoc } from 'firebase/firestore'
import { FC, useState } from 'react'
import { v4 } from 'uuid'
import { ContentData, ContentType, CoursesType, IAcademyModalUploadContentProps } from './Academy.definition'

const AcademyModalUploadContent: FC<IAcademyModalUploadContentProps> = (props) => {
  const [isLoading, setLoading] = useState(false)
  const [newContent, setNewContent] = useState<ContentData>({
    name: '',
    description: '',
    duration: '',
    order: props.orderIndex || 1,
    image_cover: null,
  });
  const [fileVideo, setVideoFile] = useState<File | null>(null)
  const [error, setError] = useState<null | string>(null)
  const academyType = props.isLeadership ? CoursesType.LEADERSHIP : CoursesType.STANDARD;
  const contentType = props.isLive ? ContentType.LIVE : ContentType.LESSON;

  const handleInputChange = (field: keyof ContentData, value: string) => {
    setNewContent((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleImageCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setNewContent((prevData) => ({ ...prevData, image_cover: file }));
  };


  const uploadContent = async () => {
    try {
      setError(null);
      if (!fileVideo || !newContent.image_cover || (props.isLive && !newContent.date)) {
        return;
      }

      setLoading(true);
      const contentId = v4();
      const content: ContentData = {
        ...newContent,
      };

      if (props.isLive) {
        content.date = dayjs(newContent.date + ' 21:00:00').toDate();
      }

      const url = await uploadImage(
        'image_cover',
        `${academyType}/${props.courseId}/${contentType}/${contentId}`,
        newContent.image_cover
      );
      content.image_cover = url;

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cloudflare/uploadVideo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder: contentType,
            courseId: props.courseId,
            courseType: academyType
          }),
        }
      ).then((r) => r.json());

      await fetch(res.url, {
        method: 'PUT',
        body: fileVideo,
        headers: {
          'Content-Type': 'video/mp4',
        },
      });
      content.record_link =
        'https://pub-38820717e1d6434b9216f051cc6914fb.r2.dev/' + res.filename;

      const ref = doc(
        db,
        `${academyType}/${props.courseId}/${contentType}/${contentId}`
      );
      await setDoc(ref, content);

      props.onClose();
    } catch (err) {
      console.error(err);
      setError('Algo salió mal, intenta de nuevo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={props.show} onClose={isLoading ? undefined : props.onClose}>
      <div className="flex flex-col space-y-4">
        <h3>{props.isLive ? 'Subir Live' : 'Subir Lección'}</h3>
        <div className="flex flex-col">
          <label>Nombre</label>
          <Input
            disabled={isLoading}
            placeholder="name"
            onChange={(e) => handleInputChange('name', e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Descripción</label>
          <Input
            disabled={isLoading}
            placeholder="description"
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Posición en el curso</label>
          <Input
            disabled={isLoading}
            placeholder="Posición del video"
            onChange={(e) => handleInputChange('order', e.target.value)}
          />
        </div>
        {props.isLive && (
          <div className="flex flex-col">
            <label>Fecha</label>
            <Input
              disabled={isLoading}
              placeholder="date"
              type="date"
              onChange={(e) => handleInputChange('date', e.target.value)}
            />
          </div>
        )}
        <div className="flex flex-col">
          <label>Duración</label>
          <Input
            disabled={isLoading}
            placeholder="00:00"
            onChange={(e) => handleInputChange('duration', e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label>Imagen de portada (.jpg, .png, .jpeg)</label>
          <Input
            disabled={isLoading}
            placeholder="image_cover"
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={handleImageCoverChange}
          />
        </div>
        <div className="flex flex-col">
          <label>Archivo de video (.mp4)</label>
          <Input
            disabled={isLoading}
            placeholder="video_file"
            type="file"
            accept=".mp4"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          />
        </div>
        <div>
          <Button
            className="w-full"
            loading={isLoading}
            onClick={uploadContent}
            color="primary"
          >
            {isLoading
              ? 'Subiendo... esto puede tardar varios minutos'
              : 'Subir'}
          </Button>
          {error && <span className="text-red-500">{error}</span>}
        </div>
      </div>
    </Dialog>
  );
};

export default AcademyModalUploadContent;
