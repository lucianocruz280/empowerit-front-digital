import {
  Input,
  Avatar,
  Upload,
  Button,
  Notification,
  toast,
  FormContainer,
  Select,
} from '@/components/ui'
import FormDescription from './FormDescription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineGlobeAlt,
  HiShieldCheck,
  HiOutlineCalendar,
} from 'react-icons/hi'
import * as Yup from 'yup'
import { updateUser, updateEmail_Auth } from '@/services/AuthService'
import { setUser, useAppDispatch, useAppSelector } from '@/store'
import { db, storageBucket } from '@/configs/firebaseConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'
import { useState, useEffect, useRef } from 'react'
import {
  createVerificationCode,
  deleteVerificationCode,
  generateOTP,
  verifyCode,
} from '@/services/VerificationCodeService'
import { sendEmail } from '@/services/emailSender'
import { BsBank, BsInstagram, BsTelegram, BsWhatsapp } from 'react-icons/bs'
import {
  Country,
  State,
  City,
  ILocationValues,
  ISelectOPT,
} from '@/@types/profile'
import useCountries, { CountriesHook } from '@/hooks/useCountries'
import useStates, { StatesHook } from '@/hooks/useStates'
import useCities, { CitiesHook } from '@/hooks/useCities'
import { FaRegRegistered } from 'react-icons/fa6'
import { collection, getDocs, query, where } from 'firebase/firestore'

const validationSchema = Yup.object().shape({
  name: Yup.string().required('User Name Required'),
  email: Yup.string().email('Invalid email').required('Email Required'),
  title: Yup.string(),
  avatar: Yup.string(),
  lang: Yup.string(),
  timeZone: Yup.string(),
  syncData: Yup.bool(),
})

const Profile = ({ data }: any) => {
  const user = useAppSelector((state) => state.auth.user)
  const _id = useRef(uuidv4())
  const refStorage = ref(storageBucket, 'profile-images/' + _id.current)
  const dispatch = useAppDispatch()
  const onSetFormFile = (form: any, field: any, file: any) => {
    form.setFieldValue('avatar', file[0])
    form.setFieldValue('avatarPreview', URL.createObjectURL(file[0]))
  }

  const onFormSubmit = (values: any, setSubmitting: any) => {
    toast.push(<Notification title={'Perfil actualizado'} type="success" />, {
      placement: 'top-center',
    })
    setSubmitting(false)
  }

  const onUploadStorage = async (img: any) => {
    await uploadBytes(refStorage, img)
    const urlStorage = await getDownloadURL(refStorage)
    return urlStorage
  }

  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isValidatingEmail, setIsValidatingEmail] = useState(false)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const [isValidEmail, setIsValidEmail] = useState(true)
  const [authCode, setAuthCode] = useState('')
  const [isValidCode, setIsValidCode] = useState(false)

  const onRequestVerificationCode = (userId: unknown, userEmail: string) => {
    setIsUnlocking(true)
    const otp = generateOTP()
    createVerificationCode(userId, otp)
      .then((status) => {
        if (status) {
          sendEmail(userEmail, otp).then(() => {
            setIsAuthenticating(true)
            setIsUnlocking(false)

            toast.push(
              <Notification
                title={'Se envió un código de verificación a tu correo'}
                type="success"
              />,
              {
                placement: 'top-center',
              }
            )
          })
        }
      })
      .catch((err) => {
        setIsUnlocking(false)
        console.log(err)
      })
  }

  const onVerifyCode = (userId: unknown, code: string) => {
    verifyCode(userId, code)
      .then((isValid) => {
        toast.push(
          <Notification
            title={isValid ? 'Código valido' : 'Código invalido'}
            type={isValid ? 'success' : 'danger'}
          />,
          {
            placement: 'top-center',
          }
        )
        if (isValid) {
          setIsAuthenticating(false)
          setIsValidCode(true)
          deleteVerificationCode(userId)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onVerifyEmail = (userId: unknown, userEmail: string) => {
    const otp = generateOTP()
    createVerificationCode(userId, otp)
      .then((status) => {
        if (status) {
          sendEmail(userEmail, otp).then(() => {
            setIsValidatingEmail(true)
            toast.push(
              <Notification
                title={'Se envió un código de verificación a tu correo'}
                type="success"
              />,
              {
                placement: 'top-center',
              }
            )
          })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const onVerifyCodeNewEmail = (userId: unknown, code: string) => {
    verifyCode(userId, code)
      .then((isValid) => {
        toast.push(
          <Notification
            title={isValid ? 'Código valido' : 'Código invalido'}
            type={isValid ? 'success' : 'danger'}
          />,
          {
            placement: 'top-center',
          }
        )
        if (isValid) {
          setIsValidEmail(true)
          setIsValidatingEmail(false)
          deleteVerificationCode(userId)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const emptySelectValue: ISelectOPT = {
    label: '',
    value: '',
  }

  const [vCountry, setVCountry] = useState<Country | null>(null)
  const [vState, setVState] = useState<State | null>(null)
  const [vCity, setVCity] = useState<City | null>(null)
  const countries: CountriesHook = useCountries()
  const states: StatesHook = useStates(vCountry ?? emptySelectValue)
  const cities: CitiesHook = useCities(vState ?? emptySelectValue)

  const getLocationValues = (data: ILocationValues) => {
    if (data?.country?.value && !vCountry) {
      setVCountry(data.country)
    }
    if (data?.state?.value && !vState) {
      setVState(data.state)
    }
    /*if (data?.city?.value && !vCity) {
      setVCity(data.city)
    }*/
  }

  useEffect(() => {
    getLocationValues(data)
  }, [data])

  return (
    <Formik
      initialValues={{
        ...data,
        city: data?.city?.label,
        avatarPreview: data.avatar,
      }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        if (
          !isValidCode ||
          !isValidEmail ||
          isValidatingEmail ||
          isAuthenticating
        ) {
          return false
        }
        setSubmitting(true)
        try {
          const {
            birthdate,
            whatsapp,
            telegram,
            instagram,
            avatar,
            email,
            name,
            presenter_code,
          } = values

          const infBirthdate = {
            birthdate: birthdate || '',
          }
          const infContact = {
            whatsapp: whatsapp || '',
            telegram: telegram || '',
            instagram: instagram?.trim() || '',
          }

          const sendData: any = {
            ...infBirthdate,
            ...infContact,
            presenter_code,
            email: email?.trim(),
            name: name?.trim(),
          }
          let img = ''

          if (presenter_code != data.presenter_code) {
            const docs = await getDocs(
              query(
                collection(db, 'users'),
                where('presenter_code', '==', presenter_code)
              )
            )
            if (docs.docs.filter((r) => r.id != user.uid).length > 0) {
              toast.push(
                <Notification
                  title={'Código de presentador no disponible'}
                  type="danger"
                />,
                {
                  placement: 'top-center',
                }
              )
              return
            }
          }

          if (typeof avatar === 'object') {
            img = await onUploadStorage(avatar)
            sendData.avatar = img
          }

          if (email?.trim() != data.email) {
            await updateEmail_Auth(email?.trim())
          }
          await updateUser(values.uid, sendData)
          dispatch(
            setUser({
              ...values,
              city: {
                label: values.city || '',
                value: values.city || '',
              },
              avatar: typeof values.avatar === 'object' ? img : values.avatar,
            })
          )
          setTimeout(() => {
            onFormSubmit(values, setSubmitting)
          }, 1000)
        } catch (e) {
          console.log(e)
          toast.push(
            <Notification title={'Ha ocurrio un error'} type="danger" />,
            {
              placement: 'top-center',
            }
          )
        }
      }}
    >
      {({ values, touched, errors, isSubmitting, resetForm }) => {
        const validatorProps = { touched, errors }

        return (
          <Form>
            <FormContainer>
              <FormDescription
                title="Información"
                desc="Información básica, como tu nombre y correo que será mostrada en tu perfil"
              />
              <FormRow name="name" label="Datos Básicos" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Nombre"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />

                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="date"
                  autoComplete="off"
                  name="birthdate"
                  placeholder="Fecha de nacimiento"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                  prefix={<HiOutlineCalendar className="text-xl" />}
                />

                <br />
                <label>Código de presentador</label>
                <Field
                  type="text"
                  autoComplete="off"
                  name="presenter_code"
                  placeholder="Código de presentador"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
              </FormRow>

              <FormRow
                name="payroll"
                label="Métodos de pago"
                {...validatorProps}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="rfc"
                  placeholder="RFC"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                  prefix={<FaRegRegistered className="text-xl" />}
                />

                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="bank_account"
                  placeholder="CLABE Cuenta de Banco"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                  prefix={<BsBank className="text-xl" />}
                />
              </FormRow>

              <FormRow name="location" label="Locación" {...validatorProps}>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  name="country"
                  placeholder="País"
                  component={Select}
                  value={vCountry}
                  options={countries[0]}
                  isDisabled={!isValidCode}
                  // prefix={<HiOutlineGlobe className="text-xl" />}
                  onChange={(e: Country) => {
                    setVCountry(e)
                    setVState(null)
                    setVCity(null)
                  }}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  name="state"
                  placeholder="Estado"
                  options={states[0]}
                  value={vState}
                  component={Select}
                  isDisabled={!isValidCode}
                  // prefix={<HiOutlineMap className="text-xl" />}
                  onChange={(e: State) => {
                    setVState(e)
                    setVCity(null)
                  }}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="city"
                  placeholder=""
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />

                <br />
                <label>Código postal</label>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="cp"
                  placeholder=""
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
                <label>Colonia</label>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="colony"
                  placeholder="Colonia"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
                <label>Calle</label>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="street"
                  placeholder="Calle"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
                <label>Número interior</label>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="num_int"
                  placeholder=""
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
                <label>Número exterior</label>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="num_ext"
                  placeholder=""
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
                <label>Referencia</label>
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="reference"
                  placeholder=""
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                />
              </FormRow>
              <FormRow name="contact" label="Contacto" {...validatorProps}>
                <Field
                  type="number"
                  autoComplete="off"
                  name="whatsapp"
                  placeholder="Whatsapp"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                  prefix={<BsWhatsapp className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="instagram"
                  placeholder="Instagram"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                  prefix={<BsInstagram className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="number"
                  autoComplete="off"
                  name="telegram"
                  placeholder="Telegram"
                  component={Input}
                  readOnly={!isValidCode}
                  disabled={!isValidCode}
                  prefix={<BsTelegram className="text-xl" />}
                />
              </FormRow>
              <FormRow name="email" label="Email" {...validatorProps}>
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                  prefix={<HiOutlineMail className="text-xl" />}
                  readOnly={!isValidCode || isValidEmail || isValidatingEmail}
                  disabled={!isValidCode || isValidEmail || isValidatingEmail}
                />
                <Button
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="button"
                  variant="default"
                  color="primary"
                  hidden={!isValidCode || !isValidEmail}
                  onClick={() => {
                    setIsValidEmail(false)
                  }}
                >
                  Cambiar
                </Button>
                <Button
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="button"
                  variant="default"
                  color="primary"
                  hidden={!isValidCode || isValidEmail}
                  disabled={isValidatingEmail}
                  onClick={() => {
                    onVerifyEmail(data?.uid, values.email)
                  }}
                >
                  Validar
                </Button>
              </FormRow>

              {isValidatingEmail && (
                <FormRow name="code" label="Código" {...validatorProps}>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="code"
                    placeholder="Código de verificación"
                    component={Input}
                    prefix={<HiShieldCheck className="text-xl" />}
                    onChange={(e: any) => {
                      setAuthCode(e.currentTarget.value)
                    }}
                  />
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2 "
                    type="button"
                    variant="default"
                    color="primary"
                    onClick={() => onVerifyCodeNewEmail(data?.uid, authCode)}
                  >
                    Verificar
                  </Button>
                </FormRow>
              )}

              <FormRow name="avatar" label="Avatar" {...validatorProps}>
                <Field name="avatar">
                  {({ field, form }: any) => {
                    const avatarProps = form.values.avatarPreview
                      ? { src: form.values.avatarPreview }
                      : {}
                    return (
                      <Upload
                        className={
                          isValidCode ? 'cursor-pointer' : 'cursor-not-allowed'
                        }
                        onChange={(files: any) =>
                          onSetFormFile(form, field, files)
                        }
                        onFileRemove={(files: any) =>
                          onSetFormFile(form, field, files)
                        }
                        showList={false}
                        uploadLimit={1}
                        disabled={!isValidCode}
                      >
                        <Avatar
                          className="border-2 border-white dark:border-gray-800 shadow-lg"
                          size={60}
                          shape="circle"
                          icon={<HiOutlineUser />}
                          {...avatarProps}
                        />
                      </Upload>
                    )
                  }}
                </Field>
              </FormRow>

              <FormRow name="sponsor" label="Patrocinador" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="sponsor"
                  placeholder="Sponsor"
                  component={Input}
                  prefix={<HiOutlineGlobeAlt className="text-xl" />}
                  readOnly
                  disabled
                />
              </FormRow>
              {isAuthenticating && (
                <FormRow name="code" label="Código" {...validatorProps}>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="code"
                    placeholder="Código de verificación"
                    component={Input}
                    prefix={<HiShieldCheck className="text-xl" />}
                    onChange={(e: any) => {
                      setAuthCode(e.currentTarget.value)
                    }}
                  />
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2 "
                    type="button"
                    variant="default"
                    color="primary"
                    onClick={() => onVerifyCode(data?.uid, authCode)}
                  >
                    Verificar
                  </Button>
                </FormRow>
              )}

              <div className="mt-4 ltr:text-right">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  type="button"
                  onClick={() => resetForm}
                >
                  Cancelar
                </Button>
                <Button
                  variant="solid"
                  loading={isSubmitting}
                  type="submit"
                  hidden={
                    isAuthenticating ||
                    isValidatingEmail ||
                    !isValidCode ||
                    !isValidEmail
                  }
                >
                  {isSubmitting ? 'Actualizando' : 'Actualizar'}
                </Button>
                <Button
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="button"
                  variant="solid"
                  hidden={isAuthenticating || isValidatingEmail || isValidCode}
                  disabled={isAuthenticating}
                  loading={isUnlocking}
                  onClick={() =>
                    onRequestVerificationCode(data?.uid, data?.email)
                  }
                >
                  Desbloquear
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default Profile
