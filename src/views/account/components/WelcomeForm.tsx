import {
  Input,
  Button,
  Notification,
  toast,
  FormContainer,
  Select,
} from '@/components/ui'
import FormDescription from './FormDescription'
import FormRow from './FormRow'
import { Field, Form, Formik } from 'formik'
import { HiOutlineUserCircle, HiOutlineCalendar, HiUsers } from 'react-icons/hi'
import * as Yup from 'yup'
import { updateUser, updateEmail_Auth } from '@/services/AuthService'
import { setUser, useAppDispatch } from '@/store'
import { useState, useEffect } from 'react'
import {
  BsInstagram,
  BsTelegram,
  BsTelephoneFill,
  BsWhatsapp,
  BsBank,
} from 'react-icons/bs'
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
import { SiLitecoin } from 'react-icons/si'
import { FaRegRegistered } from 'react-icons/fa6'

const WelcomeForm = ({ data, setOpenWelcomeModal }: any) => {
  const dispatch = useAppDispatch()
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

  const onFormSubmit = (values: any, setSubmitting: any) => {
    toast.push(<Notification title={'Perfil actualizado'} type="success" />, {
      placement: 'top-center',
    })
    setSubmitting(false)
    setOpenWelcomeModal(false)
  }

  const getLocationValues = (data: ILocationValues) => {
    if (data?.country?.value && !vCountry) {
      setVCountry(data.country)
    }
    if (data?.state?.value && !vState) {
      setVState(data.state)
    }
    if (data?.city?.value && !vCity) {
      setVCity(data.city)
    }
  }

  useEffect(() => {
    getLocationValues(data)
  }, [data])

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('User Name Required'),
    birthdate: Yup.date().required('Date Required'),
    //email: Yup.string().email('Invalid email').required('Email Required'),
    wallet_litecoin: Yup.string().optional(),
    rfc: Yup.string().optional(),
    bank_account: Yup.string().optional(),
    country: Yup.object().shape({
      value: Yup.string().required('Country is required'),
    }),
    state: Yup.object().shape({
      value: Yup.string().required('State is required'),
    }),
    city: Yup.string().required('City is required'),
    whatsapp: Yup.string().required('Phone Required'),
    zip: Yup.string().required('Zip Required'),
    num_ext: Yup.string().required('Num_ext Required'),
    num_int: Yup.string(),
    reference: Yup.string(),
    street: Yup.string().required('Address Required'),
    colony: Yup.string().required('Colony Required'),
    title: Yup.string(),
    lang: Yup.string(),
    timeZone: Yup.string(),
    syncData: Yup.bool(),
    nombreBeneficiario1: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      'Este campo solo acepta letras'
    ),
    telefonoBeneficiario1: Yup.string().matches(
      /^[0-9]+$/,
      'Este campo solo acepta números'
    ),
    parentescoBeneficiario1: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      'Este campo solo acepta letras'
    ),
    nombreBeneficiario2: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      'Este campo solo acepta letras'
    ),
    telefonoBeneficiario2: Yup.string().matches(
      /^[0-9]+$/,
      'Este campo solo acepta números'
    ),
    parentescoBeneficiario2: Yup.string().matches(
      /^[A-Za-z\s]+$/,
      'Este campo solo acepta letras'
    ),
  })

  return (
    <Formik
      initialValues={{ ...data }}
      enableReinitialize={true}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        setSubmitting(true)
        try {
          const {
            name,
            birthdate,
            whatsapp,
            telegram,
            instagram,
            email,
            nombreBeneficiario1,
            telefonoBeneficiario1,
            parentescoBeneficiario1,
            nombreBeneficiario2,
            telefonoBeneficiario2,
            parentescoBeneficiario2,
          } = values

          const infLocation = {
            country: vCountry,
            state: vState,
            city: {
              label: values.city,
              value: values.city,
            },
            street: values.street,
            zip: values.zip,
            num_ext: values.num_ext,
            num_int: values.num_int || '',
            reference: values.reference || '',
            colony: values.colony,
          }

          const infBirthdate = {
            birthdate: birthdate || '',
          }
          const infContact = {
            name: name.trim() || '',
            whatsapp: whatsapp || '',
            telegram: telegram || '',
            instagram: instagram?.trim() || '',
          }
          const infPayroll = {
            rfc: values.rfc,
            wallet_litecoin: values.wallet_litecoin,
            bank_account: values.bank_account,
          }
          const infBeneficiario = {
            beneficiario1: {
              nombre: nombreBeneficiario1?.trim() || '',
              telefono: telefonoBeneficiario1 || '',
              parentesco: parentescoBeneficiario1?.trim() || '',
            },
            beneficiario2: {
              nombre: nombreBeneficiario2?.trim() || '',
              telefono: telefonoBeneficiario2 || '',
              parentesco: parentescoBeneficiario2?.trim() || '',
            },
          }

          const sendData = {
            ...infBirthdate,
            ...infContact,
            ...infBeneficiario,
            ...infLocation,
            ...infPayroll,
            email: email?.trim(),
          }

          if (email.trim()) {
            if (email?.trim() != data.email) {
              await updateEmail_Auth(email?.trim())
            }
          }

          await updateUser(values.uid, sendData)

          if (
            ['alive-pack', 'freedom-pack', 'business-pack'].includes(
              data.membership
            )
          ) {
            // send first pack
          }

          dispatch(
            setUser({
              ...values,
            })
          )
          setTimeout(() => {
            onFormSubmit(values, setSubmitting)
          }, 1000)
        } catch (e) {
          console.log(e)
          toast.push(
            <Notification title={'Ha ocurrido un error'} type="danger" />,
            {
              placement: 'top-center',
            }
          )
        }
      }}
    >
      {(formProps) => {
        const { values, touched, errors, isSubmitting, setFieldValue } =
          formProps
        const validatorProps = { touched, errors }

        return (
          <Form>
            <FormDescription
              title="¡Felicidades por formar parte de la compañía que esta revolucionando la forma de hacer negocios!"
              desc="Completa los siguientes datos para poder disfrutar al máximo de Empowerit TOP"
            />
            <FormContainer>
              <FormRow name="basic" label="Datos básicos" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="name"
                  placeholder="Nombre"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="date"
                  autoComplete="off"
                  name="birthdate"
                  placeholder="Fecha de nacimiento"
                  component={Input}
                  prefix={<HiOutlineCalendar className="text-xl" />}
                />
              </FormRow>

              <FormRow
                name="payroll"
                label="Métodos de pago"
                {...validatorProps}
              >
                <div>
                  <span className="font-bold">Wallet de Litecoin</span>{' '}
                  <span className="text-red-500 text-xs">(Obligatorio)</span>
                </div>
                <Field
                  type="text"
                  autoComplete="off"
                  name="wallet_litecoin"
                  placeholder="Dirección"
                  component={Input}
                  prefix={<SiLitecoin className="text-xl" />}
                />

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <span className="font-bold">RFC</span>
                </div>
                <Field
                  type="text"
                  autoComplete="off"
                  name="rfc"
                  placeholder="RFC"
                  component={Input}
                  prefix={<FaRegRegistered className="text-xl" />}
                />

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <span className="font-bold">Cuenta de Banco (CLABE)</span>
                </div>
                <Field
                  type="text"
                  autoComplete="off"
                  name="bank_account"
                  placeholder="CABLE Cuenta de Banco"
                  component={Input}
                  prefix={<BsBank className="text-xl" />}
                />
              </FormRow>
              <FormRow name="location" label="Locación" {...validatorProps}>
                <Field
                  className="ltr:mr-2 rtl:ml-2"
                  name="country"
                  placeholder="País"
                  component={Select}
                  value={vCountry}
                  options={countries[0]}
                  onChange={(e: Country) => {
                    setVCountry(e)
                    setFieldValue('country', e)
                    setVState(null)
                    setFieldValue('state', null)
                    setVCity(null)
                    setFieldValue('city', null)
                  }}
                />
                {errors?.country && (
                  <span className="text-red-500">País es obligatorio</span>
                )}
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  name="state"
                  placeholder="Estado"
                  options={states[0]}
                  value={vState}
                  component={Select}
                  onChange={(e: State) => {
                    setVState(e)
                    setFieldValue('state', e)
                    setVCity(null)
                    setFieldValue('city', null)
                  }}
                />
                {errors?.state && (
                  <span className="text-red-500">Estado es obligatorio</span>
                )}
                <Field
                  type="text"
                  autoComplete="off"
                  name="city"
                  placeholder="Ciudad"
                  component={Input}
                />
                {errors?.city && (
                  <span className="text-red-500">Ciudad es obligatorio</span>
                )}

                <Field
                  type="text"
                  autoComplete="off"
                  name="colony"
                  placeholder="Colonia"
                  component={Input}
                />
                {errors?.colony && (
                  <span className="text-red-500">Colonia es obligatorio</span>
                )}

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <label>Calle</label>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="street"
                    placeholder="Dirección"
                    component={Input}
                  />
                  {errors?.street && (
                    <span className="text-red-500">
                      Dirección es obligatorio
                    </span>
                  )}
                </div>

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <label>Código postal</label>
                  <Field
                    type="number"
                    autoComplete="off"
                    name="zip"
                    placeholder="Código Postal"
                    component={Input}
                  />
                  {errors?.zip && (
                    <span className="text-red-500">
                      Código postal es obligatorio
                    </span>
                  )}
                </div>

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <label>Número exterior</label>
                  <Field
                    type="number"
                    autoComplete="off"
                    name="num_ext"
                    component={Input}
                  />
                  {errors?.num_ext && (
                    <span className="text-red-500">
                      Número exterior es obligatorio
                    </span>
                  )}
                </div>

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <label>Número interior</label>
                  <Field
                    type="number"
                    autoComplete="off"
                    name="num_int"
                    component={Input}
                  />
                </div>

                <div className="mt-2 ltr:mr-2 rtl:ml-2">
                  <label>Referencia</label>
                  <Field
                    type="text"
                    autoComplete="off"
                    name="reference"
                    placeholder="Entre calles"
                    component={Input}
                  />
                </div>
              </FormRow>
              <FormRow name="contact" label="Contacto" {...validatorProps}>
                <Field
                  type="number"
                  autoComplete="off"
                  name="whatsapp"
                  placeholder="WhatsApp"
                  component={Input}
                  prefix={<BsWhatsapp className="text-xl" />}
                />
                {errors?.whatsapp && (
                  <span className="text-red-500">Whatsapp es obligatorio</span>
                )}
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="instagram"
                  placeholder="Instagram"
                  component={Input}
                  prefix={<BsInstagram className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="telegram"
                  placeholder="Telegram"
                  component={Input}
                  prefix={<BsTelegram className="text-xl" />}
                />
              </FormRow>
              {/*<FormRow name="email" label="Email" {...validatorProps}>
                <Field
                  type="email"
                  autoComplete="off"
                  name="email"
                  placeholder="Email"
                  component={Input}
                  prefix={<HiOutlineMail className="text-xl" />}
                />
              </FormRow>*/}

              <FormRow
                name="beneficiarios"
                label="Negocio Heredable"
                {...validatorProps}
              >
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="nombreBeneficiario1"
                  placeholder="Nombre del beneficiario #1"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="telefonoBeneficiario1"
                  placeholder="Teléfono del beneficiario #1"
                  component={Input}
                  prefix={<BsTelephoneFill className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="parentescoBeneficiario1"
                  placeholder="Parentesco"
                  component={Input}
                  prefix={<HiUsers className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="nombreBeneficiario2"
                  placeholder="Nombre del beneficiario #2"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="telefonoBeneficiario2"
                  placeholder="Teléfono del beneficiario #2"
                  component={Input}
                  prefix={<BsTelephoneFill className="text-xl" />}
                />
                <Field
                  className="mt-2 ltr:mr-2 rtl:ml-2"
                  type="text"
                  autoComplete="off"
                  name="parentescoBeneficiario2"
                  placeholder="Parentesco"
                  component={Input}
                  prefix={<HiUsers className="text-xl" />}
                />
              </FormRow>
              <div className="mt-4 ltr:text-right">
                <Button variant="solid" loading={isSubmitting} type="submit">
                  Actualizar
                </Button>
              </div>
            </FormContainer>
          </Form>
        )
      }}
    </Formik>
  )
}

export default WelcomeForm
