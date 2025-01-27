import Button from '@/components/ui/Button'
import { Formik, Form, Field } from 'formik'
import { collection, addDoc } from 'firebase/firestore'
import { useParams } from 'react-router-dom'
import {
  FormContainer,
  FormItem,
  Upload,
  toast,
  Notification,
} from '@/components/ui'
import Input from '@/components/ui/Input'
import * as Yup from 'yup'
import { db, storageBucket } from '@/configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import useCourses from '@/hooks/useCourses'
import { useEffect, useState } from 'react'
import useLives from '@/hooks/useLives'
import useLessons from '@/hooks/useLessons'
import CardLive from '@/components/lives/CardLive'
import { FaPlus } from 'react-icons/fa'
import CardLesson from '@/components/lives/CardLesson'
import AcademyModalUploadContent from '../AcademyModalUploadContent.component'
import { CoursesType } from '../Academy.definition'

const EditCourses = () => {
  const { courseId } = useParams()
  const [courseType] = useState(
    window.location.pathname.includes('course-leadership') ? CoursesType.LEADERSHIP : CoursesType.STANDARD
  )
  const localCourseType = courseType == CoursesType.LEADERSHIP ? CoursesType.LEADERSHIP : CoursesType.STANDARD
  const refStorage = ref(storageBucket, 'courses-images/' + uuidv4())
  const { isLoading, courseById, fetchCourseById } = useCourses(localCourseType)
  const { data: lives } = useLives(localCourseType, courseId, true)
  const { data: lessons } = useLessons(
    localCourseType,
    courseId,
    true
  )
  const [isOpenModalLive, setOpenModalLive] = useState(false)
  const [isOpenModalLesson, setOpenModalLesson] = useState(false)

  const onSetFormFile = (form: any, field: any, file: any) => {
    form.setFieldValue(localCourseType, file[0])
    form.setFieldValue('coursesPreview', URL.createObjectURL(file[0]))
  }

  const onUploadStorage = async (img: any) => {
    await uploadBytes(refStorage, img)
    const urlStorage = await getDownloadURL(refStorage)
    return urlStorage
  }

  const handleSubmit = async (
    values: any,
    { resetForm }: { resetForm: any }
  ) => {
    const urlStorage = await onUploadStorage(values.courses)
    try {
      await addDoc(collection(db, `${localCourseType}`), {
        name: values.name,
        description: values.description,
        image_cover: urlStorage,
      })
      toast.push(
        <Notification title={'Se subió el curso éxito'} type="success" />,
        {
          placement: 'top-center',
        }
      )
      resetForm()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (courseId) fetchCourseById(localCourseType, courseId)
  }, [courseId])

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Por favor introduzca el nombre del curso'),
    description: Yup.string().required(
      'Por favor introduzca la descripción del curso'
    ),
  })

  // if (isLoading || !courseId) return 'Cargando cursos'

  return (
    <div>
      <span className="font-bold text-xl">Editar curso</span>
      <br />

      <div className="flex flex-col space-y-4">
        <div className="w-full lg:w-1/2">
          <Formik
            initialValues={{
              name: courseById?.name || '',
              description: courseById?.description || '',
              image_cover: courseById?.image_cover || '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors }) => (
              <Form>
                <FormContainer>
                  <FormItem
                    label="Nombre"
                    invalid={errors.name && (touched.name as any)}
                    errorMessage={errors.name as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="name"
                      placeholder="Nombre del Curso"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Descripción"
                    invalid={errors.description && (touched.description as any)}
                    errorMessage={errors.description as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="description"
                      placeholder="Descripción del Curso"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem label="Imagen del Curso">
                    <Field name="courses">
                      {({ field, form }: any) => {
                        const courseProps = form.values.coursesPreview
                          ? { src: form.values.coursesPreview }
                          : courseById?.image_cover
                          ? { src: courseById.image_cover }
                          : {}
                        return (
                          <Upload
                            className="cursor-pointer"
                            onChange={(files: any) =>
                              onSetFormFile(form, field, files)
                            }
                            onFileRemove={(files: any) =>
                              onSetFormFile(form, field, files)
                            }
                            showList={false}
                            uploadLimit={1}
                          >
                            <img
                              src={courseProps.src}
                              className="border-2 border-white dark:border-gray-800 shadow-lg"
                              width={200}
                              height={160}
                            />
                          </Upload>
                        )
                      }}
                    </Field>
                  </FormItem>

                  <Button block variant="solid" type="submit">
                    Guardar Cambios
                  </Button>
                </FormContainer>
              </Form>
            )}
          </Formik>
        </div>

        <div className="w-full">
          <div className="flex flex-col space-y-4">
            <h3 className="flex space-x-2">
              <span>Lecciones</span>
              <button
                className="text-sm text-white bg-blue-700 rounded-full p-1 h-6 w-6 flex items-center justify-center"
                title="Subir video"
                onClick={() => setOpenModalLesson(true)}
              >
                <FaPlus size={8} />
              </button>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {lessons.map((lesson) => (
                <div key={lesson.id}>
                  <CardLesson hidePlay lesson={lesson} />
                </div>
              ))}
            </div>

            <AcademyModalUploadContent
                show={isOpenModalLesson}
                courseId={courseId}
                orderIndex={lessons.length}
                onClose={() => setOpenModalLesson(false)}
                isLeadership={false}
                isLive={false}
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex flex-col space-y-4">
            <h3 className="flex space-x-2">
              <span>Lives</span>
              <button
                className="text-sm text-white bg-blue-700 rounded-full p-1 h-6 w-6 flex items-center justify-center"
                title="Subir video"
                onClick={() => setOpenModalLive(true)}
              >
                <FaPlus size={8} />
              </button>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {lives.map((live) => (
                <div key={live.id}>
                  <CardLive hidePlay live={live} />
                </div>
              ))}
            </div>

            <AcademyModalUploadContent
                show={isOpenModalLive}
                courseId={courseId}
                onClose={() => setOpenModalLive(false)}
                isLeadership={false}
                isLive
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCourses
