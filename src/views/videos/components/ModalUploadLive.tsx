import { Button, Dialog, Input } from '@/components/ui'
import { db } from '@/configs/firebaseConfig'
import { uploadImage } from '@/utils/academy/storage'
import dayjs from 'dayjs'
import { doc, setDoc } from 'firebase/firestore'
import { FC, useState } from 'react'
import { v4 } from 'uuid'

type Props = {
  courseId: string
  show: boolean
  onClose: () => void
}

const ModalUploadLive: FC<Props> = (props) => {
  const [isLoading, setLoading] = useState(false)
  const [newlesson, setNewLesson] = useState({
    name: '',
    description: '',
    duration: '',
    date: '',
  })
  const [file_video, setVideoFile] = useState<File | null>(null)
  const [image_cover, setImageCover] = useState<File | null>(null)
  const [error, setError] = useState<null | string>(null)

  const uploadLive = async () => {
    try {
      setError(null)
      if (!file_video) return
      if (!image_cover) return
      if (!newlesson.date) return

      setLoading(true)
      const lessonId = v4()
      const lesson: any = {
        name: newlesson.name,
        description: newlesson.description,
        duration: newlesson.duration,
        order: 1,
        image_cover: null,
        date: dayjs(newlesson.date + ' 21:00:00').toDate(),
      }

      const url = await uploadImage(
        'image_cover',
        'courses/' + props.courseId + '/lessons/' + lessonId,
        image_cover
      )
      lesson.image_cover = url

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/cloudflare/uploadVideo`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folder: 'lives',
            courseId: props.courseId,
            courseType: 'courses'
          }),
        }
      ).then((r) => r.json())

      console.log(file_video.type)

      await fetch(res.url, {
        method: 'PUT',
        body: file_video,
        headers: {
          'Content-Type': 'video/mp4',
        },
      })
      lesson.record_link =
        'https://pub-38820717e1d6434b9216f051cc6914fb.r2.dev/' + res.filename

      const ref = doc(db, 'courses/' + props.courseId + '/lives/' + lessonId)
      await setDoc(ref, lesson)

      props.onClose()
    } catch (err) {
      console.error(err)
      setError('Algo salio mal, intenta de nuevo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog isOpen={props.show} onClose={isLoading ? undefined : props.onClose}>
      <div className="flex flex-col space-y-4">
        <h3>Subir Live</h3>
        <div className="flex flex-col">
          <label>Nombre</label>
          <Input
            disabled={isLoading}
            placeholder="name"
            onChange={(e) => {
              setNewLesson((data: any) => ({ ...data, name: e.target.value }))
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Descripción</label>
          <Input
            disabled={isLoading}
            placeholder="description"
            onChange={(e) => {
              setNewLesson((data: any) => ({
                ...data,
                description: e.target.value,
              }))
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Fecha</label>
          <Input
            disabled={isLoading}
            placeholder="date"
            type="date"
            onChange={(e) => {
              setNewLesson((data: any) => ({ ...data, date: e.target.value }))
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Duración</label>
          <Input
            disabled={isLoading}
            placeholder="00:00"
            onChange={(e) => {
              setNewLesson((data: any) => ({
                ...data,
                duration: e.target.value,
              }))
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Imagen de portada (.jpg, .png, .jpeg)</label>
          <Input
            disabled={isLoading}
            placeholder="image_cover"
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={(e) => {
              if (e.target.files) setImageCover(e.target.files[0])
            }}
          />
        </div>
        <div className="flex flex-col">
          <label>Archivo de video (.mp4)</label>
          <Input
            disabled={isLoading}
            placeholder="video_file"
            type="file"
            accept=".mp4"
            onChange={(e) => {
              if (e.target.files) setVideoFile(e.target.files[0])
            }}
          />
        </div>
        <div>
          <Button
            className="w-full"
            loading={isLoading}
            onClick={uploadLive}
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
  )
}

export default ModalUploadLive
