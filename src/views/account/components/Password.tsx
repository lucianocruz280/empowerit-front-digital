import React, { useState } from 'react'
import {
  Input,
  Button,
  Notification,
  toast,
  FormContainer,
} from '@/components/ui'
import FormDescription from './FormDescription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { auth } from '@/configs/firebaseConfig'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'
import { HiShieldCheck } from 'react-icons/hi'
import {
  createVerificationCode,
  deleteVerificationCode,
  generateOTP,
  verifyCode,
} from '@/services/VerificationCodeService'
import { sendEmail } from '@/services/emailSender'
import { useAppSelector } from '@/store'

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Contraseña requerida'),
  newPassword: Yup.string()
    .required('Ingresa tu nueva contraseña')
    .min(8, 'Muy corta!')
    .matches(/^[A-Za-z0-9_-]*$/, 'Sólo letras y números permitidos'),
  confirmNewPassword: Yup.string().oneOf(
    [Yup.ref('newPassword'), undefined],
    'La contraseña no coincide'
  ),
})

const Password: React.FC = () => {
  const [isValidCode, setIsValidCode] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authCode, setAuthCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const user = useAppSelector((state) => state.auth.user)

  const onFormSubmit = async (
    values: { [key: string]: string },
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!isValidCode) return false
    const user = auth.currentUser || null

    if (user) {
      const credential = EmailAuthProvider.credential(
        user.email || '',
        values.password
      )

      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, values.newPassword)
            .then(() => {
              toast.push(
                <Notification
                  title={'Contraseña actualizada'}
                  type="success"
                />,
                {
                  placement: 'top-center',
                }
              )
            })
            .catch((error) => {
              console.log(error)
              toast.push(<Notification title={'Error'} type="danger" />, {
                placement: 'top-center',
              })
            })
        })
        .catch((error) => {
          // Un error ocurrió durante la reautenticación.
          toast.push(
            <Notification
              title={`Error durante la reautenticación: ${error}`}
              type="danger"
            />,
            {
              placement: 'top-center',
            }
          )
          console.log('Error durante la reautenticación:', error)
        })
    } else {
      // El usuario no está autenticado
      console.error('No se ha encontrado un usuario autenticado.')
    }

    setSubmitting(false)
  }

  const onRequestVerificationCode = (userId: unknown, userEmail: string) => {
    setIsLoading(true)
    const otp = generateOTP()
    createVerificationCode(userId, otp)
      .then((status) => {
        if (status) {
          sendEmail(userEmail, otp).then(() => {
            setIsAuthenticating(true)
            setIsLoading(false)
            toast.push(
              <Notification
                title={'Se envio un codigo de verificacion a tu correo'}
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
        setIsLoading(false)
        console.log(err)
      })
  }

  const onVerifyCode = (userId: unknown, code: string) => {
    verifyCode(userId, code)
      .then((isValid) => {
        toast.push(
          <Notification
            title={isValid ? 'Codigo valido' : 'Codigo invalido'}
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

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          newPassword: '',
          confirmNewPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(
          values: { [key: string]: string },
          { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
        ) => {
          setSubmitting(true)
          setTimeout(() => {
            onFormSubmit(values, setSubmitting)
          }, 1000)
        }}
      >
        {({
          values,
          touched,
          errors,
          isSubmitting,
          resetForm,
        }: {
          values: { [key: string]: string }
          touched: { [key: string]: boolean }
          errors: { [key: string]: string }
          isSubmitting: boolean
          resetForm: () => void
        }) => {
          const validatorProps = { touched, errors }
          return (
            <Form>
              <FormContainer>
                <FormDescription
                  title="Contraseña"
                  desc="Ingresa tu contraseña actual y tu nueva contraseña para actualizarla"
                />
                <FormRow
                  name="password"
                  label="Contraseña actual"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="password"
                    placeholder="Contraseña actual"
                    component={Input}
                    readonly={!isValidCode}
                    disabled={!isValidCode}
                  />
                </FormRow>
                <FormRow
                  name="newPassword"
                  label="Nueva contraseña"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="newPassword"
                    placeholder="Nueva contraseña"
                    component={Input}
                    readonly={!isValidCode}
                    disabled={!isValidCode}
                  />
                </FormRow>
                <FormRow
                  name="confirmNewPassword"
                  label="Confirmar nueva contraseña"
                  {...validatorProps}
                >
                  <Field
                    type="password"
                    autoComplete="off"
                    name="confirmNewPassword"
                    placeholder="Confirmar nueva contraseña"
                    component={Input}
                    readonly={!isValidCode}
                    disabled={!isValidCode}
                  />
                </FormRow>
                {isAuthenticating && (
                  <FormRow name="code" label="Codigo" {...validatorProps}>
                    <Field
                      type="text"
                      autoComplete="off"
                      name="code"
                      placeholder="Codigo de verificación"
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
                      onClick={() => onVerifyCode(user.uid, authCode)}
                    >
                      Verificar
                    </Button>
                  </FormRow>
                )}
                <div className="mt-4 ltr:text-right">
                  <Button
                    className="ltr:mr-2 rtl:ml-2"
                    type="button"
                    onClick={resetForm}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="solid"
                    loading={isSubmitting}
                    type="submit"
                    hidden={!isValidCode}
                  >
                    {isSubmitting ? 'Actualizando' : 'Actualizar Contraseña'}
                  </Button>
                  <Button
                    className="mt-2 ltr:mr-2 rtl:ml-2"
                    type="button"
                    variant="solid"
                    hidden={isValidCode || isAuthenticating}
                    disabled={isAuthenticating || isValidCode}
                    loading={isLoading}
                    onClick={() =>
                      onRequestVerificationCode(user.uid, user.email || '')
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
    </>
  )
}

export default Password
