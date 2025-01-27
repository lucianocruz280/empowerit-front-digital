import { useState } from 'react'
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import type { AxiosError } from 'axios'
import { sendPasswordResetEmail } from '@firebase/auth'
import { auth } from '@/configs/firebaseConfig'
import { useNavigate } from 'react-router'
import { Notification, toast } from '@/components/ui'
interface ForgotPasswordFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type ForgotPasswordFormSchema = {
  email: string
}

const validationSchema = Yup.object().shape({
  email: Yup.string().required('Please enter your email'),
})

const ForgotPasswordForm = (props: ForgotPasswordFormProps) => {
  const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

  const [emailSent, setEmailSent] = useState(false)

  const [message, setMessage] = useTimeOutMessage()
  const navigate = useNavigate()

  const onSendMail = async (
    values: ForgotPasswordFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    setSubmitting(true)
    try {
      sendPasswordResetEmail(auth, values.email)
        .then(() => {
          navigate('/sign-in')
        })
        .catch((error) => {
          console.error(error)
          toast.push(
            <Notification
              title="Hubo un problema, verifica tu correo electrónico"
              type="danger"
            />,
            {
              placement: 'top-center',
            }
          )
        })
        .finally(() => {
          setSubmitting(false)
        })
    } catch (errors) {
      setMessage(
        (errors as AxiosError<{ message: string }>)?.response?.data?.message ||
          (errors as Error).toString()
      )
      setSubmitting(false)
    }
  }

  return (
    <div className={className}>
      <div className="mb-6">
        {emailSent ? (
          <>
            <h3 className="mb-1">Revisa tu bandeja de entrada</h3>
            <p>
              Te hemos enviado las instrucciones para recuperar tu contraseña
            </p>
          </>
        ) : (
          <>
            <h3 className="mb-1">Contraseña Olvidada</h3>
            <p>
              Por favor, ingresa tu correo electrónico para recibir un link de
              recuperación
            </p>
          </>
        )}
      </div>
      {message && (
        <Alert showIcon className="mb-4" type="danger">
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSendMail(values, setSubmitting)
          } else {
            setSubmitting(false)
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <div className={emailSent ? 'hidden' : ''}>
                <FormItem
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    disablePaste
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Correo"
                    component={Input}
                  />
                </FormItem>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {emailSent ? 'Reenviar correo' : 'Enviar correo'}
              </Button>
              <div className="mt-4 text-center">
                <span>Volver a </span>
                <ActionLink to={signInUrl}>Inicio de Sesión</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ForgotPasswordForm
