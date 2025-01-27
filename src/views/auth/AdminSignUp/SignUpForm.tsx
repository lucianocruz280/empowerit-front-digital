import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import type { CommonProps } from '@/@types/common'
import { apiSignUp } from '@/services/AuthService'
import { useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/configs/firebaseConfig'
import AsyncSelect from 'react-select/async'
import { Notification, Radio, Select, toast } from '@/components/ui'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { OPTIONS2 } from '@/utils/packs'

interface SignUpFormProps extends CommonProps {
  disableSubmit?: boolean
  signInUrl?: string
}

type SignUpFormSchema = {
  name: string
  last_name: string
  password: string
  email: string
  sponsor: string
  sponsor_id: string
  membership: string
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Por favor ingrese su nombre'),
  email: Yup.string()
    .trim()
    .email('Email invalido')
    .required('Por favor ingrese su email'),
  password: Yup.string().required('Por favor ingrese su contraseña'),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref('password')],
    'Las contraseñas no coinciden'
  ),
  membership: Yup.string().required('Membresia requerida'),
})

const SignUpForm = (props: SignUpFormProps) => {
  const { disableSubmit = false, className } = props
  const [position, setPosition] = useState<'left' | 'right'>('right')
  const [message, setMessage] = useTimeOutMessage()
  const [users, setUsers] = useState<
    { label: string; value: string; name: string }[]
  >([])
  const [sponsor, setSponsor] = useState<null | {
    label: string
    value: string
    name: string
  }>(null)
  const [membership, setMembership] = useState<null | {
    label: string
    value: string
    name: string
  }>(null)

  const onSignUp = async (
    values: SignUpFormSchema,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!sponsor) {
      setMessage('Seleccionar sponsor')
      return
    }

    try {
      const { name, password, email } = values
      setSubmitting(true)
      const result = await fetch(
        `${import.meta.env.VITE_API_URL}/subscriptions/activeWithoutVolumen`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            password,
            email: email.trim(),
            sponsor: sponsor.name,
            sponsor_id: sponsor.value,
            side: position,
            days: 30,
            membership: membership?.value,
          }),
          method: 'POST',
        }
      ).then((r) => r.json())

      if (result?.statusCode === 500) {
        toast.push(<Notification title={'Algo salio mal'} type="danger" />, {
          placement: 'top-center',
        })
      } else {
        toast.push(
          <Notification title={'Registrado correctamente'} type="success" />,
          {
            placement: 'top-center',
          }
        )
        setTimeout(() => {
          window.location.reload()
        }, 200)
      }

      setSubmitting(false)
    } catch (err: any) {
      setMessage(err.toString())
      setSubmitting(false)
    }
  }

  const loadOptions = (_input: string, callback: any): void => {
    getDocs(collection(db, 'users')).then((res) => {
      let data: { label: string; value: string; name: string }[] = []
      if (users.length == 0) {
        res.docs.forEach((user) => {
          data.push({
            value: user.id,
            label: user.data().name + ' - (' + user.data().email + ')',
            name: user.data().name,
          })
        })
        setUsers(data)
      } else {
        data = users
      }
      callback(
        data.filter(({ label }) =>
          _input
            ? label.toLowerCase().includes(_input.toLocaleLowerCase())
            : true
        )
      )
    })
  }

  return (
    <>
      <div className={className}>
        {message && (
          <Alert showIcon className="mb-4" type="danger">
            {message}
          </Alert>
        )}
        <Formik
          initialValues={{
            name: '',
            last_name: '',
            password: '',
            confirmPassword: '',
            email: '',
            sponsor: '',
            sponsor_id: '',
            membership: '100-pack',
            position: 'right',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (!disableSubmit) {
              onSignUp(values, setSubmitting)
            } else {
              setSubmitting(false)
            }
          }}
        >
          {({ touched, errors, isSubmitting }) => (
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
                    placeholder="Nombre"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Email"
                  invalid={errors.email && touched.email}
                  errorMessage={errors.email}
                >
                  <Field
                    type="email"
                    autoComplete="off"
                    name="email"
                    placeholder="Email"
                    component={Input}
                  />
                </FormItem>
                <FormItem
                  label="Password"
                  invalid={errors.password && touched.password}
                  errorMessage={errors.password}
                >
                  <Field
                    autoComplete="off"
                    name="password"
                    placeholder="Password"
                    component={PasswordInput}
                  />
                </FormItem>
                <FormItem
                  label="Confirm Password"
                  invalid={errors.confirmPassword && touched.confirmPassword}
                  errorMessage={errors.confirmPassword}
                >
                  <Field
                    autoComplete="off"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    component={PasswordInput}
                  />
                </FormItem>
                <FormItem label="Patrocinador" errorMessage={errors.sponsor}>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadOptions}
                    onChange={(value: any) => setSponsor(value)}
                    defaultOptions
                    name="sponsor_id"
                  />
                </FormItem>
                <FormItem label="Membresia" errorMessage={errors.sponsor}>
                  <Select name="membership" options={OPTIONS2} onChange={(value: any) => setMembership(value)} />
                </FormItem>
                <FormItem label="Lado" errorMessage={errors.sponsor}>
                  <Radio.Group
                    value={position}
                    onChange={(val) => setPosition(val)}
                  >
                    <Radio key={'left'} value={'left'}>
                      Izquierda
                    </Radio>
                    <Radio key={'right'} value={'right'}>
                      Derecha
                    </Radio>
                  </Radio.Group>
                </FormItem>
                <Button
                  block
                  loading={isSubmitting}
                  variant="solid"
                  type="submit"
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Registrar'}
                </Button>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export default SignUpForm
