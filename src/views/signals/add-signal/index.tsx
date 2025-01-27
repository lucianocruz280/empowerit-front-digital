import {
  Button,
  FormContainer,
  FormItem,
  Input,
  Notification,
  Radio,
  Select,
  toast,
  Upload,
} from '@/components/ui'
import { db, storageBucket } from '@/configs/firebaseConfig'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { v4 as uuidv4 } from 'uuid'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import useAuthority from '@/utils/hooks/useAuthority'
import { useAppSelector } from '@/store'


// deploy

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],
  ['link', 'image', 'video', 'formula'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],

  ['clean'], // remove formatting button
]

const KINDS = [
  {
    label: 'Buy Market',
    value: 'buy',
  },
  {
    label: 'Sell Market',
    value: 'sell',
  },
  {
    label: 'Buy Limit',
    value: 'buy-limit',
  },
  {
    label: 'Sell Limit',
    value: 'sell-limit',
  },
  {
    label: 'Buy Stop',
    value: 'buy-stop',
  },
  {
    label: 'Sell Stop',
    value: 'sell-stop',
  },
]

const AddSignal = () => {
  const roles = useAppSelector((state) => state.auth.user.authority)
  const refStorage = ref(storageBucket, 'signals-images/' + uuidv4())

  const validationSchema = Yup.object().shape({
    type: Yup.string().required('Seleccione Tipo'),
    pair: Yup.string().required('Seleccione Par de moneda'),
    kind: Yup.string().required('Seleccione Tipo Ejecución'),
    tp1: Yup.number(),
    tp2: Yup.number(),
    tp3: Yup.number(),
    sl: Yup.number(),
    comments: Yup.string(),
    analisis: Yup.string().required(
      'Por favor introduzca la imagen del analisis'
    ),
  })

  const onSetFormFile = (form: any, field: any, file: any) => {
    form.setFieldValue('analisis', file[0])
    form.setFieldValue('analisisPreview', URL.createObjectURL(file[0]))
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
      await addDoc(collection(db, 'signals'), {
        name: values.name,
        description: values.description,
        image_cover: urlStorage,
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

  return (
    <div>
      <div>
        <Formik
          initialValues={{
            tp1: '',
            tp2: '',
            tp3: '',
            sl: '',
            comments: '',
            pair: '',
            type: '',
            analisis: '',
            kind: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ touched, errors, setFieldValue, values }) => (
            <Form>
              <FormContainer>
                <div className="mb-4">
                  <Radio.Group
                    value={values.type}
                    onChange={(e) => {
                      setFieldValue('type', e)
                    }}
                  >
                    {roles?.includes('FOREX') && (
                      <Radio value="forex">Forex</Radio>
                    )}
                    {roles?.includes('CRYPTO') && (
                      <Radio value="crypto">Crypto</Radio>
                    )}
                    {roles?.includes('SPORT') && (
                      <Radio value="sport">Deportes</Radio>
                    )}
                    {roles?.includes('FOREX') && (
                      <Radio value="syntetic">Sinteticos</Radio>
                    )}
                  </Radio.Group>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <FormItem
                    label="Moneda"
                    invalid={errors.pair && (touched.pair as any)}
                    errorMessage={errors.pair as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="pair"
                      placeholder="Seleccionar"
                      component={Select}
                      values={[]}
                    />
                  </FormItem>
                  <FormItem
                    label="Tipo Ejecución"
                    invalid={errors.kind && (touched.kind as any)}
                    errorMessage={errors.kind as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="kind"
                      placeholder="Seleccionar"
                      component={Select}
                      onChange={(e) => {
                        setFieldValue('kind', e.value)
                      }}
                      value={
                        values.kind && KINDS.find((r) => r.value == values.kind)
                      }
                      options={KINDS}
                    />
                  </FormItem>
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                  <FormItem
                    label="Take Profit 1"
                    invalid={errors.tp1 && (touched.tp1 as any)}
                    errorMessage={errors.tp1 as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="tp1"
                      placeholder="Tp 1"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Take Profit 2"
                    invalid={errors.tp2 && (touched.tp2 as any)}
                    errorMessage={errors.tp2 as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="tp2"
                      placeholder="Tp 2"
                      component={Input}
                    />
                  </FormItem>
                  <FormItem
                    label="Take Profit 3"
                    invalid={errors.tp3 && (touched.tp3 as any)}
                    errorMessage={errors.tp3 as any}
                  >
                    <Field
                      type="text"
                      autoComplete="off"
                      name="tp3"
                      placeholder="Tp 3"
                      component={Input}
                    />
                  </FormItem>
                </div>
                <FormItem
                  label="Stop Loss"
                  invalid={errors.sl && (touched.sl as any)}
                  errorMessage={errors.sl as any}
                >
                  <Field
                    type="text"
                    autoComplete="off"
                    name="sl"
                    placeholder="SL"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Comentarios"
                  invalid={errors.comments && (touched.comments as any)}
                  errorMessage={errors.comments as any}
                >
                  <ReactQuill
                    theme="snow"
                    value={values.comments}
                    onChange={(value) => {
                      setFieldValue('comments', value)
                    }}
                    modules={{
                      toolbar: toolbarOptions,
                    }}
                    style={{
                      height: 300,
                    }}
                  />
                </FormItem>
                <FormItem label="Analisis">
                  <Field name="analisis">
                    {({ field, form }: any) => {
                      const courseProps = form.values.analisisPreview
                        ? { src: form.values.analisisPreview }
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
                  Guardar
                </Button>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default AddSignal
