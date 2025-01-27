import Button from '@/components/ui/Button'
import { Formik, Form, Field } from 'formik'
import { collection, addDoc } from 'firebase/firestore'
import {
  FormContainer,
  FormItem,
  Avatar,
  Upload,
  toast,
  Notification,
} from '@/components/ui'
import Input from '@/components/ui/Input'
import * as Yup from 'yup'
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import { db, storageBucket } from '@/configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

const VideosView = () => {
  const refStorage = ref(storageBucket, 'courses-images/' + uuidv4())
  const onSetFormFile = (form: any, field: any, file: any) => {
    form.setFieldValue('courses', file[0])
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
      await addDoc(collection(db, 'courses-leadership'), {
        name: values.name,
        description: values.description,
        image_cover: urlStorage,
        s3_path: values.name.replace(/\s/g, "").toLowerCase()
      })
      toast.push(
        <Notification title={'Se subio el curso éxito'} type="success" />,
        {
          placement: 'top-center',
        }
      )
      resetForm()
    } catch (error) {
      console.log(error)
    }
  }
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Por favor introduzca el nombre del curso'),
    description: Yup.string().required(
      'Por favor introduzca la descripcion del curso'
    ),
  })

  return (
    <div>
      <Formik
        initialValues={{
          name: '',
          description: '',
          image_cover: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ touched, errors }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Nombre"
                invalid={errors.name && touched.name}
                errorMessage={errors.name}
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
                label="Descripcion"
                invalid={errors.description && touched.description}
                errorMessage={errors.description}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="description"
                  placeholder="Descripcion del Curso"
                  component={Input}
                />
              </FormItem>
              <FormItem label="Imagen del Curso">
                <Field name="courses">
                  {({ field, form }: any) => {
                    const courseProps = form.values.coursesPreview
                      ? { src: form.values.coursesPreview }
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
                        <Avatar
                          className="border-2 border-white dark:border-gray-800 shadow-lg"
                          size={60}
                          shape="square"
                          icon={<HiOutlineGlobeAlt />}
                          {...courseProps}
                        />
                      </Upload>
                    )
                  }}
                </Field>
              </FormItem>

              <Button block variant="solid" type="submit">
                Añadir Curso
              </Button>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default VideosView
